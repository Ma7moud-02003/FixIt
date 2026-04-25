import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Favourite } from '../../Core/Services/-favourite';
import { RouterLink, RouterModule } from "@angular/router";
import { CommonModule } from '@angular/common';
import { FavoriteModel } from '../../Shared/Models/favorite';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-favorite',
  imports: [RouterLink,CommonModule,RouterModule],
  templateUrl: './my-favorite.html',
  styleUrl: './my-favorite.css',
})
export class MyFavorite implements OnInit , OnDestroy
{
  private _favourite=inject(Favourite);
  workers=signal<FavoriteModel[]>([]);
 private subs=new Subscription();

  ngOnInit(): void {
   this.getMyFavourites();
  }

  getMyFavourites()  {
    this._favourite.getFavourites().subscribe({
      next:(res)=>{
        this.workers.set(res.data);
        console.log(this.workers());
     
      }
    })
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
