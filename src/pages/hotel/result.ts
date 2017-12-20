import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import {HotelService} from '../../providers/hotel-service';
import {DetailHotel} from './detail';
import 'rxjs/add/operator/map';
import xml2js from 'xml2js';
/*
  Generated class for the Hotel page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
  providers: [HotelService]
})
export class ResultPage {

    public listHotel:any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams, 
        public hotel:HotelService,
        public alertCtrl:AlertController,
        public loadingCtrl:LoadingController
    ) {        
        let h = this.parseXML(this.navParams.get('listHotel'));
        h.then(
            data=>{
                this.listHotel = data
                console.log(this.listHotel);
            }
        );
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ResultPage');
    }

    parseXML(data)
    {
        return new Promise(resolve =>
        {
            var parser = new xml2js.Parser(
            {
                trim: true,
                explicitArray: true
            });

        parser.parseString(data, function (err, result)
        {
            var obj = result.Service_SearchHotel;
            var item = obj.SearchHotel_Response[0];
            //console.log(item);
            resolve(item);

            });
        });
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

    public detailHotel(idHotel:string, price:string){
        let loading = this.loading("Getting Information...");
        loading.present();
        let data = {hotel_code: idHotel};
        this.hotel.getDetailHotel(data)
        .map(res=>res.text())
        .subscribe(
            data=>{                
                loading.dismiss();
                this.navCtrl.push(DetailHotel, {detailHotel: data, priceRoom: price});
            },
            onerror=>{this.showAlert("Error", "Error while getting hotel information");loading.dismiss();}
        );
    }

}