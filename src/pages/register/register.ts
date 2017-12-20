import { Component } from '@angular/core';
import { Events, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';
import { Facebook, GooglePlus } from 'ionic-native';
import {RegisterFacebook} from './register-facebook';
import {RegisterGoogle} from './register-google';
import { MyApp } from '../../app/app.component';

@Component({
  selector: 'page-others',
  templateUrl: 'register.html',
  providers: [AuthService]
})
export class RegisterPage {
  FB_APP_ID: number = 1302890683098947;
  public fb_res:string;
  public first_name:string = "";
  public last_name:string = "";
  public email:string = "";
  public phone:string = "";
  public password:string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public auth: AuthService,
    public modalCtrl:ModalController,
    public ev: Events
  ) {
    Facebook.browserInit(this.FB_APP_ID, "v2.8");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OthersPage');
  }

  doRegister(){
    if(this.first_name == ""){
        this.showAlert('Info', 'First name field is required !');
        return false;
      }
      if(this.last_name == ""){
        this.showAlert('Info', 'Last name field is required !');
        return false;
      }
      if(this.email == ""){
        this.showAlert('Info', 'Email field is required !');
        return false;
      }
      if(this.phone == ""){
        this.showAlert('Info', 'Phone field is required !');
        return false;
      }
      if(this.password == ""){
        this.showAlert('Info', 'Password field is required !');
        return false;
      }
      
      let loading = this.loading('Please wait...');
      loading.present();
      this.auth.checkEmailExist(this.email)
      .map(res=>res.text())
      .subscribe(
        data=>{
          loading.dismiss();
          if(data != "notexist"){
            this.showAlert('Info', 'Email already registered.!');
          }
          else{
          let params = {
            fname : this.first_name,
            lname : this.last_name,
            email : this.email,
            password : this.password,
            mobile: this.phone
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
        },
        onerror=>{
          loading.dismiss();
          this.showAlert('Error', 'Error while getting information from facebook.');
        }
      );
  }

  registerGoogle(){
    let loading = this.loading('Please wait...');
    loading.present();
    
    GooglePlus.login(
      {
        'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        'webClientId': '312281598742-dha6i3n8fihe3560fvberpu8d5fk02qm.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        'offline': true
      }
    )
    .then(
      user =>{
        loading.dismiss();
        this.fb_res = JSON.stringify(user);
        let name:string = user.displayName;
        let split_name:string[] = name.split(' ');
        this.first_name = split_name.shift();
        this.last_name = split_name.length > 0 ? split_name.join(' '):this.first_name;
        this.email = user.email;
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(regex.test(this.email)){
          this.auth.checkEmailExist(this.email)
          .map(res=>res.text())
          .subscribe(
            data=>{
              if(data != "notexist"){
                var res = data.split(";");
                window.localStorage.setItem('email', res[2]);
                window.localStorage.setItem('id_user', res[0]);
                window.localStorage.setItem('is_loggedin', "true");
                window.localStorage.setItem('password', ' ');
                window.localStorage.setItem('phone', ' ');
                window.localStorage.setItem('username', res[1]);
                this.ev.publish("auth:loggedin", true);
                this.navCtrl.setRoot(MyApp);
              }
              else{              
                let param = {
                  first_name: this.first_name,
                  last_name: this.last_name,
                  email: this.email,
                  phone: '',
                  password: '',
                  picture: user.imageUrl
                };
                this.modalCtrl.create(RegisterGoogle, {fb_user: param}).present();
              }
            },
            onerror=>{
              this.showAlert('Error', 'Error while getting information from Google.');
            }
          );
        }
        else{
          let param = {
            first_name: this.first_name,
            last_name: this.last_name,
            email: '',
            phone: '',
            password: '',
            picture: user.imageUrl
          };
          this.modalCtrl.create(RegisterGoogle, {fb_user: param}).present();
        }
      },
      onerror => {
        loading.dismiss();
        this.fb_res = JSON.stringify(onerror);
      }
    );

  }

  registerFacebook(){
    let permissions = [];

    permissions = ['public_profile', 'email'];

    Facebook.login(permissions)
    .then(res => {
      let userId = res.authResponse.userID;
      let params = new Array();

      Facebook.api("/me?fields=id,name,gender,email", params)
      .then(user => {
        this.fb_res = JSON.stringify(user);
        let name:string = user.name;
        let split_name:string[] = name.split(' ');
        this.first_name = split_name.shift();
        this.last_name = split_name.length > 0 ? split_name.join(' '):this.first_name;
        this.email = user.email;
        let loading = this.loading('Please wait...');
        loading.present();
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(regex.test(this.email)){
          this.auth.checkEmailExist(this.email)
          .map(res=>res.text())
          .subscribe(
            data=>{
              loading.dismiss();
              if(data != "notexist"){
                var res = data.split(";");
                window.localStorage.setItem('email', res[2]);
                window.localStorage.setItem('id_user', res[0]);
                window.localStorage.setItem('is_loggedin', "true");
                window.localStorage.setItem('password', ' ');
                window.localStorage.setItem('phone', ' ');
                window.localStorage.setItem('username', res[1]);
                this.ev.publish("auth:loggedin", true);
                this.navCtrl.setRoot(MyApp);
              }
              else{              
                let param = {
                  first_name: this.first_name,
                  last_name: this.last_name,
                  email: this.email,
                  phone: '',
                  password: '',
                  picture: "https://graph.facebook.com/" + userId + "/picture?type=large"
                };
                this.modalCtrl.create(RegisterFacebook, {fb_user: param}).present();
              }
            },
            onerror=>{
              loading.dismiss();
              this.showAlert('Error', 'Error while getting information from facebook.');
            }
          );
        }
        else{
          loading.dismiss();
          let param = {
            first_name: this.first_name,
            last_name: this.last_name,
            email: '',
            phone: '',
            password: '',
            picture: "https://graph.facebook.com/" + userId + "/picture?type=large"
          };
          this.modalCtrl.create(RegisterFacebook, {fb_user: param}).present();
        }
        
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

}