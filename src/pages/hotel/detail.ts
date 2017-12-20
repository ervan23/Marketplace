import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import {HotelService} from '../../providers/hotel-service';
import 'rxjs/add/operator/map';
import xml2js from 'xml2js';
/*
  Generated class for the Hotel page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
  providers: [HotelService]
})
export class DetailHotel {

    public detailHotel:any;
    public priceRoom:any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams, 
        public hotel:HotelService,
        public alertCtrl:AlertController,
        public loadingCtrl:LoadingController
    ) {       
        this.priceRoom = this.navParams.get('priceRoom');
        console.log(this.priceRoom);
        this.parseXML(this.navParams.get('detailHotel')).then(
            data=>{   
                this.detailHotel  = data;             
                console.log(this.detailHotel);
            }
        );
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DetailPage');
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
                var obj = result.Service_GetHotelDetail;
                var item = obj.GetHotelDetail_Response[0];
                resolve(item);
            });
        });
    }

}