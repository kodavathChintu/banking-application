export type UserRole = 'CUSTOMER' | 'MANAGER' | 'BANK_MANAGER';

export interface User {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  active: boolean;
}

export interface AuthResponse {
  token?: string;
  user: User;
  message?: string;
}

export interface Bank {
  bankId: number;
  bankName: string;
  ifscCode: string;
  branchName: string;
  address: string;
  active: boolean;
}

export interface Customer {
  customerId: number;
  fullName: string;
  contactNumber: string;
  address: string;
  status: string;
  bank: Bank;
}

export interface Account {
  accountId: number;
  accountNumber: string;
  balance: number;
  accountType: string;
  accountStatus: string;
  openingDate: string;
  customer: Customer;
  bank: Bank;
}

export interface AccountOpeningRequest {
  requestId: number;
  customerName: string;
  email: string;
  mobileNumber: string;
  address: string;
  aadhaarFileName: string;
  gender: string;
  accountType: string;
  requestStatus: string;
  bank: Bank;
  user?: any;
}

export interface Transaction {
  transactionId: number;
  amount: number;
  transactionType: string;
  transactionTime: string;
  remarks: string;
  senderAccount: string;
  receiverAccount: string;
}

export interface DepositRequest {
  accountNumber: string;
  amount: number;
  remarks?: string;
}

export interface WithdrawRequest {
  accountNumber: string;
  amount: number;
  remarks?: string;
}

export interface TransferRequest {
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number;
  remarks?: string;
}

export interface AccountOpeningFormData {
  customerName: string;
  email: string;
  mobileNumber: string;
  address: string;
  gender: string;
  accountType: string;
  bankId: number;
}
