import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import {BillingService} from '../../../providers/billing-service';
import { PamConfirm } from './pam-confirm';
/*
  Generated class for the Bills page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-pam',
  templateUrl: 'pam.html',
  providers: [BillingService]
})
export class PamPage {
  public customer_id:any;
  public location:any;
  public listPAM:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public billing: BillingService,
    public alertCtrl:AlertController,
    public modalCtrl:ModalController,
    public loadingCtrl:LoadingController) {
      let loading = this.loading('Mohon tunggu...');
      loading.present();
      this.billing.getListPAMProduct()
      .map(res => res.json())
      .subscribe(
        data => {
          loading.dismiss();
          console.log(data);
          this.listPAM = data;
        },
        onerror => {
          loading.dismiss();
          this.showAlert('Error', 'Terjadi kegagalan pengambilan data, periksa koneksi anda dan coba lagi.');
          this.navCtrl.pop();
        }
      );

    }

  checkBilling(){    
    let loading = this.loading("Collecting Information...");
    loading.present();
    this.billing.cekPamBillingInfo(this.customer_id, this.location)
    .map(res=>res.text().split(';'))
    .subscribe(
      data=>{
        if(data[0].toUpperCase() == "$C"){
          this.showAlert("Error", "Something went wrong");
        }
        else if(data[0].toUpperCase() == "$D"){
          this.customer_id = "";
          this.location = "";
          let profileModal = this.modalCtrl.create(PamConfirm, { customer_data: data });
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
