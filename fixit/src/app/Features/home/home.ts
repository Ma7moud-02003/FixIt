import { Component, ElementRef, inject, OnInit, QueryList, signal, ViewChildren } from '@angular/core';
import { Footer } from "../../Shared/Components/footer/footer";
import { Router, RouterLink } from "@angular/router";
import { Auth } from '../../Core/Services/auth';
import { UserRole } from '../../Shared/enums/role';


@Component({
  selector: 'app-home',
  imports: [Footer, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit{
  
services=signal([
  {
    type: 'سباكة',
    image: './services/Plumber.png',
    desc: 'إصلاح تسريب المياه، تركيب الخلاطات والسخانات، وحلول سريعة لكل مشاكل السباكة في منزلك.'
  },
  {
    type: 'كهرباء',
    image: './services/Electrician.png',
    desc: 'تركيب وصيانة التمديدات الكهربائية وإصلاح الأعطال لضمان أمان وكفاءة الكهرباء في منزلك.'
  },
  {
    type: 'نجارة',
    image: './services/carpenter.png',
    desc: 'تصميم وصيانة الأبواب والأثاث الخشبي بدقة وجودة تضيف لمسة جمالية لمنزلك.'
  },
  {
    type: 'دهان',
    image: './services/painter.png',
    desc: 'دهانات وتشطيبات احترافية للجدران والأسقف تمنح منزلك مظهرًا أنيقًا ومتجددًا.'
  },
  
  {
    type: 'صيانة منزلية',
    image: './services/home.png',
    desc: 'حلول صيانة شاملة لكل أعطال المنزل بسرعة وكفاءة على يد فنيين متخصصين.'
  },
  {
    type: 'حداد',
    image: './services/ironman.png',
    desc: 'خدمات حداد وتصفيف شعر احترافية تمنحك مظهرًا أنيقًا ومميزًا.'
  }

]);
workers = signal([
    {
    name: "محمود عمرو",
    job: "فلاح كبير ",
    rating: 4,
    reviews: 120
  },
    {
    name: "بدر حسن ",
    job: "حلاق ذو خبره",
    rating: 4,
    reviews: 120
  },
   {
    name: " مصطفي مبروك ",
    job: "حداد متين",
    rating: 3,
    reviews: 120
  },
  
  {
    name: "محمد جمال",
    job: "سباك عتيق",
    rating: 4.8,
    reviews: 110
  },

]);

steps = signal([
  {
    number: 1,
    
    title: "ابحث عن خدمة",
    desc: "حدد نوع الخدمة التي تحتاجها وموقعك بدقة."
  },
  {
    number: 2,
    title: "استعرض الصنايعية",
    desc: "شاهد تقييمات وخبرات أفضل المحترفين في منطقتك."
  },
  {
    number: 3,
    title: "تواصل واطلب",
    desc: "اتصل مباشرة أو احجز الموعد الذي يناسب جدولك."
  },
  {
    number: 4,
    title: "استلم شغلك",
    desc: "استلم الخدمة بجودة عالية وضمان من منصة FixIt."
  }
]);

auth=inject(Auth);
private route=inject(Router);
role=signal<string>('');

ngOnInit(): void {
  this.role.set(this.auth.getRole()||'')
}

routTo(){
if(this.role()==UserRole.Clien_Role)
this.route.navigate(['/mainLayout/search']);

}

ngAfterViewInit() {
}
}




