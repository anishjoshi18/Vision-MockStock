import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { gcompStocks, currUser } from '../../models/global';

/**
 * Generated class for the PlaceOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-place-order',
  templateUrl: 'place-order.html',
})
export class PlaceOrderPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	//console.log(this.displayIt());
  }

  compStocks=gcompStocks.compStock;

  swipeEvent(e) {
    if(e.direction == '2'){
       this.navCtrl.parent.select(4);
    }
    else if(e.direction == '4'){
       this.navCtrl.parent.select(2);
    }
  }

  keys(){
  	/*gcompStocks.compStock.forEach((value: CompStocks, key: string) => {
    	console.log(key, value);
	});*/

    if(gcompStocks.compStock==null){
      gcompStocks.compStock=new Map();
      return [];
    }
    else{
      this.compStocks=gcompStocks.compStock;      
	    return Array.from( gcompStocks.compStock.keys()).reverse();
    }
  }

  getBal(){
    return currUser.profile.balance;
  }
  

}
