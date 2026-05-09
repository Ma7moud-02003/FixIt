import { Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService } from '../../services/-review';
import { ActiveSection, AdminProfile, Toast } from '../../Model/adminProfile';
import { ProfileService } from '../../services/-profile';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
 
  // ── Signals ────────────────────────────────────────────────────────────────
  profile = signal<AdminProfile | null>(null);
  isLoading = signal(true);
  activeSection = signal<ActiveSection>('profile');
  toasts = signal<Toast[]>([]);
  toastCounter = signal(0);
 
  // Edit profile
  editLoading = signal(false);
  editSuccess = signal(false);
 
  // Password
  passwordLoading = signal(false);
  showCurrentPw = signal(false);
  showNewPw = signal(false);
  showConfirmPw = signal(false);
 
  // Image
  imageLoading = signal(false);
  dragOver = signal(false);
  previewUrl = signal<string | null>(null);
  selectedFile = signal<File | null>(null);
 
  // Computed
  avatarInitials = computed(() => {
    const name = this.profile()?.fullName ?? '';
    return name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('');
  });
 
  // ── Forms ──────────────────────────────────────────────────────────────────
  editForm!: FormGroup;
  passwordForm!: FormGroup;
 
  ngOnInit(): void {
    this.initForms();
    this.loadProfile();
  }
 
  private initForms(): void {
    this.editForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s\-()]{7,20}$/)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
    });
 
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
          ],
        ],
        confarmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }
 
  private passwordMatchValidator(group: AbstractControl) {
    const np = group.get('newPassword')?.value;
    const cp = group.get('confarmPassword')?.value;
    return np === cp ? null : { mismatch: true };
  }
 
  // ── Load Profile ───────────────────────────────────────────────────────────
  loadProfile(): void {
    this.isLoading.set(true);
    this.profileService.getProfile().subscribe({
      next: (res) => {
          console.log(res);
          this.profile.set(res.data);
          this.patchEditForm(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.showToast('error', 'خطأ في الاتصال', 'تعذّر تحميل بيانات الملف الشخصي');
        this.isLoading.set(false);
        this.useDemoProfile();
      },
    });
  }
 
  private patchEditForm(p: AdminProfile): void {
    this.editForm.patchValue({
      fullName: p.fullName,
      email: p.email,
      phone: p.phone,
      city: p.city,
    });
  }
 
  private useDemoProfile(): void {
    const demo: AdminProfile = {
      id: '1',
      fullName: 'أحمد محمد العمري',
      email: 'ahmed.admin@company.com',
      phone: '+966 50 123 4567',
      city: 'الرياض',
      role: 'مدير النظام',
      imgUrl: '',
      createdAt: '2023-01-15T10:30:00Z',
      lastLogin: new Date().toISOString(),
      isActive: true,
    };
    this.profile.set(demo);
    this.patchEditForm(demo);
    this.isLoading.set(false);
  }
 
  // ── Navigation ─────────────────────────────────────────────────────────────
  setSection(section: any): void {
    this.activeSection.set(section);
  }
 
  // ── Edit Profile ───────────────────────────────────────────────────────────
  submitEditProfile(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.editLoading.set(true);
    this.profileService.editProfile(this.editForm.value).subscribe({
      next: (res:any) => {
       
          this.profile.set(res.data);
          this.editSuccess.set(true);
          this.showToast('success', 'تم بنجاح', 'تم تحديث الملف الشخصي بنجاح');
          setTimeout(() => this.editSuccess.set(false), 3000);
        
        this.editLoading.set(false);
      },
      error: () => {
        this.showToast('error', 'خطأ في الاتصال', 'تعذّر تحديث البيانات');
        this.editLoading.set(false);
      },
    });
  }
 
  // ── Change Password ────────────────────────────────────────────────────────
  submitChangePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.passwordLoading.set(true);
    this.profileService.changePassword(this.passwordForm.value).subscribe({
      next: (res) => {
       
          this.showToast('success', 'تم بنجاح', 'تم تغيير كلمة المرور بنجاح');
          this.passwordForm.reset();
       
        this.passwordLoading.set(false);
      },
      error: () => {
        this.showToast('error', 'خطأ في الاتصال', 'تعذّر تغيير كلمة المرور');
        this.passwordLoading.set(false);
      },
    });
  }
 
  // ── Image Upload ───────────────────────────────────────────────────────────
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) this.processFile(input.files[0]);
  }
 
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(true);
  }
 
  onDragLeave(): void {
    this.dragOver.set(false);
  }
 
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }
 
  private processFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.showToast('error', 'ملف غير صالح', 'يُرجى اختيار صورة صالحة');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.showToast('error', 'الملف كبير جداً', 'يجب أن يكون حجم الصورة أقل من 5 ميجابايت');
      return;
    }
    this.selectedFile.set(file);
    const reader = new FileReader();
    reader.onload = (e) => this.previewUrl.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }
 
  submitChangeImage(): void {
    const file = this.selectedFile();
    if (!file) return;
    const formData = new FormData();
    formData.append('imgUrl', file);
    this.imageLoading.set(true);
    this.profileService.changeImage(formData).subscribe({
      next: (res) => {
        if (res.success) {
          const updated = { ...this.profile()!, imageUrl: res.data.imageUrl };
          this.profile.set(updated);
          this.previewUrl.set(null);
          this.selectedFile.set(null);
          this.showToast('success', 'تم بنجاح', 'تم تحديث الصورة الشخصية بنجاح');
        } else {
          this.showToast('error', 'خطأ', res.message);
        }
        this.imageLoading.set(false);
      },
      error: () => {
        this.showToast('error', 'خطأ في الاتصال', 'تعذّر رفع الصورة');
        this.imageLoading.set(false);
      },
    });
  }
 
  cancelImagePreview(): void {
    this.previewUrl.set(null);
    this.selectedFile.set(null);
  }
 
  // ── Toast ──────────────────────────────────────────────────────────────────
  showToast(type: Toast['type'], title: string, message: string): void {
    const id = this.toastCounter() + 1;
    this.toastCounter.set(id);
    this.toasts.update((t) => [...t, { id, type, title, message }]);
    setTimeout(() => this.removeToast(id), 4500);
  }
 
  removeToast(id: number): void {
    this.toasts.update((t) => t.filter((toast) => toast.id !== id));
  }
 
  // ── Helpers ────────────────────────────────────────────────────────────────
  hasError(form: FormGroup, field: string, error: string): boolean {
    const ctrl = form.get(field);
    return !!(ctrl?.hasError(error) && ctrl?.touched);
  }
 
  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
 
  trackByToastId(_: number, t: Toast): number {
    return t.id;
  }
}
