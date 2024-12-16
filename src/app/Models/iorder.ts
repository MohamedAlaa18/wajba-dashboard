import { IAddon, IExtra, IVariation } from "./item";

export interface IOrder {
  id: number;
  orderDate: string;
  status: number;
  totalAmount: number;
  orderType: number;
  paymentMethod: number;
  discount: number;
  employeeName?: string | null;
  branchId: number;
  branchName: string;
  items: IOrderItem[];
}

export interface IOrderItem {
  itemId: number;
  quantity: number;
  price: number;
  totalPrice: number;
  category: string;
  imgurl: string;
  itemName: string;
  variations: IVariation[];
  addons: IAddon[];
  extras: IExtra[];
}

// export interface IVariation {
//   variationName: string;
//   attributeName: string;
//   additionalPrice: number;
// }

// export interface IAddon {
//   addonName: string;
//   additionalPrice: number;
// }

// export interface IExtra {
//   extraName: string;
//   additionalPrice: number;
// }
