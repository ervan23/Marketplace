import { Component } from '@angular/core';
import { Camera, CameraOptions } from 'ionic-native';
import { NavController, NavParams, AlertController, LoadingController, ActionSheetController } from 'ionic-angular';
import { InsuranceService } from '../../../providers/insurance-service';

@Component({
  selector: 'page-bfi',
  templateUrl: 'bfi-pengajuan.html',
  providers: [Camera, InsuranceService]
})
export class BfiPengajuanPage {

  public id_user:any = "";
  public nama:any = "";
  public email:any = "";
  public hp1:any = "";
  public hp2:any = "";
  public alamat:any = "";
  public unit_jaminan:any = "";
  public pinjaman:any = "";
  public foto_ktp:any = "";
  public jangka_waktu:any = "";
  public referensi:any = "";
  public imageURL:any = "";
  public isImageSelected:boolean = false;

  constructor(
    public navCtrl: NavController,
    public camera: Camera,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public insurance: InsuranceService
  ) {
    this.id_user = window.localStorage.getItem('id_user');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InsurancePage');
  }

  openCamera(){
    try {
      const options: CameraOptions = {
        quality: 30,
        destinationType: Camera.DestinationType.DATA_URL,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE
      }

      Camera.getPicture(options).then((imageData) => {
        this.isImageSelected = true;
        this.imageURL = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
        console.log(err);
      }).catch(
        data=>{
          this.showAlert('Info', JSON.stringify(data));
        }
      );
    } catch (error) {
      this.showAlert('Info', JSON.stringify(error));
    }    
  }

  openGallery(){
    const options: CameraOptions = {
      quality: 30,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    }

    Camera.getPicture(options).then((imageData) => {
      this.isImageSelected = true;
      this.imageURL = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
    });
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

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select option:',
      buttons: [
        {
          text: 'Galeri',
          icon: 'image',
          handler: () => {
            this.openGallery();
          }
        },
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.openCamera();
          }
        }
      ]
    });
    actionSheet.present();
  }

  proses(){
    let loading = this.loading("Please wait..!");
    if(this.id_user == "" || this.id_user == undefined || this.id_user == null){
      this.showAlert("Error", "Login first..!");
      return false;
    }
    if(this.alamat == ""){
      this.showAlert("Error", "Alamat is required..!");
      return false;
    }
    if(this.email == ""){
      this.showAlert("Error", "Email is required..!");
      return false;
    }
    if(this.imageURL == ""){
      this.showAlert("Error", "Foto KTP is required..!");
      return false;
    }
    if(this.hp1 == ""){
      this.showAlert("Error", "Phone-1 is required..!");
      return false;
    }
    if(this.hp2 == ""){
      this.showAlert("Error", "Phone-2 is required..!");
      return false;
    }
    if(this.jangka_waktu == ""){
      this.showAlert("Error", "Jangka waktu is required..!");
      return false;
    }
    if(this.nama == ""){
      this.showAlert("Error", "Nama is required..!");
      return false;
    }
    if(this.pinjaman == ""){
      this.showAlert("Error", "Pinjaman is required..!");
      return false;
    }
    if(this.referensi == ""){
      this.showAlert("Error", "Referensi is required..!");
      return false;
    }
    if(this.unit_jaminan == ""){
      this.showAlert("Error", "Unit Jaminan is required..!");
      return false;
    }
    
    loading.present();
     let params:any = {
          nama: this.nama,
          email: this.email,
          no_hp: this.hp1,
          no_hp2: this.hp2,
          alamat: this.alamat,
          unit_jaminan: this.unit_jaminan,
          pinjaman: this.pinjaman,
          foto_ktp: this.imageURL,
          jangka_waktu: this.jangka_waktu,
          referensi: this.referensi
      };

    this.insurance.pengajuan(this.id_user, params)
    .map(res=>res.text())
    .subscribe(
      data=>{
        loading.dismiss();
        if(data.toLowerCase() == 'exist'){
          this.showAlert("Info", 'Your data already exist..!');
        }
        else if(data.toLowerCase() == 'notok'){
          this.showAlert("Info", 'Failed to process, try again..!');
        }        
        else if(data.toLowerCase() == 'ok'){
          let alert = this.alertCtrl.create({
            title: 'Success',
            subTitle: 'Your request submited to next process.',
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.navCtrl.pop();
                }
              }
            ]
          });
          alert.present();
        }
        else{
          this.showAlert('Info', 'Something went wrong, contact Dxplor or try again..!');
        }
      },
      onerror=>{
        loading.dismiss();
        this.showAlert('Error', 'Something went wrong, contact Dxplor..!');
      }
    );
    
  }

  private loading(content:string){
    let loader = this.loadingCtrl.create({
      content: content
    });

    return loader;
  }

}
