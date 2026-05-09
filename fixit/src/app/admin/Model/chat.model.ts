export interface ChatRoom {
  createdAt: string;
  currentUserId: string;
  currentUserImgUrl: string;
  currentUserIsActive: boolean;
  currentUserName: string;
  lastMessage: string;
  lastMessageAt: string;
  roomId: number;
  targetUserId: string;
  targetUserImgUrl: string;
  targetUserIsActive: boolean;
  targetUserName: string;
  unreadCount?: number;
}
 
export interface ChatMessage {
  createdAt: string;
  isRead: boolean;
  messageId: number;
  messageText: string;
  receiverId: string;
  roomId: number;
  senderId: string;
  senderImgUrl: string;
  senderIsActive: boolean;
  senderName: string;
}
 
export interface MessagesResponse {
  data: ChatMessage[];
}