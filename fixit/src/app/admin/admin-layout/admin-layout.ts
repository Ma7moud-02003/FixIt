import { Component } from '@angular/core';
import { Clinets } from "../components/clinets/clinets";
import { Sidebar } from "../components/sidebar/sidebar";
import { RouterModule } from "@angular/router";
import { BottomNav } from "../components/bottom-nav/bottom-nav";
import { Nav } from "../components/nav/nav";

@Component({
  selector: 'app-admin-layout',
  imports: [Clinets, Sidebar, RouterModule, BottomNav, Nav],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {}
