import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { MockStockLoginPage } from '../mock-stock-login/mock-stock-login';
import { FeedbackPage } from '../feedback/feedback';
import { AboutPage } from '../about/about';
import { currUser, gcompanies, gcompStocks, gstocks, gcompPrices, gnews, newNews } from '../../models/global'
import { Storage } from '@ionic/storage'; 

@Component({
  selector: 'page-options',
  templateUrl: 'options.html'
})
export class OptionsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  constructor(private dataBase:AngularFireDatabase ,private storage: Storage, private app:App, public fire:AngularFireAuth, public navCtrl: NavController) {
  }

   swipeEvent(e) {
    if(e.direction == '4'){
       this.navCtrl.parent.select(3);
    }
  }

  getBalance(){
    return currUser.profile.balance;
  }

  getTotal(){
    return gstocks.totalStocks;
  }

  getTeamName(){
    return currUser.profile.teamName;
  }
  getPart1(){
    return currUser.profile.part1; 
  }
  getPart2(){
    return currUser.profile.part2; 
  }
  
  page(){
     this.navCtrl.push(FeedbackPage);
  }

  page1(){
     this.navCtrl.push(AboutPage);
  } 

  logout(){
  	let that=this;
    this.fire.auth.signOut()
    .then(function() {
      console.log('Logged Out');
      gcompanies.company=null;
      gcompStocks.compStock=null;
      gstocks.stock=null;
      gstocks.totalStocks=0;
      gcompPrices.compPrice=null;
      gnews.news=null;
      newNews.new=false;
      that.storage.set('profile',null);
      that.dataBase.database.ref("User/"+currUser.profile.teamID+"/balance").off();
      that.dataBase.database.ref("Company").off();
      that.dataBase.database.ref("CompPrice").off();
      that.dataBase.database.ref("Transactions/"+currUser.profile.teamID).off();
      that.dataBase.database.ref("Stocks/"+currUser.profile.teamID).off();
      that.dataBase.database.ref("news").off();
      that.app.getRootNav().setRoot(MockStockLoginPage);
    })
    .catch(error=>{
      console.log('Unable to sign out');
      console.log(error);
    });
  }  

}
