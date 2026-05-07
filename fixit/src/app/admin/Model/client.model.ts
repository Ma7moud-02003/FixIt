export interface IClient {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  role: 'client' | 'worker' | string; // حددتها كـ 'client' بناءً على الداتا
  imgUrl: string | null;
  isActive: boolean;
  isBlocked: boolean;
  
  // الإحصائيات والقوائم
  favorites: any[]; // يمكنك تغيير any لـ Interface الخاص بـ Favorite
  notifications: any[];
  messages: any[];
  reviews: any[];
  
  // العلاقات (Chat Rooms)
  clientChatRooms: any[];
  workerChatRooms: any[];
  
  // التقارير والطلبات
  sentReports: any[];
  receivedReports: any[];
  sentRequests: any[];

  // التواريخ والحماية
  passwordHash: string;
  createdAt: string | Date;
  updatedAt: string | Date | null;
  lastLogin: string | Date | null;
}