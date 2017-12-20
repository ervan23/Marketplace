import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-pln',
  templateUrl: 'bpjs-summary.html'
})
export class BpjsSummary {

    public customer_data:string;
    public idpelanggan:any;
    public namapelanggan:any;
    public totalharga:any;
    public noinvoice:any;
    public refid:any;

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
        this.totalharga=res[7];
        this.noinvoice=res[12];
        this.refid=res[6];
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