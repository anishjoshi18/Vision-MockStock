import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { StartAppPage } from '../pages/start-app/start-app';
import { PendingOrdersPage } from '../pages/pending-orders/pending-orders';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { NewsPage } from '../pages/news/news';
import { OptionsPage } from '../pages/options/options';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { MockStockLoginPage } from '../pages/mock-stock-login/mock-stock-login';
import { RulesPage } from '../pages/rules/rules';
import { YourSharesPage } from '../pages/your-shares/your-shares';
import { PlaceOrderPage } from '../pages/place-order/place-order';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { ProfilePage } from '../pages/profile/profile';
import { CompanyPage } from '../pages/company/company';
import { NewsPPage } from '../pages/news-p/news-p';
import { FeedbackPage } from '../pages/feedback/feedback'; 
import { AboutPage } from '../pages/about/about'; 
import { CompdescPage } from '../pages/compdesc/compdesc'; 


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';



const firebaseAuth= {
  apiKey: "AIzaSyAHTSVoD9Lia7BQTCzUe2LcX723UVnEjZo",
  authDomain: "vision-2k18.firebaseapp.com",
  databaseURL: "https://vision-2k18.firebaseio.com",
  projectId: "vision-2k18",
  storageBucket: "vision-2k18.appspot.com",
  messagingSenderId: "1021934660093"
}


@NgModule({
  declarations: [
    MyApp,
    StartAppPage,
    PendingOrdersPage,
    DashboardPage,
    NewsPage,
    OptionsPage,
    TabsControllerPage,
    MockStockLoginPage,
    RulesPage,
    YourSharesPage,
    PlaceOrderPage,
    ForgotPasswordPage,
    ProfilePage,
    CompanyPage,
    NewsPPage,
    FeedbackPage,
    AboutPage,
    CompdescPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
        backButtonText: '',
        iconMode: 'ios',
        modalEnter: 'modal-slide-in',
        modalLeave: 'modal-slide-out',
        tabsPlacement: 'bottom',
        pageTransition: 'ios-transition'
      }
    ),
    AngularFireModule.initializeApp(firebaseAuth),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot(),
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StartAppPage,
    PendingOrdersPage,
    DashboardPage,
    NewsPage,
    OptionsPage,
    TabsControllerPage,
    MockStockLoginPage,
    RulesPage,
    YourSharesPage,
    PlaceOrderPage,
    ForgotPasswordPage,
    ProfilePage,
    CompanyPage,
    NewsPPage,
    FeedbackPage,
    AboutPage,
    CompdescPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}