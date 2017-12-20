import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import {PlnPage} from './pln/pln';
import {PlnTokenPage} from './pln-token/pln-token';
import {PamPage} from './pam/pam';
import {BpjsPage} from './bpjs/bpjs';
import {TelkomPage} from './telkom/telkom';
import {SpeedyPage} from './speedy/speedy';
import {PascabayarPage} from './pascabayar/pascabayar';
import {TvPage} from './tv/tv';
import {LeasingPage} from './leasing/leasing';

@Component({
  selector: 'page-bills',
  templateUrl: 'bills.html'
})
export class BillsPage {

  page = {
    pln: PlnPage,
    plnToken: PlnTokenPage,
    pam: PamPage,
    bpjs: BpjsPage,
    telkom: TelkomPage,
    speedy: SpeedyPage,
    pascabayar: PascabayarPage,
    tv: TvPage,
    leasing: LeasingPage
  };

  img_apk = {
    banner_bpjs: 'assets/images/banner_bpjs.png',
    banner_pam: 'assets/images/banner_pam.png',
    banner_pln: 'assets/images/banner_pln.png',
    banner_pln_token: 'assets/images/banner_pln_token.png',
    banner_speedy: 'assets/images/banner_speedy.png',
    banner_telkom: 'assets/images/banner_telkom.png',
    pascabayar: 'assets/images/pascabayar.jpg',
    tv: 'assets/images/tv berlanggan ppob.jpg',
    leasing: 'assets/images/angsuran.jpg',
    game: 'assets/images/game ppob.jpg'
  };
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad BillsPage');
  }

  public goToPage(page:Component):void{
    this.navCtrl.push(page);
  }

  underConstruction(){
    let alert = this.alertCtrl.create({
      title: 'Info',
      subTitle: 'Under Construction..!',
      buttons: ['OK']
    });
    alert.present();
  }

}
