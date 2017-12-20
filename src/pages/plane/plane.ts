import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, DateTime, AlertController, LoadingController, ToastController } from 'ionic-angular';
import {PlaneService} from '../../providers/plane-service';
import { ResultPlane } from './result-plane';

import { CalendarController } from 'ion2-calendar/dist';


@Component({
  selector: 'page-plane',
  templateUrl: 'plane.html',
  providers: [PlaneService]
})
export class PlanePage {
  @ViewChild(DateTime) datetime: any = DateTime;

  public isReturn = false;
  public isSearchOrigin = false;
  public isSearchDest = false;
  private date = new Date(new Date().setDate(new Date().getDate() + 1));
  public listAirport:any = [];
  public tmp_listAirport:any = [];
  public origin:string = "";
  public destination:string = "";
  public now: string = this.date.toISOString();
  public max: any = this.date.getFullYear()+3;
  public dateFlight: any = this.now;
  private r_date = new Date(new Date(this.dateFlight).setDate(new Date(this.dateFlight).getDate() + 1));
  public dateReturn: any = this.r_date.toISOString();//this.dateFlight;
  public adult:any = 1;
  public child:any = 0;
  public infant:any = 0;
  private ind_day = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
  private ind_mth = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', "Juni", 'Juli', 'Agst', 'Sep', 'Okt', 'Nov', 'Des'];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public plane: PlaneService,
    public alertCtrl:AlertController,
    public loadingCtrl:LoadingController,
    public toastCtrl:ToastController,
    public calendarCtrl: CalendarController
  )
  {
    window.localStorage.setItem('adult_passenger', this.adult);
    window.localStorage.setItem('child_passenger', this.child);
    window.localStorage.setItem('infant_passenger', this.infant);
    this.initAutocomplete();
  }

  openFlightCalendar() {
    this.calendarCtrl.openCalendar({
      from: new Date(this.now),
      weekdaysTitle:['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
      cssClass:'my-class'
    })
    .then( res => { 
      console.log(res);
      this.dateFlight = new Date(res.date.time).toISOString();//new Date(new Date().setDate(new Date(res.date.time).getDate())).toISOString();
      console.log(this.dateFlight);
      this.dateReturn = new Date(res.date.time).toISOString();
    })
    .catch(
      () => {console.log('Cancelled');}
    );
  }

  openReturnCalendar() {
    this.calendarCtrl.openCalendar({
      from: new Date(this.dateReturn),
      weekdaysTitle:['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
      cssClass:'my-class'
    })
    .then( res => { 
      console.log(res);
      this.dateReturn = new Date(new Date().setDate(new Date(res.date.time).getDate())).toISOString();
    })
    .catch(
      () => {console.log('Cancelled');}
    );
  }

  showReadableDate(date){
    let d = new Date(date);
    let h = this.ind_day[d.getDay()];
    let t = d.getDate();
    let b = this.ind_mth[d.getMonth()];
    let y = d.getFullYear();

    return h+', '+t+' '+b+' '+y;
  }

  onFlightDateChanged(){
    this.dateReturn = this.dateFlight;
  }

  getOriginItem(ev:any){
    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.isSearchOrigin = true;
      this.tmp_listAirport = this.listAirport.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else{
      this.isSearchOrigin = false;
    }
  }

  getDestinationItem(ev:any){
    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.isSearchDest = true;
      this.tmp_listAirport = this.listAirport.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else{
      this.isSearchDest = false;
    }
  }



  initAutocomplete(){
    this.plane.getAirportList()
    .map(res => res.json())
    .subscribe(
      data => {
        this.listAirport = data;
        this.tmp_listAirport = data;
      }, //on success request
      err => { console.log(err) },  //on error request
      () => {}    //on request complete, no matter success or error
    );
  }

  setOrigin(ap:string){
    this.origin = ap;
    this.isSearchOrigin = false;
  }

  setDestination(ap:string){
    this.destination = ap;
    this.isSearchDest = false;
  }

  onPassengerChange(ev:any){
    console.log(ev);
    if((parseInt(this.adult) + parseInt(this.child)) > 7){
      this.child = ''+(7 - parseInt(this.adult))+'';
      this.presentToast('Amount of adult and child passenger must not exceed 7', 3000, 'bottom');      
    }
    if(parseInt(this.adult) < parseInt(this.infant)){
      this.infant = this.adult;
      this.presentToast('Number of infant must not exceed number of adult passenger', 3000, 'bottom');
    }
    window.localStorage.setItem('adult_passenger', this.adult);
    window.localStorage.setItem('child_passenger', this.child);
    window.localStorage.setItem('infant_passenger', this.infant);
  }

  findFlight(){
    var rute = "OW";
    if(this.origin === ""){
      this.showAlert('Info', 'Enter your depature airport');
      return false;
    }
    if(this.destination === ""){
      this.showAlert('Info', 'Enter your destination airport');
      return false;
    }
    if(this.isReturn){
      rute = "RT";

      let dr = new Date(this.dateReturn);
      var rm,rd;
      if(dr.getMonth() < 9){
        rm = "0"+(dr.getMonth() + 1);
      }
      else{
        rm = (dr.getMonth() + 1);
      }
      if(dr.getDate() < 10){
        rd = "0"+dr.getDate();
      }
      else{
        rd = dr.getDate();
      }

      this.dateReturn = dr.getFullYear()+"-"+rm+"-"+rd;
    }
    let fromdate = new Date(this.dateFlight);
    var dm,dd;
    if(fromdate.getMonth() < 9){
      dm = "0"+(fromdate.getMonth() + 1);
    }
    else{
      dm = (fromdate.getMonth() + 1);
    }
    if(fromdate.getDate() < 10){
      dd = "0"+fromdate.getDate();
    }
    else{
      dd = fromdate.getDate();
    }
    let data = {
      rute : rute,
      from : this.origin,
      to : this.destination,
      fromdate : fromdate.getFullYear()+"-"+dm+"-"+dd,
      todate : this.dateReturn,//(fromdate.getDate()+3)+"/"+(fromdate.getMonth() + 1)+"/"+fromdate.getFullYear(),
      adult : this.adult,
      child : this.child,
      infant : this.infant
    };
    console.log(data);
    let loading = this.loading("Please wait...");
    loading.present();
    this.plane.getOneWayFlightList(data, {})
    .map(res=>res.json())
    .subscribe(
      data=>{
        loading.dismiss();
        console.log(data);
        if(JSON.stringify(data) == "" || JSON.stringify(data)==" " || JSON.stringify(data)=="\"null\"")
        {
          this.showAlert("Info", "Server Busy, please Try Again Later");
          return false;
        }
        if(JSON.stringify(data).indexOf("Search Not Found") != -1)
        {
          this.showAlert("Info", "Flight not found");
          return false;
        }
        if(JSON.stringify(data).indexOf("error_message") != -1)
        {
          this.showAlert("Info", data['error_message']);
          return false;
        }
        if(this.isReturn){
          this.navCtrl.push(ResultPlane, {result: data.departure['flights'], return: this.isReturn, return_flight: data.return['flights']});
        }
        else{
          this.navCtrl.push(ResultPlane, {result: data.departure['flights']});
        }
        
      },
      err=>{
        console.log(err);
        loading.dismiss();
        this.showAlert("Error", "Something went wrong, try again !");
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

  private presentToast(message:any, duration:number, position:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });

    toast.onDidDismiss(() => {});

    toast.present();
  }

}
