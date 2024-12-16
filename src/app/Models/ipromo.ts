export interface IItem {
  id: number;
  name: string;
  price: number;
  status: number;
}

export interface ICategory {
  id: number;
  name: string;
  price: number;
}

export interface IOffer {
  id: number;
  name: string;
  code: string;
  imageUrl: string | null;
  status: number;
  startDate: string;
  endDate: string;
  description: string;
  discountOn:'items'|'categories'
  discountPercentage: number;
  items: IItem[];
  categories: ICategory[];
  discountType: number;
  branchId: number;
}

export interface IVoucher {
  id: number;
  name: string;
  code: number;
  discount: number;
  discountType: number;
  startDate: string;
  endDate: string;
  minimumOrderAmount: number;
  maximumDiscount: number;
  limitPerUser: number;
  imageUrl: string;
  description: string;
  branchId: number;
}
