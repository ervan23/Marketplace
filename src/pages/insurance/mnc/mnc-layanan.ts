import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-mnc',
  templateUrl: 'mnc-layanan.html'
})
export class MncLayananPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InsurancePage');
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
