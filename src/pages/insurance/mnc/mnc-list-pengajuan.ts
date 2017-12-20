import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { InsuranceService } from '../../../providers/insurance-service';

@Component({
  selector: 'page-bfi',
  templateUrl: 'mnc-list-pengajuan.html',
  providers: [InsuranceService]
})
export class MncListPengajuan {

  public listPengajuan:any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public insurance: InsuranceService,
    public alertCtrl:AlertController
  ) {
    this.listPengajuan = this.navParams.get('list_pengajuan');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MncListPengajuan');
  }

  getStatus(status:any){
    let s:number = parseInt(status);
    let text:string;
    switch(s){
        case 1:
            text = 'Pengajuan';
            break;
        case 2:
            text = 'Diterima';
            break;
        case 3:
            text = 'Selesai';
            break;
        case 4:
            text = 'Ditolak';
            break;
    }
    return text;
  }

  dateFormat(date){
    let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let mounths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let d = new Date(date);
    return days[d.getDay()]+", "+d.getDate()+" "+mounths[d.getMonth()]+" "+d.getFullYear();
  }

  private showAlert(title:string, message:string){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }

}
