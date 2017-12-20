import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import {MarketService} from '../../providers/market-service';
import {DetailProductPage} from './detail-product';


@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
  providers: [MarketService]
})
export class ProductPage {
  public products = [];
  public title:string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public market: MarketService, 
    public loadingCtrl:LoadingController,
    public alertCtrl: AlertController
  ) {
      this.title = this.navParams.get('title');
      this.products = this.navParams.get('products');
  }

  public loading(content:string){
    let loader = this.loadingCtrl.create({
      content: content
    });

    return loader;
  }

  private showAlert(title:string, message:string){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  public konversiRupiah(bilangan:number){
    var	number_string = bilangan.toString(),
      sisa 	= number_string.length % 3,
      rupiah 	= number_string.substr(0, sisa),
      ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
        
    if (ribuan) {
      let separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }

    // Cetak hasil
    return rupiah;
  }

  openProduct(id){
    let loading  = this.loading('Mohon tunggu...!');
    loading.present();

    this.market.getDetailProduct(id)
    .map(res => res.json())
    .subscribe(
      data => {
        loading.dismiss();
        if(data.success == true || data.success == 'true'){
          this.navCtrl.push(DetailProductPage, {detail: data.data[0]});
        }
        else{
          this.showAlert('Error', 'Detail produk tidak ditemukan.');
        }
      },
      onerror => {
        loading.dismiss();
        this.showAlert('Error', 'Terjadi kesalahan, cobalagi atau hubungi Dxplor.');
      }
    );
  }

  getProvince(v:any){
    return v.province.name;
  }

  isUsingAP(v){
    return parseInt(v.hari) > 0 ? true:false;
  }

  isRecomended(v){
    return false;//parseInt(v.costumer.rkm_status) == 1 ? true:false;
  }

  getCustomer(v:any){
    return v.store.name;
  }

  getFirstNameProduct(name: string):string{
    let n = name.split(" ");
    return n[0];
  }

  getSecondNameProduct(name: string):string{
    let n = name.split(" ");
    return n.length > 1 ? n[1]:"";
  }

  setFirstLine(name: string):string{
    return this.getFirstNameProduct(name)+" "+this.getSecondNameProduct(name);
  }

  getAlmostFullNameProduct(name: string):string{
    let n = name.split(" ");
    let r:string = "";
    if(n.length > 2){
      n.splice(0, 2);
      r =  n.join(" ");
      if(r.length > 17){
        r = n.join(" ").substr(0, 17)+"...";
      }
      else{
        r = n.join(" ")
      }
    }

    return r;    
  }

}
