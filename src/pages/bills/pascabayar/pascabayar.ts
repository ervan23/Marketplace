import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import {BillingService} from '../../../providers/billing-service';
import { PascabayarConfirm } from './pascabayar-confirm';

@Component({
  selector: 'page-pascabayar',
  templateUrl: 'pascabayar.html',
  providers:[BillingService]
})
export class PascabayarPage {

  public customer_id:string = null;
  public tagihan:any = [];
  public jenis_tagihan:string = null;

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
    if(this.customer_id == null){
        this.showAlert('Info', 'Customer ID harus diisi.');
        return false;
    } 
    if(this.jenis_tagihan == null){
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
          let profileModal = this.modalCtrl.create(PascabayarConfirm, { customer_data: data });
          this.customer_id = "";
          this.jenis_tagihan = "";
          profileModal.present();
        }
        else{
          this.showAlert("Info", 'Terjadi kesalahan, coba lagi.');
        }
      },
      onerror=>{},
      ()=>{loading.dismiss()}
    );
  }

  private getBillingType(){
      let loading = this.loading('Mohon tunggu...');
      loading.present();

      this.billing.getBillingType('telp')
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
