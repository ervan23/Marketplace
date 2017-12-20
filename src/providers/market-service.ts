import { Injectable } from '@angular/core';
import { Http, RequestOptions, RequestMethod, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MarketService {
  public res = {};
  private base_url  = "http://omahit.info/katalog/";

  constructor(public http: Http) {
    //console.log('Hello MarketService Provider');
  }

  getCategory(){
    return this.http.get(this.base_url+'api/category', {})
  }

  getProducts(id){
    return this.http.get(this.base_url+'api/product?category_id='+id, {})
  }

  insertProduct(data){
    return this.http.post(this.base_url+'api/product', data, {});
  }

  getMyProduct(id:any){
    return this.http.get(this.base_url+'api/cproduct?id='+id);
  }

  getProductByShop(id_shop:any){
    return this.http.get(this.base_url+'api/sproduct?id='+id_shop);
  }

  getProvince(){
    return this.http.get(this.base_url+'api/province', {});
  }

  deleteProduct(data){
    let options = new RequestOptions({
      method: RequestMethod.Post,
      body: JSON.stringify(data)
    });
    return this.http.request(this.base_url+'api/product/product/'+data.product_id, options);
  }

  deleteStore(id){
    return this.http.post(this.base_url+'api/store/store/'+id, {});
  }

  updateProduct(data){
    return this.http.post(this.base_url+'api/product', data, {});
  }

  hapusAssets(data){
    return this.http.get(this.base_url+'api/asset?id='+data);
  }

  getDetailProduct(id_product){
     return this.http.get(this.base_url+'api/product?id='+id_product);
  }

  checkUserHaveShop(id:any){
    return this.http.get(this.base_url+'api/store?costumer_id='+id, {});
  }

  getShopByCustomer(id:any){
    return this.http.get(this.base_url+'api/store?costumer_id='+id, {});
  }

  saveShop(data:any){
    return this.http.post(this.base_url+'api/store', data, {});
  }

  getApType(){
    return this.http.get(this.base_url+'api/deposite', {});
  }

  useAPForProduct(data){
    return this.http.post(this.base_url+'api/transaction', data, {});
  }

  getAPBalance(id_cust){
    return this.http.get(this.base_url+'api/costumer?id='+id_cust, {});
  }

  getHistoryAPBalance(id_cust){
    return this.http.get(this.base_url+'api/history?costumer_id='+id_cust, {});
  }

  checkEmail(email){
    return this.http.post("http://dxplor.com/dxplor/Mo_customer/checkemailid", JSON.stringify({email: email}), {});
  }
}
