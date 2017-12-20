import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class MerchantService {
  public res = {};  
  private base_url  = "http://dxplor.com/";

  constructor(public http: Http) {
    console.log('Hello MerchantService Provider');
  }

  getPariwisataList(){
      return this.http.get(this.base_url+'dxplor/Mo_pariwisata/getPariwisata');
  }

  getDetailPariwisata(data:any, header:any){
      return this.http.post(this.base_url+'dxplor/Mo_pariwisata/getContentPariwisata', data, header);
  }

  searchPariwisata(keyword){
    return this.http.post(this.base_url+"dxplor/Mo_pariwisata/getPariwisata", JSON.stringify({search:keyword}), {});
  }

  getPropertyList(){
      return this.http.get(this.base_url+'dxplor/Mo_property/getProperty');
  }

  getDetailProperty(data:any, header:any){
      return this.http.post(this.base_url+'dxplor/Mo_property/getContentProperty', data, header);
  }

  searchProperty(keyword){
    return this.http.post(this.base_url+"dxplor/Mo_property/getProperty2", JSON.stringify({search:keyword}), {});
  }

  getOtomotifList(){
      return this.http.get(this.base_url+'dxplor/Mo_otomotif/getOtomotif');
  }

  getDetailOtomotif(data:any, header:any){
      return this.http.post(this.base_url+'dxplor/Mo_otomotif/getContentOtomotif', data, header);
  }

  searchOtomotif(keyword){
    return this.http.post(this.base_url+"dxplor/Mo_otomotif/getOtomotif2", JSON.stringify({search:keyword}), {});
  }

  getNotaryList(){      
      return this.http.get(this.base_url+'dxplor/Mo_lawyer/getLawyer2');
  }

  getDetailNotary(data:any, header:any){
      return this.http.post(this.base_url+'dxplor/Mo_lawyer/getContentLawyer', data, header);
  }

}
