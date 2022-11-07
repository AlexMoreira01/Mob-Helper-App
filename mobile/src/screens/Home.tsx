import { useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';

import { useNavigation } from "@react-navigation/native"
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';
import { SignOut } from 'phosphor-react-native';
import { ChatTeardropText } from 'phosphor-react-native';

import Logo from '../assets/MobHelper.svg';

import { Filter } from '../components/Filter';
import { Button } from '../components/Button';
import { Order, OrderProps } from '../components/Order';
import { Loading } from '../components/Loading';

import AuthContext from '../contexts/auth';
import api from '../services/api';

export function Home() {
    const { user, signOut } = useContext(AuthContext)

    const [isLoading, setIsLoading] = useState(false);
    const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open');
    const [orders, setOrders] = useState<OrderProps[]>([]);

    const navigation = useNavigation();
    const { colors } = useTheme();

    function handleNewOrder() {
        navigation.navigate('new');
    }

    function handleOpenDetails(orderId: string) {
        navigation.navigate('details', { orderId })
    }

    // function handleClosedStatus() {
    //     setStatusSelected('closed')
    // }

    function handleLogout() {
        signOut()
    }

    useEffect(() => {
        setIsLoading(true);

        try {
            api.post(`/orders/${statusSelected}`, {
                id: user.id,
                is_admin: user.isAdmin,
            })
                .then(res => {
                    if (res.status === 200) {
                        setOrders(res.data)
                    } else {
                        return Alert.alert("Solicitações", "Não foi possível localizar ordens em aberto!")
                    }
                })
                .catch(err => {
                    console.log(err);
                    return Alert.alert("Error", "Ocorreu um erro com a busca das solicitações!")
                });
        } catch {
            return Alert.alert("Solicitações", "Não foi possível realizar a requisição")
        }

        setIsLoading(false);

    }, [statusSelected])

    return (
        <VStack flex={1} pb={6} bg="gray.700">
            <HStack
                w="full"
                justifyContent="space-between"
                alignItems="center"
                bg="gray.600"
                pt={10}
                pb={4}
                px={6}
            >
                <Logo width={150} />

                <IconButton
                    icon={<SignOut size={26} color={colors.gray[300]} />}
                    onPress={handleLogout}
                />
            </HStack>

            <VStack flex={1} px={6}>
                <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center">
                    <Heading color="gray.100">
                        Solicitações
                    </Heading>

                    <Text color="gray.200">
                        {orders.length}
                    </Text>
                </HStack>

                <HStack space={3} mb={8}>
                    <Filter
                        type='open'
                        title='Em andamento'
                        onPress={() => setStatusSelected('open')}
                        isActive={statusSelected === 'open'}
                    />

                    <Filter
                        type='closed'
                        title='Finalizado'
                        onPress={() => setStatusSelected('closed')}
                        isActive={statusSelected === 'closed'}
                    />

                </HStack>

                {
                    isLoading ? <Loading /> :
                        <FlatList
                            data={orders}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetails(item.id)} />}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            ListEmptyComponent={() => (
                                <Center>
                                    <ChatTeardropText color={colors.gray[300]} size={40} />
                                    <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                        Você ainda não possui {'\n'}
                                        solicitações {statusSelected === 'open' ? 'em andamento' : 'finalizados'}
                                    </Text>
                                </Center>
                            )}
                        />
                }

                <Button
                    title='Nova solicitação'
                    onPress={handleNewOrder}
                />
            </VStack>


        </VStack>
    );
}