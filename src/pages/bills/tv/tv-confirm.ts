import { Component } from '@angular/core';
import { Events, NavController, NavParams, AlertController, LoadingController, ViewController } from 'ionic-angular';
import {BillingService} from '../../../providers/billing-service';
import { TvSummary } from './tv-summary';


@Component({
  selector: 'page-pln',
  templateUrl: 'tv-confirm.html',
  providers: [BillingService]
})
export class TvConfirm {

    public customer_data:any;
    public jenis_tagihan:any;
    public nama:any;
    public cust_id:any;
    public tagihan:any;
    public admin:any;
    public total:any;
    public invois:any;
    public cashback;

    //telkovision
    public bl_th:any;

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
        if(type.toUpperCase() == 'TELKOMVISION'){
            this.jenis_tagihan = 'TELKOMVISION';
            this.nama = this.customer_data[4];
            this.cust_id = this.customer_data[6];
            this.tagihan = this.customer_data[8];
            this.admin = this.customer_data[10];
            this.total = this.customer_data[12];
            this.invois = this.customer_data[14];
            this.bl_th = this.customer_data[15];
        }
        else{
            this.jenis_tagihan = this.customer_data[2];
            this.nama = this.customer_data[4];
            this.cust_id = this.customer_data[6];
            this.tagihan = this.customer_data[8];
            this.admin = this.customer_data[10];
            this.total = this.customer_data[12];
            this.invois = this.customer_data[14];
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
                          if(res[0] == "$4"){
                            this.ev.publish("balance:reduce", this.total);
                            this.showAlert('Info', 'Payment success, please note the ref id!');
                            this.navCtrl.push(TvSummary, {data: res, admin:this.admin, type:this.jenis_tagihan});
                          }
                          if(res[0] == "$3"){
                            this.ev.publish("balance:reduce", this.total);
                            this.showAlert('Info', 'Payment success, please note the ref id!');
                            this.navCtrl.push(TvSummary, {data: res, admin:this.admin, type:this.jenis_tagihan, id_cust:this.cust_id});
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
