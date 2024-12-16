export interface IRole {
  createdAt: Date,
  deletedAt: Date,
  id: number,
  isDeleted: boolean,
  name: string,
  updatedAt: Date,
  userRole: number,
  permissions: IPermission[],
}

export interface IPermission {
  id: number,
  pageName: string,
  name: boolean,
  canCreate: boolean,
  canRead: boolean,
  canUpdate: boolean,
  canDelete: boolean
  roleId: number,
}

export interface IUser {
  id: number,
  name: string,
  email: string,
  phoneNumber: string,
}
