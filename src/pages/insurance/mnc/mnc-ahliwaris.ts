import { Component } from '@angular/core';
import { Camera, CameraOptions } from 'ionic-native';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-bfi',
  templateUrl: 'mnc-ahliwaris.html',
  providers: [Camera]
})
export class MncAhliwarisPage {

  public nama:any = '';
  public hubungan:any = '';
  public presentase:number;
  public total_presentasi:number;
  public max_t:number = 100;

  constructor(
    public navCtrl: NavController,
    public camera: Camera,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController
  ) {
    let aw = navParams.get('passenger');
    this.total_presentasi = parseInt(navParams.get('t'));
    this.max_t -= this.total_presentasi; 
    if(aw != undefined){
      this.nama = aw.nama;
      this.hubungan = aw.hubungan;
      this.presentase = aw.presentase;
      this.total_presentasi = parseInt(this.total_presentasi.toString()) - parseInt(this.presentase.toString())
    }    
    console.log('persen '+this.total_presentasi);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InsurancePage');
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  done(){    
    console.log('persen '+this.total_presentasi);
    if(this.nama == ''){
      this.showAlert('Info', 'Nama ahli waris harus di isi..!');
      return false;
    }
    else if(this.hubungan == ''){
      this.showAlert('Info', 'Hubungan ahli waris harus di isi..!');
      return false;
    }
    else if(this.presentase == null || this.presentase == undefined || this.presentase <= 0){
      this.showAlert('Info', 'Persentase harus di isi dan lebih dari 0 (nol)..!');
      return false;
    }
    else if(this.presentase > 100){
      this.showAlert('Info', 'Nilai maksimal persentase adalah 100..!');
      return false;
    }
    else if((parseInt(this.presentase.toString()) + parseInt(this.total_presentasi.toString())) > 100){
      this.showAlert('Info', 'Total maksimal persentase adalah 100..!');
      return false;
    }
    let aw = {
        nama: this.nama,
        hubungan: this.hubungan,
        presentase: this.presentase
    };
    this.viewCtrl.dismiss(aw);
  }

  private showAlert(title:string, message:string){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            //this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

}
