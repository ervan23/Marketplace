import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class GadgetService {
  public res = {};  
  private base_url  = "http://dxplor.com/";

  constructor(public http: Http) {
    console.log('Hello GadgetService Provider');
  }

  getGadgetList(){
      return this.http.get(this.base_url+'dxplor/Mo_gadget/getGadget');
  }

  getDetailProduct(data:any, header:any){
      return this.http.post(this.base_url+'dxplor/Mo_gadget/getContentGadget', data, header);
  }

  searchProduct(keyword){
    return this.http.post(this.base_url+"dxplor/Mo_gadget/getGadget2", JSON.stringify({search:keyword}), {});
  }

}
