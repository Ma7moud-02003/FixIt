import { MyServiceModel } from '../../Models/services';
import { Review } from './../../../Core/Services/review';
import { Component, computed, inject, input, OnChanges, OnDestroy, OnInit, signal, SimpleChanges } from '@angular/core';
import { User } from '../../../Core/Services/user';
import { Subscription } from 'rxjs';
import { UserEditeModel, WorkerModel } from '../../../Shared/Models/UserProfile';
import { email, form, FormField, pattern, required } from '@angular/forms/signals';
import { Alerts } from '../../../Shared/Alerts/alerts';
import { NewPasswordModel } from '../../../Shared/Models/changingPass';
import { Skeleton } from '../../../Shared/Components/skeleton/skeleton';
import { SkeletonModule } from 'primeng/skeleton';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { Service } from '../../../Core/Services/service';
import { ServiceDetailsModel } from '../../../Shared/Models/serviceDetails';
import { ServiceCard } from "../my-service-card/service-card";
// import { SendedServiceRequestModel } from '../../../Shared/Models/sendedSrciveModel';
import { Auth } from '../../../Core/Services/auth';
import { UserRole } from '../../../Shared/enums/role';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CommonModule } from '@angular/common';
import { categories } from '../../Models/categorys';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { ReviewCard } from "../cards/review-card/review-card";
interface Catog {
  name: string
  selected: boolean
}
interface ReviewModel {
  rate: number,
  comment: string
}

