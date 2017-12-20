import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { TopupConfirmation } from './topup-confirmation';
import { MyApp } from '../../app/app.component';

@Component({
  templateUrl: 'topup-dpay.html',
  providers: [AuthService]
})
export class TopupDpay {

    nominal:number = 0;
    dest_bank:string = "";

    constructor(
        public navCtrl: NavController,
        public navParam: NavParams,
        public auth: AuthService,
        public alertCtrl:AlertController,
        public loadingCtrl:LoadingController,
        public modalCtrl:ModalController
    ) {
    }

    topUpDpay(){
        let loading = this.loading("Getting Information...");
        loading.present();
        if(this.nominal <= 0){
            loading.dismiss();
            this.showAlert("Warning", "Input or select amount to top up.");
        }
        else if(this.nominal < 20000){
            loading.dismiss();
            this.showAlert("Warning", "Minimum top up 20.000");
        }
        else if((this.nominal % 10000) != 0){
            loading.dismiss();
            this.showAlert("Warning", "Transfer amount should multiples 10.000.");
        }
        else if(this.dest_bank == undefined || this.dest_bank == "" || this.dest_bank == null){
            loading.dismiss();
            this.showAlert("Warning", "Select dxplor bank account.");
        }
        else{
            let min = 1;
            let max = 1000;
            let num:number = Math.floor(Math.random() * (max - min + 1)) + min;
            let t_amount:number = parseInt(this.nominal+"") + parseInt(num+"");
            let params = {
                tobank: this.dest_bank,
                checksum: num,
                amount: t_amount,
                customerid: window.localStorage.getItem('id_user')
            };
            this.auth.topUpDpay(params)
            .map(res=>res.text())
            .subscribe(
                data=>{                    
                    loading.dismiss();
                    if(data.toLowerCase() == "ok"){
                        let modal = this.modalCtrl.create(TopupConfirmation);
                        modal.onDidDismiss(
                            data=>{
                                this.navCtrl.setRoot(MyApp);
                            }
                        );
                        modal.present();
                    }
                    else{
                        this.showAlert("Error", "Top up request error, try again or contact dxplor !");
                    }
                },
                onerror=>{loading.dismiss();}
            );
        }
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