import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GeneralService {
  public res = {};
  private base_url  = "http://localhost:8100/api/";

  constructor(public http: Http) {
    //console.log('Hello MarketService Provider');
  }

  post(url:string, body:any, headers:any){
    return this.http.post(this.base_url+url, body, headers);
  }

  get(url:string, headers:any){
    return this.http.get(this.base_url+url, headers);
  }

}
