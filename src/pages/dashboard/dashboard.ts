import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController ,App } from 'ionic-angular';
import { Company } from '../../models/gcompany';
import { AngularFireDatabase } from 'angularfire2/database';
import { CompStocks } from '../../models/CompStocks';
import { CompPrice } from '../../models/compPrice';
import { CompanyPage } from '../company/company';
import { News } from '../../models/gnews';
import { StartAppPage } from '../start-app/start-app';
import { currUser, gcompanies, gcompStocks, gstocks, gcompPrices, gnews, newNews, gcompNews } from '../../models/global';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})


export class DashboardPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  constructor(private alertCtrl: AlertController,private app:App,private loadingCtrl: LoadingController, private dataBase: AngularFireDatabase, public navCtrl: NavController) {
  	this.presentLoadingDefault();
    this.initializeItems();
    this.checkConnection();
  }

  checkConnection(){
    var connectedRef = this.dataBase.database.ref(".info/connected");
    var that=this;
      setTimeout(function(){
      connectedRef.on("value", function(snap) {
        if (snap.val() === true) {
          that.alert.dismiss();
        } else {
          that.showAlert();
        }
      });
    }, 2000);
  }

  showAlert() {
    this.alert = this.alertCtrl.create({
      title: 'Can\'t Connect!',
      subTitle: 'Please check your Internet connection!',
      enableBackdropDismiss: false
    });
    this.alert.present();
  }

  swipeEvent(e) {
    if(e.direction == '2'){
       this.navCtrl.parent.select(1);
    }
  }

  searchQuery: string = '';
  companies =new Map();
  compStocks =new Map();
  compPrices: CompPrice[]=[];
  compPricess:CompPrice[]=[];
  compPriceMap =new Map();
  stocks =new Map();
  news =new Map();
  arrow=true;
  compNews = new Map();
  alert=this.alertCtrl.create();

  doRefresh(refresher) {
    this.dataBase.database.ref("User/"+currUser.profile.teamID+"/balance").off();
    this.dataBase.database.ref("Company").off();
    this.dataBase.database.ref("CompPrice").off();
    this.dataBase.database.ref("Transactions/"+currUser.profile.teamID).off();
    this.dataBase.database.ref("Stocks/"+currUser.profile.teamID).off();
    this.dataBase.database.ref("news").off();
    
    this.app.getRootNav().setRoot(StartAppPage);

    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  getBalance(){
    return currUser.profile.balance;
  }

  getArrow(compAbbr){
    return this.compPriceMap.get(compAbbr).arrow;
  }

  showCompany(company: Company){
 	  this.navCtrl.push(CompanyPage, {company});
  }

  loading:any;
  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Fetching Data',
      spinner: 'dots'
    });

    this.loading.present();

    setTimeout(() => {
      this.loading.dismiss();
    }, 10000);
  }

  initializeItems() {
  	let that=this;

    //Get user rank and balance
    let ref0=this.dataBase.database.ref("User/"+currUser.profile.teamID+"/balance");
    ref0.on('value', function(snap){
          currUser.profile.balance = snap.val();
    });

  	//Get Company Data
    let ref=this.dataBase.database.ref("Company");
    ref.on('value', function(snap){
   	  if(snap.exists()){
        snap.forEach(data => {
    			var val = data.val();
    			var company= <Company>{};
    			company.name=val.name;
    			company.low=val.low;
    			company.high=val.high;
    			company.desc=val.desc;
    			that.companies.set(data.key,company);
          return false;							
      });
     }
     console.log('Companies Fetched');
     gcompanies.company=that.companies;  
    });
    
    //Get Company Prices
    let ref1=this.dataBase.database.ref("CompPrice");
    ref1.on('value', (snap) => {
   	  that.compPrices=[];   
      if(snap.exists()){
        snap.forEach((data) => {
    			var val = data.val();
    			var compPrice= <CompPrice>{};
    			compPrice.comp_abbr=data.key;
    			compPrice.price=val.price;
    			compPrice.p_price=val.p_price;
          compPrice.shares=val.shares;
          if(compPrice.p_price>compPrice.price)
            compPrice.arrow=false;
          else
            compPrice.arrow=true;
    			that.compPrices.push(compPrice);
          that.compPriceMap.set(data.key,compPrice);
          return false;							
      });
     }
     that.compPricess=that.compPrices;
     gcompPrices.compPrice=that.compPriceMap;
     console.log('Prices Fetched');
     if(gstocks.stock!=null){
        gstocks.totalStocks=0;
        gstocks.stock.forEach((value: number, key: string) => {
            gstocks.totalStocks=gstocks.totalStocks+ gcompPrices.compPrice.get(key).price * value;
        });
        var up2={};
        up2['User/'+currUser.profile.teamID+'/eval']=gstocks.totalStocks+currUser.profile.balance;
        that.dataBase.database.ref().update(up2).catch(function(err){console.log(err);});        
       }
    });

    //Get User Stocks
    let ref2=this.dataBase.database.ref("Transactions/"+currUser.profile.teamID);
    ref2.on('value', function(snap){
   	  if(snap.exists()){
        snap.forEach(data => {
    			var val = data.val();
          var lcompStocks= <CompStocks>{};
          lcompStocks.comp=val.comp;
          lcompStocks.price=val.price;
          lcompStocks.quantity=val.quantity;
          lcompStocks.tran=(val.tran==1)?'Buy':'Sell';
          that.compStocks.set(data.key,lcompStocks);
          return false;
        });
        gcompStocks.compStock=that.compStocks;
      }
      console.log('Stocks Fetched');
    });
       
    //Get total user Stocks
    let ref3=this.dataBase.database.ref("Stocks/"+currUser.profile.teamID);
    ref3.on('value', function(snap){
       if(snap.exists()){
          snap.forEach(data => {
            that.stocks.set(data.key,data.val());
            return false;
      });
      gstocks.stock=that.stocks;
      console.log('Total Stocks Fetched');
      if(gcompPrices.compPrice!=null){
        gstocks.totalStocks=0;
        gstocks.stock.forEach((value: number, key: string) => {
            gstocks.totalStocks=gstocks.totalStocks+ gcompPrices.compPrice.get(key).price * value;
        });
        var up2={};
        up2['User/'+currUser.profile.teamID+'/eval']=gstocks.totalStocks+currUser.profile.balance;
        that.dataBase.database.ref().update(up2).catch(function(err){console.log(err);});        
      }
     }
    });

    //Get News
    let ref4=this.dataBase.database.ref("news");
    ref4.on('value', function(snap){
       if(snap.exists()){
          snap.forEach(data => {
            var val = data.val();
            var lnews= <News>{};
            lnews.applied=val.applied;
            if(lnews.applied){
              lnews.desc=val.desc;
                lnews.heading=val.heading;
              lnews.times=""+val.time;
              lnews.effect=val.effect;
              if(val.effect&&val.affectedC!=undefined){
                var affc=data.child('affectedC');
                affc.forEach(comp1 => {
                  var set=new Set();
                  if(that.compNews.get(comp1.key)!=undefined){
                    set=that.compNews.get(comp1.key)
                  }
                  set.add(lnews.times);
                  that.compNews.set(comp1.key,set);
                  return false;
                });
              }
              that.news.set(lnews.times,lnews);
            }
            return false;
      });
      gcompNews.compNews=that.compNews;
      gnews.news=that.news;
      newNews.new=true;
      console.log('News Fetched');
      that.loading.dismiss();
     }
    });

  }

  getBal(){
    return currUser.profile.balance;
  }

  initializeItemsAgain(){
  	 this.compPrices=this.compPricess;
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItemsAgain();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.compPrices = this.compPrices.filter((compPrice) => {
        return (this.companies.get(compPrice.comp_abbr).name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }  
}
