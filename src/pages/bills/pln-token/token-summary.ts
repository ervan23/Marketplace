import { Component } from '@angular/core';
import { Events, NavController, NavParams, AlertController, LoadingController, ViewController } from 'ionic-angular';
import {BillingService} from '../../../providers/billing-service';


@Component({
  selector: 'page-pln',
  templateUrl: 'token-summary.html',
  providers: [BillingService]
})
export class TokenSummary {

    public customer_data:any;
    public id_customer:any;
    public no_meter:any;
    public customer_name:any;
    public daya;
    public harga;
    public noref;
    public adminca;
    public materai;
    public ppn;
    public ppj;
    public angsuran;
    public rptoken;
    public kwh;
    public token;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public billing: BillingService,
        public alertCtrl:AlertController,
        public viewCtrl:ViewController,
        public ev: Events,
        public loadingCtrl:LoadingController)
    {
        let data:string = this.navParams.get('data');
        let res = data.split(';');
        var res2 = res[1].split("!");

        this.id_customer = res2[1];        
        this.no_meter = res2[0];
        this.customer_name=res[2];
        this.daya=res[3];
        this.harga=res[15];
        this.noref=res[4];
        this.adminca=this.navParams.get('admin');
        this.materai=res[8];        
        this.ppn=res[9];        
        this.ppj=res[10];
        this.angsuran=res[11];
        this.rptoken=res[12];
        this.kwh=res[13];        
        this.token=res[5];
    }

    public goHome(){
        this.navCtrl.popToRoot();
    }

}    