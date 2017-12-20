import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import {PlaneService} from '../../providers/plane-service';
import {PlaneSchedule} from './plane-schedule';


@Component({
  selector: 'page-plane',
  templateUrl: 'return-flight.html',
  providers: [PlaneService]
})
export class ReturnFlight {

    search_result:any = [];
    depart_id:any;
    depart_schedule:any;

    constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public plane: PlaneService,
    public alertCtrl:AlertController,
    public loadingCtrl:LoadingController,
    public toastCtrl:ToastController
  )
  {
    this.search_result = this.navParams.get('retrun_flight');
    this.depart_id = this.navParams.get('departure_id');
    console.log('return flight '+this.depart_id);
    console.log(this.search_result);
  }

  showSchedule(id_flight){
    let loading = this.loading("Getting Information...");
    loading.present();
    this.plane.getOneWayFlightSchedule(this.depart_id)
    .map(res=>res.json())
    .subscribe(
        data=>{
            this.depart_schedule = data[0];
            this.plane.getOneWayFlightSchedule(id_flight)
            .map(res=>res.json())
            .subscribe(
                data=>{
                    loading.dismiss();
                    this.navCtrl.push(PlaneSchedule, {return: true, return_schedule: data[0], schedule:this.depart_schedule});
                },
                onerror=>{
                    loading.dismiss();
                    this.showAlert("Error", "Something went wrong, try again !");
                }
            );
        },
        onerror=>{
            loading.dismiss();
            this.showAlert("Error", "Something went wrong, try again !");
        }
    );
  }

  getFakePrice(v):number{
    let ab:number;
    let at:number;

    ab = parseInt(v.adult_base);
    at = parseInt(v.adult_tax);
    let fb:number =  ab+at;
    let tb:number = ab + ((25/100) * (fb-ab));
    return tb;
  }

  public getAirlineLogo(flight:Array<any>){
    if(flight.length > 1){
      if(flight[0].airline_name == flight[1].airline_name){
        return flight[0].airline_image;
      }
      return "assets/images/desain flight.png"
    }
    else{
      return flight[0].airline_image;
    }
  }

  public getAirlineName(flight:Array<any>){
    let collect_name = [];
    let name:string = "";
    flight.forEach((item, index) => {
      if(collect_name.indexOf(item.airline_name) < 0){
        collect_name.push(item.airline_name);
      } 
    });

    collect_name.forEach((item, index) => {      
      if(index == 0){
          name = item;
      }
      else{
        name += " + "+item;
      }
    });
    return name;
  }

  public getFlightTime(flight:Array<any>){
    let time:string = flight[0].departure_time +" - "+ flight[(flight.length - 1)].arrival_time;
    return time;
  }

  public getFlightDuration(flight:Array<any>){
    //travel_time
    let duration:string;
    let transit:string;
    transit = flight.length > 1 ?(flight.length-1)+" transit":"Direct";
    var timeStart = new Date(flight[0].departure_date+" "+flight[0].departure_time).getTime();
    var timeEnd = new Date(flight[flight.length-1].arrival_date+" "+flight[flight.length-1].arrival_time).getTime();
    var hourDiff = timeEnd - timeStart; //in ms
    var minDiff = hourDiff / 60 / 1000; //in minutes
    var hDiff = hourDiff / 3600 / 1000; //in hours
    var humanReadable = {hours: 0, minutes: 0};
    humanReadable.hours = Math.floor(hDiff);
    humanReadable.minutes = minDiff - 60 * humanReadable.hours;
    duration = humanReadable.hours +"h "+ humanReadable.minutes +"m, "+transit;
    return duration;
  }

  public konversiRupiah(bilangan:number){
    var	number_string = bilangan.toString(),
      sisa 	= number_string.length % 3,
      rupiah 	= number_string.substr(0, sisa),
      ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
        
    if (ribuan) {
      let separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }

    // Cetak hasil
    return rupiah;
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