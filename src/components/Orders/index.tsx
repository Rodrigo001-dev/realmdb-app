import React, { useState, useCallback } from 'react';
import { Alert, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { getRealm } from '../../databases/realm';

import { Load } from '../Load';
import { Filters } from '../Filters';
import { Order, OrderProps } from '../Order';

import { Container, Header, Title, Counter } from './styles';

export function Orders() {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [status, setStatus] = useState('open');

  async function fetchOrders() {
    setIsLoading(true);
    const realm = await getRealm();

    try {
      // dentro do realm.objects() é passado o nome da coleção
      const response = realm
        .objects<OrderProps[]>("Order")
        .filtered(`status = '${status}'`)
        // o sorted é para os chamados se organizarem(pela data criada(created_at))
        .sorted("created_at")
        .toJSON();

      setOrders(response);
    } catch {
      Alert.alert("Chamados", "Não foi possível carregar os chamados");
    } finally {
      realm.close();
      setIsLoading(false);
    }
  };

  useFocusEffect(useCallback(() => {
    fetchOrders();
  }, [status]));

  return (
    <Container>
      <Filters onFilter={setStatus} />

      <Header>
        <Title>Chamados {status === 'open' ? 'aberto' : 'encerrado'}</Title>
        <Counter>{orders.length}</Counter>
      </Header>

      {
        isLoading ?
          <Load />
          : <FlatList
            data={orders}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <Order data={item} />
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
          />
      }
    </Container>
  );
}