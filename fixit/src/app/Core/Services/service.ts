import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ServiceStatus } from '../../Shared/enums/status';


@Injectable({
  providedIn: 'root',
})
export class Service {
  statuses = ServiceStatus
  workerIds = signal<string>('5EF3A57D-E93E-450F-8613-D021F0A1AFAC');

  endPoint: string = 'Service'
  private _http = inject(HttpClient);

  // client section--------------------------

  //add request
  creatService(serData: FormData, workerId: string) {
    return this._http.post(`${environment.apiUrl}/${this.endPoint}/AddService/${workerId}`, serData);
  };

  // getting service for client
  getSendedServices(pageNum:number=1,pageSize:number=3): Observable<any> {
    return this._http.get(`${environment.apiUrl}/${this.endPoint}/SentsServiceRequests?pageNum=${pageNum}&pageSize=${pageSize}`);
  }

// getting service details for client
  getSendedServiceDetails(serviceId: string): Observable<any> {
    return this._http.get(`${environment.apiUrl}/${this.endPoint}/Details/${serviceId}`);
  }

  // accepting the price reprecented of worker from client
  acceptPrice(serviceId: string,address:string) {
    console.log(address);
    console.log(serviceId);
    return this._http.put(`${environment.apiUrl}/${this.endPoint}/sendsJobs/${serviceId}/inprocess`, 
      {serviceAddress:address,serviceId});
  }


  // dening getting task from worker
  disPutedTask(serviceId: string) {
    return this._http.put(`${environment.apiUrl}/${this.endPoint}/sendsJobs/${serviceId}/Disputed`, {});
  }

// rejecting the price offeerd from worker 
  rejectPrice(serviceId: string) {
    return this._http.put(`${environment.apiUrl}/${this.endPoint}/recivedJobs/${serviceId}/reject`, {});
  }


  // worker work--------------------------------


  // accepting task 
 acceptTask(serviceId: string) {
    return this._http.put(`${environment.apiUrl}/${this.endPoint}/sendsJobs/${serviceId}/completed`, {});
  }

  // getting recived tasks for worker
  getResivedServices(pageNum:number=1,pageSize:number=10): Observable<any> {
    return this._http.get(`${environment.apiUrl}/${this.endPoint}/Worker/RecivedsServiceRequests?pageNum=${pageNum}&pageSize=${pageSize}`);
  }

  // getting service details for worker
  getRecivedServiceDetails(serviceId: string): Observable<any> {
    return this._http.get(`${environment.apiUrl}/${this.endPoint}/Details/${serviceId}`);
  }

  // worker add price for service
  addPriceForService(totalPrice: number , serviceId: string) {
    return this._http.put(`${environment.apiUrl}/${this.endPoint}/Worker/recivedJobs/${serviceId}/${this.statuses.PENDING}`, 
      {totalPrice}
    );
  }

// submitting delevering the task to the client
  submitTheTask(serviceId: string,file:FormData) {
    return this._http.put(`${environment.apiUrl}/${this.endPoint}/Worker/recivedJobs/${serviceId}/submitted`,file);
  }

  // rejecting the service from client 
  rejectService(serviceId: string) {
    return this._http.put(`${environment.apiUrl}/${this.endPoint}/${serviceId}/reject`, {});
  }

   // cancling the service from the worker 
  canceledServiec(serviceId: string) {
    return this._http.put(`${environment.apiUrl}/${this.endPoint}/recivedJobs/${serviceId}/canceled`, {});
  }

// handling status 
 getStatusClasses(state:string) {
    const base = 'text-[10px] px-2 py-1 rounded-md flex items-center gap-1 font-medium ';
    const status = ServiceStatus;
    switch (state) {
      case status.PRICE_PROCESS: return base + 'bg-blue-50 text-sky-500 border border-blue-100';
      case status.CPMLETED: return base + 'bg-green-50 text-emerald-500 border border-green-100';
      case status.Submited: return base + 'bg-gray-50 text-gray-600 border border-gray-200';
      case status.CANSELED: return base + 'bg-red-50 text-gray-600 border border-red-200';
      case status.PENDING: return base + 'bg-orange-50 text-orange-600 border border-orange-200';
      case status.DISPUTED: return base + 'bg-yellow-50 text-yellow-600 border border-yellow-200';
      case status.Reviewed: return base + 'bg-cyan-50 text-cyan-600 border border-cyan-200';
      case status.InProcess: return base + 'bg-violet-50 text-violet-600 border border-violet-200';


      default: return base + 'bg-orange-50 text-orange-400 border border-orange-100';
    }
  }

  getStausByArabic(status: string): string {
    const state = ServiceStatus;
    switch (status) {
      case state.PRICE_PROCESS:
        return 'مرسله جار تحديد السعر';
      case state.Rejected:
        return 'مرفوضه';
        case state.CANSELED:
        return 'تم الالغاء';
      case state.CPMLETED:
        return 'مكتمله';
      case state.PENDING:
        return 'معلقه';
      case state.Submited:
        return 'تم التسليم';
      case state.DISPUTED:
        return 'معطله';
         case state.Reviewed:
        return 'تم التقييم';
          case state.InProcess:
        return 'قيد التنفيذ';
      default: return 'غير محدد'

    }
  }


}
