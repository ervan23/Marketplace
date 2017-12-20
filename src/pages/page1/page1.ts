import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { Slides, Events } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

import { MarketPage } from '../market/market';
import { MobilePage } from '../mobile/mobile';
import { LoginPage } from '../login/login';
import { PlanePage } from '../plane/plane';
import { InsurancePage } from '../insurance/insurance';
import { MedicalPage } from '../medical/medical';
import { OthersPage } from '../others/others';
import { BillsPage } from '../bills/bills';
import { ElectronicPage } from '../electronic/electronic';
import { FashionPage } from '../fashion/fashion';
import { GadgetPage } from '../gadget/gadget';
import { HealthPage } from '../health/health';
import { MLMPage } from '../mlm/mlm';
import { NotaryPage } from '../notary/notary';
import { RestoPage } from '../resto/resto';
import { TravelPage } from '../travel/travel';
import { HotelPage } from '../hotel/hotel';
import { OtomotifPage } from '../otomotif/otomotif';
import { PropertyPage } from '../property/property';
import { PariwisataPage } from '../pariwisata/pariwisata';
import { TopupDpay } from '../account/topup-dpay';
import { TopupConfirmation } from '../account/topup-confirmation';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html',
  providers: [AuthService]
})
export class Page1 {
  @ViewChild(Slides) slides: Slides;
//https://s28.postimg.org/co0zfm4dp/dpoint.png
img_apk = {
    ico_marketplace: 'assets/images/ico_marketplace.png',
    ico_plane: 'assets/images/ico_plane.png',
    ico_mobile: 'assets/images/ico_mobile.png',
    ico_bills: 'assets/images/ico_bills.png',
    ico_gadget: 'assets/images/ico_gadget.png',
    ico_electronic: 'assets/images/ico_electronic.png',
    ico_fashion: 'assets/images/ico_fashion.png',
    ico_resto: 'assets/images/ico_resto.png',
    ico_insurance: 'assets/images/ico_insurance.jpg',
    ico_medical: 'assets/images/ico_medical.png',
    ico_notary: 'assets/images/ico_notary.png',
    ico_travel: 'assets/images/ico_travel.jpg',
    ico_health: 'assets/images/ico_health.jpg',
    ico_others: 'assets/images/ico_others.png',
    ico_mlm: 'assets/images/ico_mlm.png',
    ico_hotel: 'assets/images/hotel.jpg',
    ico_pariwisata: 'assets/images/pariwisata.jpg',
    ico_otomotif: 'assets/images/otomotif.jpg',
    ico_property: 'assets/images/property.jpg',
    ico_fitri: 'assets/images/idul_fitri.jpg'
  };
  slider_apk = {
    slide04: 'assets/images/slider/fantasy island.jpg',
    slide05: 'assets/images/slider/gampoeng.jpg',
    slide06: 'assets/images/slider/lampung teasure new.jpg',
    slide07: 'assets/images/slider/pulse.jpg',
    slide01: 'assets/images/slider/pyramid spa.jpg',
    slide02: 'assets/images/slider/tiket pesawat.jpg',
    slide03: 'assets/images/slider/vbc.jpg',
  };

  page = {
    market: MarketPage,
    plane: PlanePage,
    mobile: MobilePage,
    bills: BillsPage,
    gadget: GadgetPage,
    electronic: ElectronicPage,
    fashion: FashionPage,
    resto: RestoPage,
    insurance: InsurancePage,
    medical: MedicalPage,
    notary: NotaryPage,
    travel: TravelPage,
    health: HealthPage,
    others: OthersPage,
    mlm: MLMPage,
    hotel: HotelPage,
    topup: TopupDpay,
    otomotif: OtomotifPage,
    property: PropertyPage,
    pariwisata: PariwisataPage
  };

  public balance:any = 0;

  constructor(
    public navCtrl: NavController,
    public auth: AuthService,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public event: Events,
    public loadingCtrl:LoadingController
  ) {
    this.auth.getBalance(window.localStorage.getItem('id_user'))
    .map(res=>(res.text()))
    .subscribe(
      data=>{
        this.balance = parseInt(data);
      }
    );

    event.subscribe("balance:remove",
      loggedout => {
        this.balance = 0;
      }
    );

    event.subscribe("balance:reduce",
      val=>{ 
        //this.balance -= val;
        this.auth.getBalance(window.localStorage.getItem('id_user'))
        .map(res=>(res.text()))
        .subscribe(
          data=>{
            this.balance = parseInt(data);
          }
        );
      }
    );

  }

  topUp(){
    let loading = this.loading('Please wait..!');
    loading.present();
    let id_user = window.localStorage.getItem('id_user');
    if(id_user == null || id_user == ""){
      loading.dismiss();
        this.alertCtrl.create({
            title: "Info",
            subTitle: "You're logged out, login first !",
            buttons: [
                    {
                        text: 'Ok',
                        handler: data => {
                            this.navCtrl.push(LoginPage);
                        }
                    }
                ]
        }).present();
    }
    else{
        this.auth.getPendingTopup(id_user)
        .map(res=>res.text())
        .subscribe(
            data=>{
              loading.dismiss();
                if(data.toLowerCase() == "exist"){
                  let modal = this.modalCtrl.create(TopupConfirmation);
                  modal.present();
                }
                else{
                  this.goToPage(this.page.topup);
                }
            },
            onerror=>{
              loading.dismiss();
            }
        );
    }
  }

  goToPage(page){
    this.navCtrl.push(page);
  }

  startAgainAutoplay(){
    this.slides.startAutoplay();
  }

  openMLM(){
    window.open('http://www.dxplor.biz', '_system', 'location=yes'); return false;
  }

  private loading(content:string){
    let loader = this.loadingCtrl.create({
      content: content
    });

    return loader;
  }

  public greetingFitri(){
    this.alertCtrl.create({
            title: "Selamat..!",
            subTitle: "Selamat Hari Raya Idul Fitri 1438 H, Minal Aidin wal Faizin.",
            buttons: [
                    {
                        text: 'Ok',
                        handler: data => {
                            //this.navCtrl.push(LoginPage);
                        }
                    }
                ]
        }).present();
  }

}
