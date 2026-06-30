export interface Transaction {
  transactionId: string;

  fromWalletId: string;
  toWalletId: string;

  userId1: string;
  userId2: string;

  user1FullName: string;
  user2FullName: string;

  user1ImgUrl: string;
  user2ImgUrl: string;

  transactionType: string;

  refType: string;

  serviceRequestId: string;

  serviceCommetion: number;

  amount: number;

  createdAt: string;
}