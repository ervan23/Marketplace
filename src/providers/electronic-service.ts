import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class ElectronicService {
  public res = {};  
  private base_url  = "http://dxplor.com/";

  constructor(public http: Http) {
    console.log('Hello ElectronicService Provider');
  }

  getElectroList(){
      return this.http.get(this.base_url+'dxplor/Mo_electronic/getElectronic');
  }

  getDetailProduct(data:any, header:any){
      return this.http.post(this.base_url+'dxplor/Mo_electronic/getContentElectronic', data, header);
  }

  searchProduct(keyword){
    return this.http.post(this.base_url+"dxplor/Mo_electronic/getElectronic2", JSON.stringify({search:keyword}), {});
  }
}
