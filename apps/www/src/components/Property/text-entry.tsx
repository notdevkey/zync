import { useCallback, useEffect, useState } from 'react';

interface Props {
  text: string;
  onSubmit(newText: string): void;
  className?: string;
  placeholder?: string;
}

export function TextEntry({ text, onSubmit, className, placeholder }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(text);

  const handleSubmit = useCallback(() => {
    if (text !== newText) {
      onSubmit(newText);
    }
    setIsEditing(false);
  }, [newText, onSubmit, text]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsEditing(false);
        setNewText(text);
      }
    }
    document.addEventListener('keydown', handleKey);

    return () => document.removeEventListener('keydown', handleKey);
  }, [newText, onSubmit, text]);

  return (
    <div onClick={() => setIsEditing(true)} className="cursor-pointer">
      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          onBlur={() => {
            handleSubmit();
          }}
        >
          <input
            type="text"
            placeholder={placeholder}
            className={
              'bg-transparent outline-none w-fit font-dm-sans' + className
            }
            value={newText}
            maxLength={30}
            onChange={(e) => setNewText(e.target.value)}
          />
        </form>
      ) : (
        <p className={'text-white' + className}>{text}</p>
      )}
    </div>
  );
}
