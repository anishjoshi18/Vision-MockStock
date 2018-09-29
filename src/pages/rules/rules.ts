import { Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsControllerPage } from '../tabs-controller/tabs-controller';

@Component({
  selector: 'page-rules',
  templateUrl: 'rules.html'
})
export class RulesPage {
  
  // this tells the tabs component which Pages
  // should be each tab's root Page
  constructor(public navCtrl: NavController) {
  }
  goToDashboard(params){
    if (!params) params = {};
    if(this.checked)
      this.navCtrl.setRoot(TabsControllerPage);
  }

  checked : boolean = false;
}
