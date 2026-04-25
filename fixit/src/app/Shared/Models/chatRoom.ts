export interface ChatRoom {
  roomId: number;
  targetUserId: string;

  targetUserName: string;
  targetUserImgUrl: string | null;
  targetUserIsActive: boolean;

  lastMessage: string;
  lastMessageAt: string;
unreadCount?:number,
  createdAt: string;
}