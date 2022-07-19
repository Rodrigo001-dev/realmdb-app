import Realm from 'realm';

import { OrderSchema } from './schemas/OrderSchema';

// o Realm.open() vai abrir uma conexão com o RealmDB
export const getRealm = async () => await Realm.open({
  // o path é para falar qual o nome do banco de dados
  path: "realm-app",
  // dentro do [] eu passo todos os schemas que eu quero que ele use como
  // representação das minhas coleções para ele criar essa estrutura dentro
  // da base de dados
  schema: [OrderSchema],
});