import { Component, inject } from '@angular/core';
import { BottomNav } from "../../Shared/Components/bottom-nav/bottom-nav";
import { RouterOutlet } from '@angular/router';
import { TopNav } from "../../Shared/Components/top-nav/top-nav";
import { Auth } from '../../Core/Services/auth';
import { Navbefor } from "../../Shared/Components/navbefor/navbefor";
import { Footer } from "../../Shared/Components/footer/footer";

@Component({
  selector: 'app-main-layout',
  imports: [BottomNav, RouterOutlet, TopNav, Navbefor, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private auth=inject(Auth);
  userToken=this.auth.userToken;
  constructor()
  {
 this.userToken.set(this.auth.userToken());   
  }
}
