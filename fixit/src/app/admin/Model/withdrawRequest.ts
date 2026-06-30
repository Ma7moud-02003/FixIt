export interface WithdrawRequest {
  id: string;
  userId: string;
  walletId: string;
 
  fullName: string;
  email: string;
  imgUrl: string;
 
  amount: number;
 
  method: string;
 
  status: string;
 
  createdAt: string;
 
  paidAt: string | null;
}
 