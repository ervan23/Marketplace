import { Component } from '@angular/core';
import { Camera, CameraOptions } from 'ionic-native';
import { NavController, NavParams, ActionSheetController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-bfi',
  templateUrl: 'bfi-simulasi.html',
  providers: [Camera]
})
export class BfiSimulasiPage {

  public segment_view:any = "mobil";

  constructor(
    public navCtrl: NavController,
    public camera: Camera,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public actionSheetCtrl: ActionSheetController
  ) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InsurancePage');
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
