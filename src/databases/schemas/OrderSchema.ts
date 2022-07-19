export const OrderSchema = {
  // nome do schema
  name: "Order",
  // properties são as colunas
  properties: {
    _id: "string",
    patrimony: "string",
    equipment: "string",
    description: "string",
    status: "string",
    created_at: "date",
  },

  primaryKey: "_id",
};