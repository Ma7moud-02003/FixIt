import { Component } from '@angular/core';
import { Footer } from "../footer/footer";
import { RouterLink } from "@angular/router";
import { BottomNav } from "../bottom-nav/bottom-nav";

@Component({
  selector: 'app-sidebar',
  imports: [Footer, RouterLink, BottomNav],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {}
