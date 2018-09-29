import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { OptionsPage } from '../options/options';
import { PlaceOrderPage } from '../place-order/place-order';
import { YourSharesPage } from '../your-shares/your-shares';
import { NewsPage } from '../news/news';
import { newNews } from '../../models/global';

@Component({
  selector: 'page-tabs-controller',
  templateUrl: 'tabs-controller.html'
})
export class TabsControllerPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = DashboardPage;
  tab2Root: any = PlaceOrderPage;
  tab3Root: any = YourSharesPage;
  tab4Root: any = NewsPage;
  tab5Root: any = OptionsPage;
  constructor(private cdRef:ChangeDetectorRef, public navCtrl: NavController) {
  }



  ngAfterViewChecked()
  {
    if(newNews.new)
      this.returnIt='!';
    else
      this.returnIt='';
    this.cdRef.detectChanges();
  }

  returnIt='';
  newNewsM(){
    return this.returnIt;
  }

}
  