import React from 'react';

import { Form, Input } from 'antd';
import { InputProps } from 'antd/lib/input';

import type { Rule } from 'rc-field-form/lib/interface';

interface FormItemInputProps extends InputProps {
  label?: React.ReactNode;
  name: string;
  className?: string;
  placeholder?: string;
  onChangeFunction?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rules?: Rule[];
  maxLength?: number;
  disabled?: boolean;
  inputType: string;
}

const FormItemInputComponent: React.FC<FormItemInputProps> = ({
  label,
  name,
  className,
  placeholder,
  inputType,
  suffix,
  onChangeFunction,
  rules,
  maxLength,
  disabled = false,
}) => {
  return (
    <Form.Item label={label} name={name} className={className} rules={rules}>
      <Input
        name={name}
        onChange={onChangeFunction}
        type={inputType}
        placeholder={placeholder}
        suffix={suffix}
        disabled={disabled}
        maxLength={maxLength}
      />
    </Form.Item>
  );
};

export default FormItemInputComponent;
