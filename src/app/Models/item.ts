import { IBranch } from "./ibranch";

export interface IItem {
  itemId?: number;
  id: number;
  name: string;
  description: string;
  note: string;
  isActive: boolean;
  isFeatured: boolean;
  imageUrl: string;
  price: number;
  currentPrice?: number;
  prePrice?: number;
  taxValue: number;
  categoryId: number;
  categoryName: string;
  itemType: 'Veg' | 'Non-Veg';
  isDeleted: boolean;
  branches: IBranch[];
}

export interface IAddon {
  itemId: number,
  name: string,
  price: number,
}

export interface IExtra {
  additionalPrice: number,
  originalPrice: number,
  id: number,
  itemId: number,
  name: string,
  status: number,
}

export interface IAttribute {
  id: number
  name: string,
  status: number,
  // variations: IVariation[],
}

export interface IVariation {
  additionalPrice: number,
  id: number,
  itemattributesId: number,
  name: string,
  note: string,
}
