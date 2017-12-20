import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

/*
  Generated class for the BillingService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {
  public res = {};  
  private base_url  = "http://www.dxplor.com/";
  constructor(
    public http: Http,
    private storage: Storage
  ) {
    console.log('Hello AuthService Provider');
  }

  getBalance(id_user){
    return this.http.get(this.base_url+"dxplor/Mo_balance/get_balance/"+id_user, {});
  }

  login(data){
    return this.http.post(this.base_url+'dxplor/Mo_customer/login_new2', JSON.stringify(data), {});
  }

  login_old(data){
    return this.http.post(this.base_url+'dxplor/Mo_customer/login_new', JSON.stringify(data), {});
  }

  changePassword(email, oldpassword, newpassword){
    let data = {
      uname: email,
      oldpassword: oldpassword,
      newpassword: newpassword
    };
    console.log(data);
    return this.http.post(this.base_url+'dxplor/Mo_customer/changepassword', JSON.stringify(data), {});
  }

  checkEmail(email){
    return this.http.post(this.base_url+"dxplor/Mo_customer/checkemailid", JSON.stringify({email: email}), {});
  }

  transferDpay(data){
    return this.http.post(this.base_url+'dxplor/Mo_balance/transfer_dpay', JSON.stringify(data), {});
  }

  getPendingTopup(id_user:string){
    return this.http.get(this.base_url+'dxplor/Mo_balance/get_topup_order/'+id_user, {});
  }

  topUpDpay(data){
    return this.http.post(this.base_url+'dxplor/Mo_balance/topup_new', JSON.stringify(data), {});
  }

  getExistingTopup(id_user){
    return this.http.get(this.base_url+'dxplor/Mo_balance/get_topup_order_new/'+id_user, {});
  }

  cancelTopup(data){
    return this.http.post(this.base_url+'dxplor/Mo_balance/topup_cancel', JSON.stringify(data), {});
  }

  confirmTopup(data){
    return this.http.post(this.base_url+'dxplor/Mo_balance/topup_confirm', JSON.stringify(data), {});
  }

  getHistoryBalance(id_user){
    return this.http.get(this.base_url+'dxplor/Mo_customer/gethistory/'+id_user, {});
  }

  saveSession(index, value){
    return this.storage.set(index, value);
  }

  getSession(index){
    return this.storage.get(index);
  }

  deleteSession(index){
    return this.storage.remove(index);
  }

  register(data:any){
    return this.http.post(this.base_url+"dxplor/index.php/Mo_customer/register", JSON.stringify(data), {});
  }

  checkEmailExist(email){
    return this.http.post(this.base_url+"dxplor/Mo_customer/checkemailexist", JSON.stringify({email: email}), {});
  }

  resetPassword(email){
    return this.http.post(this.base_url+"dxplor/Mo_customer/forgotpassword", JSON.stringify({email:email}), {});
  }

  getReferalLink(id){
    return this.http.post(this.base_url+"dxplor/mo_customer/ref_link", {id:id}, {});
  }

}
