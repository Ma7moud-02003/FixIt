import { Component, computed, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
export interface Category {
  id: number;
  nameAr: string;
  nameEn: string;
  description: string;
  workers: number;
  status: 'نشط' | 'غير نشط';
}


export interface CategoryForm {
  nameAr: string;
  nameEn: string;
  description: string;
  selectedIcon: number;
}
 


@Component({
  selector: 'app-categos',
  imports: [CommonModule,FormsModule],
  templateUrl: './categos.html',
  styleUrl: './categos.css',
})
export class Categos {
  showModal    = signal(false);
  searchQuery  = signal('');
 
  form = signal<CategoryForm>({ nameAr: '', nameEn: '', description: '', selectedIcon: 0 });
 
  categories = signal<Category[]>([
    { id: 1, nameAr: 'سباكة',           nameEn: 'PLUMBING',   description: 'إصلاح وصيانة أنظمة المياه والصرف الصحي.',             workers: 45, status: 'نشط' },
    { id: 2, nameAr: 'كهرباء',          nameEn: 'ELECTRICAL', description: 'تمديد وصيانة الأسلاك الكهربائية والإضاءة.',           workers: 32, status: 'نشط' },
    { id: 3, nameAr: 'نجارة',           nameEn: 'CARPENTRY',  description: 'تصنيع وتركيب وإصلاح الأثاث والأبواب.',                workers: 28, status: 'نشط' },
    { id: 4, nameAr: 'تنظيف',           nameEn: 'CLEANING',   description: 'تنظيف المنازل والسطاحات والواجهات والتعقيم.',         workers: 60, status: 'نشط' },
    { id: 5, nameAr: 'تكييف وتبريد',   nameEn: 'HVAC',       description: 'صيانة وتعبئة غاز المكيفات وتركيب الوحدات الجديدة.',   workers: 15, status: 'نشط' },
    { id: 6, nameAr: 'دهانات',          nameEn: 'PAINTING',   description: 'أعمال الدهانات الداخلية والخارجية وورق الحائط.',      workers: 22, status: 'نشط' },
    { id: 7, nameAr: 'نقل وشحن',        nameEn: 'MOVING',     description: 'نقل الأثاث والأغراض بشكل آمن واحترافي.',              workers: 18, status: 'نشط' },
    { id: 8, nameAr: 'حدادة',           nameEn: 'WELDING',    description: 'أعمال اللحام والحداد وصنع البوابات والأبواب.',         workers: 12, status: 'غير نشط' },
  ]);
 
  // Stats
  totalCategories  = computed(() => this.categories().length);
  activeCategories = computed(() => this.categories().filter(c => c.status === 'نشط').length);
  totalWorkers     = computed(() => this.categories().reduce((a, c) => a + c.workers, 0));
 
  filteredCategories = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return !q ? this.categories() : this.categories().filter(c =>
      c.nameAr.includes(q) || c.nameEn.toLowerCase().includes(q)
    );
  });
 
  iconOptions = [0, 1, 2, 3, 4];
 
  navItems = [
    { label: 'الرئيسية',         icon: 'grid'        },
    { label: 'المستخدمين',       icon: 'users'        },
    { label: 'العمال',            icon: 'briefcase'    },
    { label: 'التصنيفات',         icon: 'table',       active: true },
    { label: 'طلبات الخدمة',     icon: 'clipboard'    },
    { label: 'المدفوعات',         icon: 'credit-card'  },
    { label: 'التقييمات',         icon: 'star'         },
    { label: 'مراقبة المحادثات', icon: 'message'      },
  ];
 
  // ── Actions ────────────────────────────────────────────
  openModal()  { this.showModal.set(true); }
  closeModal() { this.showModal.set(false); this.form.set({ nameAr: '', nameEn: '', description: '', selectedIcon: 0 }); }
 
  selectIcon(i: number) {
    this.form.update(f => ({ ...f, selectedIcon: i }));
  }
 
  saveCategory() {
    const f = this.form();
    if (!f.nameAr.trim()) return;
    this.categories.update(cats => [...cats, {
      id: Date.now(), nameAr: f.nameAr, nameEn: f.nameEn || 'NEW',
      description: f.description, workers: 0, status: 'نشط',
    }]);
    this.closeModal();
  }
 
  deleteCategory(id: number) {
    this.categories.update(cats => cats.filter(c => c.id !== id));
  }
 
  onSearch(e: Event) { this.searchQuery.set((e.target as HTMLInputElement).value); }
 
  updateForm(field: keyof CategoryForm, value: string) {
    this.form.update(f => ({ ...f, [field]: value }));
  }
}
