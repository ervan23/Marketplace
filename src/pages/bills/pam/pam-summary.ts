import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-pln',
  templateUrl: 'pam-summary.html'
})
export class PamSummary {

    public customer_data:string;
    public idpelanggan:any;
    public namapelanggan:any;
    public tagihanbulan:any;
    public tgllunas:any;
    public totalharga:any;
    public noinvoice:any;
    public refid:any;
    public hargaadmin:any;
    public tagihan:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl:AlertController,
    public viewCtrl:ViewController,)
    {        
        this.customer_data = this.navParams.get('customer_data');
        let res = this.customer_data;        
        this.showAlert('Info', 'Payment success, please note the ref id or capture summary!');
        this.idpelanggan=res[1];
        this.namapelanggan=res[2];
        this.tagihanbulan=res[5];
        this.tgllunas = res[10].replace("%",":");
        this.tgllunas = this.tgllunas.replace("%",":");
        this.totalharga=res[7];
        this.noinvoice=res[14];
        this.refid=res[6];
        this.hargaadmin=this.navParams.get('admin');
        this.tagihan=res[3];
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