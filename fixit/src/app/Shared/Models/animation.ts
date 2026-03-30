import { Injectable } from '@angular/core';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
@Injectable({
  providedIn: 'root',
})
export class Animation {


  fadeUpSide(element:any){
    gsap.from(element,{
      x:-60,
      opacity:0,
      duration:1
    })
  }

fadeForHomeIconInUp(element:any)
{
gsap.from(element,{
  y:-50,
  x:-50,
  opacity:0,
  duration:1
})
}

fadeForHomeIconInDown(element:any)
{
gsap.from(element,{
  y:50,
  x:50,
  opacity:0,
  duration:1
})
}



  

}
