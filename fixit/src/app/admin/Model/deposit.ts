export interface Deposit {
  paymentId: string;
  userId: string;
  walletId: string;

  fullName: string;
  email: string;
  imgUrl: string;

  amount: number;

  gateway: string;
  gatewayRef: string;

  status: string;

  createdAt: string;

  releasedAt: string | null;
}