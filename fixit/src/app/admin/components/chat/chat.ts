import { Component, computed, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
 
export interface ChatMessage {
  sender: string;
  text: string;
  time: string;
  isSelf: boolean;
}
 
export interface Conversation {
  id: number;
  title: string;
  subtitle: string;
  avatar: string;
  avatar2?: string;
  lastMsg: string;
  time: string;
  unread?: number;
  serviceType: string;
  online1: boolean;
  online2: boolean;
  flagged?: boolean;
}
 

@Component({
  selector: 'app-chat',
  imports: [],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
   selectedConvId = signal(1);
  searchQuery    = signal('');
  showControls   = signal(true);
 
  conversations = signal<Conversation[]>([
    {
      id: 1, title: 'سارة أحمد & محمد خالد', subtitle: 'تنظيف منازل : طلب',
      avatar: 'https://i.pravatar.cc/40?img=47', avatar2: 'https://i.pravatar.cc/40?img=12',
      lastMsg: 'هل يمكنك الوصول في تمام الساعة الخامسة؟', time: 'منذ دقيقتين',
      serviceType: 'تنظيف منازل', online1: true, online2: false,
    },
    {
      id: 2, title: 'عبد الله منصور & ياسين علي', subtitle: 'سباكة وصيانة',
      avatar: 'https://i.pravatar.cc/40?img=14', avatar2: 'https://i.pravatar.cc/40?img=15',
      lastMsg: 'اتصل بي على الرقم 0501234567 فوراً', time: 'منذ ساعة',
      serviceType: 'سباكة وصيانة', online1: true, online2: true, unread: 7, flagged: true,
    },
    {
      id: 3, title: 'مي القحطاني & فهد العتيبي', subtitle: 'تركيب أثاث',
      avatar: 'https://i.pravatar.cc/40?img=48', avatar2: 'https://i.pravatar.cc/40?img=17',
      lastMsg: 'تم إكمال العمل بنجاح، شكراً لك', time: 'أمس',
      serviceType: 'تركيب أثاث', online1: false, online2: false,
    },
  ]);
 
  messages = signal<ChatMessage[]>([
    { sender: 'سارة أحمد', text: 'مرحباً محمد، بخصوص موعد اليوم.', time: '10:00 ص', isSelf: false },
    { sender: 'محمد خالد', text: 'أهلاً سارة، تعم أنا في الطريق إليك.', time: '10:05 ص', isSelf: true },
    { sender: 'سارة أحمد', text: 'هل يمكنك الوصول في تمام الساعة الخامسة؟', time: '10:10 ص', isSelf: false },
  ]);
 
  selectedConv = computed(() =>
    this.conversations().find(c => c.id === this.selectedConvId()) ?? this.conversations()[0]
  );
 
  filteredConvs = computed(() => {
    const q = this.searchQuery();
    return !q ? this.conversations() : this.conversations().filter(c => c.title.includes(q));
  });
 
  navItems = [
    { label: 'الرئيسية',         icon: 'grid'        },
    { label: 'المستخدمين',       icon: 'users'        },
    { label: 'العمال',            icon: 'briefcase'    },
    { label: 'التصنيفات',         icon: 'table'        },
    { label: 'طلبات الخدمة',     icon: 'clipboard'    },
    { label: 'المدفوعات',         icon: 'credit-card'  },
    { label: 'التقييمات',         icon: 'star'         },
    { label: 'مراقبة المحادثات', icon: 'message',     active: true },
  ];
 
  selectConv(id: number) {
    this.selectedConvId.set(id);
  }
 
  onSearch(e: Event) {
    this.searchQuery.set((e.target as HTMLInputElement).value);
  }
 
  toggleControls() {
    this.showControls.update(v => !v);
  }
}
