"use client";

import { useEffect, useState } from "react";
import { Vehicle } from "@/types/diagnostic";
import {
  getVehicles,
  addVehicle,
  deleteVehicle,
  getChatSessionsByVehicle,
} from "@/lib/storage";
import {
  vehicleYears,
  vehicleMakes,
  getModelsForMake,
} from "@/lib/vehicleCatalog";
import { v4 as uuidv4 } from "uuid";

interface VehicleSelectorProps {
  onVehicleSelect: (vehicle: Vehicle) => void;
  onNewSession: () => void;
}

export default function VehicleSelector({
  onVehicleSelect,
  onNewSession,
}: VehicleSelectorProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    make: "Honda",
    model: "Civic",
    vin: "",
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    const loaded = await getVehicles();
    setVehicles(loaded);
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.make || !formData.model) return;

    const newVehicle: Vehicle = {
      id: uuidv4(),
      year: formData.year,
      make: formData.make,
      model: formData.model,
      vin: formData.vin || undefined,
      createdAt: Date.now(),
    };

    await addVehicle(newVehicle);
    setVehicles([newVehicle, ...vehicles]);
    setFormData({
      year: new Date().getFullYear(),
      make: "Honda",
      model: "Civic",
      vin: "",
    });
    setIsAdding(false);
  };

  const handleDeleteVehicle = async (id: string) => {
    if (confirm("Delete this vehicle?")) {
      await deleteVehicle(id);
      setVehicles(vehicles.filter((v) => v.id !== id));
    }
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    onVehicleSelect(vehicle);
    onNewSession();
  };

  const models = getModelsForMake(formData.make);

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">My Vehicles</h2>

      {vehicles.length === 0 && !isAdding && (
        <div className="text-center py-6 text-gray-500">
          <p className="mb-4">No vehicles added yet</p>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add Your First Vehicle
          </button>
        </div>
      )}

      {vehicles.length > 0 && (
        <div className="space-y-2 mb-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition"
            >
              <button
                onClick={() => handleSelectVehicle(vehicle)}
                className="flex-1 text-left"
              >
                <p className="font-semibold text-gray-800">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </p>
                {vehicle.vin && (
                  <p className="text-xs text-gray-500">VIN: {vehicle.vin}</p>
                )}
              </button>
              <button
                onClick={() => handleDeleteVehicle(vehicle.id)}
                className="ml-2 px-2 py-1 text-red-600 hover:bg-red-50 rounded transition text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {isAdding && (
        <form
          onSubmit={handleAddVehicle}
          className="space-y-3 bg-gray-50 p-4 rounded-md"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {vehicleYears.map((y: number) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Make
            </label>
            <select
              value={formData.make}
              onChange={(e) =>
                setFormData({ ...formData, make: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {vehicleMakes.map((m: string) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            <select
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {models.map((mod: string) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              VIN (Optional)
            </label>
            <input
              type="text"
              value={formData.vin}
              onChange={(e) =>
                setFormData({ ...formData, vin: e.target.value })
              }
              placeholder="17-character VIN"
              maxLength={17}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Add Vehicle
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Add Another Vehicle
        </button>
      )}
    </div>
  );
}
