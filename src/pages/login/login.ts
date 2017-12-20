import { Component } from '@angular/core';
import { Events, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { MyApp } from '../../app/app.component';
import { ForgotPassword } from '../account/forgot-password';
import { CodeConfirmPage } from './code-confirm';
/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AuthService]
})
export class LoginPage {

  public email:any = "";
  public password:any = "";
  public indexApp = MyApp;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthService,
    public ev: Events,
    public alertCtrl:AlertController,
    public loadingCtrl:LoadingController
  ) {
    
  }

  ionViewDidLoad() {
    //this.email = this.navParams.get("email");
  }

  forgotPassword(){
    this.navCtrl.push(ForgotPassword);
  }

  public doLogin(){
    if(this.email == undefined || this.password == undefined || this.email == "" || this.password == ""){
      this.showAlert('Required Field', 'Fill all required field');
    }
    else{
      let loading = this.loading('Please wait...');
      loading.present();
      let login = {uname : this.email, password : this.password};
      let env = this;
      this.auth.login(login)
      .map(res=>res.json())
      .subscribe(
        data => {
          console.log(data);
          if(data.message.toLowerCase() == 'ok'){
            let data_session = {
              is_loggedin: true,
              username: data.nama,
              id_user: data.id,
              phone: data.phone,
              email: this.email,
              password: this.password
            };
            
            window.localStorage.setItem('email', data_session.email);
            window.localStorage.setItem('id_user', data_session.id_user);
            window.localStorage.setItem('is_loggedin', "true");
            window.localStorage.setItem('password', data_session.password);
            window.localStorage.setItem('phone', data_session.phone);
            window.localStorage.setItem('username', data_session.username);
            this.ev.publish("auth:loggedin", data_session.is_loggedin);
            loading.dismiss();
            env.navCtrl.setRoot(MyApp);
          }
          else if(data.message.toLowerCase() == 'notok'){
            this.showAlert("Login Gagal:", "Email/Password salah");
            loading.dismiss();
          }
          else{
            loading.dismiss();
            this.navCtrl.push(CodeConfirmPage, {email: this.email, phone: data.phone});
          }
        },
        err => {
          console.log("ERROR!: ", err);
          loading.dismiss();
        }
    );
    }
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
