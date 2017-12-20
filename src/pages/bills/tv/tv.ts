import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import {BillingService} from '../../../providers/billing-service';
import { TvConfirm } from './tv-confirm';

@Component({
  selector: 'page-pascabayar',
  templateUrl: 'tv.html',
  providers:[BillingService]
})
export class TvPage {

  public customer_id:any = '';
  public tagihan:any = [];
  public jenis_tagihan:string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public billing: BillingService,
    public alertCtrl:AlertController,
    public modalCtrl:ModalController,
    public loadingCtrl:LoadingController) {
        this.getBillingType();
    }

  checkBilling(){
    if(this.customer_id == ''){
        this.showAlert('Info', 'Customer ID harus diisi.');
        return false;
    } 
    if(this.jenis_tagihan == ''){
        this.showAlert('Info', 'Pilih jenis tagihan Anda.');
        return false;
    } 
    let loading = this.loading("Collecting Information...");
    loading.present();
    this.billing.cekPascabayarBillingInfo(this.customer_id, this.jenis_tagihan)
    .map(res=>res.text().split(';'))
    .subscribe(
      data=>{
        console.log(data);
        if(data[0].toUpperCase() == "$C"){
          this.showAlert("Error", data[4]);
        }
        else if(data[0].toUpperCase() == "$D"){
          let profileModal = this.modalCtrl.create(TvConfirm, { customer_data: data, type:this.jenis_tagihan });          
          this.customer_id = "";
          this.jenis_tagihan = "";
          profileModal.present();
        }
      },
      onerror=>{},
      ()=>{loading.dismiss()}
    );
  }

  private getBillingType(){
      let loading = this.loading('Mohon tunggu...');
      loading.present();

      this.billing.getBillingType('tv')
      .map(res => res.json())
      .subscribe(
          data=>{
              loading.dismiss();
              if(data.success == true){
                this.tagihan = data.data;
              }
              else{
                this.showAlert('Info', 'Jenis tagihan gagal dimuat, Coba lagi...');
                this.navCtrl.pop();
              }
          },
          onerror=>{
              loading.dismiss();
              this.showAlert('Info', 'Terjadi kesalahan, Coba lagi...');
              this.navCtrl.pop();
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

  private loading(content:string){
    let loader = this.loadingCtrl.create({
      content: content
    });

    return loader;
  }

}
