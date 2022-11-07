import React from 'react';
import { Select as NativeBaseSelect, ISelectProps, ISelectItemProps } from 'native-base';
import { CheckIcon } from 'native-base';


// ...rest => Recebe todas as propriedades passadas para esse componente e as adiciona com as ja existentes
export function Select({ ...rest }: ISelectProps, { ...itens }: ISelectItemProps) {
    return (
        <NativeBaseSelect
            // selectedValue={location}
            minWidth="200"
            // accessibilityLabel="Escolha local do atendiemento"
            // placeholder="Escolha o local de atendimento"
            _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
            }}

            bg="gray.700"
            height={14}
            borderWidth={0}
            fontSize="md"
            fontFamily="body"
            color="white"

            // mt={3} 
            // onValueChange={itemValue => setLocation(itemValue)}
            {...rest}

        >

           

            
        </NativeBaseSelect>

    );
}