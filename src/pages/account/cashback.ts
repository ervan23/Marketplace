import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'cashback.html'
})
export class Cashback {

    history:any = [];
    balance:any;

    constructor(
        public navCtrl: NavController,
        public navParam: NavParams,
        public viewCtrl: ViewController
    ){
        
    }

  dismiss(){
      this.viewCtrl.dismiss();
  }

}