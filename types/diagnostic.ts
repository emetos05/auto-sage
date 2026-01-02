export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  createdAt: number;
}

export interface DiagnosticRequest {
  description: string;
  vehicleId: string;
  symptoms?: string[];
  imageBase64?: string;
}

export interface DiagnosticResponse {
  id: string;
  severity: "safe" | "caution" | "urgent" | "escalate";
  diagnosis: string;
  recommendation: string;
  diySteps?: string[];
  repairShopNeeded: boolean;
  timestamp: number;
}

export interface RepairShop {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  phone: string;
  address: string;
  website?: string;
  distance?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  diagnostic?: DiagnosticResponse;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  vehicleId: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}
