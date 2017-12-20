import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class RestoService {
  public res = {};  
  private base_url  = "http://dxplor.com/";

  constructor(public http: Http) {
    console.log('Hello RestoService Provider');
  }

  getRestoList(){
      return this.http.get(this.base_url+'dxplor/Mo_resto/getResto');
  }

  getDetailProduct(data:any, header:any){
      return this.http.post(this.base_url+'dxplor/Mo_resto/getContentResto', data, header);
  }

  searchProduct(keyword){
    return this.http.post(this.base_url+"dxplor/Mo_resto/getResto2", JSON.stringify({search:keyword}), {});
  }

}
