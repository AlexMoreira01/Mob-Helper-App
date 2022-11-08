import { useContext, useEffect, useState } from 'react';
import { VStack, Text, HStack, useTheme, ScrollView, Box } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';

import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText, User, Desktop, UsersFour, NavigationArrow, Broadcast, QrCode, Buildings, Timer, Check } from 'phosphor-react-native'
import { Select as NativeBaseSelect, ISelectProps } from 'native-base';


import { Input } from '../components/Input';
import { Select } from '../components/Select';
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
    user: {
        name: string
    },
    name_product: string;
    department: string;
    location: 'Remoto' | 'Presencial';
    address_access: string;
    description: string;
    closed: string;
    name_admin: string;
    sla: string;
    success: 'Sucesso' | 'Falha';
    solution: string;
}

export function Details() {
    const { user } = useContext(AuthContext)

    const [adminName, SetAdminName] = useState('');
    const [sla, setSla] = useState('');
    const [success, setSuccess] = useState('');
    const [solution, setSolution] = useState('');


    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
    const [nameSolicit, setNameSolicit] = useState('');

    const { colors } = useTheme();

    const navigation = useNavigation()

    const route = useRoute()
    const { orderId } = route.params as RouteParams;

    async function handleOrderClose() {
        if (!solution && !adminName && !sla && !success) {
            return Alert.alert('Solicitação', "Informe os dados para encerrar a solicitação");
        }

        try {
            api.put(`/order/update/${orderId}`, {
                adminName,
                sla,
                success,
                solution
            })
                .then(res => {
                    if (res.status === 201) {
                        console.log(res)
                        Alert.alert("Solicitação", "solicitação encerrada.");
                        navigation.goBack();
                    } else {
                        return Alert.alert("Ordem", "Não foi possível localizar essa ordem!")
                    }
                })
                .catch(err => {
                    console.log(err);
                    Alert.alert('Solicitação', "Não foi possível encerrar a solicitação")
                });
        } catch {
            return Alert.alert("Error", "Não foi possível realizar a requisição")
        }
    }

    useEffect(() => {
        try {
            api.get(`/order/${orderId}`)
                .then(res => {
                    if (res.status === 200) {
                        // console.log(res.data)
                        setOrder(res.data)
                        setNameSolicit(res.data.user.name)
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
        console.log(order)
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
                    title="usaurio"
                    description={`Solicitante: ${nameSolicit}`}
                    icon={User}
                />

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
                        {user.isAdmin ? 'Finalizar Chamado' : 'Conclusão'}
                    </Text>
                </HStack>

                <CardDetails
                    title='realizado'
                    icon={User}
                    description={order.name_admin == null ? '' : `Por: ${order.name_admin}`}
                >
                    {
                        order.status === 'open' && user.isAdmin &&
                        <Input
                            placeholder='Feito por: :'
                            onChangeText={SetAdminName}
                            textAlignVertical="top"
                        />
                    }
                </CardDetails>


                <CardDetails
                    title="sla"
                    icon={Timer}
                    description={order.sla}
                >
                    {
                        order.status === 'open' && user.isAdmin &&
                        <Input
                            placeholder='Tempo de conclusão:'
                            onChangeText={setSla}
                            textAlignVertical="top"
                        />
                    }

                </CardDetails>

                {
                    order.status === 'open' && user.isAdmin &&
                    <CardDetails
                        title="Resultado"
                        icon={Check}
                    >
                        <Select
                            accessibilityLabel="Resultado"
                            placeholder="Resultado do chamado"
                            selectedValue={success}
                            onValueChange={itemValue => setSuccess(itemValue)}
                        >
                            <NativeBaseSelect.Item label="Sucesso" value="Sucesso" />
                            <NativeBaseSelect.Item label="Falha" value="Falha" />
                        </Select>
                    </CardDetails>
                }

                {
                    order.status === 'open' && !user.isAdmin &&
                    <CardDetails
                        title="resultado"
                        description={order.success}
                        icon={Check}
                    />
                }

                {
                    order.status === 'closed' &&
                    <CardDetails
                        title="resultado"
                        description={order.success}
                        icon={Check}
                    />
                }


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
                        order.status === 'open' && user.isAdmin &&
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