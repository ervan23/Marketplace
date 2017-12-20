import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

/*
  Generated class for the BillingService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BillingService {
  public res = {};
  private base_url  = "http://dxplor.com/";

  constructor(public http: Http) {
    console.log('Hello BillingService Provider');
  }

  cekPlnBillingInfo(id_customer){
    return this.http.post(this.base_url+"dxplor/Mo_pln/check_bill_pln", {customer_id: id_customer}, {});
  }

  getCashback(){
    return this.http.get(this.base_url+"dxplor/Mo_pln/get_cashback");
  }

  getBalance(id_user){
    return this.http.get(this.base_url+"dxplor/Mo_balance/get_balance/"+id_user, {});
  }

  payPLN(invoice:any, id_user:any, customer_id:any, total:any){
    return this.http.post(this.base_url+"dxplor/Mo_pln/pay_pln", {invoice_no:invoice,memberid:id_user, customer_id:customer_id, total:total}, {});
  }

  cekPlnTokenBillingInfo(id_customer, amount){
    return this.http.post(this.base_url+"dxplor/Mo_pln_prepaid/check_pln_prepaid", {customer_id:id_customer,amount:amount});
  }

  getPrepaidcashback(){
    return this.http.get(this.base_url+"dxplor/Mo_pln_prepaid/get_cashback");
  }

  payPlnPrepaid(invoice:any, id_user:any, customer_id:any, total:any){
    return this.http.post(this.base_url+"dxplor/Mo_pln_prepaid/pay_pln_prepaid2", {invoice_no:invoice,memberid:id_user,secret:'3-6-1-2-3-1-2', customer_id:customer_id, total:total}, {});
  }

  cekPamBillingInfo(cust_id, location){
    return this.http.post(this.base_url+"dxplor/Mo_pam/check_bill_pam", {customer_id : cust_id, location : location });
  }

  getPamCashback(){
    return this.http.get(this.base_url+"dxplor/Mo_pam/get_cashback");
  }

  payPam(invoice, id_user, customer_id:any, total:any){
    return this.http.post(this.base_url+"dxplor/Mo_pam/pay_pam", {invoice_no:invoice,memberid:id_user, customer_id:customer_id, total:total}, {});
  }

  cekBpjsBillingInfo(cust_id){
    return this.http.post(this.base_url+"dxplor/Mo_bpjs/check_bill_bpjs", {customer_id : cust_id});
  }

  getBpjsCashBack(){
    return this.http.get(this.base_url+"dxplor/Mo_bpjs/get_cashback");
  }

  payBpjs(invoice, id_user, customer_id:any, total:any){
    return this.http.post(this.base_url+"dxplor/Mo_bpjs/pay_bpjs", {invoice_no:invoice,memberid:id_user, customer_id:customer_id, total:total}, {});
  }

  cekTelkomBillingInfo(cust_id){
    return this.http.post(this.base_url+"dxplor/Mo_telkom/check_bill_telkom", {customer_id : cust_id});
  }

  getTelkomCashback(){
    return this.http.get(this.base_url+"dxplor/Mo_telkom/get_cashback");
  }

  payTelkom(invoice, id_user, customer_id:any, total:any){
    return this.http.post(this.base_url+"dxplor/Mo_telkom/pay_telkom", {invoice_no:invoice,memberid:id_user, customer_id:customer_id, total:total}, {});
  }

  cekSpeedyBillingInfo(cust_id){
    return this.http.post(this.base_url+"dxplor/Mo_speedy/check_bill_speedy", {customer_id : cust_id});
  }

  paySpeedy(invoice, id_user, customer_id:any, total:any){
    return this.http.post(this.base_url+"dxplor/Mo_speedy/pay_speedy", {invoice_no:invoice,memberid:id_user, customer_id:customer_id, total:total}, {});
  }

  getBillingType(billing_type:string){
    return this.http.get(this.base_url+'dxplor/mo_tagihan?type='+billing_type);
  }

  cekPascabayarBillingInfo(customer_id:string, jenis_tagihan:string){
    let params = {
      id_pelanggan: customer_id,
      jenis_tagihan: jenis_tagihan
    }
    return this.http.post(this.base_url+'dxplor/mo_pascabayar/check_bill', params, {});
  }

  payPPOB(invoice, id_user, customer_id:any, total:any, jenis_tagihan:any){
    let params = {
      invoice_no:invoice,
      memberid:id_user, 
      customer_id:customer_id, 
      total:total,
      jenis_tagihan: jenis_tagihan
    };
    return this.http.post(this.base_url+'dxplor/mo_pascabayar/pay', params, {});
  }

  cekLeasingBillingInfo(customer_id:string, jenis_tagihan:string){
    let params = {
      id_pelanggan: customer_id,
      jenis_tagihan: jenis_tagihan
    }
    return this.http.post(this.base_url+'dxplor/mo_pascabayar/check_bill', params, {});
  }

  getListPAMProduct(){
    return this.http.get(this.base_url+'dxplor/Mo_pam/getkode_product');
  }

  checkCashBackPPOB(jenis_tagihan){
    let params = {
      jenis_tagihan: jenis_tagihan
    };
    return this.http.post(this.base_url+'dxplor/mo_pascabayar/get_cashback', params, {});
  }

}
