import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class OtherService {
  public res = {};  
  private base_url  = "http://dxplor.com/";

  constructor(public http: Http) {
    console.log('Hello OtherService Provider');
  }

  getOtherList(){
      return this.http.get(this.base_url+'dxplor/Mo_others/getOthers');
  }

  getDetailProduct(data:any, header:any){
      return this.http.post(this.base_url+'dxplor/Mo_others/getContentOthers', data, header);
  }

  searchProduct(keyword){
    return this.http.post(this.base_url+"dxplor/Mo_others/getOthers2", JSON.stringify({search:keyword}), {});
  }

}
