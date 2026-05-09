import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-price-process',
  imports: [CommonModule,RouterModule],
  templateUrl: './client-price-process.html',
  styleUrl: './client-price-process.css',
})
export class ClientPriceProcess {
    @Output() cancle=new EventEmitter<void>();
   cancleService()
   {
    this.cancle.emit();
   }

}
