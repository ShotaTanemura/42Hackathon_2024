export type VehicleType = 'Bike' | 'Car' | 'Motorbike'
export type BagType = 'Small' | 'Standard' | 'Big'

export type DriveOptionData<T extends string> = {
  name: T
  icon: string
}
