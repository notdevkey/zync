interface Props {
  type: 'add' | 'remove';
  text: string;
  onClick: () => void;
}

export function Button({ type, text, onClick }: Props) {
  return (
    <button
      className="py-1.5 px-4 flex text-sm rounded-md bg-darkblue-200 border border-darkblue-200 h-fit items-center w-fit font-dm-sans font-medium shadow-widget hover:border-darkblue-100 duration-100"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
