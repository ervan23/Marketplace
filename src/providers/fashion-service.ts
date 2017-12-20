import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class FashionService {
  public res = {};  
  private base_url  = "http://dxplor.com/";

  constructor(public http: Http) {
    console.log('Hello FashionService Provider');
  }

  getFashionList(){
      return this.http.get(this.base_url+'dxplor/Mo_fashion/getFashion');
  }

  getDetailProduct(data:any, header:any){
      return this.http.post(this.base_url+'dxplor/Mo_fashion/getContentFashion', data, header);
  }
  
  searchProduct(keyword){
    return this.http.post(this.base_url+"dxplor/Mo_fashion/getFashion2", JSON.stringify({search:keyword}), {});
  }

}
