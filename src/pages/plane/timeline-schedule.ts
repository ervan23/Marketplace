import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController, ViewController } from 'ionic-angular';
import {PlaneService} from '../../providers/plane-service';


@Component({
  selector: 'page-timeline-schedule',
  templateUrl: 'timeline-schedule.html',
  providers: [PlaneService]
})
export class PageTimelineSchedule {

  public flight:any;
  public adult_pax:number;
  public child_pax:number;
  public infant_pax:number;
  public adult_price:number;
  public child_price:number;
  public infant_price:number;
  public total_price:number;
  public low_price:number;
  public off_price:number;
  
  public r_adult_price:number;
  public r_child_price:number;
  public r_infant_price:number;
  public r_total_price:number;
  public r_low_price:number;
  public r_off_price:number;

  public new_flight:any;
  public isReturn:boolean;
  public segment_view:string = "flight";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public plane: PlaneService,
    public alertCtrl:AlertController,
    public loadingCtrl:LoadingController,
    public toastCtrl:ToastController,
    public viewCtrl:ViewController
  )
  {
    this.flight = navParams.get('flight_detail');
    this.isReturn = navParams.get('return');
    this.adult_pax = parseInt(window.localStorage.getItem("adult_passenger"));
    this.child_pax = parseInt(window.localStorage.getItem("child_passenger"));
    this.infant_pax = parseInt(window.localStorage.getItem("infant_passenger"));
    if(this.isReturn){      
      this.new_flight = navParams.get('return_flight');
      this.r_adult_price = ((this.adult_pax * this.new_flight.adult_base) + (this.adult_pax * this.new_flight.adult_tax) + this.new_flight.markup_adult);
      //this.adult_price = Math.round(this.adult_price + (((25/100) * this.adult_price)/4));
      this.r_child_price = (this.child_pax * this.new_flight.child_base) + (this.child_pax * this.new_flight.child_tax);
      //this.child_price = Math.round(this.child_price + (((25/100) * this.child_price)/4));
      this.r_infant_price = (this.infant_pax * this.new_flight.infant_base) + (this.infant_pax * this.new_flight.infant_tax);
      //this.infant_price = Math.round(this.infant_price + (((25/100) * this.infant_price)/4));
      this.r_total_price = this.r_adult_price + this.r_child_price + this.r_infant_price;
      this.r_low_price = ((parseInt(this.new_flight.lowest_price)-((50/100)*parseInt(this.new_flight.discount_adult))) * this.adult_pax) + this.r_child_price + this.r_infant_price;
      this.r_off_price = this.r_total_price - this.r_low_price;
    }
    console.log(this.isReturn);
    console.log(this.flight);
    console.log(this.new_flight);
    this.adult_price = ((this.adult_pax * this.flight.adult_base) + (this.adult_pax * this.flight.adult_tax) + this.flight.markup_adult);
    //this.adult_price = Math.round(this.adult_price + (((25/100) * this.adult_price)/4));
    this.child_price = (this.child_pax * this.flight.child_base) + (this.child_pax * this.flight.child_tax);
    //this.child_price = Math.round(this.child_price + (((25/100) * this.child_price)/4));
    this.infant_price = (this.infant_pax * this.flight.infant_base) + (this.infant_pax * this.flight.infant_tax);
    //this.infant_price = Math.round(this.infant_price + (((25/100) * this.infant_price)/4));
    this.total_price = this.adult_price + this.child_price + this.infant_price;
    this.low_price = ((parseInt(this.flight.lowest_price)-((50/100)*parseInt(this.flight.discount_adult))) * this.adult_pax) + this.child_price + this.infant_price;
    this.off_price = this.total_price - this.low_price;
  }

  getLowPrice(){
    if(this.isReturn){
      return this.low_price + this.r_low_price;
    }
    else{
      return this.low_price;
    }
  }

  getTotalPrice(){
    if(this.isReturn){
      return this.total_price + this.r_total_price;
    }
    else{
      return this.total_price;
    }
  }

  getOffPrice(){
    if(this.isReturn){
      return this.off_price + this.r_off_price;
    }
    else{
      return this.off_price;
    }
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad PageTimelineSchedule');    
  }

  onSegmentChanged(){
    console.log(this.segment_view);
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
