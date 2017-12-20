import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import {BillingService} from '../../../providers/billing-service';
import { PlnConfirm } from './pln-confirm';


@Component({
  selector: 'page-pln',
  templateUrl: 'pln.html',
  providers: [BillingService]
})
export class PlnPage {

  public customer_id:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public billing: BillingService,
    public alertCtrl:AlertController,
    public modalCtrl:ModalController,
    public loadingCtrl:LoadingController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlnPage');
  }

  checkBilling(){    
    let loading = this.loading("Collecting Information...");
    loading.present();
    this.billing.cekPlnBillingInfo(this.customer_id)
    .map(res=>res.text().split(';'))
    .subscribe(
      data=>{
        if(data[0].toUpperCase() == "$C"){
          this.showAlert("Error", "Something went wrong");
        }
        else if(data[0].toUpperCase() == "$D"){
          this.customer_id = "";
          let profileModal = this.modalCtrl.create(PlnConfirm, { customer_data: data });
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
