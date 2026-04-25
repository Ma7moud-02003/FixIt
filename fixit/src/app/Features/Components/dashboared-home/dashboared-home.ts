import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
}
interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
}

interface Order {
  id: number;
  clientName: string;
  service: string;
  price: number;
  status: 'قيد الانتظار' | 'مقبول' | 'مكتمل';
}

interface Chat {
  id: number;
  name: string;
  message: string;
  image: string;
  unread: boolean;
}

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}
@Component({
  selector: 'app-dashboared-home',
  imports: [CommonModule],
  templateUrl: './dashboared-home.html',
  styleUrl: './dashboared-home.css',
})
export class DashboaredHome {
workerProfile = signal({
    name: 'محمود',
    image: 'https://i.pravatar.cc/150?u=mahmoud',
    status: 'Online'
  });

  isOnline = computed(() => this.workerProfile().status === 'Online');
  
  stats = signal<StatCard[]>([
    { label: 'إجمالي المهام', value: 128, icon: '📦', color: 'text-blue-500' },
    { label: 'مهام نشطة', value: 5, icon: '⚡', color: 'text-indigo-500' },
    { label: 'مهام مكتملة', value: 114, icon: '✅', color: 'text-emerald-500' },
    { label: 'رسائل غير مقروءة', value: 3, icon: '💬', color: 'text-rose-500' },
  ]);

  totalEarnings = signal(4250);

  orders = signal<Order[]>([
    { id: 1, clientName: 'سارة جلال', service: 'دهان حوائط', price: 450, status: 'مقبول' },
    { id: 2, clientName: 'أحمد كمال', service: 'تصليح سباكة', price: 120, status: 'قيد الانتظار' },
    { id: 3, clientName: 'لمياء محمد', service: 'تمديدات كهرباء', price: 800, status: 'مكتمل' },
    { id: 4, clientName: 'عمر فاروق', service: 'تنسيق حدائق', price: 300, status: 'مكتمل' },
  ]);

  chats = signal<Chat[]>([
    { id: 1, name: 'سارة جلال', message: 'متى يمكنك البدء في العمل؟', image: 'https://i.pravatar.cc/100?u=sarah', unread: true },
    { id: 2, name: 'أحمد كمال', message: 'التسريب أصبح أسوأ من قبل...', image: 'https://i.pravatar.cc/100?u=ahmed', unread: true },
    { id: 3, name: 'لمياء محمد', message: 'شكراً جزيلاً على مجهودك!', image: 'https://i.pravatar.cc/100?u=lucie', unread: false },
  ]);

  reviews = signal<Review[]>([
    { id: 1, user: 'محمد علي', rating: 5, comment: 'خدمة ممتازة واحترافية عالية في المواعيد.', date: 'منذ يومين' },
    { id: 2, user: 'منى حسن', rating: 4, comment: 'عمل جيد جداً، قام بإصلاح كل شيء بدقة.', date: 'منذ أسبوع' },
  ]);
}
