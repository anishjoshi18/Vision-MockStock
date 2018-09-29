import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { gstocks } from '../../models/global';
import { gcompPrices } from '../../models/global';

/**
 * Generated class for the YourSharesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-your-shares',
  templateUrl: 'your-shares.html',
})
export class YourSharesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	gstocks.totalStocks=0;
    if(gstocks.stock!=null){
    	this.stocks.forEach((value: number, key: string) => {
        	gstocks.totalStocks=gstocks.totalStocks+ this.prices.get(key).price * value;
    	});
    }
  }


   swipeEvent(e) {
    if(e.direction == '2'){
       this.navCtrl.parent.select(3);
    }
    else if(e.direction == '4'){
       this.navCtrl.parent.select(1);
    }
  }
  
  stocks=gstocks.stock;
  prices=gcompPrices.compPrice;

  keys(){
    if(gstocks.stock==null){
      return [];
    }
    else{
      this.prices=gcompPrices.compPrice;
      this.stocks=gstocks.stock;
      return Array.from( gstocks.stock.keys());
    }
  }

  getTotal(){
    return gstocks.totalStocks;
  }
  
}
