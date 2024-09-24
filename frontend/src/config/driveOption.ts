import type { VehicleType,  BagType, DriveOptionData } from "@/types/driveOption"

export const vehicleOptions: Record<VehicleType, DriveOptionData<VehicleType>> = {
  Bike: { name: 'Bike', icon: '🚲' },
  Car: { name: 'Car', icon: '🚗' },
  Motorbike: { name: 'Motorbike', icon: '🏍️' },
}

export const bagOptions: Record<BagType, DriveOptionData<BagType>> = {
  Small: { name: 'Small', icon: '💼' },
  Standard: { name: 'Standard', icon: '🎒' },
  Big: { name: 'Big', icon: '🧳' },
}