@Component({
  selector: 'app-profile',
  imports: [FormField, Skeleton, SkeletonModule,
    RouterLink, ServiceCard,
    ToggleSwitchModule, CommonModule, SelectModule, FormsModule, ReviewCard],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit, OnDestroy {

  clientServices = signal<MyServiceModel[]>([]);
  workerServices = signal<MyServiceModel[]>([]);
  workerReviews = signal<ReviewModel[]>([]);


  isEditMode = signal<boolean>(false);
  constructor() {
  }


  // uploading image 

  selectedFile!: File;
  imagePreview = signal<string>('');

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      console.log('اختار صورة بس');
      return;
    }

    this.selectedFile = file;
    // ✅ عمل preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  uploadProfileImage() {

    const formData = new FormData();
    formData.append('imgUrl', this.selectedFile);

    this.subs.add(this._user.editeUserImageProfile(formData, this.role())?.subscribe({
      next: () => {
        this.alerts.sucsess('تم تحديث الصوره بنجاح 👍')
      }
    }))
  }




  ngOnInit(): void {
    this.role.set(this.auth.getRole() || '');
    if (this.role() == UserRole.Clien_Role) {
      this.getMyServicesAsClient();
      this.getClientProgile();
    }
    else if (this.role() == UserRole.Worker_Role) {
      this.getMyServicesAsWorker();
      this.getWorkerProfile();
      this.getAllWorkerReviews();
    }
  }

  showProfilPage = signal<boolean>(false);
  showChangePassForm = signal<boolean>(false);
  profileData = signal<WorkerModel>({} as WorkerModel);

  selectedCatogery = computed(() => {
    return this.profileForm.categoryName().value();
  })
  catogerys = signal<Catog[]>(categories);
  changingPasswordModel = signal<NewPasswordModel>({
    currentPassword: '',
    newPassword: '',
    confarmPassword: '',
  })
  private _user = inject(User);
  private auth = inject(Auth)
  private subs = new Subscription();
  private alerts = inject(Alerts);
  private router = inject(Router);
  private _services = inject(Service);
  private _review = inject(Review);
  role = signal<string>('');
  isLoading = signal<boolean>(false);

  getClientProgile() {
    this.subs.add(
      this._user.getUserData().subscribe({
        next: (res) => {
          this.showProfilPage.set(true);
          console.log(res);
          this.profileData.set(res.data);


        }
      })
    )
  }

  getWorkerProfile() {
    this.subs.add(
      this._user.getWorkerData().subscribe({
        next: (res) => {
          this.showProfilPage.set(true);
          console.log(res);
          this.profileData.set(res.data)

        }
      })
    )
  }


  profileForm = form(this.profileData, (schemapath) => {
    required(schemapath.fullName, { message: 'الاسم مطلوب ' });
    required(schemapath.email, { message: 'البريد الالكتروني مطلوب ' });
    required(schemapath.city, { message: 'المدينه مطلوبه ' });
    required(schemapath.phone, { message: 'رقم الهاتف مطلوب  ' });
    email(schemapath.email, { message: 'بريد الكتروني غير صالح' });

    pattern(
      schemapath.phone,
      /^01[0125][0-9]{8}$/,
      { message: 'رقم الهاتف غير صالح' }
    );
  });

  changPasswordForm = form(this.changingPasswordModel, (schemapath) => {
    required(schemapath.currentPassword, { message: ' مطلوب ' });
    required(schemapath.newPassword, { message: '  مطلوب ' });
    required(schemapath.confarmPassword, { message: ' مطلوب ' });
    pattern(
      schemapath['newPassword'],
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      { message: 'الباسورد لازم يحتوي على حرف كبير وصغير ورقم' }
    );
  })
  toggleChangePassword() {
    this.showChangePassForm.set(!this.showChangePassForm());
    setTimeout(() => {
      document.getElementById('changePassword')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  }

  editclientProfileData(): void {
    if (this.role() == UserRole.Clien_Role)
      this.editeClientProfile();
    else if (this.role() == UserRole.Worker_Role)
      this.editWorkerProfile();
  }

  editeClientProfile() {
    console.log(this.profileForm().value());

    this.isLoading.set(true);
    const { fullName, city, phone, updatedAt } = this.profileForm().value();
    const newProfileData: UserEditeModel = {

      phone,
      fullName,
      city,
      updatedAt
    }
    console.log(newProfileData);

    this.subs.add(
      this._user.editUserProfile(newProfileData).subscribe({
        next: (res: any) => {
          console.log(res);
          this.alerts.sucsess(res.data || 'تم التعديل بنجاح');
          this.isLoading.set(false);
          this.isEditMode.set(false);
        }
      })
    )
  }
  editWorkerProfile() {
    const { fullName, city, phone,
      jobTitle, description, availabilityStatus, area, imgUrl, categoryName
    } = this.profileForm().value();
    const newProfileData = {

      imgUrl,
      phone,
      categoryName,
      fullName,
      city,
      jobTitle,
      description,
      availabilityStatus,
      area,

    }
    console.log(newProfileData);
    this.subs.add(
      this._user.editWorkerProfile(newProfileData).subscribe({
        next: (res: any) => {
          console.log(res);
          this.alerts.sucsess(res.data || 'تم التعديل بنجاح');
          this.isLoading.set(false);
          this.isEditMode.set(false);

        }
      })
    )
  }

  changeUserPassword() {
    if (this.changPasswordForm.newPassword().value() !== this.changPasswordForm.confarmPassword().value()) {
      this.alerts.error('كلمة السر الجديدة غير متطابقة');
      return;
    }
    this.subs.add(
      this._user.changePassword(this.changPasswordForm().value()).subscribe({
        next: (res) => {
          console.log(res);
          this.alerts.sucsess('تم تغيير كلمة المرور بنجاح ');
          this.showChangePassForm.set(false);
          this.clearPssForm();
        }
      })
    )
  }

  clearPssForm() {
    this.changPasswordForm.currentPassword().value.set('');
    this.changPasswordForm.newPassword().value.set('');
    this.changPasswordForm.confarmPassword().value.set('');

  }

  confirmDeleting() {
    this.alerts.confirmDelete("لن تكون قادر علي استرجاع حسابك مره اخري !")
      .then(result => {
        if (result.isConfirmed) {

          this.subs.add(
            this._user.deleteUserAccount().subscribe({
              next: () => {
                Swal.fire({
                  title: "تم الحذف!",
                  text: "تم حذف حسابك بنجاح",
                  icon: "success"
                });

                setTimeout(() => {
                  this.clearAndRoutAfterSDeleting();
                }, 400);
              }
            })
          );

        } else if (result.dismiss === Swal.DismissReason.cancel) {

          Swal.fire({
            title: "تم الغاء الحذف",
            text: "حسابك في امان",
            icon: "info"
          });

        }
      });
  }
  clearAndRoutAfterSDeleting() {
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }




  getMyServicesAsClient() {
    this.subs.add(
      this._services.getSendedServices(1, 2).subscribe({
        next: (res) => {
          this.clientServices.set(res.data.slice(0, 2));
          console.log(res.data);
        }
      })
    )
  }

  getMyServicesAsWorker() {
    this.subs.add(
      this._services.getResivedServices(1, 2).subscribe({
        next: (res) => {
          this.workerServices.set(res.data.slice(0, 2));

          console.log(res.data);
        }
      })
    )
  }


  getAllWorkerReviews() {
    this.subs.add(
      this._review.getAllRevies(1, 3).subscribe({
        next: (res: any) => {
          this.workerReviews.set(res.data)
          console.log(this.workerReviews());
          console.log(res);
        }
      })
    )
  }
  routToServices() {
    if (this.role() == UserRole.Clien_Role)
      this.router.navigate(['/mainLayout/myServices'])
    else if (this.role() == UserRole.Worker_Role)
      this.router.navigate(['/dashboared/myServices'])


  }





  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
