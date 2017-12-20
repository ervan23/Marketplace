import { Component } from '@angular/core';
import { Events, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import {MobileService} from '../../providers/mobile-service';

@Component({
  selector: 'page-pulsa',
  templateUrl: 'pulsa.html',
  providers: [MobileService]
})
export class PulsaPage{
  public op_logo:any;
  public op_code:any;
  public phone:any;
  public op_priceList:any;
  public op_price:any = 0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mobile: MobileService,
    public alertCtrl:AlertController,
    public loadingCtrl:LoadingController,
    public toastCtrl:ToastController,
    public ev:Events
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PulsaPage');
  }

  inputHandle(input:any){
    var code:string = input.target.value;
    if(code.length >= 4){
      code = code.substring(0,4);
      this.mobile.getOperator(code)
      .map(res=>res.text().split(','))
      .subscribe(
        data=>{
          this.op_code = data[0];
          this.op_logo = data[1];
        },
        onerror=>{this.presentToast("Failed to get operator data, try re-enter number", 3500, 'bottom')},
        ()=>{
          this.mobile.getOperatorPrice(this.op_code)
          .map(res=>res.json())
          .subscribe(
            data=>{
              this.op_priceList = data;
            },
            onerror=>{this.presentToast("Failed to get operator data, try re-enter number", 3500, 'bottom')},
            ()=>{}
          );
        }
      );
    }    
  }

  topUp(){
    let loading = this.loading("Please wait...!");
    loading.present();
    this.mobile.getBalance(window.localStorage.getItem('id_user'))
    .map(res=>res.text())
    .subscribe(
      data=>{
        loading.dismiss();
        console.log(data);
        if(parseInt(data) < this.op_price){
          this.showAlert("Info", "You dont have enough balance, please topup first");
        }
        else{
          let loading = this.loading("Top Up Process...!");
          loading.present();
          this.mobile.topUpPulsa(this.phone, this.op_code, this.op_price, window.localStorage.getItem('id_user'))
          .map(res=>res.text())
          .subscribe(
            data=>{ 
              console.log(data);
              let stat:string = data;
              if(stat.toUpperCase() == "OK"){
                this.ev.publish("balance:reduce", this.op_price);
                this.presentToast("Top up being processed", 4000, 'bottom');
                this.navCtrl.pop();
              }
              else{
                this.presentToast("Error occurred while top up proccess, try again", 5000, 'bottom')
              }
            },
            onerror=>{ console.log(onerror) },
            ()=>{ loading.dismiss() }
          );
        }
      },
      onerror=>{
        this.showAlert("Error", "Something went wrong, try again !")
        loading.dismiss();
      }
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