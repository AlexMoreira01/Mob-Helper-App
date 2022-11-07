import { useContext, useEffect, useState } from 'react';
import { VStack, Text, HStack, useTheme, ScrollView, Box } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';

import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText, User, Desktop, UsersFour, NavigationArrow, Broadcast, QrCode, Buildings, Timer } from 'phosphor-react-native'

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';
import { Loading } from '../components/Loading';
import { CardDetails } from '../components/CardDetails'
import { Alert } from 'react-native';
import api from '../services/api';
import AuthContext from '../contexts/auth';

type RouteParams = {
    orderId: string;
}

type OrderDetails = OrderProps & {
    name_product: string;
    department: string;
    location: 'Remoto' | 'Presencial';
    address_access: string;
    description: string;
    solution: string;
    closed: string;
}

export function Details() {
    const { user } = useContext(AuthContext)

    const [solution, setSolution] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

    const { colors } = useTheme();

    const navigation = useNavigation()
    const route = useRoute()
    const { orderId } = route.params as RouteParams;

    async function handleOrderClose() {
        if (!solution) {
            return Alert.alert('Solicitação', "Informa a solução para encerrar a solicitação");
        }

        var year = new Date().getFullYear(); //To get the Current Year
        var month = new Date().getMonth() + 1; //To get the Current Month
        var date = new Date().getDate(); //To get the Current Date
        var hours = new Date().getHours(); //To get the Current Hours
        var min = new Date().getMinutes(); //To get the Current Minutes
        var sec = new Date().getSeconds(); //To get the Current Seconds

        let dateFormat = [year, month, date].join("-")

        // await fetch(`http://192.168.1.11:3333/order/update/${orderId}`, {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         status: 'closed',
        //         solution: solution,
        //         closed_at: new Date()
        //     }),
        //     headers: {
        //         'Content-type': 'application/json; charset=UTF-8',
        //     },
        // })
        //     .then(() => {
        //         Alert.alert("Solicitação", "solicitação encerrada.");
        //         navigation.goBack();
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //         Alert.alert('Solicitação', "Não foi possível encerrar a solicitação")
        //     })
    }

    useEffect(() => {

        try {
            api.get(`/order/${orderId}`)
                .then(res => {
                    if (res.status === 200) {
                        console.log(res.data)
                        setOrder(res.data)
                    } else {
                        return Alert.alert("Ordem", "Não foi possível localizar essa ordem!")
                    }
                })
                .catch(err => {
                    console.log(err);
                    return Alert.alert("Error", "Ocorreu um erro com a busca da ordem!")
                });
        } catch {
            return Alert.alert("Error", "Não foi possível realizar a requisição")
        }

        setIsLoading(false);
    }, [])

    if (isLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1} bg="gray.700">
            <Box px={6} bg="gray.600">
                <Header title='solicitação' />
            </Box>

            <HStack bg="gray.500" justifyContent="center" p={4}>
                {
                    order.status === 'closed'
                        ? <CircleWavyCheck size={22} color={colors.green[300]} />
                        : <Hourglass size={22} color={colors.secondary[700]} />
                }

                <Text
                    fontSize="sm"
                    color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
                    ml={2}
                    textTransform="uppercase"
                >
                    {order.status === 'closed' ? 'finalizado' : 'em andamento'}
                </Text>
            </HStack>

            <ScrollView mx={5} showsVerticalScrollIndicator={false}>
                <CardDetails
                    title="nome"
                    description={`Produto: ${order.name_product}`}
                    icon={Desktop}
                />

                <CardDetails
                    title="equipamento"
                    description={`Patrimônio: ${order.patrimony}`}
                    icon={DesktopTower}
                />

                <CardDetails
                    title="departamento"
                    description={`Setor: ${order.department}`}
                    icon={UsersFour}
                />

                <CardDetails
                    title="localização"
                    description={`Atendimento: ${order.location}`}
                    icon={order.location == 'Remoto' ? Broadcast : NavigationArrow}
                />

                <CardDetails
                    title={order.location == 'Remoto' ? 'Código de acesso' : 'Endereço ou setor'}
                    description={order.location == 'Remoto' ? ` Código : ${order.address_access}` : `Local : ${order.address_access}`}
                    icon={order.location == 'Remoto' ? QrCode : Buildings}
                />

                <CardDetails
                    title="descrição do problema"
                    description={order.description}
                    icon={ClipboardText}
                    footer={`Registrado em ${new Date(order.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    })}`}
                />

                <HStack bg="gray.500" justifyContent="center" p={5} mt={8} borderColor={colors.white}>
                    
                    <Text
                        fontSize="md"
                        color={colors.white}
                        ml={2}
                        textTransform="uppercase"
                    >
                        Finalizar Chamado
                    </Text>
                </HStack>

                <CardDetails
                    title='realizado'
                    description={`Por: ${user.name}`}
                    icon={User}
                />

                <CardDetails
                    title='sla'
                    description={`Tempo de conclusão:`}
                    icon={Timer}
                />


                <CardDetails
                    title="solução"
                    icon={CircleWavyCheck}
                    description={order.solution}
                    footer={order.closed && `Encerrado em ${new Date(order.closed).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    })}`}
                // Condicional => se foi encerrado ira mostrar o texto, como o ternario porem sem o :
                >
                    {
                        order.status === 'open' &&
                        <Input
                            placeholder='Descrição da solução'
                            onChangeText={setSolution}
                            textAlignVertical="top"
                            multiline
                            h={24}
                        />
                    }

                </CardDetails>


            </ScrollView>

            {
                // Se ela não for fechada
                // !order.closed && 
                order.status === 'open' && user.isAdmin &&
                <Button
                    title="Encerrar solicitação"
                    margin={5}
                    onPress={handleOrderClose}
                />
            }
        </VStack>
    );
}