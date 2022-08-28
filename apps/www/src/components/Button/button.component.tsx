interface Props {
  type: 'add' | 'remove';
  text: string;
  onClick: () => void;
}

export function Button({ type, text, onClick }: Props) {
  return (
    <button
      className="py-1.5 px-4 flex text-sm rounded-md bg-gray-50 border border-blue-50 h-fit items-center w-fit font-inter shadow-widget hover:border-blue-200 hover:bg-gray-100"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
