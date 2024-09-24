import { Bike } from 'lucide-react';

import type { VehicleType,  BagType, DriveOptionData } from "@/types/driveOption"
import BikeIcon from '@mui/icons-material/TwoWheeler';
import CarIcon from '@mui/icons-material/DirectionsCar';
import MotorcycleIcon from '@mui/icons-material/EmojiTransportation';

import BackpackIcon from '@mui/icons-material/Backpack';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LuggageIcon from '@mui/icons-material/Luggage';

export const vehicleOptions: Record<VehicleType, DriveOptionData<VehicleType>> = {
  Bike: { name: 'Bike', icon: Bike },
  Car: { name: 'Car', icon: CarIcon },
  Motorbike: { name: 'Motorbike', icon: BikeIcon },
}

export const bagOptions: Record<BagType, DriveOptionData<BagType>> = {
  Small: { name: 'Small', icon: ShoppingBagIcon },
  Standard: { name: 'Standard', icon: BackpackIcon },
  Big: { name: 'Big', icon: LuggageIcon },
}