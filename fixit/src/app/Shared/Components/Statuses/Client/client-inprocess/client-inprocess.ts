import { Component,  input, signal  } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-client-inprocess',
  imports: [RouterLink],
  templateUrl: './client-inprocess.html',
  styleUrl: './client-inprocess.css',
})
export class ClientInprocess {
  workerName=input<string>('');
}
