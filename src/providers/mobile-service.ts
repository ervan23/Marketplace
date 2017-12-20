import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class MobileService {
  public res = {};  
  private base_url  = "http://dxplor.com/";

  constructor(public http: Http) {
    console.log('Hello MobileService Provider');
  }

  getOperator(num_code){
      return this.http.get(this.base_url+"dxplor/Mo_operator/"+num_code, {});
  }

  getOperatorPrice(op_code){
      return this.http.get(this.base_url+"dxplor/Mo_operator_package/"+op_code, {});
  }

  getBalance(id_user){
    return this.http.get(this.base_url+"dxplor/Mo_balance/get_balance/"+id_user, {});
  }

  topUpPulsa(phone, op_code, price, id_user){
    //http://dxplor.com/dxplor/Mo_pulsa3/'+mobilenomodel+'/'+operatorid+'/'+selected_id+'/'+$localStorage.customerid+'/3-6-1-2-3-1-1'
    return this.http.get(this.base_url+"dxplor/Mo_pulsa3/"+phone+"/"+op_code+"/"+price+"/"+id_user+"/3-6-1-2-3-1-1");
  }

  getPacketOperator(num_code){
      return this.http.get(this.base_url+"dxplor/Mo_operator_packet/"+num_code, {});
  }

  getPacketListOperator(op_code){
    return this.http.get(this.base_url+"dxplor/Mo_operator_packet_data/"+op_code, {});
  }

  topUpPacket(phone, op_code, price, id_user){
    //http://dxplor.com/dxplor/Mo_pulsa3/'+mobilenomodel+'/'+operatorid+'/'+selected_id+'/'+$localStorage.customerid+'/3-6-1-2-3-1-1
    return this.http.get(this.base_url+"dxplor/Mo_pulsa3/"+phone+"/"+op_code+"/"+price+"/"+id_user+"/3-6-1-2-3-1-1");
  }

}
