import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { CatogsService } from '../../services/catogs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
export const CATEGORY_ICONS: Record<string, string> = {
  default: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg>`,
};
 
// ── Icons pool for random assignment ────────────────────────────────────────
export const ICON_POOL = [
  // Wrench
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg>`,
  // Bolt (electrical)
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>`,
  // Home (construction)
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>`,
  // Fire (heating)
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg>`,
  // Paintbrush
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>`,
  // Cog (maintenance)
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" /></svg>`,
  // Truck (delivery/moving)
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>`,
  // Shield (security)
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>`,
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
          error: () => {
            this.isSubmitting.set(false);
            this.showToast('فشل في تعديل القسم.', 'error');
          },
        })
      );
    } else {
      this.subs.add(
        this._catogs.addCatog(payload).subscribe({
          next: (res: any) => {
            const newCat: Category = res?.data ?? { ...payload, categoryId: Date.now() };
            this.categories.update(list => [newCat, ...list]);
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
