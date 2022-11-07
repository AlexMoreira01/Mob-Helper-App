import React from 'react';
import { Input as NativeBaseInput, IInputProps } from 'native-base';

// ...rest => Recebe todas as propriedades passadas para esse componente e as adiciona com as ja existentes
export function Input({ ...rest }: IInputProps) {
  return (
    <NativeBaseInput
        bg="gray.700"
        height={14}
        size="md"
        borderWidth={0}
        fontSize="md"
        fontFamily="body"
        color="white"
        placeholderTextColor="gray.300"
        {...rest}
        _focus={{
            borderWidth: 1,
            borderColor: "blue.500",
            bg: "gray.700"
        }}
        
    />
  );
}