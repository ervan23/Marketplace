import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import {MerchantService} from '../../providers/merchant-service';
import {ProductDetailPage} from '../product-detail/product-detail';

@Component({
  selector: 'page-medical',
  templateUrl: 'otomotif.html',
  providers: [MerchantService]
})
export class OtomotifPage {
  public otomotifList:any = [];
  public failGetdata:boolean = false;
  public isSearchMode:boolean = false;
  public tmp_otomotifList:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public merchant: MerchantService,
  ) {
    this.init();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtomotifPage');
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

  strip_tags (input, allowed) {
    allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')

    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
    var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi

    return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
    })
  }

  private init(){
    let loading = this.loading('Please Wait...');
    loading.present();
    this.merchant.getOtomotifList()
    .map(res=>res.json())
    .subscribe(
      data=>{
        this.otomotifList = data;
        this.tmp_otomotifList = data;
        if(data){
          this.failGetdata = false;
        }
        else{
          this.failGetdata = true;
        }
      },
      err=>{
        console.log(err);
        loading.dismiss();
        this.failGetdata = true;
        this.showAlert("Error", "Connection failed, try again !");
      },
      ()=>{loading.dismiss()}
    );
  }

  search(ev){
    let val = ev.target.value;
    console.log(val);
    if (val && val.trim() != '') {
      this.isSearchMode = true;
      this.merchant.searchOtomotif(val)
      .map(res=>res.json())
      .subscribe(
        data=>{
          this.isSearchMode = false;
          this.failGetdata = false;
          this.tmp_otomotifList = data;
        },
        onerror=>{
          this.isSearchMode = false;
          this.failGetdata = true;
        }
      );
      this.tmp_otomotifList = this.otomotifList.filter((item) => {
        return (item.NAME.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
    else{
      this.tmp_otomotifList = this.otomotifList;
    }
  }

  resetSearch(){
    this.tmp_otomotifList = this.otomotifList;
    this.isSearchMode = false;
    this.failGetdata = false;
  }

  public openDetail(id, img1, img2, img3, product, title){
    let loading = this.loading('Please Wait...');
    let detailData:any;
    loading.present();
    this.merchant.getDetailOtomotif({id: id}, {})
    .map(res=>res.text())
    .subscribe(
      data=>{detailData = data},
      err=>{
        console.log(err);
        loading.dismiss();
        this.showAlert("Error", "Connection failed, try again !");
      },
      ()=>{
        loading.dismiss();
        let data = {
          img : [img1, img2, img3],
          data: detailData,
          product: product,
          title: title
        };
        this.navCtrl.push(ProductDetailPage, data);
      }
    );
  }

}
