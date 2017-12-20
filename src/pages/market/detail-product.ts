import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import {MarketService} from '../../providers/market-service';
import { SMS, SmsOptions, SmsOptionsAndroid } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';


@Component({
  selector: 'page-products',
  templateUrl: 'detail-product.html',
  providers: [MarketService, SMS, CallNumber]
})
export class DetailProductPage {
  public product:any = {};
  public other_products:any = {};
  public is_other_loaded:boolean = false;
  public item_range:number = 0;
  public title:string;
  public phone_number:string;

  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams, 
      public market: MarketService, 
      public loadingCtrl:LoadingController,
      public sms: SMS,
      public call: CallNumber,
      public alertCtrl: AlertController
    ) {
      this.product = this.navParams.get('detail');
      this.title = this.product.name;
      this.phone_number = this.product.store.phone;
      this.getOtherProduct(this.product.category.id);
  }

  public loading(content:string){
    let loader = this.loadingCtrl.create({
      content: content
    });

    return loader;
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

  sendSMS(){
    this.sms.send(this.phone_number, '', {
      android: "INTENT"
    }).then(
      data=>{},
      onerror=>{
        //this.showAlert('Info', 'Failed to send sms.');
      }
    ).catch(
      onerror=>{
        //this.showAlert('Info', 'Failed to send sms.');
      }
    );
  }

  callOwner(){
    this.call.callNumber(this.phone_number, true)
    .then(
      onerror=>{
        //this.showAlert('Info', 'Failed to open dialer.');
      }
    )
    .catch(
      ()=>{
        //this.showAlert('Info', 'Failed to open dialer.');
      }
    );
  }

  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
      items.push(i);
    }
    return items;
  }

  getOtherProduct(category_id){
    this.market.getProducts(category_id)
    .map(res=>res.json())
    .subscribe(
      data=>{
        if(data.data.length > 0){
          this.is_other_loaded = true;
          this.item_range = data.data.length > 3 ? 3:data.data.length;
          this.other_products = data.data;
        }
        else{
          console.log(data);
        }
      },
      onerror=>{

      }
    );
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

  private showAlert(title:string, message:string){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}
