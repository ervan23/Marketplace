import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController, ViewController } from 'ionic-angular';
import {BillingService} from '../../../providers/billing-service';
import { SpeedyConfirm } from './speedy-confirm';
/*
  Generated class for the Bills page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-speedy',
  templateUrl: 'speedy.html',
  providers: [BillingService]
})
export class SpeedyPage {
  public customer_id:any;

  constructor(
    public navCtrl: NavController,
    public viewCtrl:ViewController,
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
    this.billing.cekSpeedyBillingInfo(this.customer_id)
    .map(res=>res.text().split(';'))
    .subscribe(
      data=>{
        if(data[0].toUpperCase() == "$C"){
          this.showAlert("Error", "Something went wrong");
        }
        else if(data[0].toUpperCase() == "$D"){
          this.customer_id = "";
          let profileModal = this.modalCtrl.create(SpeedyConfirm, { customer_data: data });
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
  
  dismiss(){
    this.viewCtrl.dismiss();
  }
}
