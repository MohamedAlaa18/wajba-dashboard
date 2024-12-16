export interface IEmail {
  email: string;
  userName: string;
  name: string;
  password: string;
  host: string;
  port: string;
  mailEncryption: string;
  id: number;
  createdAt: string; // Use Date if you plan to convert to/from date objects
  updatedAt: string; // Use Date if you plan to convert to/from date objects
  isDeleted: boolean;
  deletedAt: string | null; // Use Date | null if working with date objects
}
