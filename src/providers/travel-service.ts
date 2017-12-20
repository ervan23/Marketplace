import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class TravelService {
  public res = {};  
  private base_url  = "http://dxplor.com/";

  constructor(public http: Http) {
    console.log('Hello TravelService Provider');
  }

  getTravelList(){
      return this.http.get(this.base_url+'dxplor/Mo_travel/getTravel');
  }

  getDetailProduct(data:any, header:any){
      return this.http.post(this.base_url+'dxplor/Mo_travel/getContentTravel', data, header);
  }

  searchProduct(keyword){
    return this.http.post(this.base_url+"dxplor/Mo_travel/getTravel2", JSON.stringify({search:keyword}), {});
  }

}
