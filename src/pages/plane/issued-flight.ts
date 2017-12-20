import { Component } from '@angular/core';
import { Events, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import {PlaneService} from '../../providers/plane-service';
import { PlanePage } from './plane';
import { PageTimelineSchedule } from './timeline-schedule';


@Component({
  selector: 'page-plane',
  templateUrl: 'issued-flight.html',
  providers: [PlaneService]
})
export class IssuedFlight {

    public selected_airline:any;
    public book_detail:any;
    public new_flight:any;
    public total_price:number = 0;
    public old_total_price:number = 0;
    public new_total_price:number = 0;
    public fee_price:number = 0;
    public price_message:string;
    public schedule:any;
    public transaction_flight_id = [];

    public from:any;
    public to:any;
    public arrival_date:any;
    public arrival_time:any;
    public departure_date:any;
    public departure_time:any;
    public code_from:any;
    public code_to:any;
    public extract_detail;

    public isReturn:boolean;

    constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public plane: PlaneService,
      public alertCtrl:AlertController,
      public ev: Events,
      public loadingCtrl:LoadingController,
      public modalCtrl: ModalController
    )
    {
        this.book_detail = navParams.get('book_detail');
        for(let b=0; b < this.book_detail.length; b++){
            this.fee_price += this.book_detail[b].total_service_fee;
        }
        
        this.selected_airline = navParams.get('selected_airline');
        this.new_flight = navParams.get('new_flight');
        this.schedule = navParams.get('schedule');
        this.isReturn = navParams.get('return');
        this.old_total_price = parseInt(navParams.get('old_low'));
        console.log("Old");
        console.log(this.selected_airline);
        console.log("Schedule");
        console.log(this.schedule);
        console.log("New");
        this.extract_detail = this.new_flight;
        console.log(this.extract_detail);

        for(let i= 0; i < this.book_detail.length; i++){
            let new_total:number = parseInt(this.book_detail[i].total_price);
            let new_nett_price:number = parseInt(this.book_detail[i].nett_price);
            this.new_total_price += new_total + (((new_total - new_nett_price)*25)/100);
            this.transaction_flight_id.push(this.book_detail[i].transaction_flight_id);
        }

        this.new_total_price = Math.floor(this.new_total_price) + this.fee_price;
        this.checkPrice(this.old_total_price, this.new_total_price);
        
        this.from = this.schedule.flight_schedule[0].from_name;
        this.to = this.schedule.flight_schedule[this.schedule.flight_schedule.length - 1].to_name;
        this.departure_date = this.schedule.flight_schedule[0].departure_date;
        this.departure_time = this.schedule.flight_schedule[0].departure_time;
        this.arrival_date = this.schedule.flight_schedule[this.schedule.flight_schedule.length - 1].arrival_date;
        this.arrival_time = this.schedule.flight_schedule[this.schedule.flight_schedule.length - 1].arrival_time;
        this.code_from = this.schedule.flight_schedule[0].from;
        this.code_to = this.schedule.flight_schedule[this.schedule.flight_schedule.length - 1].to;
    }

    checkPrice(old_price:number, new_price:number){
        if(old_price != new_price){
            this.price_message = "Your flight price has been updated by the airline. Check your flight detail before issued it";
            let prompt = this.alertCtrl.create({
                title: 'Ticket price update:',
                subTitle: 'Your ticket price has been update by the airline. Check price detail below..!',
                buttons: [
                    {
                        text: "Ok"
                    }
                ]
            });
            prompt.present();
        }
        else{
            this.price_message = "Your flight price has been confirmed by the airline. Check your flight detail before issued it";
        }
    }

    getTransactionPrice(){
        return this.old_total_price + this.fee_price;
    }

    issuedFlight(){
        console.log(this.transaction_flight_id);
        let loading = this.loading('Please wait...');
        loading.present();
        this.plane.getBalance(window.localStorage.getItem('id_user'))
        .map(res=>res.text())
        .subscribe(
            data=>{
                loading.dismiss();
                if(parseInt(data) < this.new_total_price){
                    this.showAlert('Info', 'You dont have enough balance');
                }
                else{
                    this.transaction_flight_id.forEach((item, index)=>{
                        let param = {
                            customer_id : window.localStorage.getItem('id_user'),
                            transaction_flight_id : item
                        };
                        this.issuedProcess(param);
                    });                    
                }
            },
            onerror=>{
                loading.dismiss();
                this.showAlert('Error', 'Something went wrong, try again !');
            }
        );        
    }

    openTimeline(){
        //this.modalCtrl.create(PageTimelineSchedule, {flight_detail: this.schedule, new_flight: this.new_flight}).present();
    }

    getShortDate(date){
        let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        let mounths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let d = new Date(date);
        return days[d.getDay()]+", "+d.getDate()+" "+mounths[d.getMonth()]+" "+d.getFullYear();
    }

    getPriceType(type:string){
        return type.toUpperCase()=='IDR'?'Economy':type;
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

    issuedProcess(param:any){
        let loading = this.loading('Issued Proccess...');
        loading.present();
        this.plane.issuedFlight(param)
        .map(res=>res.text())
        .subscribe(
            data => {
                loading.dismiss();
                let res = JSON.parse(data);
                let param = {
                    transaction_flight_id : this.transaction_flight_id,
                    member_id : window.localStorage.getItem('id_user'),
                    price : this.getTransactionPrice()
                }
                if(res.status == '0'){
                    this.showAlert('Error', 'Error while issued your flight, contact Dxplor..!');
                }
                else{
                    this.plane.chargeFlightBalance(param)
                    .map(res=>res)
                    .subscribe(
                        data=>{
                            this.ev.publish("balance:reduce", this.getTransactionPrice());
                            loading.dismiss();
                            let prompt = this.alertCtrl.create({
                                title: 'Flight issued:',
                                subTitle: 'Check your email for e-Ticket, if you cant find it contact Dxplor..!',
                                buttons: [
                                    {
                                        text: 'Continue',
                                        handler: data => {
                                            this.navCtrl.push(PlanePage);
                                        }
                                    }
                                ]
                            });
                            prompt.present();
                        },
                        onerror=>{
                            loading.dismiss();
                            this.showAlert('Error', 'Issued failed, try again..!');
                        }
                    );
                }
            },
            onerror  => {}
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

    private loading(content:string){
        let loader = this.loadingCtrl.create({
        content: content
        });

        return loader;
    }

    private showAlert(title:string, message:string){
        let alert = this.alertCtrl.create({
        title: title,
        subTitle: message,
        buttons: ['OK']
        });
        alert.present();
    }
    
}