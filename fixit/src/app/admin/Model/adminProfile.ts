
export interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  role: string;
  imgUrl: string;
  createdAt: string;
  lastLogin?: string;
  isActive?: boolean;
}
 
export interface EditProfileRequest {
  fullName: string;
  email: string;
  phone: string;
  city: string;
}
 
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confarmPassword: string;
}
 
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}
 
export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}
export type ActiveSection = 'profile' | 'edit' | 'password' | 'image';