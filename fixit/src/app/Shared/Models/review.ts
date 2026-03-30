export interface ReviewModel {
  reviewId: number;
  requestId: string;
  comment: string;
  rate: number;
  createdAt: string;
  reviewerName: string;
  reviewerWorkerName: string | null;
  submitedImgUrl:string,
  reviewerImgUrl:string;

}