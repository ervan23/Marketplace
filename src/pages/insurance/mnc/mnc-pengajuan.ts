import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController, Events } from 'ionic-angular';
import { InsuranceService } from '../../../providers/insurance-service';
import { MncLayananPage } from './mnc-layanan';
import { MncAhliwarisPage } from './mnc-ahliwaris';

@Component({
  selector: 'page-mnc',
  templateUrl: 'mnc-pengajuan.html',
  providers: [InsuranceService]
})
export class MncPengajuanPage {

    public aw_tiga:Array<{nama, hubungan, presentase}> = [];
    public aw_dua:Array<{nama, hubungan, presentase}> = [];
    public aw_satu:Array<{nama, hubungan, presentase}> = [];

    public nama:any = '';
    public no_ktp:any = '';
    public email:any = '';
    public tanggal_lahir:any = '';
    public kota:any = '';
    public alamat:any = '';
    public phone:any = '';
    public referensi:any = '';
    public dob:any;
    public total_persen:number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public insurance: InsuranceService,
    public ev: Events
  ) {
    
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

  proses(){
    console.log(this.total_persen);
    let id_user = window.localStorage.getItem('id_user');
    if(id_user == '' || id_user == null || id_user == undefined){
        this.showAlert('Error', 'Login First');
        return false;
    }
    if(this.nama == ''){
        this.showAlert('Error', 'Nama harus di isi..!');
        return false;
    }
    
    if(this.no_ktp == ''){
        this.showAlert('Error', 'Nomor KTP harus di isi..!');
        return false;
    }    
    if(this.email == ''){
        this.showAlert('Error', 'Email harus di isi..!');
        return false;
    }
    if(this.phone == ''){
        this.showAlert('Error', 'No Hp harus di isi..!');
        return false;
    }
    if(this.alamat == ''){
        this.showAlert('Error', 'Alamat harus di isi..!');
        return false;
    }
    if(this.referensi == ''){
        this.showAlert('Error', 'Referensi harus di isi..!');
        return false;
    }    
    if(this.kota == '' || this.kota == null || this.kota == undefined){
        this.showAlert('Error', 'Kota harus di isi..!');
        return false;
    }
    if(this.tanggal_lahir == '' || this.tanggal_lahir == null || this.tanggal_lahir == undefined){
        this.showAlert('Error', 'Tanggal lahir harus di isi..!');
        return false;
    }
    if(this.aw_satu.length < 1){
        this.showAlert('Error', 'Ahli waris 1 harus di isi..!');
        return false;
    }    
    if(this.total_persen != 100){
      this.showAlert('Error', 'Total persentase ahli waris harus 100% (Persen)');
      return false;
    }

    let loading = this.loading('Please wait...');
    loading.present();
    let param:any;
    console.log(this.kota+"-"+this.tanggal_lahir);
    if(this.aw_dua.length <= 0 && this.aw_tiga.length <= 0){
      param = {
          nama: this.nama,
          email: this.email,
          no_hp: this.phone,
          no_ktp: this.no_ktp,
          alamat: this.alamat,
          kota: this.kota,
          tgl_lahir: this.tanggal_lahir,
          aw_nama: this.aw_satu[0].nama,
          aw_hubungan: this.aw_satu[0].hubungan,
          aw_persentase: this.aw_satu[0].presentase,
          referensi: this.referensi
      };
    }
    else if(this.aw_tiga.length <= 0 && this.aw_dua.length >= 1){
      param = {
          nama: this.nama,
          email: this.email,
          no_hp: this.phone,
          no_ktp: this.no_ktp,
          alamat: this.alamat,
          kota: this.kota,
          tgl_lahir: this.tanggal_lahir,
          aw_nama: this.aw_satu[0].nama,
          aw_hubungan: this.aw_satu[0].hubungan,
          aw_persentase: this.aw_satu[0].presentase,
          aw_nama2: this.aw_dua[0].nama,
          aw_hubungan2: this.aw_dua[0].hubungan,
          aw_persentase2: this.aw_dua[0].presentase,
          referensi: this.referensi
      };
    }
    else if(this.aw_tiga.length >= 1 && this.aw_dua.length >= 1){
      param = {
          nama: this.nama,
          email: this.email,
          no_hp: this.phone,
          no_ktp: this.no_ktp,
          alamat: this.alamat,
          kota: this.kota,
          tgl_lahir: this.tanggal_lahir,
          aw_nama: this.aw_satu[0].nama,
          aw_hubungan: this.aw_satu[0].hubungan,
          aw_persentase: this.aw_satu[0].presentase,
          aw_nama2: this.aw_dua[0].nama,
          aw_hubungan2: this.aw_dua[0].hubungan,
          aw_persentase2: this.aw_dua[0].presentase,
          aw_nama3: this.aw_tiga[0].nama,
          aw_hubungan3: this.aw_tiga[0].hubungan,
          aw_persentase3: this.aw_tiga[0].presentase,
          referensi: this.referensi
      };
    }
    
    this.insurance.checkEmail(this.referensi)
    .map(res=>res.text())
    .subscribe(
        data=>{
            console.log(data);
            if(data == "notexist"){
                loading.dismiss();
                this.showAlert("Info:", "Email referensi belum terdaftar, periksa kembali.");
            }
            else{
                this.insurance.pengajuanMNCLife(id_user, param)
                .map(res=> res.json())
                .subscribe(
                    data=>{
                        loading.dismiss();
                        console.log(data);
                        if(data.error == true || data.error == 'true'){
                          this.showAlert('Error', data.message);
                        }
                        else if(data.error == false || data.error == 'false'){
                          this.ev.publish("balance:reduce", 55000);
                          this.showAlert('Berhasil', data.message);
                          this.navCtrl.pop();
                        }
                        else{
                          this.showAlert('Error', "Terjadi kesalahan, coba lagi atau hubungi Dxplor..!");
                        }
                    },
                    onerror=>{
                        loading.dismiss();
                        this.showAlert('Error', "Terjadi kesalahan, coba lagi atau hubungi Dxplor..!");
                        console.log(onerror);
                    }
                );
            }
        },
        onerror=>{
            loading.dismiss();
            this.showAlert("Error:", "Something went wrong. Try again !");
        }
    );      
  }

  fillAWsatu(){
    let p:any;
    if(this.aw_satu[0]){
      p = this.aw_satu[0];
      let modal = this.modalCtrl.create(MncAhliwarisPage, {passenger: p, t:this.total_persen});
      modal.onDidDismiss(
        data=>{
          if(data != undefined){
            this.total_persen = this.total_persen - parseInt(this.aw_satu[0].presentase);
            this.aw_satu[0] = data;
            this.total_persen += parseInt(this.aw_satu[0].presentase);
            console.log(this.aw_satu);
          }
        }
      );
      modal.present();
    }
    else{
      p = undefined;
      let modal = this.modalCtrl.create(MncAhliwarisPage, {passenger: p, t:this.total_persen});
      modal.onDidDismiss(
        data=>{
          if(data != undefined){
            this.aw_satu[0] = data;
            this.total_persen += parseInt(this.aw_satu[0].presentase);
            console.log(this.aw_satu);
          }
        }
      );
      modal.present();
    }
  }
  
  fillAWdua(){
    let p:any;
    let i:number = 0;
    if(this.aw_dua[i]){
      p = this.aw_dua[i];
      let modal = this.modalCtrl.create(MncAhliwarisPage, {passenger: p, t:this.total_persen});
      modal.onDidDismiss(
        data=>{
          if(data != undefined){
            this.total_persen = this.total_persen - parseInt(this.aw_dua[0].presentase);
            this.aw_dua[0] = data;
            this.total_persen += parseInt(this.aw_dua[0].presentase);
            console.log(this.aw_dua);
          }
        }
      );
      modal.present();
    }
    else{
      p = undefined;
      let modal = this.modalCtrl.create(MncAhliwarisPage, {passenger: p, t:this.total_persen});
      modal.onDidDismiss(
        data=>{
          if(data != undefined){
            this.aw_dua[i] = data;
            this.total_persen += parseInt(this.aw_dua[0].presentase);     
            console.log(this.aw_dua);
          }
        }
      );
      modal.present();
    }
  }

  fillAWtiga(){
    let p:any;
    let i:number = 0;
    if(this.aw_tiga[i]){
      p = this.aw_tiga[i];
      let modal = this.modalCtrl.create(MncAhliwarisPage, {passenger: p, t:this.total_persen});
      modal.onDidDismiss(
        data=>{
          if(data != undefined){
            this.total_persen = this.total_persen - parseInt(this.aw_tiga[0].presentase);
            this.aw_tiga[0] = data;
            this.total_persen += parseInt(this.aw_tiga[0].presentase);
            console.log(this.aw_tiga);
          }
        }
      );
      modal.present();
    }
    else{
      p = undefined;
      let modal = this.modalCtrl.create(MncAhliwarisPage, {passenger: p, t:this.total_persen});
      modal.onDidDismiss(
        data=>{
          if(data != undefined){
            this.aw_tiga[i] = data; 
            this.total_persen += parseInt(this.aw_tiga[0].presentase);       
            console.log(this.aw_tiga);
          }
        }
      );
      modal.present();
    }
  }

  deleteAWtiga(){
    console.log("hapus tiga"+this.total_persen);
    console.log(this.total_persen);
    this.total_persen = parseInt(this.total_persen.toString()) - parseInt(this.aw_tiga[0].presentase);
    this.aw_tiga.pop();
  }

  deleteAWdua(){
    console.log("hapus dua"+this.total_persen);
    this.total_persen = parseInt(this.total_persen.toString()) - parseInt(this.aw_dua[0].presentase);
    this.aw_dua.pop();
  }

  private loading(content:string){
    let loader = this.loadingCtrl.create({
      content: content
    });

    return loader;
  }

}
