import { useState, useContext } from "react";
import { Alert } from "react-native";
import { VStack, Heading, Icon, useTheme } from "native-base";
import { Envelope, Key } from "phosphor-react-native"


// Para se usar o svg deve se usar uma biblioteca
import LogoIcon from '../assets/smartphone.svg';
import LogoText from '../assets/MobHelper.svg';

import { Input } from "../components/Input";
import { Button } from "../components/Button";

import AuthContext from "../contexts/auth";
import { useNavigation } from "@react-navigation/native";



export function SignIn() {
    const { signed, user, signIn } = useContext(AuthContext);

    const navigation = useNavigation();

    // Variavel comum nao gera uma nova renderização, somente os estados -- estado reflete na interface
    // Variavel comum para calculos ou outras coisas
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { colors } = useTheme();

    async function setIsLoadingFalse() {
        setIsLoading(false);
    }

    async function handleSignIn() {

        if (!email || !password) {
            return Alert.alert('Entrar', 'Informe e-mail e senha');
        }

        setIsLoading(true);

        signIn(email, password, setIsLoadingFalse);
    }

    async function handleSignUp(){
        // navigation.navigate('SignUp');
    }



    return (
        <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>

            <LogoIcon />
            <LogoText />

            <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
                Acesse sua conta
            </Heading>

            {/* Utilizando o mesmo componente com configurações diferentes */}
            <Input
                placeholder="E-mail"
                mb={4}
                InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
                onChangeText={setEmail}
            />

            <Input
                mb={8}
                placeholder="Senha"
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                secureTextEntry
                onChangeText={setPassword}
            />

            <Button
                title="Entrar"
                w="full"
                onPress={handleSignIn}
            />

            

            {/* <Button
                title="Cadastre-se"
                w="full"
                mt={7}
                onPress={handleSignUp}
            /> */}


        </VStack>
    )
}