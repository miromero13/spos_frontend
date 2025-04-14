import { type ApiBase } from '@/models'
// import { type GENDER } from '@/utils'

export interface User extends ApiBase {
  name: string
  ci: number
  email: string
  phone: string
  // gender: GENDER
  role: Role
}
export interface CreateUser extends Partial<Omit<User, 'role' | 'branch' | 'gender'>> {
  gender: string
  role: string
  branch?: string
}

export enum Role {
  ADMIN = 'administrator',
  CASHIER = 'cashier',
}
export interface UpdateUser extends CreateUser { }
