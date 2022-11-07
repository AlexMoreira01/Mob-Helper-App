import { Button as ButtonNativeBase, IButtonProps, Heading } from 'native-base';

type Props = IButtonProps & {
    title: string
}


export function Button({ title, ...rest}: Props) {
  return (
    <ButtonNativeBase 
        bg="blue.500"
        h={14}
        fontSize="sm"
        rounded="sm"
        _pressed={{bg: "blue.300"}}
        { ...rest}
    >
        {/* Escrever texto */}
        <Heading color="white" fontSize="sm"> 
            {title}
        </Heading>
    </ButtonNativeBase>
  );
}