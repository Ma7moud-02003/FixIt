import { Component, input } from '@angular/core';

@Component({
  selector: 'app-client-inprocess',
  imports: [],
  templateUrl: './client-inprocess.html',
  styleUrl: './client-inprocess.css',
})
export class ClientInprocess {
  workerName=input<string>('');
}
