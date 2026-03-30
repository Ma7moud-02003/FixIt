
export interface SendedServiceRequestModel {
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
}