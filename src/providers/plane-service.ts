import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class PlaneService {
  public res = {};  
  private base_url  = "http://www.dxplor.com/";

  constructor(public http: Http) {
    console.log('Hello PlaneService Provider');
  }

  getBalance(id_user){
    return this.http.get(this.base_url+"dxplor/Mo_balance/get_balance/"+id_user, {});
  }

  getAirportList(){
      return this.http.get(this.base_url+'dxplor/Mo_flight/getairportautocomplete');
  }

  getOneWayFlightList(data:any, header:any){
      return this.http.post(this.base_url+'dxplor/index.php/Mo_flight/search2', data, header);
  }

  getOneWayFlightSchedule(flight_id){
    return this.http.get(this.base_url+'dxplor/Mo_flight/get_schedule/'+flight_id, {});
  }

  bookFlight(data:any){
    return this.http.post(this.base_url+'dxplor/Mo_flight/book_flight', JSON.stringify(data), {});
  }

  getFlightTransactionDetail(booking_code){
    return this.http.get(this.base_url+'dxplor/Mo_flight/get_transaction_flight_detail/'+booking_code);
  }

  issuedFlight(data:any){
    return this.http.post(this.base_url+'dxplor/Mo_flight/issued2', JSON.stringify(data), {});
  }

  chargeFlightBalance(data:any){
    return this.http.post(this.base_url+'dxplor/Mo_balance/potong_balance_flight', JSON.stringify(data), {});
  }

}
