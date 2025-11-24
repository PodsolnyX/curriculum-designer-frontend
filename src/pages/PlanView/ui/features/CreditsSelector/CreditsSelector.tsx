import React, { useEffect, useRef, useState } from 'react';
import { InputNumber, Tag } from 'antd';

interface CreditsSelectorProps {
  credits: number;
  onChange?: (value: number) => void;
  type?: 'input' | 'tag';
  error?: boolean;
}

const CreditsSelector = ({
  credits,
  onChange,
  type = 'tag',
  error,
}: CreditsSelectorProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);
  const [newValue, setNewValue] = useState<number | null>(credits || 0);

  useEffect(() => {
    if (credits) setNewValue(credits);
  }, [credits]);

  const onSaveValue = () => {
    const resultValue =
      newValue === null || newValue < 0 ? 0 : newValue > 30 ? 30 : newValue;

    if (newValue === null || newValue < 0) setNewValue(0);
    else if (newValue > 30) setNewValue(30);

    setIsEdit(false);
    onChange && resultValue !== credits && onChange(resultValue);

    const element = ref?.current;

    if (element) element.blur();
  };

  return type === 'tag' ? (
    <span className={'relative'} onClick={(event) => event.stopPropagation()}>
      <Tag
        color={error ? 'red' : 'blue'}
        className={'m-0 hover:cursor-text hover:opacity-50'}
        bordered={false}
        onClick={() => setIsEdit(true)}
      >
        {`${credits} ЗЕТ`}
      </Tag>
      {isEdit && (
        <InputNumber
          size={'small'}
          className={`absolute top-0 left-0 bg-white z-10 w-32`}
          value={newValue}
          onChange={(value) =>
            setNewValue(value === null ? null : Number(value))
          }
          onBlur={() => onSaveValue()}
          onKeyDown={(event) => {
            if (event.key === 'Enter') onSaveValue();
          }}
          autoFocus={true}
          addonBefore={'ЗЕТ'}
        />
      )}
    </span>
  ) : (
    <InputNumber
      size={'small'}
      ref={ref}
      className={'w-full'}
      value={newValue}
      onChange={(value) => setNewValue(value === null ? null : Number(value))}
      onBlur={() => onSaveValue()}
      onKeyDown={(event) => {
        if (event.key === 'Enter') onSaveValue();
      }}
    />
  );
};

export default CreditsSelector;
