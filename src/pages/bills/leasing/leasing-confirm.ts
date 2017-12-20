import { Component } from '@angular/core';
import { Events, NavController, NavParams, AlertController, LoadingController, ViewController } from 'ionic-angular';
import {BillingService} from '../../../providers/billing-service';
import { LeasingSummary } from './leasing-simmary';


@Component({
  selector: 'page-pln',
  templateUrl: 'leasing-confirm.html',
  providers: [BillingService]
})
export class LeasingConfirm {

    public customer_data:any;
    public cust_id:any;
    public nama:any;
    public no_kontrak:any;
    public tagihan:any;
    public admin:any;
    public total:any;
    public invois:any;
    public no_polisi:any;
    public cicilan_ke:any;
    public jatuh_tempo:any;
    public jenis_tagihan:any;
    public cashback:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public billing: BillingService,
    public alertCtrl:AlertController,
    public viewCtrl:ViewController,
    public ev: Events,
    public loadingCtrl:LoadingController)
    {        
        this.customer_data = this.navParams.get('customer_data');
        let type:string = this.navParams.get('type');
        this.cust_id = this.navParams.get('id_cust');
        if(type.toUpperCase() == 'ADIRA'){
            this.jenis_tagihan = 'ADIRA';
            this.nama = this.customer_data[4];
            this.no_kontrak = this.customer_data[6];
            this.tagihan = this.customer_data[8];
            this.admin = this.customer_data[10];
            this.total = this.customer_data[12];
            this.invois = this.customer_data[14];
            this.no_polisi = this.customer_data[16];
            this.cicilan_ke = this.customer_data[18];
            this.jatuh_tempo = this.customer_data[20];
        }
        else{
            this.jenis_tagihan = this.customer_data[2];
            this.nama = this.customer_data[4];
            this.no_kontrak = this.customer_data[6];
            this.tagihan = this.customer_data[8];
            this.admin = this.customer_data[11];
            this.total = this.customer_data[13];
            this.invois = this.customer_data[14];
            this.no_polisi = this.customer_data[16];
            this.cicilan_ke = this.customer_data[18];
            this.jatuh_tempo = this.customer_data[20];
        }

        let loading = this.loading('Menghitung cashback...');
        loading.present();
        this.billing.checkCashBackPPOB(this.jenis_tagihan)
        .map(res=>res.text().split(';'))
        .subscribe(
            data=>{
                loading.dismiss();
                this.admin = parseInt(data[0]);
                this.cashback = data[1];
                this.total = parseInt(this.tagihan) + parseInt(data[0]);
            },
            onerror=>{loading.dismiss();}
        );
    }

  confirm_pay(){
      let loading = this.loading('Please wait..!');
      loading.present();
      this.billing.getBalance(window.localStorage.getItem('id_user'))
      .map(res=>res.text())
      .subscribe(
          data=>{
              if(parseInt(data) < this.total){
                this.showAlert("Info", "You dont have enough balance, please topup first");
              }
              else{
                  let loading = this.loading('Billing Process..!');
                  loading.present();
                  this.billing.payPPOB(this.invois, window.localStorage.getItem('id_user'), this.cust_id, this.total, this.jenis_tagihan)
                  .map(res=>res.text())
                  .subscribe(
                      data=>{
                        let res = data.split(';');
                          if(res[0] == "$7"){
                            this.ev.publish("balance:reduce", this.total);
                            this.showAlert('Info', 'Payment success, please note the ref id!');
                            this.navCtrl.push(LeasingSummary, {data: res, admin:this.admin, cust_id:this.cust_id});
                          }
                          else{
                            this.showAlert('Error', 'Payment Failure, please try again!');
                          }
                      },
                      onerror=>{},
                      ()=>{loading.dismiss()}
                  );
              }
          },
          onerror=>{this.showAlert("Error", "Something went wrong, try again")},
          ()=>{loading.dismiss()}
      );
  }

  private showAlert(title:string, message:string){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  private loading(content:string){
    let loader = this.loadingCtrl.create({
      content: content
    });

    return loader;
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
