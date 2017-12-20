import { Component, ViewChild } from '@angular/core';
import { Events, Nav, Platform, AlertController, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { SocialSharing } from '@ionic-native/social-sharing';
//import { StatusBar } from '@ionic-native/status-bar';
//import { SplashScreen } from '@ionic-native/splash-screen';

import { Page1 } from '../pages/page1/page1';
import { MarketPage } from '../pages/market/market';
import { LoginPage } from '../pages/login/login';
import { TransferDpay } from '../pages/account/transfer-dpay';
import { Cashback } from '../pages/account/cashback';
import { HistoryBalance } from '../pages/account/history-balance';
import { HelpPage } from '../pages/help/help';
import { ReferencePage } from '../pages/reference/reference';
import { RegisterPage } from '../pages/register/register';
import { AuthService } from '../providers/auth-service';
import { User } from './user';

@Component({
  selector: 'main-app',
  templateUrl: 'app.html',
  providers: [SocialSharing, AuthService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  //rootPage: any = Page1;
  //page1 = Page1;
  rootPage: any = MarketPage;
  page1 = MarketPage;
  is_loggedin:any;
  username:string;
  id_user:string;
  password:string;
  email:string;
  userReady:any;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(
    public platform: Platform,
    public auth: AuthService,
    public user: User,
    public event: Events,
    public alertCtrl:AlertController,
    public loadingCtrl:LoadingController,
    public toastCtrl:ToastController,
    public modalCtrl:ModalController,
    public socialShare: SocialSharing
  ) {
    let ses = window.localStorage.getItem("is_loggedin");
    if(ses == "" || ses == null || ses == undefined){
      this.is_loggedin = false;
    }
    else if(ses == "true"){
      this.is_loggedin = true;
      this.username = window.localStorage.getItem('username');
      this.id_user = window.localStorage.getItem('id_user');
      this.email = window.localStorage.getItem('email');
      this.password = window.localStorage.getItem('password');
    }
    event.subscribe("auth:loggedin",
      loggedin =>{
        console.log("Loggin in yakin..? "+ loggedin);
        this.is_loggedin = loggedin;
        this.username = window.localStorage.getItem('username');
        this.id_user = window.localStorage.getItem('id_user');
        this.email = window.localStorage.getItem('email');
        this.password = window.localStorage.getItem('password');
      }
    );

    event.subscribe("auth:loggedout", 
      loggedout => {
        this.is_loggedin = false;
      }
    );

    this.initializeApp();
    this.pages = [      
      { title: 'Login', component: LoginPage, icon: 'log-in'},
      { title: 'Register', component: LoginPage, icon: 'person-add'},
      { title: 'Logout', component: 'logout', icon: 'log-out'}
    ];
    console.log("construct"+this.is_loggedin);
  }

  ionViewCanEnter(){
  }

  ionViewDidLoad() {
    console.log("did load"+this.is_loggedin);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.overlaysWebView(true);
      //StatusBar.styleDefault();
      //StatusBar.styleLightContent();
      StatusBar.backgroundColorByHexString("#C62828");
      // if(this.platform.is('android')){
      //   StatusBar.backgroundColorByHexString("#C62828");
      // }
      Splashscreen.hide();
    });
  }

  changePassword(){
    let prompt = this.alertCtrl.create({
        title: 'Change Password',
        inputs: [
          {
            name: 'old_password',
            placeholder: 'Old Password',
            type: 'password'
          },
          {
            name: 'new_password',
            placeholder: 'New Password',
            type: 'password'
          },
          {
            name: 're_password',
            placeholder: 'Re-enter Password',
            type: 'password'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log(data);
            }
          },
          {
            text: 'Change',
            handler: data => {
              let a:string = data.old_password;
              let x:string = data.new_password;
              let y:string = data.re_password;
              if(a == undefined || a != window.localStorage.getItem('password')){
                this.presentToast("Invalid old password", 3500, 'bottom');
                return false;
              }              
              else if(x == undefined || x == " " || x == "" || x.length < 6){
                this.presentToast("Password must be > 6 charecter", 3500, 'bottom');
                return false;
              }              
              else if(y != x){
                this.presentToast("Re enter password not match", 3500, 'bottom');
                return false;
              }
              else{
                let loading = this.loading("Please Wait...");
                loading.present();
                let e = window.localStorage.getItem('email');
                let o = window.localStorage.getItem('password');
                let n = data.new_password;
                this.auth.changePassword(e,o,n)
                .map(res => res.text())
                .subscribe(
                  data=>{
                    loading.dismiss();
                    if(data == "oldpasswordwrong"){
                      this.presentToast("Old Password wrong", 3000, "bot");
                      return false;
                    }
                    else if(data == "ok"){
                      this.presentToast("Password has been changed", 3000, "bot");
                      window.localStorage.setItem('password', n);
                      return true;
                    }                    
                  },
                  onerror=>{
                    this.showAlert("Error :", "Something went wrong, try again !")
                  }
                );
              }
            }
          }
        ]
      });
      prompt.present();
  }

  openLogin(){
    this.nav.push(LoginPage);
  }

  openRegister(){
    this.nav.push(RegisterPage);
  }

   openHelp(){
    this.nav.push(HelpPage);
   }

   openReference(){
     this.nav.push(ReferencePage);
   }

  openPage(page) {
    if(page == 'logout'){
      this.event.publish("auth:loggedout", true);      
      this.event.publish("balance:remove", true);
      window.localStorage.removeItem('username');
      window.localStorage.removeItem('is_loggedin');
      window.localStorage.removeItem('id_user');
      window.localStorage.removeItem('password');
      //env.nav.setRoot(MyApp);
      // this.auth.deleteSession('user_login').then(function(){
      //   env.nav.setRoot(MyApp);
      // });
    }
    else{
      this.nav.push(page.component);
    }    
  }

  transferDpay(){
    let modal = this.modalCtrl.create(TransferDpay);
    modal.present();
  }

  historyBalance(){
    let id = window.localStorage.getItem('id_user');
        if(id == null || id == "" || id == undefined){
            this.alertCtrl.create({
                title: "Info",
                subTitle: "You're logged out, login first !",
                buttons: [
                    {
                        text: 'Ok',
                        handler: data => {
                            this.nav.push(LoginPage);
                        }
                    }
                ]
            }).present();
        }
        else{            
            let loading = this.loading("Loading history...");
            loading.present();
            this.auth.getHistoryBalance(id)
            .map(res=>res.json())
            .subscribe(
                data=>{
                    loading.dismiss();
                    let history = data;
                    this.modalCtrl.create(HistoryBalance, {data_history: history}).present();
                },
                onerror=>{loading.dismiss();}
            );
        }
  }

  openCashback(){
    this.modalCtrl.create(Cashback).present();
  }

  private showAlert(title:string, message:string){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  openReferal(){
    let id = window.localStorage.getItem('id_user');
    if(id == null || id == "" || id == undefined){
        this.alertCtrl.create({
            title: "Info",
            subTitle: "You're logged out, login first !",
            buttons: [
                {
                    text: 'Ok',
                    handler: data => {
                        this.nav.push(LoginPage);
                    }
                }
            ]
        }).present();
    }
    else{            
        let loading = this.loading("Please wait...");
        loading.present();        
        this.auth.getReferalLink(id)
        .map(res=>res.json())
        .subscribe(
            data=>{
                loading.dismiss();
                this.showReferalDialog(data.ref_link);
            },
            onerror=>{loading.dismiss();}
        );
    }
  }

  showReferalDialog(text:string){
    let prompt = this.alertCtrl.create({
      title: 'Referal',
      message: "Berikut adalah link referal anda:",
      inputs: [
        {
          name: 'ref',
          value: text,
          disabled: true,
          
        },
      ],
      buttons: [
        {
          text: 'Share',
          handler: data => {
            this.socialShare.share('Share', null, null, data.ref)
            .then(
              data => {},
              onerror => {
                this.showAlert('Info', 'Failed to share');
              }
            );
          }
        },
        {
          text: 'Ok'
        }
      ]
    });
    prompt.present();
  }

  private loading(content:string){
    let loader = this.loadingCtrl.create({
      content: content
    });

    return loader;
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
