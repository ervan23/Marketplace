import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-pln',
  templateUrl: 'speedy-summary.html'
})
export class SpeedySummary {

    public customer_data:string;
    public idpelanggan:any;
    public namapelanggan:any;
    public detailtagihan:any;
    public rptagihan:any;
    public standmeter:any;
    public harga:any;
    public tgllunas:any;
    public totaltagihan:any;
    public noinvoice:any;
    public refid:any;
    public hargaadmin:any;
    public totalharga:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl:AlertController,
    public viewCtrl:ViewController,)
    {        
        this.customer_data = this.navParams.get('customer_data');
        let res = this.customer_data;        
        this.showAlert('Info', 'Payment success, please note the ref id or capture summary!');
        this.idpelanggan=res[2];
        this.namapelanggan=res[3];
        this.detailtagihan=res[11];
        this.rptagihan=res[5];
        this.hargaadmin=res[6];
        this.totaltagihan=res[8];
        this.standmeter=res[8];
        this.harga=res[4];
        this.tgllunas=res[9];
        this.totalharga=res[10];
        this.noinvoice=res[14];
        this.refid=res[7];
    }

    
    private showAlert(title:string, message:string){
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

    public goHome(){
        this.navCtrl.popToRoot();
    }
}