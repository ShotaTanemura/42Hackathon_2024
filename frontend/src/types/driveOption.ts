export type VehicleType = 'Bicycle' | 'Car' | 'Motorbike' | 'E-Bike' | 'Scooter' | 'Drone'
export type BagType = 'Small' | 'Standard' | 'Big'

export type DriveOptionData<T extends string> = {
  name: T
  icon: string
  isEco: boolean
}