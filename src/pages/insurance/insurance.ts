import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { BfiInsurancePage } from './bfi/bfi';
import { MncLifePage } from './mnc/mnc';

@Component({
  selector: 'page-insurance',
  templateUrl: 'insurance.html'
})
export class InsurancePage {

  mobile_page = {
    bfi: BfiInsurancePage,
    mnc: MncLifePage
  };
  img_apk = {
    bfi: 'assets/images/BFI_menu.jpg',
    mnc: 'assets/images/mnc_life.jpg',
    sinarmas: 'assets/images/sinarmas.jpg'
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
  ) {    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InsurancePage');
  }

  public showAlert(title:string, message:string){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    alert.present();
  }

  goToPage(page:Component){
    this.navCtrl.push(page);
  }

}
