import { Component } from '@angular/core';
import { Events, NavController, NavParams, AlertController, LoadingController, ToastController, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

@Component({
  templateUrl: 'topup-confirmation.html',
  providers: [AuthService]
})
export class TopupConfirmation {

    amount:number = 0;
    dest_bank:string;
    id_topup:number = 0;

    constructor(
        public navCtrl: NavController,
        public navParam: NavParams,
        public auth: AuthService,
        public alertCtrl:AlertController,
        public loadingCtrl:LoadingController,
        public toastCtrl:ToastController,
        public viewCtrl: ViewController,
        public ev:Events
    ) {
        let id = window.localStorage.getItem('id_user');
        let loading = this.loading("Please wait...");
        loading.present();
        this.auth.getExistingTopup(id)
        .map(res=>res.text())
        .subscribe(
            data=>{
                console.log("Confirmation: "+data);
                loading.dismiss();
                if(data.toLowerCase() == "notexist" || data.toLowerCase() == "0"){
                    this.showAlert("Warning", "Error occurred when getting information, try re-login or contact Dxplor");
                }
                else{
                    let res = data.split(';');
                    this.amount = parseInt(res[0]);
                    this.dest_bank = res[1].toUpperCase();
                    this.id_topup = parseInt(res[2]);
                }
            },
            onerror=>{
                loading.dismiss();
            }
        );
    }

    cancelTopup(){
        if(this.id_topup == 0){
            this.showAlert('Warning', "Something went wrong, try again !");
        }
        else{
            let loading = this.loading("Please wait ...");
            loading.present();
            let params = {id: this.id_topup};
            this.auth.cancelTopup(params)
            .map(res=>res.text())
            .subscribe(
                data=>{
                    loading.dismiss();
                    if(data.toLowerCase() == "ok"){
                        this.presentToast("Top up request has been canceled", 3000, "bottom");
                        this.dismiss();
                    }
                    else{
                        this.showAlert("Error:", "Cancel request failed, contact Dxplor");
                    }
                },
                onerror=>{loading.dismiss();}
            );
        }        
    }

    confirmToup(){
        if(this.id_topup == 0){
            this.showAlert('Warning', "Something went wrong, try again !");
        }
        else{
            let loading = this.loading("Please wait ...");
            loading.present();
            let params = {id: this.id_topup};
            this.auth.confirmTopup(params)
            .map(res=>res.text())
            .subscribe(
                data=>{
                    loading.dismiss();
                    if(data.toLowerCase() == "ok"){                        
                        this.ev.publish("balance:reduce", 0);
                        this.alertCtrl.create({
                            title: "Info",
                            subTitle: "Topup Confirmation Success, please wait for Approval",
                            buttons: [
                                {
                                    text: 'Ok',
                                    handler: data => {
                                        this.dismiss();
                                    }
                                }
                            ]
                        }).present();
                    }
                    else{
                        this.showAlert("Error:", "Confirm request failed, contact Dxplor");
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

  private presentToast(message:any, duration:number, position:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });

    toast.onDidDismiss(() => {});

    toast.present();
  }

  dismiss(){
      this.viewCtrl.dismiss();
  }
}