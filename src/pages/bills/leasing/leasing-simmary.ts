import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {BillingService} from '../../../providers/billing-service';


@Component({
  selector: 'page-pln',
  templateUrl: 'leasing-simmary.html',
  providers: [BillingService]
})
export class LeasingSummary {

    //public customer_data:any;
    public jenis:any;
    public id_cust:any;
    public no_kontrak;
    public nama:any;
    public nopol;
    public cicilan_ke;
    public jatuh_tempo;
    public tagihan;
    public admin;
    public total;
    public no_pengesahan;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public billing: BillingService,)
    {
        let res:any = this.navParams.get('data');
        this.id_cust = this.navParams.get('cust_id');

        this.jenis = res[1];
        this.no_kontrak=res[2];
        this.nama = res[3];
        this.nopol = res[4];
        this.cicilan_ke = res[5];
        this.jatuh_tempo = res[6];
        this.tagihan = res[7];
        this.admin = res[8];
        this.total = res[9];        
        this.no_pengesahan = res[10];
    }

    public goHome(){
        this.navCtrl.popToRoot();
    }

}    