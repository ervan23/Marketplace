import { Component } from '@angular/core';
import { Events, NavController, NavParams, LoadingController, AlertController, ActionSheetController } from 'ionic-angular';
import {MarketService} from '../../providers/market-service';
import { Camera, CameraOptions } from 'ionic-native';
//import {ProductPage} from './products';

@Component({
  selector: 'add-product',
  templateUrl: 'add-product.html',
  providers: [MarketService, Camera]
})
export class AddProduct {
  public product_id:any;
  public name:string = null;
  public price:any = null;
  public customer_id:any;
  public category_id:any = null;
  public province_id:any = null;
  public kode_barang:any = null;
  public city_id:any = 1;
  public description:string = null;
  public status:any = 1;
  public images:Array<any> = [];
  public images_edit:Array<any> = [];

  public searchProvince:boolean = false;
  public searchCategory:boolean = false;
  public listProvince:any = [];
  public tmp_listProvince:any = [];
  public listCategory:any = [];
  public tmp_listCategory:any = [];
  public selectedProvince:string;
  public selectedCategory:string;
  public isEdit:boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public market: MarketService, 
    public loadingCtrl:LoadingController,
    public alertCtrl:AlertController,
    public actionSheetCtrl: ActionSheetController,
    public camera:Camera,
    public ev: Events
  ) {
    this.listCategory = navParams.get('category');
    this.listProvince = navParams.get('province');
    this.isEdit = navParams.get('edit');
    if(this.isEdit == true){
      let p = navParams.get('product');
      this.name = p.name;
      this.product_id = p.id;
      this.price = p.price;
      this.kode_barang = p.kode_barang;
      this.description = p.description;
      this.images_edit = p.image;

      //set category
      this.category_id = p.category_id;      
      this.listCategory.filter((item) => {
        if(parseInt(item.id) == parseInt(p.category_id)){
          this.selectedCategory =  item.name;
        }
      });

      this.province_id = p.province_id;      
      this.listProvince.filter((item) => {
        if(parseInt(item.id) == parseInt(p.province_id)){
          this.selectedProvince =  item.name;
        }
      });
    }
  }

  public konversiRupiah(bilangan:number){
    var	number_string = bilangan.toString(),
      sisa 	= number_string.length % 3,
      rupiah 	= number_string.substr(0, sisa),
      ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
        
    if (ribuan) {
      let separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }
    return rupiah;
  }

  getProvinceItem(ev:any){
    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.searchProvince = true;
      this.tmp_listProvince = this.listProvince.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else{
      this.searchProvince = false;
    }
  }

  getCategoryItem(ev:any){
    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.searchCategory = true;
      this.tmp_listCategory = this.listCategory.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else{
      this.searchCategory = false;
    }
  }

  setProvince(ap:any){
    this.province_id = ap.id;
    this.selectedProvince = ap.name;
    this.searchProvince = false;
  }

  setCategory(ap:any){
    this.category_id = ap.id;
    this.selectedCategory = ap.name;
    this.searchCategory =  false;
  }

  openCamera(){
    try {
      const options: CameraOptions = {
        destinationType: Camera.DestinationType.DATA_URL,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        quality: 30,
        allowEdit: true
      }

      Camera.getPicture(options).then((imageData) => {
        let imageURL = 'data:image/jpeg;base64,' + imageData;
        this.images.push(imageURL);
      }, (err) => {
        console.log(err);
      }).catch(
        data=>{
          this.showAlert('Info', JSON.stringify(data));
        }
      );
    } catch (error) {
      this.showAlert('Info', JSON.stringify(error));
    }    
  }

  openGallery(){
    const options: CameraOptions = {
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      quality: 30,
      allowEdit: true
    }

    Camera.getPicture(options).then((imageData) => {
      let imageURL = 'data:image/jpeg;base64,' + imageData;
      this.images.push(imageURL);
    }, (err) => {
      console.log(err);
    });
  }

  openImagePicker() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select option:',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.openCamera();
          }
        },
        {          
          text: 'Galeri',
          icon: 'image',
          handler: () => {
            this.openGallery();
          }
        }
      ]
    });
    actionSheet.present();
  }

  saveProduct(){
    if(this.isEdit == true){
      this.updateProduct();
    }
    else{
      this.insertNewProduct();
    }
  }

  updateProduct(){
    if(this.name == null || this.name == ''){
      this.showAlert('Info', 'Nama harus diisi.');
      return false;
    }
    // if(this.province_id == null || this.province_id == ''){
    //   this.showAlert('Info', 'Provinsi barang harus diisi.');
    //   return false;
    // }
    if(this.kode_barang == null || this.kode_barang == ''){
      this.showAlert('Info', 'Kode barang harus diisi.');
      return false;
    }
    if(this.category_id == null || this.category_id == ''){
      this.showAlert('Info', 'Kategori barang harus diisi.');
      return false;
    }    
    if(this.description == null || this.description == ''){
      this.showAlert('Info', 'Deskripsi barang harus diisi.');
      return false;
    }
    if(this.price == null || this.price <= 0){
      this.showAlert('Info', 'Harga barang harus lebih dari 0.');
      return false;
    }
    if(this.images_edit.length <= 0){
      this.showAlert('Info', 'Lengkapi foto barang.');
      return false;
    }    
    let loading = this.loading('Saving processes...');
    loading.present();
    let param:any = {
      id: this.product_id,
      name: this.name,
      price: this.price,
      costumer_id: window.localStorage.getItem('id_user'),
      store_id: window.localStorage.getItem('id_shop'),
      category_id: this.category_id,
      kode_barang: this.kode_barang,
      province_id: this.province_id,
      city_id: 1,
      description: this.description,
      status: 1,
      image: this.images,
    };
    this.market.updateProduct(param)
    .map(res=>res.json())
    .subscribe(
      data=>{
        console.log(data);
        loading.dismiss();
        this.showAlert('Info', data.message);
        if(data.success == true){
          this.ev.publish('product:update', true);
          this.navCtrl.pop();
        }
      },
      onerror=>{
        loading.dismiss();
        this.showAlert('Error', 'Terjadi kesalahan, coba lagi atau hubungi Dxplor.');
      }
    );
  }

  insertNewProduct(){
    if(this.name == null || this.name == ''){
      this.showAlert('Info', 'Nama harus diisi.');
      return false;
    }
    // if(this.province_id == null || this.province_id == ''){
    //   this.showAlert('Info', 'Provinsi barang harus diisi.');
    //   return false;
    // }
    if(this.kode_barang == null || this.kode_barang == ''){
      this.showAlert('Info', 'Kategori barang harus diisi.');
      return false;
    }    
    if(this.category_id == null || this.category_id == ''){
      this.showAlert('Info', 'Kategori barang harus diisi.');
      return false;
    }    
    if(this.description == null || this.description == ''){
      this.showAlert('Info', 'Deskripsi barang harus diisi.');
      return false;
    }
    if(this.price == null || this.price <= 0){
      this.showAlert('Info', 'Harga barang harus lebih dari 0.');
      return false;
    }
    if(this.images.length <= 0){
      this.showAlert('Info', 'Lengkapi foto barang.');
      return false;
    }    
    let loading = this.loading('Saving processes...');
    loading.present();
    let param:any = {
      name: this.name,
      price: this.price,
      costumer_id: window.localStorage.getItem('id_user'),
      store_id: window.localStorage.getItem('id_shop'),
      category_id: this.category_id,
      kode_barang: this.kode_barang,
      province_id: this.province_id,
      city_id: 1,
      description: this.description,
      status: 1,
      image: this.images,
    };
    this.market.insertProduct(param)
    .map(res=>res.json())
    .subscribe(
      data=>{
        console.log(data);
        loading.dismiss();
        this.showAlert('Info', data.message);
        if(data.success == true){
          this.ev.publish('product:update', true);
          this.navCtrl.pop();
        }
      },
      onerror=>{
        loading.dismiss();
        this.showAlert('Error', 'Terjadi kesalahan, coba lagi atau hubungi Dxplor.');
      }
    );
  }

  hapusAssets(id:any, index:number){
    console.log(index);
    if(this.images_edit.length <= 1){
      this.showAlert('Info', 'Produk harus memiliki gambar, tambahkan gambar lain terlebih dahulu.');
      return false;
    }
    let loading = this.loading('Mohon tunggu...');
    loading.present();
    let alert = this.alertCtrl.create({
        title: 'Konfirmasi',
        subTitle: 'Gambar akan terhapus meskipun tidak menyimpan perubahan, yakin akan menghapus ?',
        buttons: [
            {
              text: 'Batal',
              handler: () =>{
                loading.dismiss();
              }
            },
            {
              text: 'Hapus',
              handler: () => {
                this.market.hapusAssets(id)
                .map(res => res.json())
                .subscribe(
                  data=>{
                    loading.dismiss();
                    if(data.success == true){
                      this.images_edit.splice(index, 1);
                    }
                    else{
                      this.showAlert('Error', 'Gagal menghapus gambar, coba lagi.');
                    }
                  },
                  onerror=>{
                    loading.dismiss();
                    this.showAlert('Error', 'Terjadi kesalahan, coba lagi atau hubungi Dxplor.');
                  }
                );
              }
            }
        ]
    });
    alert.present();    
  }

  public loading(content:string){
    let loader = this.loadingCtrl.create({
      content: content
    });

    return loader;
  }

  private showAlert(title:string, message:string){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}
