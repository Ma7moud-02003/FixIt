import { Component } from '@angular/core';
import { Sidebar } from '../../Shared/Components/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { TopNav } from "../../Shared/Components/top-nav/top-nav";
import { BottomNav } from "../../Shared/Components/bottom-nav/bottom-nav";
import { Footer } from "../../Shared/Components/footer/footer";

@Component({
  selector: 'app-dashboared-layout',
  imports: [Sidebar, RouterOutlet, TopNav, BottomNav, Footer],
  templateUrl: './dashboared-layout.html',
  styleUrl: './dashboared-layout.css',
})
export class DashboaredLayout {}
