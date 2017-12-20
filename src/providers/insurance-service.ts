import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class InsuranceService {
  public res = {};  
  private base_url  = "http://dxplor.com/";

  constructor(public http: Http) {
    console.log('Hello InsuranceService Provider');
  }

  getInsuranceList(id_user){
      let param:any = {id_member: id_user};
      return this.http.post(this.base_url+'dxplor_bfi/index.php/Mo_bfi/getListPengajuan', JSON.stringify(param), {});
  }

  getDetailInsurance(bfi_no:any){
      let param:any = {bfi_no: bfi_no};
      return this.http.post(this.base_url+'dxplor_bfi/index.php/Mo_bfi/getDetailPengajuan', JSON.stringify(param), {});
  }

  pengajuan(id_user:any, data:any){
      let param:any = {
          id_member: id_user,
          nama: data.nama,
          email: data.email,
          no_hp: data.no_hp,
          no_hp2: data.no_hp2,
          alamat: data.alamat,
          unit_jaminan: data.unit_jaminan,
          pinjaman: data.pinjaman,
          foto_ktp: data.foto_ktp,
          jangka_waktu: data.jangka_waktu,
          referensi: data.referensi
      };
    return this.http.post(this.base_url+"dxplor_bfi/index.php/Mo_bfi/pengajuan", JSON.stringify(param), {});
  }

  checkEmail(email){
    return this.http.post(this.base_url+"dxplor/Mo_customer/checkemailid", JSON.stringify({email: email}), {});
  }

  pengajuanMNCLife(id_user:any, data:any){
    let param:any = {
          id_member: id_user,
          nama_lengkap: data.nama,
          email: data.email,
          no_hp: data.no_hp,
          no_ktp: data.no_ktp,
          alamat: data.alamat,
          kota: data.kota,
          tgl_lahir: data.tgl_lahir,
          aw_nama: data.aw_nama,
          aw_hubungan: data.aw_hubungan,
          aw_persentase: data.aw_persentase,
          aw_nama2: data.aw_nama2,
          aw_hubungan2: data.aw_hubungan2,
          aw_persentase2: data.aw_persentase2,
          aw_nama3: data.aw_nama3,
          aw_hubungan3: data.aw_hubungan3,
          aw_persentase3: data.aw_persentase3,
          referensi: data.referensi
      };
    return this.http.post(this.base_url+"dxplor/index.php/Mo_mnc/pengajuan", JSON.stringify(param), {});
  }

  getMNCListPengajuan(id_user:any){
      let param:any = {id_member: id_user};
      return this.http.post(this.base_url+"dxplor/index.php/Mo_mnc/getListPengajuan", JSON.stringify(param), {});
  }
}
