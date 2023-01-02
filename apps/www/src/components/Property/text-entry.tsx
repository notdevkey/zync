import { useCallback, useEffect, useState } from 'react';

interface Props {
  text: string;
  onSubmit(newText: string): void;
}

export function TextEntry({ text, onSubmit }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(text);

  const handleSubmit = useCallback(() => {
    onSubmit(newText);
    setIsEditing(false);
  }, [newText, onSubmit]);

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
            autoFocus
            type="text"
            className="bg-transparent outline-none w-fit font-dm-sans"
            value={newText}
            maxLength={30}
            onChange={(e) => setNewText(e.target.value)}
          />
        </form>
      ) : (
        <p className="text-white">{text}</p>
      )}
    </div>
  );
}
