import React, { useContext, useEffect, useState } from 'react';
import { CheckIcon, VStack } from 'native-base';
import { Alert } from 'react-native';
import { Select as NativeBaseSelect, ISelectProps } from 'native-base';

import AuthContext from '../contexts/auth';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Select } from '../components/Select';

export function Register() {
  const { user } = useContext(AuthContext)

  const [isLoading, setIsLoading] = useState(false);

  const [name_product, setName_product] = useState('');
  const [patrimony, setPatrimony] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [address_access, setAddress_access] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation();

  async function handleNewOrderRegister() {
    if (!name_product || !department || !location || !address_access || !description) {
      return Alert.alert("Registrar", "Preencha todos os campos.")
    }

    const user_id = user.id;

    setIsLoading(true);

    try {
      await api.post(`/orders/${user_id}/user`, {
        user_id,
        name_product,
        patrimony,
        department,
        location,
        address_access,
        description,
      })
        .then(res => {
          // console.log(res)
          if (res.status === 201) {
            Alert.alert("Solicitação", "Solicitação registrada com sucesso.");
            navigation.goBack();
          } else {
            console.log(res);
            setIsLoading(false);
            return Alert.alert("Solicitação", "Não foi possível registrar o pedido!")
          }
        })
        .catch(err => {
          console.log(err);
          setIsLoading(false);
          return Alert.alert("Error", "Ocorreu um erro com o registro da sua solicitação!")
        });
    } catch {
      return Alert.alert("Solicitação", "Não foi possível realizar a requisição")
    }
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Solicitação" />

      <Input
        placeholder="Nome do produto"
        // mt={1}
        onChangeText={setName_product}
      />

      <Input
        placeholder="Número do patrimônio"
        mt={3}
        onChangeText={setPatrimony}
      />

      <Select
        mt={3}
        accessibilityLabel="Escolha seu departamento"
        placeholder="Escolha seu departamento"
        selectedValue={department}
        onValueChange={itemValue => setDepartment(itemValue)}
      >
        <NativeBaseSelect.Item label="Rh" value="Rh" />
        <NativeBaseSelect.Item label="Diretoria" value="Diretoria" />
        <NativeBaseSelect.Item label="Financeiro" value="Financeiro" />
        {/* <NativeBaseSelect.Item label="" value="Diretoria" /> */}

      </Select>

      <Select
        mt={3}
        accessibilityLabel="Escolha local do atendiemento"
        placeholder="Escolha o local de atendimento"
        selectedValue={location}
        onValueChange={itemValue => setLocation(itemValue)}
      >
        <NativeBaseSelect.Item label="Presencial" value="Presencial" />
        <NativeBaseSelect.Item label="Remoto" value="Remoto" />
      </Select>

      <Input
        placeholder="Endereço / Acesso remoto"
        mt={3}
        onChangeText={setAddress_access}
      />

      <Input
        placeholder="Descrição do problema"
        flex={1}
        mt={3}
        multiline
        textAlignVertical="top"
        onChangeText={setDescription}
      />

      <Button
        title="Cadastrar"
        mt={4}
        isLoading={isLoading}
        onPress={handleNewOrderRegister}
      />
    </VStack>
  );
}