import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {BillingService} from '../../../providers/billing-service';


@Component({
  selector: 'page-pln',
  templateUrl: 'tv-summary.html',
  providers: [BillingService]
})
export class TvSummary {

    //public customer_data:any;
    public jenis:any;
    public id_cust:any;
    public nama:any;
    public periode_tayang:any;
    public tagihan;
    public admin;
    public total;
    public tanggal_bayar;
    public no_ref;    
    public pesan;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public billing: BillingService,)
    {
        let res:any = this.navParams.get('data');
        this.jenis = this.navParams.get('type');

        if(this.jenis.toUpperCase() == 'TELKOMVISION'){
            this.id_cust = this.navParams.get('id_cust');  
            this.nama = res[2];          
            this.periode_tayang = res[10];
            this.tagihan = res[4];
            this.admin = res[5];
            this.total = res[7];            
            this.tanggal_bayar = res[3];          
            this.no_ref = res[6];          
            this.pesan = "Bukti pembayran ini adalah SAH, simpan tanda terima ini sebagai bukti transaksi. Terima kasih";
        }
        else{
            this.jenis=res[1];
            this.id_cust = res[2];  
            this.nama = res[3];          
            this.periode_tayang = res[4];
            this.tagihan = res[5];
            this.admin = res[6];
            this.total = res[7];            
            this.tanggal_bayar = res[8];          
            this.no_ref = res[9];          
            this.pesan = res[10];
        }        
    }

    public goHome(){
        this.navCtrl.popToRoot();
    }

}    