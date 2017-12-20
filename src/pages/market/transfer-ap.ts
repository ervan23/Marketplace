import { Component } from '@angular/core';
import { Events, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { MarketService } from '../../providers/market-service';

@Component({
  templateUrl: 'transfer-ap.html',
  providers: [MarketService, BarcodeScanner]
})
export class TransferAP {

    nominal:number = 0;
    dest_email:string = "";
    barcodeOptions:BarcodeScannerOptions;
    qr_code_url:any;
    selected_page:string = 'form';

    constructor(
        public navCtrl: NavController,
        public navParam: NavParams,
        public market: MarketService,
        public alertCtrl:AlertController,
        public loadingCtrl:LoadingController,
        public toastCtrl:ToastController,
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
    if(this.dest_email == "" || this.dest_email == " "){
        this.presentToast("Masukan email tujuhan", 2500, "bottom");
        return false;
    }
    if(this.dest_email == window.localStorage.getItem('email')){
        this.presentToast("Tidak dapat ke akun sendiri", 2500, "bottom");
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
                    this.market.getAPBalance(window.localStorage.getItem('id_user'))
                    .map(res=>res.json())
                    .subscribe(
                        data=>{
                            let ap:number;
                            if(data.success == true || data.success == 'true'){
                                ap = parseInt(data.data.ap_balance);
                                if(ap < this.nominal){
                                    loading.dismiss();
                                    this.showAlert('Info', "Maaf AP anda tidak mencukupi.");
                                }
                                else{
                                    this.market.checkEmail(this.dest_email)
                                    .map(res=>res.text())
                                    .subscribe(
                                        data=>{
                                            console.log(data);
                                            if(data == "notexist"){
                                                loading.dismiss();
                                                this.showAlert("Info:", "Email tujuhan belum terdaftar, periksa kembali.");
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
                                                loading.dismiss();
                                                let confirm = this.alertCtrl.create({
                                                title: 'Konfirmasi',
                                                message: 'Apakah anda akan melakukan transfer AP sebesar '+this.nominal+' AP kepada '+dest_name+' ?',
                                                buttons: [
                                                    {
                                                        text: 'Batal',
                                                        handler: () => {
                                                            console.log('Disagree clicked');
                                                        }
                                                    },
                                                    {
                                                        text: 'Ya',
                                                        handler: () => {
                                                            let loading = this.loading('Proses transfer...');
                                                            loading.present();
                                                            let params = {
                                                                email: this.dest_email,
                                                                costumer_id: window.localStorage.getItem('id_user'),
                                                                price: this.nominal,
                                                                type: 'transfer',
                                                                deposite_id: '-'
                                                            };
                                                            this.market.useAPForProduct(params)
                                                            .map(res => res.json())
                                                            .subscribe(
                                                                data => {
                                                                    if(data.success == true || data.success == 'true'){
                                                                        loading.dismiss();
                                                                        this.showAlert('Berhasil', 'Transfer AP Berhasil.');
                                                                        this.navCtrl.pop();
                                                                    }
                                                                    else{
                                                                        loading.dismiss();
                                                                        this.showAlert('Info', 'Terjadi kesalahan, coba lagi.');
                                                                    }
                                                                },
                                                                onerror => {
                                                                    loading.dismiss();
                                                                    this.showAlert('Error', 'Terjadi kesalahan, coba lagi.');
                                                                }
                                                            );
                                                        }
                                                    }
                                                ]
                                                });
                                                confirm.present();
                                            }
                                        },
                                        onerror=>{
                                            loading.dismiss();
                                            this.showAlert("Error:", "Something went wrong. Try again !");
                                        }
                                    );

                                    
                                    }
                                }
                                else{
                                    loading.dismiss();
                                    this.showAlert('Info', 'Terjadi kesalahan, coba lagi.');
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

}