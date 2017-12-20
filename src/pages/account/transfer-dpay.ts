import { Component } from '@angular/core';
import { Events, NavController, NavParams, AlertController, LoadingController, ToastController, ViewController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';
import { TransferConfirmation } from './transfer-confirmation';

@Component({
  templateUrl: 'transfer-dpay.html',
  providers: [AuthService, BarcodeScanner]
})
export class TransferDpay {

    nominal:number = 0;
    dest_email:string = "";
    barcodeOptions:BarcodeScannerOptions;
    qr_code_url:any;
    selected_page:string = 'form';

    constructor(
        public navCtrl: NavController,
        public navParam: NavParams,
        public auth: AuthService,
        public alertCtrl:AlertController,
        public loadingCtrl:LoadingController,
        public toastCtrl:ToastController,
        public viewCtrl:ViewController,
        public event:Events,
        public barcode:BarcodeScanner
    ) {
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

  transferDpay(){
    if(this.nominal <= 0 || this.nominal == null){
        this.presentToast("Pilih nominal", 2500, "bottom");
        return false;
    }
    if(this.nominal < 20000){
        this.presentToast("Nominal transfer minimal 20.000", 2500, "bottom");
        return false;
    }
    if(this.dest_email == "" || this.dest_email == " "){
        this.presentToast("Masukan email tujuhan", 2500, "bottom");
        return false;
    }
    if(this.dest_email == window.localStorage.getItem('email')){
        this.presentToast("Tidak dapat ke akun sendiri", 2500, "bottom");
        return false;
    }
    if(window.localStorage.getItem('is_loggedin') != "true" || window.localStorage.getItem('is_loggedin') == null){
        let alert = this.alertCtrl.create({
            title: "Error: ",
            subTitle: "You logged out, login first !",
            buttons: [
                {
                    text: 'Ok',
                    handler: data => {
                        this.navCtrl.push(LoginPage);
                    }
                }
            ]
        });
        alert.present();
        return false;
    }
    this.transferProses();

  }

  transferProses(){
    let loading = this.loading("Proses transfer...");
    let prompt = this.alertCtrl.create({
        title: 'Enter Password',
        inputs: [
          {
            name: 'password',
            placeholder: 'Your Password',
            type: 'password'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log(data);
            }
          },
          {
            text: 'Accept',
            handler: data => {
                loading.present();                
                if(data.password != window.localStorage.getItem('password')){
                    loading.dismiss();
                    this.presentToast("Password is invalid", 2500, "bottom");
                }
                else{
                    this.auth.getBalance(window.localStorage.getItem('id_user'))
                    .map(res=>res.text())
                    .subscribe(
                        data=>{
                            if(parseInt(data) < this.nominal){
                                loading.dismiss();
                                this.showAlert("Error:", "Saldo tidak cukup.");
                            }
                            else if((parseInt(data) - this.nominal) < 10000){
                                loading.dismiss();
                                this.showAlert("Error:", "Minimal sisa saldo 10.000.");
                            }
                            else{
                                this.auth.checkEmail(this.dest_email)
                                .map(res=>res.text())
                                .subscribe(
                                    data=>{
                                        console.log(data);
                                        if(data == "notexist"){
                                            loading.dismiss();
                                            this.showAlert("Info:", "Email belum terdaftar, periksa kembali.");
                                        }
                                        else{
                                            let res = data.split("-");
                                            let custid = res[2];
                                            let dest_name = res[0]+' '+res[1];
                                            let actid = res[3];
                                            if(actid != "VIP")
                                            {
                                                actid="REGULAR";
                                            }
                                            let params = {
                                                custidto: custid,
                                                amount: this.nominal,
                                                customerid: window.localStorage.getItem('id_user'),
                                                custidtotype: actid,
                                                email: this.dest_email,
                                                dest_name: dest_name
                                            };
                                            loading.dismiss();
                                            this.dest_email = '';
                                            this.navCtrl.push(TransferConfirmation, {params: params});
                                        }
                                    },
                                    onerror=>{
                                        loading.dismiss();
                                        this.showAlert("Error:", "Something went wrong. Try again !");
                                    }
                                );
                            }
                        },
                        onerror=>{
                            loading.dismiss();
                            this.showAlert("Error:", "Something went wrong. Try again !");
                        },
                    );
                }
                try {
                    
                } catch (error) {
                    console.log(error);
                }
            }
          }
        ]
      });
      prompt.present();
  }

  openQRScanner(){
      this.barcode.scan()
      .then(
          data=>{
            //this.showAlert('Info', JSON.stringify(data));
            this.dest_email = data.text;
          },
          onerror=>{
              this.showAlert('Error', onerror);
          }
      );
  }

  onSegmentChanged(segment:any){
    this.selected_page = segment.value;
    if(this.selected_page == 'qr_code'){
        let email:string = window.localStorage.getItem('email');
        if(email == '' || email == null || email == undefined){
            this.showAlert('Info', 'Login First..!');
            this.selected_page = 'form';
        }
        else{
            this.barcode.encode(this.barcode.Encode.TEXT_TYPE, email)
            .then(
                data=>{
                    this.showAlert('Info', JSON.stringify(data));
                    this.qr_code_url = data.file;
                },
                onerror=>{
                    this.showAlert('Error', onerror);
                    this.selected_page = 'form';
                }
            );
        }        
    }
  }

  dismiss(){
      this.viewCtrl.dismiss();
  }

}