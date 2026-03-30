import { Component } from '@angular/core';
import { Sidebar } from '../../Shared/Components/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { TopNav } from "../../Shared/Components/top-nav/top-nav";

@Component({
  selector: 'app-dashboared-layout',
  imports: [Sidebar, RouterOutlet, TopNav],
  templateUrl: './dashboared-layout.html',
  styleUrl: './dashboared-layout.css',
})
export class DashboaredLayout {}
