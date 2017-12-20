import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {BillingService} from '../../../providers/billing-service';


@Component({
  selector: 'page-pln',
  templateUrl: 'pascabayar-summary.html',
  providers: [BillingService]
})
export class PascabayarSummary {

    //public customer_data:any;
    public jenis:any;
    public id_cust:any;
    public customer_name:any;
    public tanggal;
    public tagihan;
    public noref;
    public reftagihan;
    public adminca;
    public total;
    public pesan;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public billing: BillingService,)
    {
        let res:any = this.navParams.get('data');

        this.jenis = res[1];
        this.id_cust = res[2];     
        this.customer_name=res[3];
        this.tanggal = res[4];
        this.tagihan = res[5];
        this.adminca = res[6];
        this.noref = res[7];
        this.reftagihan = res[8];
        this.total = res[9];
        this.pesan = res[10];
    }

    public goHome(){
        this.navCtrl.popToRoot();
    }

}    