export interface MessageModel{
     messageId: number;
  messageText: string;

  senderId: string;
  receiverId: string;
  roomId: number;

  senderName: string;
  senderImgUrl: string;
  senderIsActive: boolean;
  isMe?:boolean;
  isRead: boolean;
  createdAt: string; // ممكن تخليها Date لو هتعمل parsing
}