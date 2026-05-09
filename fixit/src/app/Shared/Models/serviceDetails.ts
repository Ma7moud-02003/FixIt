export interface ServiceDetailsModel {
  clientId: string;
  clientName: string;
  comment: string | null;
  completeDate: string | null;
  createdAt: string;
  depositAmount: number;
  serviceAddress?:string;
  rate: number;
  requestDate: string;
  reviewId: number;
  serviceDescription: string;
  serviceId: string;
  serviceTitle: string;
  state: string;
  totalPrice: number;
submitedImgUrl?:string;
  workerId: string;
  requestedImgUrl:string;
  workerName: string;
}