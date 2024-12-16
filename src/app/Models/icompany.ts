export interface ICompany {
  id: number;
  name: string;
  email: string;
  phone: string;
  websiteURL: string;
  city: string;
  state: string;
  countryCode: string;
  zipCode: string;
  address: string;
  logoUrl: string | null;
  branches: any[];
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
}
