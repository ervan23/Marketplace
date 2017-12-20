import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import {AuthService} from '../../providers/auth-service';
import { MyApp } from '../../app/app.component';

@Component({
  selector: 'page-account',
  templateUrl: 'forgot-password.html',
  providers: [AuthService]
})
export class ForgotPassword {

    public email:string = "";
    
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public auth: AuthService
    ) {}

    resetPassword(){
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;            
        if(this.email == "" || this.email == undefined){
            this.showAlert('Error', 'Email is required..!');
            return false;
        }
        if(regex.test(this.email)){
            let loading = this.loading('Please wait..!');
            loading.present();
            this.auth.resetPassword(this.email)
            .map(res=>res.text())
            .subscribe(
                data=>{
                    loading.dismiss();
                    if(data.toLowerCase() == 'ok'){
                        this.showAlert('Info', 'Please check your email..!');
                        this.navCtrl.setRoot(MyApp);
                    }
                    else{
                        this.showAlert('Error', 'Your email not registered..!');
                    }
                },
                onerror=>{
                    loading.dismiss();
                    this.showAlert('Error', 'Something went wrong, contact Dxplor..!');
                }
            );
        }
        else{
            this.showAlert("Info", "Use an valid email..!");
        return false;
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

    private loading(content:string){
        let loader = this.loadingCtrl.create({
            content: content
        });

        return loader;
    }


}