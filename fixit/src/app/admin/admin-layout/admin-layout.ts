import { Component } from '@angular/core';
import { Clinets } from "../components/clinets/clinets";
import { Sidebar } from "../components/sidebar/sidebar";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-admin-layout',
  imports: [Clinets, Sidebar, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {}
