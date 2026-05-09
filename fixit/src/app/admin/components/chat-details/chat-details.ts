import { Auth } from './../../../Core/Services/auth';
import { ChangeDetectorRef, Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatsService } from '../../services/-chats';
import { Subscription } from 'rxjs';
import { ChatMessage } from '../../Model/chat.model';
import { CommonModule } from '@angular/common';

interface MessageGroup {
  date: string;
  messages: ChatMessage[];
}
@Component({
  selector: 'app-chat-details',
  imports: [CommonModule],
  templateUrl: './chat-details.html',
  styleUrl: './chat-details.css',
})
export class ChatDetails {
   @ViewChild('messagesEnd') messagesEndRef!: ElementRef<HTMLDivElement>;
  @ViewChild('scrollContainer') scrollContainerRef!: ElementRef<HTMLDivElement>;
 
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly _chat = inject(ChatsService);
  private readonly cdr = inject(ChangeDetectorRef);
  private subs = new Subscription();
 
  // ── Signals ────────────────────────────────────────────────
  isLoading = signal(true);
  messages = signal<ChatMessage[]>([]);
  roomId = signal<string>('');
  currentUserId = signal<string>('');
  shouldScrollToBottom = true;
 
  skeletons = Array(8).fill(0);
 
  // ── Computed ───────────────────────────────────────────────
  messageGroups = computed<MessageGroup[]>(() => {
    const msgs = this.messages();
    if (!msgs.length) return [];
 
    const groups: Record<string, ChatMessage[]> = {};
    msgs.forEach((m) => {
      const dateKey = this.getDateKey(m.createdAt);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(m);
    });
 
    return Object.entries(groups).map(([date, messages]) => ({ date, messages }));
  });
 
  headerInfo = computed(() => {
    const msgs = this.messages();
    if (!msgs.length) return null;
    // Derive the "other" user from messages where senderId !== currentUserId
    const other = msgs.find((m) => m.senderId !== this.currentUserId());
    const me = msgs.find((m) => m.senderId === this.currentUserId());
    return {
      otherName: other?.senderName ?? 'المستخدم',
      otherImg: other?.senderImgUrl ?? '',
      otherActive: other?.senderIsActive ?? false,
      myName: me?.senderName ?? '',
    };
  });
 private _auth=inject(Auth)
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('roomId') ?? '';
    this.roomId.set(id);
 
    // Try to get currentUserId from navigation state or localStorage
    this.currentUserId.set(this._auth.getUserId());
 
    this.loadMessages(+id);
  }
 
  loadMessages(roomId: number): void {
    this.isLoading.set(true);
    this.shouldScrollToBottom = true;
 
    this.subs.add(
      this._chat.getChatMessages(roomId).subscribe({
        next: (res) => {
          console.log(res);
          
          const data = res?.data ?? (Array.isArray(res) ? res : []);
          this.messages.set(data);
 
          // If no currentUserId yet, infer from most frequent senderId
          if (!this.currentUserId() && data.length > 0) {
            const freq: Record<string, number> = {};
            data.forEach((m: ChatMessage) => (freq[m.senderId] = (freq[m.senderId] ?? 0) + 1));
            const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0];
            if (top) this.currentUserId.set(top);
          }
 
          this.isLoading.set(false);
          this.cdr.markForCheck();
        },
        error: () => {
          this.messages.set(this.getDemoMessages());
          this.isLoading.set(false);
          this.cdr.markForCheck();
        },
      })
    );
  }
 
  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }
 
  scrollToBottom(): void {
    try {
      const el = this.messagesEndRef?.nativeElement;
      el?.scrollIntoView({ behavior: 'smooth' });
      this.shouldScrollToBottom = false;
    } catch {}
  }
 
  isMyMessage(msg: ChatMessage): boolean {
    return msg.senderId === this.currentUserId();
  }
 
  formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
 
  getDateKey(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
 
  isToday(dateStr: string): boolean {
    const d = new Date(dateStr);
    const t = new Date();
    return d.toDateString() === t.toDateString();
  }
 
  getInitials(name: string): string {
    return (name ?? '').split(' ').slice(0, 2).map((w) => w[0]).join('');
  }
 
  goBack(): void {
    this.router.navigate(['admin/chats']);
  }
 
  trackByMessageId(_: number, msg: ChatMessage): number {
    return msg.messageId;
  }
 
  trackByDate(_: number, group: MessageGroup): string {
    return group.date;
  }
 
  private getDemoMessages(): ChatMessage[] {
    const uid = 'b18cfc8d-b7db-41fc-8462-df140e5e2f89';
    this.currentUserId.set(uid);
    const pairs: [string, string, boolean][] = [
      [uid, 'مرحباً، هل أنت متاح للخدمة اليوم؟', false],
      ['fb43847a-f98a-43b5-a38d-808bb6d73b4c', 'نعم، متاح من الساعة 10 صباحاً', false],
      [uid, 'ممتاز، أحتاج إصلاح التكييف', false],
      ['fb43847a-f98a-43b5-a38d-808bb6d73b4c', 'حسناً، ما هو الموديل؟', false],
      [uid, 'سامسونج 2.5 حصان', false],
      ['fb43847a-f98a-43b5-a38d-808bb6d73b4c', 'سأكون عندك في الساعة 11 صباحاً', false],
      [uid, 'تمام، شكراً جزيلاً', false],
      ['fb43847a-f98a-43b5-a38d-808bb6d73b4c', 'العفو، إلى اللقاء', true],
    ];
    return pairs.map(([senderId, text, isRead], i) => ({
      messageId: i + 1,
      createdAt: new Date(Date.now() - (pairs.length - i) * 120000).toISOString(),
      isRead,
      messageText: text,
      receiverId: senderId === uid ? 'fb43847a-f98a-43b5-a38d-808bb6d73b4c' : uid,
      roomId: Number(this.roomId()),
      senderId,
      senderImgUrl: '',
      senderIsActive: i % 3 === 0,
      senderName: senderId === uid ? 'عمرو عمرو عمرو' : 'محمود اشرف القتال',
    }));
  }
 
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
