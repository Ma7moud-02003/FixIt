
export interface MyServiceModel {
  serviceId: string;
  clientId: string;
  serviceTitle: string;
  serviceDescription: string;
  requestDate: string;
  completeDate: string | null;
  depositAmount: number;
  totalPrice: number;
  state: string;
  workerName:string;
  clientName:string;
  requestedImgUrl:string
  workerImgUrl:string,
  clientImgUrl:string
}