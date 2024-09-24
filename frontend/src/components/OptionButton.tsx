// import { Leaf } from 'lucide-react';

type OptionButtonProps<T extends string> = {
  type: T;
  selectedType: T | null;
  setType: (type: T) => void;
  icon: React.ReactNode;
  isEco?: boolean;
};

export const OptionButton = <T extends string>({
  type,
  selectedType,
  setType,
  icon,
  isEco = false,
}: OptionButtonProps<T>) => {
  return (
    <button
      className={`p-4 rounded-lg border ${
        selectedType === type
          ? 'bg-pink-500 text-white border-pink-500'
          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
      } flex flex-col items-center justify-center relative`}
      onClick={() => setType(type)}
    >
      {/* {isEco && (
        <div className="absolute top-1 left-1">
          <Leaf className="w-5 h-5 text-green-500" />
        </div>
      )} */}
      <div className="w-10 h-10">{icon}</div>
      <span className="mt-2">{type}</span>
    </button>
  );
};