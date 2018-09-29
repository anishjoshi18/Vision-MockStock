import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Company } from '../../models/gcompany';
import { News } from '../../models/gnews';
import { gcompanies, gstocks, gcompPrices, gcompStocks, currUser, gnews, gcompNews } from '../../models/global';
import { AngularFireDatabase } from 'angularfire2/database';
import { NewsPPage } from '../news-p/news-p';
import { CompdescPage } from '../compdesc/compdesc';


/**
 * Generated class for the CompanyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-company',
  templateUrl: 'company.html',
})
export class CompanyPage {

  constructor(public dataBase: AngularFireDatabase,public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
  	this.selectedCompanyAbbr = <string>navParams.get('company');
  	this.selectedCompany= gcompanies.company.get(this.selectedCompanyAbbr);
  }

  selectedCompanyAbbr: string; 
  selectedCompany: Company;
  stocks=0;
  prices=gcompPrices.compPrice;
  compStocks=gcompStocks.compStock;
  alert1: any;
  tran: string;
  valid=false;
  lnews=gnews.news;
  
  showAlert(message :string, submsg: string) {
    let alert = this.alertCtrl.create({
      title: message,
      subTitle: submsg,
      buttons: ['OK']
    });
    alert.present();
  }

  keys(){
    if(this.alert1!=null)
      this.getMsg();
    if(gcompStocks.compStock==null){
        console.log('Compstock isx null');
        gcompStocks.compStock=new Map();
        return [];
    }
    else{
      this.compStocks=gcompStocks.compStock;
      return Array.from(gcompStocks.compStock.keys()).reverse();
    }
  }

  newsKeys(){
    if(gcompNews.compNews.get(this.selectedCompanyAbbr)==null){
      var el = document.getElementById('no');
      el.innerHTML='No news to show!';
      return [];
    }
    return Array.from(gcompNews.compNews.get(this.selectedCompanyAbbr)).reverse();
  }

  showNews(snews: News){
    this.navCtrl.push(NewsPPage, {snews});
  }

  getStocks(){
  	this.stocks=0;
    if(gstocks.stock!=null){
  	  if(gstocks.stock.get(this.selectedCompanyAbbr)!=null){
  		  this.stocks=<number>gstocks.stock.get(this.selectedCompanyAbbr);
  	  }
    }
  	return this.stocks;
  }

  getBal(){
    return currUser.profile.balance;
  }

  getHigh(){
    return this.selectedCompany.high;
  }

  getLow(){
    return this.selectedCompany.low;
  }

  getBuyingCapacity(){
    var cap=Math.floor(currUser.profile.balance/this.prices.get(this.selectedCompanyAbbr).price);
    return cap;
  }

  getMsg(): string {
    let msg=this.selectedCompany.name+" ("+this.selectedCompanyAbbr +"): ₹"+ this.prices.get(this.selectedCompanyAbbr).price 
        +"<br>Available Funds: ₹"+ currUser.profile.balance+"<br>";
    if(this.tran=='Buy'){
      msg=msg+"Buying Capacity: "+this.getBuyingCapacity();
      msg=msg+"<br>Available shares: "+this.prices.get(this.selectedCompanyAbbr).shares;
    }
    else
      msg=msg+"Available shares: "+this.getStocks();
    msg=msg+"<br>";
    if(this.valid==true){
      var that=this;
      msg=msg+"<font color=\"red\">*Enter Valid Quantity</font>";
      setTimeout(function() {
        that.valid=false;
      }, 5000);
    }
    if(this.alert1!=null){
      this.alert1.setMessage(msg);
    }
    return msg;
  }

  isValid(tran,quantity){
    let quan=+quantity; 
    if(Number.isNaN(quan))
      return false;
    if(quan<=0)
      return false;
    if(tran=='Buy'){
      if(this.prices.get(this.selectedCompanyAbbr).shares<quan)
        return false;
      if(this.prices.get(this.selectedCompanyAbbr).price*(quan)>currUser.profile.balance)
        return false;
    }
    else{
      if((quan)>this.getStocks())
        return false;
    }
    return true;
  }

  getDescription(){
    var abbr=this.selectedCompanyAbbr;
    this.navCtrl.push(CompdescPage,{abbr});
  }


  presentPrompt(tran: string) {
    this.tran=tran;
    this.alert1 = this.alertCtrl.create({
      title: tran,
      message:this.getMsg(),
      inputs: [
        {
          name: 'quantity',
          placeholder: 'Quantity'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            this.alert1=null;
          }
        },
        {
          text: 'Submit',
          handler: data => {
            if (this.isValid(tran,data.quantity)) {
              data.quantity=Math.floor(data.quantity);
              this.showConfirm(tran,data.quantity);
              this.alert1=null;
            } 
            else {
              this.valid=true;
              return false;
            }
          }
        }
      ]
    });
    this.alert1.present();
  }

  getConfirmMsg(tran, quantity): string{
    let msg='';
    let amount=this.prices.get(this.selectedCompanyAbbr).price*(+quantity);
    if(tran=='Buy'){
      msg=msg+"<br>Total Debit: ₹"+amount;
    }
    else{
      msg=msg+"<br>Total Credit: ₹"+amount;
    }
    return msg;
  }

  DateTime(){
    var dt=new Date();
    return ''+((dt.getDate()<10)?'0':'')+dt.getDate()+((dt.getMonth()<9)?'0':'')+(dt.getMonth()+1)+dt.getFullYear().toString().substring(2)
           +((dt.getHours()<10)?'0':'')+dt.getHours()+((dt.getMinutes()<10)?'0':'')+dt.getMinutes()+((dt.getSeconds()<10)?'0':'')+dt.getSeconds();
  }

  buyStocks(quantity: number){

    var that=this;
    let ref1=this.dataBase.database.ref("CompPrice/"+that.selectedCompanyAbbr+"/shares");
    ref1.once('value', (snap) => {
      if(snap.exists()){
        if(this.prices.get(this.selectedCompanyAbbr).shares-quantity<=0){
          this.showAlert('Transaction Denied!!!','Stocks are not Available');
        }
        else{
          var newShare={};
          newShare['/CompPrice/'+that.selectedCompanyAbbr+'/shares']=(+this.prices.get(this.selectedCompanyAbbr).shares)-(+quantity);
          that.dataBase.database.ref().update(newShare);
          

          //Add Stocks
          var newStock={};
          var price=that.prices.get(that.selectedCompanyAbbr).price;
          newStock['/Stocks/'+currUser.profile.teamID+'/'+that.selectedCompanyAbbr]=that.getStocks()+quantity;
          that.dataBase.database.ref().update(newStock);
          
          //Add Transactions
          var newTran={};
          var tranData = {
            comp: that.selectedCompanyAbbr,
            price: price,
            quantity: quantity,
            tran: 1
          };
          newTran['/Transactions/'+currUser.profile.teamID+'/'+that.DateTime()]=tranData;
          that.dataBase.database.ref().update(newTran);

          //Change balance
          currUser.profile.balance=currUser.profile.balance-that.prices.get(that.selectedCompanyAbbr).price*(+quantity);
          var newBal={};
          newBal['/User/'+currUser.profile.teamID+'/balance']=currUser.profile.balance;
          that.dataBase.database.ref().update(newBal);
          that.updateCompPrice(true,quantity);
      }
    }
    else{
        that.showAlert('Can\'t Connect!','Please make sure you are connected to internet');
      }

     });
   }
          
  sellStocks(quantity: number){
    var that=this;
    let ref1=this.dataBase.database.ref("CompPrice/"+that.selectedCompanyAbbr+"/shares");
    ref1.once('value', (snap) => {
      if(snap.exists()){
        
        var newShare={};
        newShare['/CompPrice/'+that.selectedCompanyAbbr+'/shares']=(+this.prices.get(this.selectedCompanyAbbr).shares)+(+quantity);
        that.dataBase.database.ref().update(newShare);
        

        //Add Stocks
          

          var price=that.prices.get(that.selectedCompanyAbbr).price;
            var newStock={};
            newStock['/Stocks/'+currUser.profile.teamID+'/'+that.selectedCompanyAbbr]=that.getStocks()-quantity;
            that.dataBase.database.ref().update(newStock);
            if(that.getStocks()==0){
              that.dataBase.database.ref('Stocks/'+currUser.profile.teamID+'/'+that.selectedCompanyAbbr).remove();
            }
          
          //Add Transactions
          var newTran={};
          var tranData = {
            comp: that.selectedCompanyAbbr,
            price: price,
            quantity: quantity,
            tran: 0
          };
          newTran['/Transactions/'+currUser.profile.teamID+'/'+that.DateTime()]=tranData;
          that.dataBase.database.ref().update(newTran);

          //Change balance
          currUser.profile.balance=currUser.profile.balance+that.prices.get(that.selectedCompanyAbbr).price*(+quantity);
          var newBal={};
          newBal['/User/'+currUser.profile.teamID+'/balance']=currUser.profile.balance;
          that.dataBase.database.ref().update(newBal);
          that.updateCompPrice(false,quantity);
      }
      else{
        that.showAlert('Can\'t Connect!','Please make sure you are connected to internet');
      }
     });
  }

  showConfirm(tran, quantity) {
    let confirm = this.alertCtrl.create({
      title: 'Are you sure!',
      message: this.getConfirmMsg(tran, quantity),
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            confirm=null;
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            if(tran=='Buy'){
              this.buyStocks(+quantity);
            }
            else
              this.sellStocks(+quantity);
            confirm=null;
          }
        }
      ]
    });
    confirm.present();
  }

  updateCompPrice(tran, quantity){
   var randVal=(Math.floor(Math.random() * 4));
   if(randVal!=0){
    if(!tran)
      randVal=-randVal;
    var up1={};
    var that=this;
    var firebaseRef1=this.dataBase.database.ref('CompPrice/'+this.selectedCompanyAbbr+'/price');
    firebaseRef1.once('value',function(data){
        if(data.exists()){
            var new_price= ((+data.val())+randVal);
            console.log(data.val()+'->'+ new_price);
            up1['CompPrice/'+that.selectedCompanyAbbr+'/p_price']=(+data.val());
            up1['CompPrice/'+that.selectedCompanyAbbr+'/price']=new_price;
            that.dataBase.database.ref().update(up1).catch(function(err){console.log(err);});                    

            var firebaseRef2=that.dataBase.database.ref('Company/'+that.selectedCompanyAbbr);
            firebaseRef2.once('value',function(data){
                var val=data.val();
                if(new_price>val.high){
                    var up2={};
                    up2['Company/'+that.selectedCompanyAbbr+'/high']=new_price;
                    that.dataBase.database.ref().update(up2).catch(function(err){console.log(err);});        
                }
                else if(new_price<val.low){
                    up2={};
                    up2['Company/'+that.selectedCompanyAbbr+'/low']=new_price;
                    that.dataBase.database.ref().update(up2).catch(function(err){console.log(err);});        
                }
            });
        }
    }).catch(function(err){console.log(err);});
   }
  }




  //Chart
  

  }
