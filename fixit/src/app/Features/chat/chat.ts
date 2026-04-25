import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ChatService } from '../../Core/Services/chat';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, isActive, RouterLink, RouterModule } from '@angular/router';
import { MessageModel } from '../../Shared/Models/message';
import { Auth } from '../../Core/Services/auth';
import { Subscription } from 'rxjs';
import { ChatRoom } from '../../Shared/Models/chatRoom';
import { TopNav } from "../../Shared/Components/top-nav/top-nav";
import { BottomNav } from "../../Shared/Components/bottom-nav/bottom-nav";

@Component({
  selector: 'app-chat',
  imports: [FormsModule, CommonModule, TopNav, RouterLink, RouterModule, BottomNav],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  ngAfterViewInit() {
 
    };

    scrollToBottom() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth' // يخليها تنزل بسلاسة
  });
}
  private chatService = inject(ChatService);
  private route = inject(ActivatedRoute);
  private subs = new Subscription();
  currentUserId = signal<string>('');
  // ============================
  // STATE
  // ============================
  chats = signal<ChatRoom[]>([]);
  messageHistory = signal<MessageModel[]>([]);
  message = signal<string>('');

  currentRoomId = signal<number>(0);
  receiverId = signal<string>('');
  workerId = this.route.snapshot.paramMap.get('workerId') || '';

  // ============================
  // INIT
  // ============================
 async ngOnInit(): Promise<void> {

  await this.chatService.startConnection();

  this.currentUserId.set(this._auth.getUserIdFromToken() || '');

  if (this.workerId) {
    this.createChatRoom();
  }

  // Receive Message
  this.chatService.onReceiveMessage((data: MessageModel) => {
    if (data.roomId === this.currentRoomId()) {
      this.messageHistory.update(list => [...list, data]);
      this.triggerMarkAsRead();
    } else {
      this.updateSidebarUnreadCount(data.roomId);
    }
  });

  // Messages Read
  this.chatService.onMessagesRead((data: any) => {
    if (data.roomId === this.currentRoomId()) {
      this.messageHistory.update(list =>
        list.map(msg => {
          if (msg.senderId !== data.readerId && !msg.isRead) {
            return { ...msg, isRead: true };
          }
          return msg;
        })
      );
    }
  });

  this.getAllChats();
}

  // ============================
  // CHAT ROOMS
  // ============================

  getAllChats() {
    this.chatService.getChatRooms().subscribe({
      next: (res: any) => {
        console.log(res.data);

        this.chats.set(res.data);
      }
    });
  }

  createChatRoom() {
    this.subs.add(this.chatService.createChatRoom(this.workerId).subscribe({
      next: (room: any) => {
        const roomId = room.data;

        this.currentRoomId.set(roomId);

        this.chatService.joinRoom(roomId);

        this.getChatHistory(roomId);
      }
    }));
  }

  targetUser = signal<any>({
    id:'',
    name: '',
    image: '',
    isActive: false
  })



  openChat(roomId: number, targetChat: ChatRoom) {
      
    const targetUserId = targetChat.targetUserId;
    this.targetUser.set({
      name: targetChat.targetUserName,
      image: targetChat.targetUserImgUrl,
      isActive: targetChat.targetUserIsActive,
      id:targetChat.targetUserId
    })
    this.receiverId.set(targetUserId);

    if (roomId === this.currentRoomId()){
   setTimeout(()=>{
    this.scrollToBottom();
   })
     return;
    }
    const current = this.currentRoomId();

    if (current !== 0) {
      this.chatService.leaveRoom(current.toString());
    }

    this.currentRoomId.set(roomId);
    // this.scrollToBottom()

    this.chatService.joinRoom(roomId.toString());

    this.getChatHistory(roomId);
  }

  // ============================
  // MESSAGES
  // ============================

  sendMessage() {
    const text = this.message().trim();

    if (!text || this.currentRoomId() === 0) return;

    const roomId = this.currentRoomId();

    this.subs.add(this.chatService.sendApiMessage(roomId, text).subscribe({
      next: () => {
        this.updateSidebarUnreadCount(this.currentRoomId());
        this.message.set('');
           setTimeout(()=>{
    this.scrollToBottom();
   })
      }
    }));
  }
  
  getChatHistory(roomId: number) {
    this.messageHistory.set([])
    this.subs.add(this.chatService.getChatHistory(roomId).subscribe({
      next: (res: any) => {
        this.messageHistory.set(res.data);
        this.triggerMarkAsRead();
       setTimeout(()=>{
 this.scrollToBottom()
       },100)
      }
    }));
  }

  // ============================
  // READ STATUS
  // ============================

  triggerMarkAsRead() {
    const roomId = this.currentRoomId();

    if (roomId !== 0) {
      this.chatService.markAsRead(roomId);
    }
  }

  // ============================
  // UI HELPERS
  // ============================
  private _auth = inject(Auth);
  isMe(senderId: string): boolean {
    const myId = this.currentUserId();
    return senderId === myId;
  }



  updateSidebarUnreadCount(roomId: number) {
    this.chats.update(list =>
      list.map(chat =>
        chat.roomId === roomId
          ? {
            ...chat,
            unreadCount: 1,
            lastMessage: this.message(),
            lastMessageAt: new Date().toISOString()

          }
          : chat
      ).sort((a, b) => {
        const aTime = new Date(a.lastMessageAt).getTime();
        const bTime = new Date(b.lastMessageAt).getTime();
        return bTime - aTime;
      })
    );
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.chatService.stopConnection();
  }
}