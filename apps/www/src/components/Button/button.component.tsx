interface Props {
  type: 'add' | 'remove';
  text: string;
  onClick: () => void;
}

export function Button({ type, text, onClick }: Props) {
  return (
    <button
      className="py-1.5 px-4 flex text-sm rounded-md bg-dark-200 border border-dark-200 h-fit items-center w-fit font-dm-sans font-medium shadow-widget hover:border-dark-100 duration-100"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
