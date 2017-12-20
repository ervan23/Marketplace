import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PulsaPage } from './pulsa';
import { DataPage } from './data';

@Component({
  selector: 'page-mobile',
  templateUrl: 'mobile.html'
})
export class MobilePage {

  mobile_page = {
    pulsa: PulsaPage,
    data: DataPage
  };
  img_apk = {
    mobile_data: 'assets/images/mobile_data.png',
    mobile_pulsa: 'assets/images/mobile_pulsa.png'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MobilePage');
  }
  goToPage(page:Component){
    this.navCtrl.push(page);
  }

}