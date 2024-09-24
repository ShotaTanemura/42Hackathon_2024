import { LucideProps } from 'lucide-react';
import { FC } from 'react';

type OptionButtonProps<T extends string> = {
  type: T;
  selectedType: T | null;
  setType: (type: T) => void;
  icon: FC<LucideProps>
};

export const OptionButton = <T extends string>({
  type,
  selectedType,
  setType,
  icon: Icon, // Destructure the icon prop as Icon
}: OptionButtonProps<T>) => {
  return (
    <button
      className={`p-4 rounded-lg border ${
        selectedType === type
          ? 'bg-pink-500 text-white border-pink-500'
          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
      } flex flex-col items-center justify-center`}
      onClick={() => setType(type)}
    >
      <Icon className="h-6 w-6" /> {/* Render the icon component */}
      <span className="mt-2">{type}</span>
    </button>
  );
};