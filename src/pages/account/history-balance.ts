import { Component } from '@angular/core';
import { Events, NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

@Component({
  templateUrl: 'history-balance.html',
  providers: [AuthService]
})
export class HistoryBalance {

    history:any = [];
    balance:any;

    constructor(
        public navCtrl: NavController,
        public navParam: NavParams,
        public viewCtrl: ViewController,
        public auth:AuthService,
        public ev: Events
    ){
        this.history = this.navParam.get('data_history');
        this.auth.getBalance(window.localStorage.getItem('id_user'))
        .map(res  => res.text())
        .subscribe(
            data => {
                this.balance = data;
            }
        );
    }

  dismiss(){
      this.ev.publish("balance:reduce", 0);
      this.viewCtrl.dismiss();
  }

}