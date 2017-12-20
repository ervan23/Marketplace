import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import {HotelService} from '../../providers/hotel-service';
import {ResultPage} from './result';

/*
  Generated class for the Hotel page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-hotel',
  templateUrl: 'hotel.html',
  providers: [HotelService]
})
export class HotelPage {
  public paxPassport:any;
  public paxPassportList:any = [];
  public destCountry:any;
  public destCountryList:any = [];
  public destCity:any;
  public destCityList:any = [];
  public rooms:any = 1;
  public guest:any = 1;
  public roomCount:any = 0;
  public isRoomSelected:boolean = false;
  public autocomplete:any;

  private date = new Date();
  public now: string = this.date.toISOString();
  public max: any = this.date.getFullYear()+3;
  public cekin: any = this.now;
  private r_date = new Date(new Date(this.cekin).setDate(new Date(this.cekin).getDate() + 1));
  public cekout: any = this.r_date.toISOString();//this.dateFlight;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    public hotel:HotelService,
    public alertCtrl:AlertController,
    public loadingCtrl:LoadingController
  ) {}

  ionViewDidLoad() {
    this.hotel.getAutocomplete()
    .map(res=>res.json())
    .subscribe(
      data=>{this.autocomplete = data},
      onerror=>{console.log(onerror)}
    );
  }

  onCekinDateChanged(){
    this.cekout = this.cekin;
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

  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
      items.push(i);
    }
    return items;
  }

  findHotel(){
    let loading = this.loading("Please wait...");
    loading.present();
    let ci = new Date(this.cekin);
    let co = new Date(this.cekout);
    var mi,din;
    var mo,dout;
    if(ci.getMonth() < 9){
      mi = "0"+(ci.getMonth() + 1);
    }
    else{
      mi = (ci.getMonth() + 1);
    }
    if(ci.getDate() < 10){
      din = "0"+ci.getDate();
    }
    else{
      din = ci.getDate();
    }
    if(co.getMonth() < 9){
      mo = "0"+(co.getMonth() + 1);
    }
    else{
      mo = (co.getMonth() + 1);
    }
    if(co.getDate() < 10){
      dout = "0"+co.getDate();
    }
    else{
      dout = co.getDate();
    }
    let data = {
      guest: this.guest,
      destination: this.destCountry,
      checkin: ci.getFullYear()+"-"+mi+"-"+din,
      checkout: co.getFullYear()+"-"+mo+"-"+dout,
      room: this.rooms
    }
    var lisHotel;
    this.hotel.getHotels(JSON.stringify(data))
    .map(res=>res.json())
    .subscribe(
      data=>{console.log(data); lisHotel = data},
      err=>{this.showAlert("Error", "Error while getting hotel information");loading.dismiss();},
      ()=>{
        loading.dismiss();
        this.navCtrl.push(ResultPage, {listHotel: lisHotel});
      }
    );
  }

}
