import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import {BillingService} from '../../../providers/billing-service';
import { PlnTokenConfirm } from './pln-token-confirm';

@Component({
  selector: 'page-pln-token',
  templateUrl: 'pln-token.html',
  providers:[BillingService]
})
export class PlnTokenPage {

  public customer_id:any;
  public nominal:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public billing: BillingService,
    public alertCtrl:AlertController,
    public modalCtrl:ModalController,
    public loadingCtrl:LoadingController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad pln-token');
  }

  checkBilling(){    
    let loading = this.loading("Collecting Information...");
    loading.present();
    this.billing.cekPlnTokenBillingInfo(this.customer_id, this.nominal)
    .map(res=>res.text().split(';'))
    .subscribe(
      data=>{
        if(data[0].toUpperCase() == "$C"){
          this.showAlert("Error", "Something went wrong");
        }
        else if(data[0].toUpperCase() == "$D"){
          this.customer_id = "";
          this.nominal = "";
          let profileModal = this.modalCtrl.create(PlnTokenConfirm, { customer_data: data });
          profileModal.present();
        }
      },
      onerror=>{},
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

}
