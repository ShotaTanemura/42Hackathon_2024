type OptionButtonProps<T extends string> = {
  type: T
  selectedType: T | null
  setType: (type: T) => void
  icon: string
}

export const OptionButton = <T extends string>({
  type,
  selectedType,
  setType,
  icon,
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
      {icon}
      <span className="mt-2">{type}</span>
    </button>
  )
}
