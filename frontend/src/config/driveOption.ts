import type { VehicleType,  BagType, DriveOptionData } from "@/types/driveOption"

export const vehicleOptions: Record<VehicleType, DriveOptionData<VehicleType>> = {
  Bicycle: { name: 'Bicycle', icon: '🚲' , isEco: false},
  Car: { name: 'Car', icon: '🚗' , isEco: true},
  Motorbike: { name: 'Motorbike', icon: '🏍️' , isEco: true},
  'E-Bike': { name: 'E-Bike', icon: '🔋🚲' , isEco: false},
  Scooter: { name: 'Scooter', icon: '🛴' , isEco: false},
  Drone: { name: 'Drone', icon: '🛸' , isEco: false},
}

export const bagOptions: Record<BagType, DriveOptionData<BagType>> = {
  Small: { name: 'Small', icon: '💼' , isEco: false},
  Standard: { name: 'Standard', icon: '🎒' , isEco: false},
  Big: { name: 'Big', icon: '🧳' , isEco: false},
}