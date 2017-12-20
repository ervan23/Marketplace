import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import {GadgetService} from '../../providers/gadget-service';
import {ProductDetailPage} from '../product-detail/product-detail';


@Component({
  selector: 'page-gadget',
  templateUrl: 'gadget.html',
  providers: [GadgetService]
})
export class GadgetPage {
  public gadgetList:any = [];
  public failGetdata:boolean = false;
  public isSearchMode:boolean = false;
  public tmp_gadgetList:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public gadget: GadgetService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad GadgetPage');
    this.init();
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

  private init(){
    let loading = this.loading('Please Wait...');
    loading.present();
    this.gadget.getGadgetList()
    .map(res=>res.json())
    .subscribe(
      data=>{
        this.gadgetList = data;
        this.tmp_gadgetList = data;
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

  strip_tags (input, allowed) {
    allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')

    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
    var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi

    return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
    })
  }

  search(ev){
    let val = ev.target.value;
    console.log(val);
    if (val && val.trim() != '') {
      this.isSearchMode = true;
      this.gadget.searchProduct(val)
      .map(res=>res.json())
      .subscribe(
        data=>{
          this.isSearchMode = false;
          this.failGetdata = false;
          this.tmp_gadgetList = data;
        },
        onerror=>{
          this.isSearchMode = false;
          this.failGetdata = true;
        }
      );
      this.tmp_gadgetList = this.gadgetList.filter((item) => {
        return (item.NAME.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
    else{
      this.tmp_gadgetList = this.gadgetList;
    }
  }

  resetSearch(){
    this.tmp_gadgetList = this.gadgetList;
    this.isSearchMode = false;
    this.failGetdata = false;
  }

  public openDetail(id, img1, img2, img3, product, title){
    let loading = this.loading('Please Wait...');
    let detailData:any;
    loading.present();
    this.gadget.getDetailProduct({id: id}, {})
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
