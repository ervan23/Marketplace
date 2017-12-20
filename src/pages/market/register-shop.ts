import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import {MarketService} from '../../providers/market-service';
import {DetailProductPage} from './detail-product';


@Component({
  selector: 'page-products',
  templateUrl: 'register-shop.html',
  providers: [MarketService]
})
export class RegisterShopPage {
  
  public name:any = null;
  public owner:any = null;
  public type:any = 'regular';
  public phone:any = null;
  public address:any = null;
  public id:any = null;
  public status:any = 1;
  public editMode:boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public market: MarketService, 
    public loadingCtrl:LoadingController,
    public alertCtrl: AlertController
  ) {
      let edit = navParams.get('edit_mode');
      if(edit == true){
        let data = navParams.get('data');
        this.editMode = true;
        this.address = data.address;
        this.name = data.name;
        this.owner = data.owner;
        this.phone = data.phone;
        this.id = data.id;
      }
  }

  saveShop(){
      if(this.name == null || this.name == ''){
        this.showAlert('Info', 'Nama toko harus diisi.');
        return false;
      }
      if(this.owner == null || this.owner == ''){
        this.showAlert('Info', 'Pemilik toko harus diisi.');
        return false;
      }
      if(this.phone == null || this.phone == ''){
        this.showAlert('Info', 'Hp toko harus diisi.');
        return false;
      }
      if(this.address == null || this.address == ''){
        this.showAlert('Info', 'Alamat toko harus diisi.');
        return false;
      }
      let loading = this.loading('Sedang diproses...');
      loading.present();
      let params = {};
      if(this.editMode){
        params = {
          name: this.name,
          owner: this.owner,
          costumer_id: window.localStorage.getItem('id_user'),
          type: this.type,
          phone: this.phone,
          address: this.address,
          status: this.status,
          id: this.id
        };
      }
      else{
        params = {
          name: this.name,
          owner: this.owner,
          costumer_id: window.localStorage.getItem('id_user'),
          type: this.type,
          phone: this.phone,
          address: this.address,
          status: this.status
        };
      }      

      this.market.saveShop(params)
      .map(res=>res.json())
      .subscribe(
          data=>{
              loading.dismiss();
              if(data.success == true || data.success == 'true'){
                window.localStorage.setItem('id_shop', data.data[0].id);
                this.navCtrl.pop();
              }
              else{
                  this.showAlert('Error', 'Terjadi kesalahan saat melakukan penyimpanan, coba lagi.');
              }
          },
          onerror=>{
            loading.dismiss();
            this.showAlert('Error', 'Terjadi kesalahan, coba lagi.');
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
