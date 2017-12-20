import { Component } from '@angular/core';
import { Events, NavController, NavParams, AlertController, LoadingController, ViewController } from 'ionic-angular';
import {BillingService} from '../../../providers/billing-service';
import { PascabayarSummary } from './pascabayar-summary';


@Component({
  selector: 'page-pln',
  templateUrl: 'pascabayar-confirm.html',
  providers: [BillingService]
})
export class PascabayarConfirm {

    public customer_data:any;
    public jenis:any;
    public nama:any;
    public id_customer:any;
    public tagihan:any;
    public admin:any;
    public total:any;
    public invoice:any;
    public cashback;

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
        this.jenis = this.customer_data[2];
        this.nama = this.customer_data[4];
        this.id_customer = this.customer_data[6];
        this.tagihan = this.customer_data[8];
        this.admin = this.customer_data[10];
        this.total = this.customer_data[12];
        this.invoice = this.customer_data[14];

        let loading = this.loading('Menghitung cashback...');
        loading.present();
        this.billing.checkCashBackPPOB(this.jenis)
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
                  this.billing.payPPOB(this.invoice, window.localStorage.getItem('id_user'), this.id_customer, this.total, this.jenis)
                  .map(res=>res.text())
                  .subscribe(
                      data=>{
                        let res = data.split(';');
                          if(res[0] == "$7"){
                            this.ev.publish("balance:reduce", this.total);
                            this.showAlert('Info', 'Payment success, please note the ref id!');
                            this.navCtrl.push(PascabayarSummary, {data: res, admin:this.admin});
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
