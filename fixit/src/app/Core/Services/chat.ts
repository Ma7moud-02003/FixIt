import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Auth } from './auth';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

  @Injectable({
  providedIn: 'root',
})
export class ChatService {

   private authService = inject(Auth);
  private http = inject(HttpClient);

  private hubConnection!: signalR.HubConnection;
  private isConnected = false;

  endPoint: string = 'chat';

  // ============================
  // 🔌 CONNECTION
  // ============================
async startConnection(): Promise<void> {
  if (this.hubConnection && this.isConnected) {
    return Promise.resolve(); // مهم جدًا
  }

  this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('https://fixitapi.runasp.net/chat', {
      accessTokenFactory: () =>
        this.authService.getUserToken().replace(/"/g, '')
    })
    .withAutomaticReconnect()
    .build();

  // handlers
  this.hubConnection.onreconnected(() => {
    console.log('🔄 Reconnected');
  });

  this.hubConnection.onclose(() => {
    console.log('❌ Disconnected');
    this.isConnected = false;
  });

  return this.hubConnection.start()
    .then(() => {
      console.log('✅ SignalR Connected');
      this.isConnected = true;
    })
    .catch(err => {
      console.error('❌ SignalR Error:', err);
      throw err; // مهم عشان await يمسك الخطأ
    });
}
  // ============================
  // 🌐 API METHODS
  // ============================

  getChatRooms() {
    return this.http.get(`${environment.apiUrl}/${this.endPoint}`);
  }

  getChatHistory(roomId: number) {
    return this.http.get(`${environment.apiUrl}/${this.endPoint}/room/${roomId}`);
  }

  createChatRoom(workerId: string) {
    return this.http.post(
      `${environment.apiUrl}/${this.endPoint}/room/${workerId}`,
      JSON.stringify(workerId),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  sendApiMessage(roomId: number, message: string) {
    return this.http.post(
      `${environment.apiUrl}/${this.endPoint}/room/${roomId}/messages`,
      JSON.stringify(message),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ============================
  // 📡 SIGNALR METHODS
  // ============================

  joinRoom(roomId: string) {
    this.hubConnection.invoke('JoinRoom', Number(roomId))
      .catch(err => console.error('JoinRoom Error:', err));
  }

  leaveRoom(roomId: string) {
    this.hubConnection.invoke('LeaveRoom', Number(roomId))
      .catch(err => console.error('LeaveRoom Error:', err));
  }

  sendMessage(roomId: number, messageText: string) {
    this.hubConnection.invoke('SendMessage', roomId, messageText)
      .catch(err => console.error('SendMessage Error:', err));
  }

  markAsRead(roomId: number) {
    this.hubConnection.invoke('MarkAsRead', roomId)
      .catch(err => console.error('MarkAsRead Error:', err));
  }

  // ============================
  // 🎧 EVENTS (RECEIVE)
  // ============================

  onReceiveMessage(callback: (data: any) => void) {
    this.hubConnection.on('ReceiveMessage', callback);
  }

  onReceiveNotification(callback: (data: { roomId: number, message: string }) => void) {
    this.hubConnection.on('ReceiveNotification', callback);
  }

  onUserStatusChanged(callback: (userId: string, isActive: boolean) => void) {
    this.hubConnection.on('UserStatusChanged', callback);
  }

  onMessagesRead(callback: (data: { roomId: number, readerId: string }) => void) {
    this.hubConnection.on('MessagesRead', callback);
  }

  onError(callback: (error: string) => void) {
    this.hubConnection.on('Error', callback);
  }

  // ============================
  // 🧹 CLEANUP
  // ============================

  stopConnection() {
    if (!this.hubConnection) return;

    this.hubConnection.stop();
    this.isConnected = false;
  }


}
