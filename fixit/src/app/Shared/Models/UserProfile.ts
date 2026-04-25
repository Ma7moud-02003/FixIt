export interface UserModel {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  passwordHash: string;
  imgUrl: string | null;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface WorkerModel extends UserModel {
 
  jobTitle: string;
  ratingAverage?: number | null;
  availabilityStatus: boolean;
  area: string;
  categoryName: string;
  description: string;
  categoryId:number;
  rate:number
  
}

export interface WorkersModel {
  workerId: string;
  fullName: string;
  role: string;
  city: string;

  area: string | null;
  categoryName: string | null;
  description: string | null;
  imgUrl: string | null;
  jobTitle: string | null;
  ratingAverage: number | null;
  rate:number;
  availabilityStatus: boolean;
}


export interface UserEditeModel{
 
  fullName: string;
  phone: string;
  city: string;
  updatedAt: string | null;

}


export interface WorkerEditModel extends UserEditeModel{
  isActive:true
  fullName: string;
  phone: string;
  city: string;
    jobTitle: string;
  availabilityStatus: boolean;
  area: string;
  categoryName: string;
  description: string;

}
