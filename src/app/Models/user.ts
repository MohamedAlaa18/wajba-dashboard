import { IBranch } from "./ibranch";

export interface IUser {
  id: any;
  name: string;
  email: string;
  phoneNumber: string;
  status: number;
  userType: number;
  profilePhoto: string;
  roleId: number;
  roleName: string;
  branches: IBranch[];
  addresses: Address[] | null;
  password: string;
  confirmPassword: string;
}

export interface Address {
  id: number;
  buildingName: string;
  street: string;
  apartmentNumber: string;
  addressLabel: string;
  addressType: number;
  floor: string;
}
