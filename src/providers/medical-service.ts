import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class MedicalService {
  public res = {};  
  private base_url  = "http://dxplor.com/";

  constructor(public http: Http) {
    console.log('Hello MedicalService Provider');
  }

  getMedicalList(){
      return this.http.get(this.base_url+'dxplor/Mo_medical/getMedical');
  }

  getDetailProduct(data:any, header:any){
      return this.http.post(this.base_url+'dxplor/Mo_medical/getContentMedical', data, header);
  }

  searchProduct(keyword){
    return this.http.post(this.base_url+"dxplor/Mo_medical/getMedical2", JSON.stringify({search:keyword}), {});
  }

}
