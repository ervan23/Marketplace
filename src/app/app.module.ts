import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';

import { CalendarModule } from 'ion2-calendar';
import { SocialSharing } from '@ionic-native/social-sharing';

import { Page1 } from '../pages/page1/page1';
import { Cashback } from '../pages/account/cashback';
import { AccountPage } from '../pages/account/account';
import { TransferDpay } from '../pages/account/transfer-dpay';
import { TransferConfirmation } from '../pages/account/transfer-confirmation';
import { HistoryBalance } from '../pages/account/history-balance';
import { ForgotPassword } from '../pages/account/forgot-password';
import { TopupDpay } from '../pages/account/topup-dpay';
import { TopupConfirmation } from '../pages/account/topup-confirmation';
import { MarketPage } from '../pages/market/market';
import { RegisterShopPage } from '../pages/market/register-shop';
import { ProductPage } from '../pages/market/products';
import { DetailProductPage } from '../pages/market/detail-product';
import { MyShop } from '../pages/market/my-shop';
import { TransferAP } from '../pages/market/transfer-ap';
import { HistoryAP } from '../pages/market/history-ap';
import { AddProduct } from '../pages/market/add-product';
import { MobilePage } from '../pages/mobile/mobile';
import { PulsaPage } from '../pages/mobile/pulsa';
import { DataPage } from '../pages/mobile/data';
import { PlanePage } from '../pages/plane/plane';
import { ResultPlane } from '../pages/plane/result-plane';
import { ReturnFlight } from '../pages/plane/return-flight';
import { PlaneSchedule } from '../pages/plane/plane-schedule';
import { DetailPassenger } from '../pages/plane/detail-passenger';
import { IssuedFlight } from '../pages/plane/issued-flight';
import { PageTimelineSchedule} from '../pages/plane/timeline-schedule';
import { InsurancePage } from '../pages/insurance/insurance';
import { BfiInsurancePage } from '../pages/insurance/bfi/bfi';
import { BfiSimulasiPage } from '../pages/insurance/bfi/bfi-simulasi';
import { BfiPengajuanPage } from '../pages/insurance/bfi/bfi-pengajuan';
import { BfiListPengajuan } from '../pages/insurance/bfi/bfi-list-pengajuan';
import { MncLifePage } from '../pages/insurance/mnc/mnc';
import { MncLayananPage } from '../pages/insurance/mnc/mnc-layanan';
import { MncPengajuanPage } from '../pages/insurance/mnc/mnc-pengajuan';
import { MncAhliwarisPage } from '../pages/insurance/mnc/mnc-ahliwaris';
import { MncListPengajuan } from '../pages/insurance/mnc/mnc-list-pengajuan';
import { MedicalPage } from '../pages/medical/medical';
import { OthersPage } from '../pages/others/others';
import { PlnPage } from '../pages/bills/pln/pln';
import { PlnConfirm } from '../pages/bills/pln/pln-confirm';
import { PlnSummary } from '../pages/bills/pln/pln-summary';
import { PlnTokenPage } from '../pages/bills/pln-token/pln-token';
import { PlnTokenConfirm } from '../pages/bills/pln-token/pln-token-confirm';
import { TokenSummary } from '../pages/bills/pln-token/token-summary';
import { PamPage } from '../pages/bills/pam/pam';
import { PamConfirm } from '../pages/bills/pam/pam-confirm';
import { PamSummary } from '../pages/bills/pam/pam-summary';
import { BpjsPage } from '../pages/bills/bpjs/bpjs';
import { BpjsConfirm } from '../pages/bills/bpjs/bpjs-confirm';
import { BpjsSummary } from '../pages/bills/bpjs/bpjs-summary';
import { TelkomPage } from '../pages/bills/telkom/telkom';
import { TelkomConfirm } from '../pages/bills/telkom/telkom-confirm';
import { TelkomSummary } from '../pages/bills/telkom/telkom-summary';
import { SpeedyPage } from '../pages/bills/speedy/speedy';
import { SpeedyConfirm } from '../pages/bills/speedy/speedy-confirm';
import { SpeedySummary } from '../pages/bills/speedy/speedy-summary';
import { PascabayarPage } from '../pages/bills/pascabayar/pascabayar';
import { PascabayarConfirm } from '../pages/bills/pascabayar/pascabayar-confirm';
import { PascabayarSummary } from '../pages/bills/pascabayar/pascabayar-summary';
import { LeasingPage } from '../pages/bills/leasing/leasing';
import { LeasingConfirm } from '../pages/bills/leasing/leasing-confirm';
import { LeasingSummary } from '../pages/bills/leasing/leasing-simmary';
import { TvPage } from '../pages/bills/tv/tv';
import { TvConfirm } from '../pages/bills/tv/tv-confirm';
import { TvSummary } from '../pages/bills/tv/tv-summary';
import { BillsPage } from '../pages/bills/bills';
import { ElectronicPage } from '../pages/electronic/electronic';
import { FashionPage } from '../pages/fashion/fashion';
import { GadgetPage } from '../pages/gadget/gadget';
import { HealthPage } from '../pages/health/health';
import { MLMPage } from '../pages/mlm/mlm';
import { NotaryPage } from '../pages/notary/notary';
import { RestoPage } from '../pages/resto/resto';
import { TravelPage } from '../pages/travel/travel';
import { LoginPage } from '../pages/login/login';
import { CodeConfirmPage } from '../pages/login/code-confirm';
import { HotelPage } from '../pages/hotel/hotel';
import { DetailHotel } from '../pages/hotel/detail';
import { ProductDetailPage } from '../pages/product-detail/product-detail';
import { ResultPage } from '../pages/hotel/result';
import { HelpPage } from '../pages/help/help';
import { ReferencePage } from '../pages/reference/reference';
import { RegisterPage } from '../pages/register/register';
import { RegisterFacebook } from '../pages/register/register-facebook';
import { RegisterGoogle } from '../pages/register/register-google';
import { OtomotifPage } from '../pages/otomotif/otomotif';
import { PropertyPage } from '../pages/property/property';
import { PariwisataPage } from '../pages/pariwisata/pariwisata';
import { User } from './user';

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Cashback,
    AccountPage,
    TransferDpay,
    TransferConfirmation,
    TopupDpay,
    TopupConfirmation,
    HistoryBalance,
    ForgotPassword,
    MarketPage,
    ProductPage,
    DetailProductPage,
    MyShop,
    RegisterShopPage,
    AddProduct,
    MobilePage,
    PlanePage,
    ResultPlane,
    ReturnFlight,
    PlaneSchedule,
    DetailPassenger,
    IssuedFlight,
    PageTimelineSchedule,
    InsurancePage,
    BfiInsurancePage,
    BfiSimulasiPage,
    BfiPengajuanPage,
    BfiListPengajuan,
    MncLifePage,
    MncLayananPage,
    MncPengajuanPage,
    MncAhliwarisPage,
    MncListPengajuan,
    MedicalPage,
    OthersPage,
    BillsPage,
    ElectronicPage,
    FashionPage,
    GadgetPage,
    HealthPage,
    MLMPage,
    NotaryPage,
    RestoPage,
    TravelPage,
    PulsaPage,
    DataPage,
    LoginPage,
    CodeConfirmPage,
    ProductDetailPage,
    PlnPage,
    PlnConfirm,
    PlnSummary,
    PlnTokenPage,
    TokenSummary,
    PlnTokenConfirm,
    PamPage,
    PamConfirm,
    PamSummary,
    BpjsPage,
    BpjsConfirm,
    BpjsSummary,
    TelkomPage,
    TelkomConfirm,
    TelkomSummary,
    SpeedyPage,
    SpeedyConfirm,
    SpeedySummary,
    PascabayarPage,
    PascabayarConfirm,
    PascabayarSummary,
    LeasingPage,
    LeasingConfirm,
    LeasingSummary,
    TvPage,
    TvConfirm,
    TvSummary,
    HotelPage,
    DetailHotel,
    ResultPage,
    ReferencePage,
    HelpPage,
    RegisterPage,
    RegisterFacebook,
    RegisterGoogle,
    OtomotifPage,
    PropertyPage,
    PariwisataPage,
    TransferAP,
    HistoryAP
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CalendarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Cashback,
    AccountPage,
    TransferDpay,
    TransferConfirmation,
    TopupDpay,
    TopupConfirmation,
    HistoryBalance,
    ForgotPassword,
    MarketPage,
    ProductPage,
    DetailProductPage,
    MyShop,
    RegisterShopPage,
    AddProduct,
    MobilePage,
    PlanePage,
    ResultPlane,
    ReturnFlight,
    PlaneSchedule,
    DetailPassenger,
    IssuedFlight,
    PageTimelineSchedule,
    InsurancePage,
    BfiInsurancePage,
    BfiSimulasiPage,
    BfiPengajuanPage,
    BfiListPengajuan,
    MncLifePage,
    MncLayananPage,
    MncPengajuanPage,
    MncAhliwarisPage,
    MncListPengajuan,
    MedicalPage,
    OthersPage,
    BillsPage,
    ElectronicPage,
    FashionPage,
    GadgetPage,
    HealthPage,
    MLMPage,
    NotaryPage,
    RestoPage,
    TravelPage,
    PulsaPage,
    DataPage,
    LoginPage,
    CodeConfirmPage,
    ProductDetailPage,
    PlnPage,
    PlnConfirm,
    PlnSummary,
    PlnTokenPage,
    PlnTokenConfirm,
    TokenSummary,
    PamPage,
    PamConfirm,
    PamSummary,
    BpjsPage,
    BpjsConfirm,
    BpjsSummary,
    TelkomPage,
    TelkomConfirm,
    TelkomSummary,
    SpeedyPage,
    SpeedyConfirm,
    SpeedySummary,
    PascabayarPage,
    PascabayarConfirm,
    PascabayarSummary,
    LeasingPage,
    LeasingConfirm,
    LeasingSummary,
    TvPage,
    TvConfirm,
    TvSummary,
    HotelPage,
    DetailHotel,
    ResultPage,
    ReferencePage,
    HelpPage,
    RegisterPage,
    RegisterFacebook,
    RegisterGoogle,
    OtomotifPage,
    PropertyPage,
    PariwisataPage,
    TransferAP,
    HistoryAP
  ],
  providers: [Storage, {provide: ErrorHandler, useClass: IonicErrorHandler}, User]
})
export class AppModule {}
