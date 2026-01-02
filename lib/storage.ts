import { DBSchema, IDBPDatabase, IDBPObjectStore, openDB } from "idb";
import { Vehicle, ChatSession, ChatMessage } from "@/types/diagnostic";

interface AutoSageDB extends DBSchema {
  vehicles: {
    key: string;
    value: Vehicle;
    indexes: { "by-date": number };
  };
  chatSessions: {
    key: string;
    value: ChatSession;
    indexes: { "by-vehicle": string; "by-date": number };
  };
}

let db: IDBPDatabase<AutoSageDB> | null = null;

export async function initDB(): Promise<IDBPDatabase<AutoSageDB>> {
  if (db) return db;

  db = await openDB<AutoSageDB>("auto-sage", 1, {
    upgrade(db) {
      // Vehicles store
      if (!db.objectStoreNames.contains("vehicles")) {
        const vehicleStore = db.createObjectStore("vehicles", {
          keyPath: "id",
        });
        vehicleStore.createIndex("by-date", "createdAt");
      }

      // Chat Sessions store
      if (!db.objectStoreNames.contains("chatSessions")) {
        const chatStore = db.createObjectStore("chatSessions", {
          keyPath: "id",
        });
        chatStore.createIndex("by-vehicle", "vehicleId");
        chatStore.createIndex("by-date", "updatedAt");
      }
    },
  });

  return db;
}

// Vehicle operations
export async function addVehicle(vehicle: Vehicle): Promise<void> {
  const database = await initDB();
  await database.add("vehicles", vehicle);
}

export async function getVehicles(): Promise<Vehicle[]> {
  const database = await initDB();
  return (await database.getAll("vehicles")).sort(
    (a, b) => b.createdAt - a.createdAt
  );
}

export async function getVehicle(id: string): Promise<Vehicle | undefined> {
  const database = await initDB();
  return database.get("vehicles", id);
}

export async function updateVehicle(vehicle: Vehicle): Promise<void> {
  const database = await initDB();
  await database.put("vehicles", vehicle);
}

export async function deleteVehicle(id: string): Promise<void> {
  const database = await initDB();
  await database.delete("vehicles", id);
}

// Chat session operations
export async function createChatSession(
  vehicleId: string
): Promise<ChatSession> {
  const database = await initDB();
  const session: ChatSession = {
    id: crypto.randomUUID(),
    vehicleId,
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await database.add("chatSessions", session);
  return session;
}

export async function getChatSession(
  id: string
): Promise<ChatSession | undefined> {
  const database = await initDB();
  return database.get("chatSessions", id);
}

export async function getChatSessionsByVehicle(
  vehicleId: string
): Promise<ChatSession[]> {
  const database = await initDB();
  const sessions = await database.getAllFromIndex(
    "chatSessions",
    "by-vehicle",
    vehicleId
  );
  return sessions.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function updateChatSession(session: ChatSession): Promise<void> {
  const database = await initDB();
  session.updatedAt = Date.now();
  await database.put("chatSessions", session);
}

export async function addMessageToSession(
  sessionId: string,
  message: ChatMessage
): Promise<void> {
  const session = await getChatSession(sessionId);
  if (!session) throw new Error("Session not found");

  session.messages.push(message);
  await updateChatSession(session);
}

export async function clearAllData(): Promise<void> {
  const database = await initDB();
  const tx = database.transaction(["vehicles", "chatSessions"], "readwrite");
  await Promise.all([
    tx.objectStore("vehicles").clear(),
    tx.objectStore("chatSessions").clear(),
    tx.done,
  ]);
}
