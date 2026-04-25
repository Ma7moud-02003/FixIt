export interface NotificationModel {
  notificationId: number;
  title: string;
  message: string;
  isRead: boolean;
  notificationType: string;
  relatedEntityId: string;
  createdAt: string; // ISO Date
}