import { PortfolioModel } from "./portfolio";

export interface ViewWorkerModel {
  area: string;
  availabilityStatus: boolean;
  categoryName: string;
  description: string;
  fullName: string;
  jobTitle: string;
  ratingAverage: number | null;  
  imgUrl:string
  serviceBalance: number;
  userId:string;
  reviewsCounter:number;
  workerId:string
}

