import React, { useState, useRef, useEffect } from 'react';
import cls from './NameInput.module.scss';
import { useOutsideClick } from '@/shared/lib/hooks/useOutsideClick.ts';

interface NameInputProps {
  value?: string;
  children?: React.ReactNode;
  onChange?(value: string): void;
}

export const NameInput = (props: NameInputProps) => {
  const { value = '', children, onChange } = props;
  const [edit, setEdit] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const saveChanges = () => {
    if (localValue !== value) {
      onChange?.(localValue);
    }
    setEdit(false);
  };

  const ref = useOutsideClick(saveChanges);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (edit && textareaRef.current) {
      if ('focus' in textareaRef.current) {
        textareaRef.current.focus();
      }
      const length = textareaRef.current?.value.length as number;
      textareaRef.current?.setSelectionRange(length, length);
    } else if (!edit) {
      setLocalValue(value);
    }
  }, [edit]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      saveChanges();
    }

    if (event.key === 'Escape') {
      setLocalValue(value);
      setEdit(false);
    }
  };

  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setEdit(true);
  };

  return (
    <div ref={ref} onClick={onClick}>
      {children}
      {edit && (
        <textarea
          ref={textareaRef}
          className={cls.FloatingInput}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
};
