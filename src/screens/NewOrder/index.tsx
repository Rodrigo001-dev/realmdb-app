import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import uuid from 'react-native-uuid';

import { getRealm } from '../../databases/realm';

import { Container, Header, Title, Form } from './styles';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { TextArea } from '../../components/TextArea';
import { IconButton } from '../../components/IconButton';

export function NewOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimony] = useState('');
  const [equipment, setEquipment] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation();

  function handleBack() {
    navigation.goBack();
  }

  async function handleNewOrderRegister() {
    // o getRealm é uma promise e por isso eu tenho que fazer o realm aguardar
    // a instância ser retornada
    const realm = await getRealm();

    try {
      setIsLoading(true);
      // qualquer operação de escrita de dados(cadastrar, atualizar, deletar),
      // qualquer operação que modifica dados tem que colocar dentro do write
      realm.write(() => {
        // o realm.create() recebe 2 parâmetros: "Order" => o nome da minha coleção(onde eu quero cadastrar)
        // no segundo eu passo um objeto com as informações que vão ser cadastradas
        const created = realm.create("Order", {
          _id: uuid.v4(),
          patrimony,
          equipment,
          description,
          status: 'open',
          created_at: new Date(),
        });

        console.log(created);
      });

      Alert.alert("Chamado", "Chamado cadastrado com sucesso!");
    } catch {
      Alert.alert("Chamado", "Não foi possível abrir o chamado!");
    } finally {
      // sempre depois que for usado a instância(realm.write) é necessário fecha-lá
      // o realm.close() fecha a conexão da instância com o banco de dados
      realm.close();
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Novo chamado</Title>
        <IconButton icon="chevron-left" onPress={handleBack} />
      </Header>

      <Form>
        <Input
          placeholder="Número do Patrimônio"
          onChangeText={setPatrimony}
        />

        <Input
          placeholder="Equipamento"
          onChangeText={setEquipment}
        />

        <TextArea
          placeholder="Descrição"
          autoCorrect={false}
          onChangeText={setDescription}
        />
      </Form>

      <Button
        title="Enviar chamado"
        isLoading={isLoading}
        onPress={handleNewOrderRegister}
      />
    </Container>
  );
}