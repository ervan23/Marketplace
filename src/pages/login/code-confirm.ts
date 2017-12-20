import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
//import { MyApp } from '../../app/app.component';

@Component({
  selector: 'page-confirm',
  templateUrl: 'code-confirm.html',
  providers: [AuthService]
})
export class CodeConfirmPage {

  public email:any = "";
  public phone:any = "";
  public code:any = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthService,
    public alertCtrl:AlertController,
    public loadingCtrl:LoadingController
  ) {
    this.email = navParams.get('email');
    this.phone = navParams.get('phone');
  }

  verification(){
    console.log({email: this.email, phone: this.phone});
  }

  private showAlert(title:string, message:string){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  public loading(content:string){
    let loader = this.loadingCtrl.create({
      content: content
    });

    return loader;
  }

}
