import { Component } from '@angular/core';
import { Events, NavController, NavParams, LoadingController, AlertController, ActionSheetController } from 'ionic-angular';
import {MarketService} from '../../providers/market-service';
import {AddProduct} from './add-product';
import {RegisterShopPage} from './register-shop';

@Component({
  selector: 'my-shop',
  templateUrl: 'my-shop.html',
  providers: [MarketService]
})
export class MyShop {
  public my_product:any;
  public category:any = [];
  public province:any = [];
  public id_deposite:any = null;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public market: MarketService, 
    public loadingCtrl:LoadingController,
    public alertCtrl:AlertController,
    public actionSheetCtrl: ActionSheetController,
    public ev: Events
  ) {
    let product:any = navParams.get('my_product');
    if(product.length <= 0){
        let alert = this.alertCtrl.create({
            title: 'Info',
            subTitle: 'Anda belum memiliki produk.',
            buttons: [
                {
                  text: 'Close'
                },
                {
                  text: 'Tambah Produk',
                  handler: () => {
                    this.openAddShop();
                  }
                }
            ]
        });
        alert.present();
    }
    else{
        this.my_product = product;
    }

    ev.subscribe("product:update", 
      update => {
        this.market.getProductByShop(window.localStorage.getItem('id_shop'))
        .map(res=>res.json())
        .subscribe(
          data=>{
            this.my_product = data.data;
            console.log(this.my_product);
          },
          onerror=>{
            this.showAlert('Error', 'Terjadi kesalahan, cobalagi atau hubungi Dxplor.');
          }
        );
      }
    );
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
    return rupiah;
  }

  openMyshopMenu(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'My shop:',
      buttons: [
        {
          text: 'Edit Shop',
          icon: 'create',
          handler: () => {
            let loading = this.loading('Mohon tunggu...');
            loading.present();
            this.market.getShopByCustomer(window.localStorage.getItem('id_user'))
            .map(res=>res.json())
            .subscribe(
              data => {
                loading.dismiss();
                this.navCtrl.push(RegisterShopPage, {edit_mode: true, data: data.data[0]});
              },
              onerror => {
                loading.dismiss();
                this.showAlert('Error', 'Terjadi kesalahan, coba lagi.');
              }
            );
          }
        },
        {
          text: 'Delete Shop',
          icon: 'trash',
          handler: () => {
            let alert = this.alertCtrl.create({
                title: 'Konfirmasi',
                subTitle: 'Anda ingin menghapus toko ?',
                buttons: [
                    {
                      text: 'Tidak'
                    },
                    {
                      text: 'Iya',
                      handler: () => {
                        let loading = this.loading('Please wait...');
                        loading.present();
                        this.market.deleteStore(window.localStorage.getItem('id_shop'))
                        .map(res => res.json())
                        .subscribe(
                          data => {
                            loading.dismiss();
                            if(data.success == 'true' || data.success == true){
                              this.showAlert('Berhasil', 'Berhasil menghapus toko.');
                              this.navCtrl.pop();
                            }
                            else{
                              this.showAlert('Info', 'Gagal menghapus toko.');
                            }
                          },
                          onerror => {
                            loading.dismiss();
                            this.showAlert('Error', 'Terjadi kesalahan, coba lagi.');
                          }
                        );
                      }
                    }
                ]
            });
            alert.present();            
          }
        }
      ]
    });
    actionSheet.present();
  }

  public presentActionSheet(v) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Menu:',
      buttons: [
        {
          text: 'Edit',
          icon: 'create',
          handler: () => {
            this.openEditShop(v);
          }
        },        
        {
          text: 'Hapus',
          icon: 'trash',
          handler: () => {
            let alert = this.alertCtrl.create({
                title: 'Konfirmasi',
                subTitle: 'Anda ingin menghapus '+v.name+' ?',
                buttons: [
                    {
                      text: 'Tidak'
                    },
                    {
                      text: 'Iya',
                      handler: () => {
                        let loading = this.loading('Please wait...');
                        loading.present();
                        let param:any = {product_id:v.id};
                        this.market.deleteProduct(param)
                        .map(res=>res.json())
                        .subscribe(
                          data=>{
                            if(data.success == false){
                              this.showAlert('Error', 'Gagal menghapus produk.!');
                            }
                            else{
                              this.market.getMyProduct(window.localStorage.getItem('id_user'))
                              .map(res=>res.json())
                              .subscribe(
                                data=>{
                                  loading.dismiss();
                                  this.showAlert('Berhasil', 'Data berhasil di hapus.');
                                  if(data.success == true || data.success == 'true'){
                                    this.my_product = data.data;
                                  }
                                  else{
                                    this.navCtrl.pop();
                                  }
                                },
                                onerror=>{
                                  loading.dismiss();
                                  this.showAlert('Error', 'Gagal menghapus produk.!');
                                }
                              );
                            }
                          },
                          onerror=>{
                            loading.dismiss();
                            this.showAlert('Error', 'Gagal menghapus produk.!');
                          }
                        );
                      }
                    }
                ]
            });
            alert.present();
          }
        }
      ]
    });
    actionSheet.present();
  }

  useAPBalance(id_deposite:any, charge:number, product_id:any, ap_desc:any){
    let loading = this.loading('Sedang diproses...');
    loading.present();
    let ap:number;
    this.market.getAPBalance(window.localStorage.getItem('id_user'))
    .map(res => res.json())
    .subscribe(
      data => {
        if(data.success == true || data.success == 'true'){
          ap = parseInt(data.data.ap_balance);
          if(ap < charge){
            loading.dismiss();
            this.showAlert('Info', "Maaf AP anda tidak mencukupi.");
          }
          else{
            let params = {
              deposite_id: id_deposite,
              costumer_id: window.localStorage.getItem('id_user'),
              product_id: product_id,
              type: 'deposite'
            };

            this.market.useAPForProduct(params)
            .map(res => res.json())
            .subscribe(
              data => {
                if(data.success == true || data.success == 'true'){
                  loading.dismiss();
                  this.showAlert('Berhasil', 'Produk anda berhasil dipasang dengan AP, dan akan menjadi prioritas untuk '+ap_desc+'.');
                }
                else{
                  loading.dismiss();
                  this.showAlert('Info', 'Terjadi kesalahan, coba lagi.');
                }
              },
              onerror => {
                loading.dismiss();
                this.showAlert('Error', 'Terjadi kesalahan, coba lagi.');
              }
            );
          }
        }
        else{
          loading.dismiss();
          this.showAlert('Info', 'Terjadi kesalahan, coba lagi.');
        }
      },
      onerror => {
        loading.dismiss();
        this.showAlert('Error', 'Terjadi kesalahan, coba lagi.');
      }
    );    
  }

  openAddShop(){
    let loading = this.loading('Please wait...');
    loading.present();
    this.market.getProvince()
    .map(res=>res.json())
    .subscribe(
      data=>{
        if(data.success == true){
          this.province = data.data;
          this.market.getCategory()
          .map(res=>res.json())
          .subscribe(
            data=>{
              if(data.success == true){
                loading.dismiss();
                this.category = data.data;             
                this.navCtrl.push(AddProduct, {category: this.category, province: this.province, edit: false});
              }
              else{
                loading.dismiss();
              this.showAlert('Error', 'Terjadi kesalah, kontak Dxplor.');
              }        
            },
            onerror=>{
              loading.dismiss();
              this.showAlert('Error', 'Terjadi kesalah, coba lagi.');
            }
          );
        }
        else{
          loading.dismiss();
        this.showAlert('Error', 'Terjadi kesalah, kontak Dxplor.');
        }        
      },
      onerror=>{
        loading.dismiss();
        this.showAlert('Error', 'Terjadi kesalah, coba lagi.');
      }
    );
  }

  openEditShop(v){
    let loading = this.loading('Please wait...');
    loading.present();
    this.market.getProvince()
    .map(res=>res.json())
    .subscribe(
      data=>{
        if(data.success == true){
          this.province = data.data;
          this.market.getCategory()
          .map(res=>res.json())
          .subscribe(
            data=>{
              if(data.success == true){
                loading.dismiss();
                this.category = data.data;             
                this.navCtrl.push(AddProduct, {category: this.category, province: this.province, edit: true, product: v});
              }
              else{
                loading.dismiss();
              this.showAlert('Error', 'Terjadi kesalah, kontak Dxplor.');
              }        
            },
            onerror=>{
              loading.dismiss();
              this.showAlert('Error', 'Terjadi kesalah, coba lagi.');
            }
          );
        }
        else{
          loading.dismiss();
        this.showAlert('Error', 'Terjadi kesalah, kontak Dxplor.');
        }        
      },
      onerror=>{
        loading.dismiss();
        this.showAlert('Error', 'Terjadi kesalah, coba lagi.');
      }
    );
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

}
