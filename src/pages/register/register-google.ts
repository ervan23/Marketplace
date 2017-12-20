import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ViewController } from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';
import { MyApp } from '../../app/app.component';

@Component({
  selector: 'page-others',
  templateUrl: 'register-google.html',
  providers: [AuthService]
})
export class RegisterGoogle {

    public user:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public auth: AuthService,
  ) {
    this.user = this.navParams.get('fb_user');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Register facebook');
  }

  doRegister(){
      if(this.user.first_name == ""){
        this.showAlert('Info', 'First name field is required !');
        return false;
      }
      if(this.user.last_name == ""){
        this.showAlert('Info', 'Last name field is required !');
        return false;
      }
      if(this.user.email == ""){
        this.showAlert('Info', 'Email field is required !');
        return false;
      }
      if(this.user.phone == ""){
        this.showAlert('Info', 'Phone field is required !');
        return false;
      }
      if(this.user.password == ""){
        this.showAlert('Info', 'Password field is required !');
        return false;
      }
      
      let loading = this.loading('Please wait...');
      loading.present();
      let params = {
          fname : this.user.first_name,
          lname : this.user.last_name,
          email : this.user.email,
          password : this.user.password,
          mobile: this.user.phone
        };
        
    this.auth.register(params)
    .map(res=>res.text())
    .subscribe(
        data => {
            loading.dismiss();
            if(data.toLowerCase() == 'ok'){
                this.showAlert('Info', 'Sign Up Success, Please check your email to activate your account (Please check Spam folder also)');
                this.navCtrl.setRoot(MyApp);
            }
            else{
                this.showAlert('Error', 'Register failed, try again.!');
            }
        },
        onerror => {
            loading.dismiss();
            this.showAlert('Error', 'Register failed, try again.!');
        }

    );
  }

  dismiss(){
    this.viewCtrl.dismiss();
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