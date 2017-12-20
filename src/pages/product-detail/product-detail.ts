import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Slides } from 'ionic-angular';

@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html'
})
export class ProductDetailPage {
  @ViewChild(Slides) slides: Slides;

  public product_title:any;
  public product_data:any;
  public product_asset:any;
  public product_img:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.product_asset = this.navParams.get('product');
    this.product_data = this.navParams.get('data');
    this.product_img = this.navParams.get('img');
    console.log(this.product_img);
    this.product_title = this.navParams.get('title');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailPage');
  }

  startAgainAutoplay(){
    this.slides.startAutoplay();
  }

}
