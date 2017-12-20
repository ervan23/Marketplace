import { Component } from '@angular/core';
import { Events, NavController, NavParams, AlertController, LoadingController, ViewController } from 'ionic-angular';
import {BillingService} from '../../../providers/billing-service';
import {SpeedySummary} from './speedy-summary';

@Component({
  selector: 'page-pln',
  templateUrl: 'speedy-confirm.html',
  providers: [BillingService]
})
export class SpeedyConfirm {

    public customer_data:any;
    public id_customer:any;
    public customer_name:any;
    public total_amount:any;
    public no_invoice:any;
    public biaya_admin:any;
    public nominal_token:any;
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
        this.id_customer = this.customer_data[6];
        this.customer_name = this.customer_data[4];
        this.total_amount = this.customer_data[12];
        this.no_invoice = this.customer_data[14];
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlnConfirm');
  }

  confirm_pay(){
      let loading = this.loading('Please wait..!');
      loading.present();
      this.billing.getBalance(window.localStorage.getItem('id_user'))
      .map(res=>res.text())
      .subscribe(
          data=>{
              if(parseInt(data) < this.total_amount){
                this.showAlert("Info", "You dont have enough balance, please topup first");
              }
              else{
                  let loading = this.loading('Billing Process..!');
                  loading.present();
                  this.billing.paySpeedy(this.no_invoice, window.localStorage.getItem('id_user'), this.id_customer, this.total_amount)
                  .map(res=>res.text().split(';'))
                  .subscribe(
                      data=>{
                          if(data[0] == "$3"){
                            this.ev.publish("balance:reduce", this.total_amount);
                            this.navCtrl.push(SpeedySummary, {customer_data: data, admin:this.biaya_admin});
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
