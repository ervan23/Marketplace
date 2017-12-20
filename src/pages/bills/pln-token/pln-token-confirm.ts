import { Component } from '@angular/core';
import { Events, NavController, NavParams, AlertController, LoadingController, ViewController } from 'ionic-angular';
import {BillingService} from '../../../providers/billing-service';
import { TokenSummary } from './token-summary';


@Component({
  selector: 'page-pln',
  templateUrl: 'pln-token-confirm.html',
  providers: [BillingService]
})
export class PlnTokenConfirm {

    public customer_data:any;
    public id_customer:any;
    public no_meter:any;
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
        this.no_meter = this.customer_data[6];
        this.id_customer = this.customer_data[16];
        this.customer_name = this.customer_data[4];
        this.nominal_token = this.customer_data[8];
        this.no_invoice = this.customer_data[14];
        this.billing.getPrepaidcashback()
        .map(res=>res.text().split(';'))
        .subscribe(
            data=>{
                this.biaya_admin = data[0];
                this.cashback = data[1];
                this.total_amount = parseInt(this.customer_data[8]) + parseInt(this.biaya_admin);
            },
            onerror=>{this.showAlert("Error", "Something went wrong, try again")}
        );
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
                  this.billing.payPlnPrepaid(this.no_invoice, window.localStorage.getItem('id_user'), this.id_customer, this.total_amount)
                  .map(res=>res.text())
                  .subscribe(
                      data=>{
                        let res = data.split(';');
                          if(res[0] == "$2"){
                            this.ev.publish("balance:reduce", this.total_amount);
                            this.showAlert('Info', 'Payment success, please note the ref id!');
                            this.navCtrl.push(TokenSummary, {data: data, admin:this.biaya_admin});
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
