import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-plane',
  templateUrl: 'detail-passenger.html'
})
export class DetailPassenger {

    passenger = {
        departure_baggage: "", 
        dob: "", 
        first_name: "", 
        last_name:"", 
        return_baggage:"", 
        title:"",
        nationality:"",
        nationality_name:""
    };
    dob_min;
    dob_max;
    name:string;
    dob:string;
    title:string;
    nationality:string = "ID";
    t:string[] = [];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public toastCtrl:ToastController,
        public viewCtrl:ViewController
    )
    {
        let p = navParams.get('passenger');
        let t:number = parseInt(navParams.get('t'));
        let date = new Date();
        switch(t){
            case 1:
                let a_max = new Date(new Date(date).setFullYear(date.getFullYear() - 12));
                this.dob_max = new Date(Date.parse(a_max.getFullYear()+"-"+a_max.getMonth()+"-"+a_max.getDate())).toISOString();
                let a_min = new Date(new Date(date).setFullYear(date.getFullYear() - 120));
                this.dob_min = new Date(Date.parse(a_min.getFullYear()+"-"+a_min.getMonth()+"-"+a_min.getDate())).toISOString();
                this.t = ['Mr','Mrs','Miss'];
                break;
            case 2:
                let c_min = new Date(new Date(date).setFullYear(date.getFullYear() - 12));                
                this.dob_min = new Date(Date.parse(c_min.getFullYear()+"-"+c_min.getMonth()+"-"+c_min.getDate())).toISOString();
                let c_max = new Date(new Date(Date.parse(this.dob_min)).setFullYear(date.getFullYear() - 2));
                this.dob_max = new Date(Date.parse(c_max.getFullYear()+"-"+c_max.getMonth()+"-"+c_max.getDate())).toISOString();
                this.t = ['Mstr','Miss'];
                break;
            case 3:
                let i_min = new Date(new Date(date).setFullYear(date.getFullYear() - 2));
                this.dob_min = new Date(Date.parse(i_min.getFullYear()+"-"+i_min.getMonth()+"-"+i_min.getDate())).toISOString();
                let i_max = date;
                this.dob_max = new Date(Date.parse(i_max.getFullYear()+"-"+i_max.getMonth()+"-"+i_max.getDate())).toISOString();
                this.t = ['Mstr','Miss'];
                break;
        }
        console.log('Passenger = '+JSON.stringify(p));
        if(p != undefined){
            this.passenger.departure_baggage = p.departure_baggage;
            this.passenger.dob = p.dob;
            this.passenger.first_name = p.first_name;
            this.passenger.last_name = p.last_name;
            this.passenger.nationality_name = p.nationality_name;
            this.passenger.return_baggage = p.return_baggage;
            this.passenger.title = p.title;
            
            this.name = p.first_name+ " " +p.last_name;
            this.dob = p.dob;
            this.title = p.title+".";
            this.nationality = p.nationality_name;
        }
    }

    dismiss(){
        this.viewCtrl.dismiss();
    }

    done(){
        if(this.name == "" || this.name == undefined){
            this.presentToast('Name field is required', 3000, 'bottom');
            return false;
        }
        if(this.dob == "" || this.dob == undefined){
            this.presentToast('Date of birth field is required', 3000, 'bottom');
            return false;
        }
        if(this.title == "" || this.title == undefined){
            this.presentToast('Title field is required', 3000, 'bottom');
            return false;
        }
        if(this.nationality == "" || this.nationality == undefined){
            this.presentToast('Nationality field is required', 3000, 'bottom');
            return false;
        }
        let n = this.name.split(' ');
        let fn = n.shift();
        let ln = n.length > 0 ? n.join(' '):fn;
        this.passenger.first_name = fn;
        this.passenger.last_name = ln;
        this.passenger.dob = this.dob;
        this.passenger.title = this.title;
        this.passenger.nationality = this.nationality;
        this.passenger.nationality_name = "";
        this.passenger.departure_baggage = '';
        this.passenger.return_baggage = '';
        this.viewCtrl.dismiss(this.passenger);
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