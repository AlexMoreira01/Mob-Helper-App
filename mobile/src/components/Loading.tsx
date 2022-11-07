import { Center, Spinner } from "native-base";

export function Loading(){
    return(
        // Flex 1 vai ocupar tudo disponivel em tela
        <Center flex={1} bg="gray.700">
            <Spinner color="secondary.700" />
        </Center>
    );
}