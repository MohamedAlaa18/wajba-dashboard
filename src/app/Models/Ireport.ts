export interface ISalesReport {
  id: string,
  date: string,
  total: number,
  discount: number,
  deliveryCharge: number,
  paymentType: string,
  paymentStatus: number,
}

export interface IItemReport {
  id: string,
  name: string,
  category:string,
  type: string,
  quantity: number;
}

export interface ICreditBalanceReport {
  id: string,
  name: string,
  email: string,
  phone: number,
  balance: string,
}
