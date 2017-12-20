import { Component } from '@angular/core';
import { Events, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import {MyApp} from '../../app/app.component';

@Component({
  templateUrl: 'transfer-confirmation.html',
  providers: [AuthService]
})
export class TransferConfirmation {

    nominal:number = 0;
    dest_name:string;
    dest_email:number = 0;
    params:any;

    constructor(
        public navCtrl: NavController,
        public navParam: NavParams,
        public auth: AuthService,
        public alertCtrl:AlertController,
        public loadingCtrl:LoadingController,
        public toastCtrl:ToastController,
        public ev:Events
    ) {
        this.params = this.navParam.get('params');
        this.dest_email = this.params.email;
        this.dest_name = this.params.dest_name;
        this.nominal = this.params.amount;
    }

    cancelTransfer(){
        this.navCtrl.pop();
    }

    confirmTransfer(){
        let loading = this.loading('Please wait...');  
        loading.present();    
        this.auth.transferDpay(this.params)
        .map(res=>res.text())
        .subscribe(
            data=>{
                if(data.toLowerCase() == "ok"){
                    this.ev.publish("balance:reduce", this.nominal);                                                        
                    loading.dismiss();
                    this.showAlert("Info:", "Transfer D-Pay Berhasil.");
                    this.navCtrl.popToRoot();
                }
                else{
                    loading.dismiss();
                    this.showAlert("Error:", "Something went wrong, try again or contact admin.");
                }
            },
            onerror=>{loading.dismiss();}
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

  private presentToast(message:any, duration:number, position:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });

    toast.onDidDismiss(() => {});

    toast.present();
  }
}