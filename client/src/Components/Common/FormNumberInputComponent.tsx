import React from 'react';

import { Form, Input } from 'antd';
import { InputProps } from 'antd/lib/input';

import type { Rule } from 'rc-field-form/lib/interface';

interface FormNumberItemInputProps extends InputProps {
  label?: React.ReactNode;
  name: string;
  className?: string;
  placeholder?: string;
  suffix?: React.ReactNode;
  max?: number;
  rules?: Rule[];
}

const FormNumberItemInputComponent: React.FC<FormNumberItemInputProps> = ({
  label,
  name,
  className,
  placeholder,
  suffix,
  max,
  onChange,
  rules,
}) => {
  return (
    <Form.Item label={label} name={name} className={className} rules={rules}>
      <Input
        name={name}
        onChange={onChange}
        type="number"
        placeholder={placeholder}
        suffix={suffix}
        maxLength={max}
        pattern="\d*"
      />
    </Form.Item>
  );
};

export default FormNumberItemInputComponent;
