import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class HealthService {
  public res = {};  
  private base_url  = "http://dxplor.com/";

  constructor(public http: Http) {
    console.log('Hello HealthService Provider');
  }

  getTravelList(){
      return this.http.get(this.base_url+'dxplor/Mo_health/getHealth');
  }

  getDetailProduct(data:any, header:any){
      return this.http.post(this.base_url+'dxplor/Mo_health/getContentHealth', data, header);
  }
  
  searchProduct(keyword){
    return this.http.post(this.base_url+"dxplor/Mo_health/getHealth2", JSON.stringify({search:keyword}), {});
  }

}
