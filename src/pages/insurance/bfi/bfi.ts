import { Component } from '@angular/core';
import { Camera, CameraOptions } from 'ionic-native';
import { NavController, NavParams, ActionSheetController, ModalController, AlertController } from 'ionic-angular';
import { BfiPengajuanPage } from './bfi-pengajuan';
import { BfiSimulasiPage } from './bfi-simulasi';
import { BfiListPengajuan } from './bfi-list-pengajuan';
import { InsuranceService } from '../../../providers/insurance-service';

@Component({
  selector: 'page-bfi',
  templateUrl: 'bfi.html',
  providers: [Camera, InsuranceService]
})
export class BfiInsurancePage {

  public id_user:any;
  public nama:any;
  public email:any;
  public hp1:any;
  public hp2:any;
  public alamat:any;
  public unit_jaminan:any;
  public pinjaman:any;
  public foto_ktp:any;
  public jangka_waktu:any;
  public referensi:any;
  public imageURL:any;
  public isImageSelected:boolean = false;

  constructor(
    public navCtrl: NavController,
    public camera: Camera,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public insurance: InsuranceService,
    public alertCtrl:AlertController
  ) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InsurancePage');
  }

  openSimulasi(){
    this.modalCtrl.create(BfiSimulasiPage).present();
  }

  openPengajuan(){
    this.navCtrl.push(BfiPengajuanPage);
  }

  openListPengajuan(){
    let id = window.localStorage.getItem('id_user');
    if(id == null || id == '' || id == undefined){
      this.showAlert('Info', 'Login first..!');
    }
    else{
      this.insurance.getInsuranceList(id)
      .map(res=>res.json())
      .subscribe(
        data=>{
          if(data.error == false){
            this.navCtrl.push(BfiListPengajuan, {list_pengajuan: data.data});
          }
          else{
            let alert = this.alertCtrl.create({
              title: 'Info',
              subTitle: data.message,
              buttons: [
                {
                  text: 'Close'
                },
                {
                  text: 'Pengajuan',
                  handler: () => {
                    this.openPengajuan();
                  }
                }
              ]
            });
            alert.present();
          }
        },
        onerror=>{
          this.showAlert('Error', 'Error when loading data, try again..!');
        }
      );
    }
    
  }

  private showAlert(title:string, message:string){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }

}
