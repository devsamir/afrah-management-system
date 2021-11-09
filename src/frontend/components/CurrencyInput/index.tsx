import React from "react";
import Input from "react-currency-input-field";

interface Props {
  value: string;
  onChange: any;
  placeholder?: string;
  className?: string;
  prefix?: string;
}
const CurrencyInput: React.FC<Props> = ({
  onChange,
  value,
  placeholder,
  className,
  prefix,
}) => {
  return (
    <Input
      placeholder={placeholder}
      className={className}
      value={value}
      decimalsLimit={2}
      prefix={prefix}
      onValueChange={onChange}
      decimalSeparator=","
      groupSeparator="."
    />
  );
};

export default CurrencyInput;
