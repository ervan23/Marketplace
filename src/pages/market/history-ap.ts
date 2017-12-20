import { Component } from '@angular/core';
import { Events, NavController, NavParams, ViewController } from 'ionic-angular';
import { MarketService } from '../../providers/market-service';

@Component({
  templateUrl: 'history-ap.html',
  providers: [MarketService]
})
export class HistoryAP {

    history:any = [];
    balance:any;

    constructor(
        public navCtrl: NavController,
        public navParam: NavParams,
        public viewCtrl: ViewController,
        public market:MarketService,
        public ev: Events
    ){
        this.history = this.navParam.get('data_history');
        this.market.getAPBalance(window.localStorage.getItem('id_user'))
        .map(res  => res.json())
        .subscribe(
            data => {
                this.balance = parseInt(data.data.ap_balance);
            }
        );
    }

  dismiss(){
      this.ev.publish("balance:reduce", 0);
      this.viewCtrl.dismiss();
  }

}