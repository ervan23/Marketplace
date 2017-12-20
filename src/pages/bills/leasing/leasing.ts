import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import {BillingService} from '../../../providers/billing-service';
import { LeasingConfirm } from './leasing-confirm';

@Component({
  selector: 'page-pascabayar',
  templateUrl: 'leasing.html',
  providers:[BillingService]
})
export class LeasingPage {

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
    this.billing.cekLeasingBillingInfo(this.customer_id, this.jenis_tagihan)
    .map(res=>res.text().split(';'))
    .subscribe(
      data=>{
        console.log(data);
        if(data[0].toUpperCase() == "$C"){
            if(data.length >= 15){                
                let profileModal = this.modalCtrl.create(LeasingConfirm, { customer_data: data, type: this.jenis_tagihan, id_cust: this.customer_id });
                this.customer_id = "";
                this.jenis_tagihan = "";
                profileModal.present();
            }
            else{                
                this.showAlert("Error", data[data.length - 2]);
            }
        }
        else if(data[0].toUpperCase() == "$D"){
          if(data.length >= 15){
                let profileModal = this.modalCtrl.create(LeasingConfirm, { customer_data: data, type: this.jenis_tagihan, id_cust: this.customer_id });
                this.customer_id = "";
                this.jenis_tagihan = "";
                profileModal.present();
            }
            else{                
                this.showAlert("Error", data[data.length - 2]);
            }
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

      this.billing.getBillingType('leasing')
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
