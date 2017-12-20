import { Slides, Events } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, AlertController, ActionSheetController } from 'ionic-angular';
import {MarketService} from '../../providers/market-service';
import {ProductPage} from './products';
import {MyShop} from './my-shop';
import {RegisterShopPage} from './register-shop';
import {TransferAP} from './transfer-ap';
import {HistoryAP} from './history-ap';

/*
  Generated class for the Market page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-market',
  templateUrl: 'market.html',
  providers: [MarketService]
})
export class MarketPage {
  @ViewChild(Slides) slides: Slides;
  public category:any;
  public segment_view:any = "member";
  public is_loggedin:boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public market: MarketService, 
    public loadingCtrl:LoadingController,
    public alertCtrl:AlertController,
    public actionSheetCtrl:ActionSheetController
  ) {
    let log = window.localStorage.getItem('id_user');
    if(log != null || log != ''){
      this.is_loggedin = true;
    }
    this.init();
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

  public init(){
    let loading = this.loading("Loading...");
    loading.present();
    this.market.getCategory()
    .map(res => res.json())
    .subscribe(
      data => {
        loading.dismiss();
        this.category = data.data;
      },
      err=>{
        console.log(err);
        loading.dismiss();
        this.showAlert('Info', 'Terjadi kesalahan, coba lagi.');
        this.navCtrl.pop();
      });
  }

  openProducts(id, title){
    let loading = this.loading("Loading...");
    loading.present();
    this.market.getProducts(id)
      .map(res => res.json())
      .subscribe(
        data => {
          let prod = data.data;
          loading.dismiss();
          if(data.success == true){
            if(prod.length > 0){
              this.navCtrl.push(ProductPage, {products: prod, title: title});
            }
            else{
              this.showAlert('Info', 'Belum ada produk untuk kategori ini.');
            }
          }
          else{
            this.showAlert('Error', 'Terjadi kesalahan, coba lagi atau kontak Dxplor.');
          }
        },
        err=>{
          loading.dismiss();
          this.showAlert('Error', 'Terjadi kesalahan, coba beberapa saat lagi.');
          console.log(err);
        }
    );
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Menu:',
      buttons: [
        {
          text: 'My Shop',
          icon: 'home',
          handler: () => {
            let loading = this.loading('Please wait...');
            loading.present();
            let id = window.localStorage.getItem('id_user');
            console.log(id);
            if(id == null || id == '' || id == " "){
              loading.dismiss();
              this.showAlert('Info', 'Anda belum login.');
              return false;
            }
            else{
              this.market.checkUserHaveShop(id)
              .map(res => res.json())
              .subscribe(
                data => {
                  let res:any = data.data;
                  if(res.length > 0){
                    window.localStorage.setItem('id_shop', res[0].id);
                    this.market.getProductByShop(window.localStorage.getItem('id_shop'))
                    .map(res=>res.json())
                    .subscribe(
                      data=>{
                        let res:any = data.data;
                        console.log(res);
                        loading.dismiss();
                        this.navCtrl.push(MyShop, {my_product: res, from_away: true});
                      },
                      onerror=>{
                        loading.dismiss();
                        this.showAlert('Error', 'Terjadi kesalahan, cobalagi atau hubungi Dxplor.');
                      }
                    );
                  }
                  else{
                    loading.dismiss();
                    let alert = this.alertCtrl.create({
                      title: 'Info',
                      subTitle: 'Anda belum memiliki toko.',
                      buttons: [
                        {
                          text: 'Close'
                        },
                        {
                          text: 'Daftar',
                          handler: () => {
                            this.navCtrl.push(RegisterShopPage);
                          }
                        }
                      ]
                    });
                    alert.present();
                  }
                },
                onerror => {
                  loading.dismiss();
                  this.showAlert('Error', 'Terjadi kesalahan, cobalagi atau hubungi Dxplor.');
                }
              );
            }            
          }
        }
      ]
    });
    actionSheet.present();
  }

}
