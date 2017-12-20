import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController, ModalController } from 'ionic-angular';
import {PlaneService} from '../../providers/plane-service';
import { PageTimelineSchedule } from './timeline-schedule';
import { DetailPassenger } from './detail-passenger';
import { IssuedFlight } from './issued-flight';


@Component({
  selector: 'page-plane',
  templateUrl: 'plane-schedule.html',
  providers: [PlaneService]
})
export class PlaneSchedule {

    schedule:any = [];
    return_schedule:any = [];
    from:any;
    to:any;
    code_from:any;
    code_to:any;
    arrival_date:any;
    arrival_time:any;
    departure_date:any;
    departure_time:any;
    adult_pax:number;
    child_pax:number;
    infant_pax:number;
    isReturn:boolean;
    a_passengers:Array<{departure_baggage: string, dob: string, first_name: string, last_name:string, return_baggage:string, title:string, nationality_name:string}> = [];
    c_passengers:Array<{departure_baggage: string, dob: string, first_name: string, last_name:string, return_baggage:string, title:string, nationality_name:string}> = [];
    i_passengers:Array<{departure_baggage: string, dob: string, first_name: string, last_name:string, return_baggage:string, title:string, nationality_name:string}> = [];

    contact = {name:"", phone:"", email:"" };

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

    constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public plane: PlaneService,
      public alertCtrl:AlertController,
      public loadingCtrl:LoadingController,
      public toastCtrl:ToastController,
      public modalCtrl:ModalController
    )
    {
      this.adult_pax = parseInt(window.localStorage.getItem("adult_passenger"));
      this.child_pax = parseInt(window.localStorage.getItem("child_passenger"));
      this.infant_pax = parseInt(window.localStorage.getItem("infant_passenger"));
      this.contact.name = window.localStorage.getItem('username');
      this.contact.phone = window.localStorage.getItem('phone');
      this.contact.email = window.localStorage.getItem('email');
      this.schedule = this.navParams.get('schedule');
      this.isReturn = this.navParams.get('return');
      if(this.isReturn){
        this.return_schedule = this.navParams.get('return_schedule');
        this.r_adult_price = ((this.adult_pax * this.return_schedule.adult_base) + (this.adult_pax * this.return_schedule.adult_tax) + this.return_schedule.markup_adult);
        //this.adult_price = Math.round(this.adult_price + (((25/100) * this.adult_price)/4));
        this.r_child_price = (this.child_pax * this.return_schedule.child_base) + (this.child_pax * this.return_schedule.child_tax);
        //this.child_price = Math.round(this.child_price + (((25/100) * this.child_price)/4));
        this.r_infant_price = (this.infant_pax * this.return_schedule.infant_base) + (this.infant_pax * this.return_schedule.infant_tax);
        //this.infant_price = Math.round(this.infant_price + (((25/100) * this.infant_price)/4));
        this.r_total_price = this.r_adult_price + this.r_child_price + this.r_infant_price;
        this.r_low_price = ((parseInt(this.return_schedule.lowest_price)-((50/100)*parseInt(this.return_schedule.discount_adult))) * this.adult_pax) + this.r_child_price + this.r_infant_price;
        this.r_off_price = this.r_total_price - this.r_low_price;
      }

      this.adult_price = ((this.adult_pax * this.schedule.adult_base) + (this.adult_pax * this.schedule.adult_tax) + this.schedule.markup_adult);
      //this.adult_price = Math.round(this.adult_price + (((25/100) * this.adult_price)/4));
      this.child_price = (this.child_pax * this.schedule.child_base) + (this.child_pax * this.schedule.child_tax);
      //this.child_price = Math.round(this.child_price + (((25/100) * this.child_price)/4));
      this.infant_price = (this.infant_pax * this.schedule.infant_base) + (this.infant_pax * this.schedule.infant_tax);
      //this.infant_price = Math.round(this.infant_price + (((25/100) * this.infant_price)/4));
      this.total_price = this.adult_price + this.child_price + this.infant_price;
      this.low_price = ((parseInt(this.schedule.lowest_price)-((50/100)*parseInt(this.schedule.discount_adult))) * this.adult_pax) + this.child_price + this.infant_price;
      this.off_price = this.total_price - this.low_price;

      console.log(this.schedule);
      this.from = this.schedule.flight_schedule[0].from_name;
      this.to = this.schedule.flight_schedule[this.schedule.flight_schedule.length - 1].to_name;
      this.code_from = this.schedule.flight_schedule[0].from;
      this.code_to = this.schedule.flight_schedule[this.schedule.flight_schedule.length - 1].to;
      this.departure_date = this.schedule.flight_schedule[0].departure_date;
      this.departure_time = this.schedule.flight_schedule[0].departure_time;
      this.arrival_date = this.schedule.flight_schedule[this.schedule.flight_schedule.length - 1].arrival_date;
      this.arrival_time = this.schedule.flight_schedule[this.schedule.flight_schedule.length - 1].arrival_time;
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

  dateFormat(date){
    let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let mounths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let d = new Date(date);
    return days[d.getDay()]+", "+d.getDate()+" "+mounths[d.getMonth()]+" "+d.getFullYear();
  }

  getShortDate(date){
    let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    let mounths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let d = new Date(date);
    return days[d.getDay()]+", "+d.getDate()+" "+mounths[d.getMonth()]+" "+d.getFullYear();
  }

  public getFlightDuration(flight:Array<any>){
    //travel_time
    let duration:string;
    var timeStart = new Date(flight[0].departure_date+" "+flight[0].departure_time).getTime();
    var timeEnd = new Date(flight[flight.length-1].arrival_date+" "+flight[flight.length-1].arrival_time).getTime();
    var hourDiff = timeEnd - timeStart; //in ms
    var minDiff = hourDiff / 60 / 1000; //in minutes
    var hDiff = hourDiff / 3600 / 1000; //in hours
    var humanReadable = {hours: 0, minutes: 0};
    humanReadable.hours = Math.floor(hDiff);
    humanReadable.minutes = minDiff - 60 * humanReadable.hours;
    duration = humanReadable.hours +"h "+ humanReadable.minutes +"m";
    return duration;
  }

  getPriceType(type:string){
    return type.toUpperCase()=='IDR'?'Economy':type;
  }

  bookFlight(){
    if(this.a_passengers.length < this.adult_pax){
      this.showAlert('Info', 'Fill all adult passenger detail');
      return false;
    }
    if(this.c_passengers.length < this.child_pax){
      this.showAlert('Info', 'Fill all child passenger detail');
      return false;
    }
    if(this.i_passengers.length < this.infant_pax){
      this.showAlert('Info', 'Fill all infant passenger detail');
      return false;
    }
    let loading = this.loading('Booking proccess, this may take few minutes...');
    loading.present();
    let n = this.contact.name.split(' ');
    let fn = n.shift();
    let ln = n.length > 0 ? n.join(' '):" "; 
    let data_book:any;
    if(this.isReturn){
      let fID:any;
      if(this.schedule.supplier_id == this.return_schedule.supplier_id){
        fID = '"'+this.schedule.flight_id+','+this.return_schedule.flight_id+'"';
      }else{
        fID = '"'+this.schedule.flight_id+'","'+this.return_schedule.flight_id+'"';
      }
      data_book = {
        customerid: window.localStorage.getItem('id_user'),
        flight_id: fID,
        result: this.a_passengers,
        result2: this.c_passengers,
        result3: this.i_passengers,
        user_email: this.contact.email,
        user_first_name: fn,
        user_last_name: ln,
        user_mobile: this.contact.phone.split(' ')[0]
      };
    }
    else{      
      data_book = {
        customerid: window.localStorage.getItem('id_user'),
        flight_id: this.schedule.flight_id,
        result: this.a_passengers,
        result2: this.c_passengers,
        result3: this.i_passengers,
        user_email: this.contact.email,
        user_first_name: fn,
        user_last_name: ln,
        user_mobile: this.contact.phone.split(' ')[0]
      };
    }

    this.plane.bookFlight(data_book)
    .map(res => res.text())
    .subscribe(
      data=>{
        let book_res:Array<any> = JSON.parse(data);
        console.log(book_res);
        loading.dismiss();
        if(book_res == null){
          let alert = this.alertCtrl.create({
            title: "Info",
            subTitle: "Server not responding..!",
            buttons: [
              {
                text: 'Cancel',
                handler: () => {
                  return;
                }
              },
              {
                text: 'Try Again',
                handler: () => {
                  this.bookFlight();
                }
              }
            ]
          });
          alert.present();
        }
        else{
          let count_data = book_res.length;
          if(count_data >= 1){
            if(book_res.indexOf('error_message') != -1){
              this.showAlert('Info', book_res[0].error_message);
            }
            else{
              loading = this.loading('Getting transaction details...');
              loading.present();
                let multiple_res = [];
                let loop:number = 0;
                let res_count:number = book_res.length;
                const promise = new Promise((resolve, reject) => {
                    book_res.forEach(
                    (item, index) => {
                      this.plane.getFlightTransactionDetail(item.booking_code)
                      .map(res=>res.text())
                      .subscribe(
                        data=>{
                          let transaction = JSON.parse(data);
                          multiple_res.push(transaction);
                          loop ++;
                        },
                        onerror=>{
                          loading.dismiss();
                          console.log(onerror);
                          this.showAlert('Error', 'Something went wrong, try again !');
                        },
                        ()=>{
                          if(loop == res_count){
                            resolve(multiple_res);
                          }
                        }
                      );

                    }
                  );                  
                }).then(mul_res=>{                  
                  loading.dismiss();
                  let selected_airline;
                  if(this.isReturn){
                    selected_airline = {
                      departure: this.schedule,
                      return: this.return_schedule
                    };
                  }
                  else{
                    selected_airline = {
                      departure: this.schedule
                    };
                  }
                  this.navCtrl.push(IssuedFlight, {book_detail:book_res, selected_airline: selected_airline, new_flight: mul_res, schedule: this.schedule, return: this.isReturn, old_low:this.getLowPrice()});
                });        
              
            }
          }
          else{
            this.showAlert('Info', 'Please contact dxplor..!');
          }
        }
        
      },
      onerror=>{
        console.log(onerror);
        loading.dismiss();
        this.showAlert('Error', 'Please contact dxplor..!');
      }
    );
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

  openTimeline(){
    if(this.isReturn){
      this.modalCtrl.create(PageTimelineSchedule, {flight_detail: this.schedule, return: this.isReturn, return_flight:this.return_schedule}).present();
    }
    else{
      this.modalCtrl.create(PageTimelineSchedule, {flight_detail: this.schedule}).present();
    }
  }

  changeContactName(){
    let prompt = this.alertCtrl.create({
        title: 'Name as on ID Card',
        inputs: [
          {
            name: 'name',
            placeholder: 'Name as on ID Card',
            type: 'text',
            value: this.contact.name
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log(data);
            }
          },
          {
            text: 'Done',
            handler: data => {
              if(data.name == "" || data.name == null || data.name == undefined){
                this.showAlert("Info", "Please fill contact name..!");
                return false;
              }
              this.contact.name = data.name;
            }
          }
        ]
      });
      prompt.present();
  }

  changeContactPhone(){
    let prompt = this.alertCtrl.create({
        title: 'Mobile number',
        inputs: [
          {
            name: 'phone',
            placeholder: 'Mobile number',
            type: 'tel',
            value: this.contact.phone
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log(data);
            }
          },
          {
            text: 'Done',
            handler: data => {
              if(data.phone == "" || data.phone == null || data.phone == undefined){
                this.showAlert("Info", "Please fill contact name..!");
                return false;
              }
              let p:string = data.phone;
              let q = p.split('');
              if(q[0] == '0'){
                q[0] = '62';
                p = q.join('');
              }
              else if(q[0] == '8'){
                p = '62'+q.join('');
              }
              else if(q[0] == '6' && q[1] == '2'){
                p = q.join('');
              }
              else{
                this.showAlert('Info', 'Enter valid phone number');
                return false;
              }
              this.contact.phone = p.split(' ')[0];
            }
          }
        ]
      });
      prompt.present();
  }

  changeContactEmail(){
    let prompt = this.alertCtrl.create({
        title: 'Email Address',
        inputs: [
          {
            name: 'email',
            placeholder: 'Email Address',
            type: 'email',
            value: this.contact.email
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log(data);
            }
          },
          {
            text: 'Done',
            handler: data => {
              if(data.email == "" || data.email == null || data.email == undefined){
                this.showAlert("Info", "Please fill email..!");
                return false;
              }
              let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;            
              if(regex.test(data.email)){                
                this.contact.email = data.email;
              }
              else{
                this.showAlert("Info", "Use an valid email..!");
                return false;
              }
              
            }
          }
        ]
      });
      prompt.present();
  }

  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
      items.push(i);
    }
    return items;
  }

  fillAdultDetail(i:number){
    let p:any;
    if(this.a_passengers[i]){
      p = this.a_passengers[i];
      let modal = this.modalCtrl.create(DetailPassenger, {passenger: p, t:1});
      modal.onDidDismiss(
        data=>{
          if(data != undefined){
            this.a_passengers[i] = data;        
            console.log(this.a_passengers);
          }
        }
      );
      modal.present();
    }
    else{
      p = undefined;
      let modal = this.modalCtrl.create(DetailPassenger, {passenger: p, t:1});
      modal.onDidDismiss(
        data=>{
          if(data != undefined){
            this.a_passengers.push(data);        
            console.log(this.a_passengers);
          }
        }
      );
      modal.present();
    }    
  }

  fillChildDetail(i:number){
    let p:any;
    if(this.c_passengers[i]){
      p = this.c_passengers[i];
      let modal = this.modalCtrl.create(DetailPassenger, {passenger: p, t:2});
      modal.onDidDismiss(
        data=>{
          if(data != undefined){
            this.c_passengers[i] = data;        
            console.log(this.c_passengers);
          }          
        }
      );
      modal.present();
    }
    else{
      p = undefined;
      let modal = this.modalCtrl.create(DetailPassenger, {passenger: p, t:2});
      modal.onDidDismiss(
        data=>{
          if(data != undefined){
            this.c_passengers.push(data);        
            console.log(this.c_passengers);
          }          
        }
      );
      modal.present();
    }    
  }

  fillInfantDetail(i:number){
    let p:any;
    if(this.i_passengers[i]){
      p = this.i_passengers[i];
      let modal = this.modalCtrl.create(DetailPassenger, {passenger: p, t:3});
      modal.onDidDismiss(
        data=>{
          if(data != undefined){
            this.i_passengers[i] = data;        
            console.log(this.i_passengers);
          }          
        }
      );
      modal.present();
    }
    else{
      p = undefined;
      let modal = this.modalCtrl.create(DetailPassenger, {passenger: p, t:3});
      modal.onDidDismiss(
        data=>{
          if(data != undefined){
            this.i_passengers.push(data);        
            console.log(this.i_passengers);
          }          
        }
      );
      modal.present();
    }
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