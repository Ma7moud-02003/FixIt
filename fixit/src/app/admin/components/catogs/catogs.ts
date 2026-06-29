import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { CatogsService } from '../../services/catogs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
export const CATEGORY_ICONS: Record<string, string> = {
  default: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg>`,
};
 
// ── Icons pool for random assignment ────────────────────────────────────────
export const ICON_POOL = [
  // Wrench (General Repair)
  `<i class="fas fa-wrench"></i>`,
  
  // Bolt (Electrical)
  `<i class="fas fa-bolt"></i>`,
  
  // Home (Construction/Structure)
  `<i class="fas fa-house"></i>`,
  
  // Fire (Heating/HVAC)
  `<i class="fas fa-fire"></i>`,
  
  // Paintbrush (Painting/Decor)
  `<i class="fas fa-paintbrush"></i>`,
  
  // Cog (Maintenance/Settings)
  `<i class="fas fa-gear"></i>`,
  
  // Truck (Delivery/Moving)
  `<i class="fas fa-truck"></i>`,
  
  // Shield (Security)
  `<i class="fas fa-shield-halved"></i>`,
];
export interface Category {
  categoryId: number;
  categoryName: string;
  description: string;
}
export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}
@Component({
  selector: 'app-catogs',
  imports: [ReactiveFormsModule],
  templateUrl: './catogs.html',
  styleUrl: './catogs.css',
})
export class Catogs implements OnInit,OnDestroy{
 private subs = new Subscription();
  private _catogs = inject(CatogsService);
  private fb = inject(FormBuilder);
 
  // ── Signals ──────────────────────────────────────────────────────────────
  categories = signal<Category[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');
  showAddEditModal = signal(false);
  showDeleteModal = signal(false);
  isEditMode = signal(false);
  selectedCategory = signal<Category | null>(null);
  isSubmitting = signal(false);
  toasts = signal<Toast[]>([]);
  private toastCounter = 0;
 
  // ── Computed ──────────────────────────────────────────────────────────────
  filteredCategories = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return this.categories();
    return this.categories().filter(
      c =>
        c.categoryName.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  });
 
  totalCount = computed(() => this.categories().length);
  skeletonArray = [1, 2, 3, 4, 5, 6];
 
  // ── Form ──────────────────────────────────────────────────────────────────
  categoryForm: FormGroup= this.fb.group({
    categoryName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
  });
 
  get nameCtrl() { return this.categoryForm.get('categoryName')!; }
  get descCtrl() { return this.categoryForm.get('description')!; }
 
  // ── Icon assignment (deterministic by id) ────────────────────────────────
  getIcon(id: number): string {
    return ICON_POOL[id % ICON_POOL.length];
  }
 
  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.getAllCatogs();
  }
 
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
 
  // ── API Methods ───────────────────────────────────────────────────────────
  getAllCatogs(): void {
    this.isLoading.set(true);
    this.subs.add(
      this._catogs.getAllCatogs().subscribe({
        next: (res: any) => {
          console.log(res);
          const list: Category[] = Array.isArray(res)
            ? res
            : res?.data ?? res?.categories ?? [];
          this.categories.set(list);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.showToast('فشل في تحميل الأقسام. حاول مجدداً.', 'error');
        },
      })
    );
  }
 
  submitForm(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }
 
    this.isSubmitting.set(true);
    const payload = this.categoryForm.value;
 
    if (this.isEditMode() && this.selectedCategory()) {
      const id = String(this.selectedCategory()!.categoryId);
      console.log(id,payload);
      
      this.subs.add(
        this._catogs.editeCategory(id, payload).subscribe({
          next: () => {
            this.categories.update(list =>
              list.map(c =>
                c.categoryId === this.selectedCategory()!.categoryId
                  ? { ...c, ...payload }
                  : c
              )
            );
            this.closeModal();
            this.showToast('تم تعديل القسم بنجاح ✓', 'success');
          },
          error: (err) => {
            console.log(err);
            this.isSubmitting.set(false);
            this.showToast('فشل في تعديل القسم.', 'error');
          },
        })
      );
    } else {
      this.subs.add(
        this._catogs.addCatog(payload).subscribe({
          next: (res: any) => {
         
            this.categories.update(list => [payload, ...list]);
            this.closeModal();
            this.showToast('تم إضافة القسم بنجاح ✓', 'success');
          },
          error: () => {
            this.isSubmitting.set(false);
            this.showToast('فشل في إضافة القسم.', 'error');
          },
        })
      );
    }
  }
 
  confirmDelete(): void {
    const cat = this.selectedCategory();
    if (!cat) return;
 console.log(cat);
 
    this.isSubmitting.set(true);
    this.subs.add(
      this._catogs.deleteCatog(String(cat.categoryId)).subscribe({
        next: () => {
          this.categories.update(list =>
            list.filter(c => c.categoryId !== cat.categoryId)
          );
          this.closeDeleteModal();
          this.showToast('تم حذف القسم بنجاح ✓', 'success');
        },
        error: () => {
          this.isSubmitting.set(false);
          this.showToast('فشل في حذف القسم.', 'error');
        },
      })
    );
  }
 
  // ── Modal Helpers ─────────────────────────────────────────────────────────
  openAddModal(): void {
    this.isEditMode.set(false);
    this.selectedCategory.set(null);
    this.categoryForm.reset();
    this.showAddEditModal.set(true);
  }
 
  openEditModal(cat: Category): void {
    this.isEditMode.set(true);
    this.selectedCategory.set(cat);
    this.categoryForm.patchValue({
      categoryName: cat.categoryName,
      description: cat.description,
    });
    this.showAddEditModal.set(true);
  }
 
  openDeleteModal(cat: Category): void {
    this.selectedCategory.set(cat);
    this.showDeleteModal.set(true);
  }
 
  closeModal(): void {
    this.showAddEditModal.set(false);
    this.isSubmitting.set(false);
    this.categoryForm.reset();
    this.selectedCategory.set(null);
  }
 
  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.isSubmitting.set(false);
    this.selectedCategory.set(null);
  }
 
  // ── Toast ─────────────────────────────────────────────────────────────────
  showToast(message: string, type: 'success' | 'error'): void {
    const id = ++this.toastCounter;
    this.toasts.update(t => [...t, { id, message, type }]);
    setTimeout(() => {
      this.toasts.update(t => t.filter(x => x.id !== id));
    }, 3500);
  }
 
  dismissToast(id: number): void {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }
 
  // ── TrackBy ───────────────────────────────────────────────────────────────
  trackByCategory(_: number, cat: Category): number {
    return cat.categoryId;
  }
 
}
