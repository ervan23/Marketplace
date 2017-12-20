import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the BillingService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class HotelService {
  public res = {};
  private base_url  = "http://dxplor.com/";
  constructor(public http: Http) {
    console.log('Hello HotelService Provider');
  }

  public getPaxPassport(){
      return this.http.get(this.base_url+"dxplor/Mo_hotel/getPaxPassport", {});
  }

  public getCountry(){
      return this.http.get(this.base_url+"dxplor/Mo_hotel/getCountry", {});
  }

  public getCity(idcountry){
      return this.http.get(this.base_url+"dxplor/Mo_hotel/getCity/"+idcountry, {});
  }

  getHotels(data:any){
    var h = new Headers();
    h.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    return this.http.post(this.base_url+"dxplor/Mo_hotel/SearchHotel", data, {headers: h});
  }

  getDetailHotel(data){
    var h = new Headers();
    h.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    return this.http.post(this.base_url+"dxplor/Mo_hotel/getHotelDetail", data, {headers: h});
  }

  getAutocomplete(){
    return this.http.get(this.base_url+"dxplor/Mo_hotel/gethotelautocomplete");
  }

}
