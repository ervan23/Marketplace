import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { InsuranceService } from '../../../providers/insurance-service';
import { MncLayananPage } from './mnc-layanan';
import { MncPengajuanPage } from './mnc-pengajuan';
import { MncListPengajuan } from './mnc-list-pengajuan';

@Component({
  selector: 'page-mnc',
  templateUrl: 'mnc.html',
  providers: [InsuranceService]
})
export class MncLifePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public insurance: InsuranceService
  ) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InsurancePage');
  }

  private showAlert(title:string, message:string){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            //this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

  openLayananMnc(){
    this.modalCtrl.create(MncLayananPage).present();
  }

  openPengajuan(){
    this.navCtrl.push(MncPengajuanPage);
  }

  openListPengajuan(){
    let loading = this.loading('Please wait...');
    loading.present();
    let id_user = window.localStorage.getItem('id_user');
    if(id_user == null || id_user == undefined){
      loading.dismiss();
      this.showAlert('Error', 'Login first..!');
    }
    else{
      this.insurance.getMNCListPengajuan(id_user)
      .map(res=>res.json())
      .subscribe(
        data=>{
          loading.dismiss();
          console.log(data);
          if(data.error == true){
            this.showAlert('Info', data.message);
          }
          else if(data.error == false){
            this.navCtrl.push(MncListPengajuan, {list_pengajuan: data.data});
          }
          else{
            this.showAlert('Info', 'Terjadi kesalahan, coba lagi atau hubungi Dxplor.');
          }
        },
        onerror=>{
          loading.dismiss();
          console.log(onerror);
        }
      );
    }
    
  }
  
  private loading(content:string){
    let loader = this.loadingCtrl.create({
      content: content
    });

    return loader;
  }

}
