import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ChatsService } from '../../services/-chats';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ChatRoom } from '../../Model/chat.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chats',
  imports: [CommonModule],
  templateUrl: './chats.html',
  styleUrl: './chats.css',
})
export class Chats implements OnInit,OnDestroy{
private _chat=inject(ChatsService);
private subs=new Subscription();

getAllChats(){
this.subs.add(
  this._chat.getAllChats().subscribe({
    next:(res)=>{
console.log(res);

    }
  })
)
}
getRandomChat(){
  this._chat.getChatMessages(6).subscribe({
    next:(res)=>{
console.log(res);

    }
  })
}
 
  private readonly router = inject(Router);

 
  // ── Signals ────────────────────────────────────────────────
  isLoading = signal(true);
  chats = signal<ChatRoom[]>([]);
  currentPage = signal(1);
  totalCount = signal(0);
  pageSize = signal(10);
  searchQuery = signal('');
 
  // Page cache: Map<pageNum, ChatRoom[]>
  private pageCache = new Map<number, ChatRoom[]>();
 
  // ── Computed ───────────────────────────────────────────────
  totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize()));
  hasPrev = computed(() => this.currentPage() > 1);
  hasNext = computed(() => this.currentPage() < this.totalPages());
 
  filteredChats = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return this.chats();
    return this.chats().filter(
      (c) =>
        c.currentUserName.toLowerCase().includes(q) ||
        c.targetUserName.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
    );
  });
 
  skeletons = Array(6).fill(0);
 
  ngOnInit(): void {
    this.loadPage(1);
  }
 
  loadPage(page: number): void {
    // Serve from cache if available
    if (this.pageCache.has(page)) {
      this.chats.set(this.pageCache.get(page)!);
      this.currentPage.set(page);
      this.isLoading.set(false);
      return;
    }
 
    this.isLoading.set(true);
    this.subs.add(
      this._chat.getAllChats(page, this.pageSize()).subscribe({
        next: (res) => {
          console.log(res);
          
          const items = res?.data ?? (Array.isArray(res) ? res : []);
          this.pageCache.set(page, items);
          this.chats.set(items);
          this.totalCount.set(res?.totalCount ?? items.length);
          this.currentPage.set(page);
          this.isLoading.set(false);
        },
        error: () => {
          // Demo fallback
          const demo = this.getDemoChats();
          this.pageCache.set(page, demo);
          this.chats.set(demo);
          this.totalCount.set(demo.length);
          this.currentPage.set(page);
          this.isLoading.set(false);
        },
      })
    );
  }
 
  goToNext(): void {
    if (this.hasNext()) this.loadPage(this.currentPage() + 1);
  }
 
  goToPrev(): void {
    if (this.hasPrev()) this.loadPage(this.currentPage() - 1);
  }
 
  openChat(room: ChatRoom): void {
    this.router.navigate(['admin/chatDetails', room.roomId]);
  }
 
  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
 
    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `${diffMins}د`;
    if (diffHours < 24) return `${diffHours}س`;
    if (diffDays < 7) return `${diffDays}ي`;
    return date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
  }
 
  trackByRoomId(_: number, chat: ChatRoom): number {
    return chat.roomId;
  }
 
  getInitials(name: string): string {
    return name?.split(' ').slice(0, 2).map((w) => w[0]).join('') ?? '?';
  }
 
  private getDemoChats(): ChatRoom[] {
    const names = [
      ['أحمد محمد السيد', 'سارة علي حسن'],
      ['محمود اشرف القتال', 'عمرو عمرو عمرو'],
      ['خالد إبراهيم نور', 'فاطمة يوسف كمال'],
      ['يوسف عبدالله رشيد', 'نورا حسام فريد'],
      ['طارق سامي الجندي', 'دينا وليد سلام'],
      ['كريم مصطفى لطفي', 'منى أحمد ثابت'],
    ];
    const messages = [
      'هل يمكنك القدوم غداً للإصلاح؟',
      'تم إنجاز العمل بنجاح، شكراً',
      'ما هو سعر الخدمة؟',
      'nvc',
      'متى تكون متاحاً؟',
      'أحتاج مساعدة في السباكة',
    ];
    return names.map(([cur, tgt], i) => ({
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      currentUserId: `user-${i}`,
      currentUserImgUrl: '',
      currentUserIsActive: i % 2 === 0,
      currentUserName: cur,
      lastMessage: messages[i],
      lastMessageAt: new Date(Date.now() - i * 3600000).toISOString(),
      roomId: i + 1,
      targetUserId: `target-${i}`,
      targetUserImgUrl: '',
      targetUserIsActive: i % 3 === 0,
      targetUserName: tgt,
      unreadCount: i === 1 ? 3 : i === 3 ? 1 : 0,
    }));
  }
 
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
