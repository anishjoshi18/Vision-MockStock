import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { gcompanies } from '../../models/global';
import { Company } from '../../models/gcompany';



/**
 * Generated class for the CompdescPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-compdesc',
  templateUrl: 'compdesc.html',
})
export class CompdescPage {

  constructor(private dataBase:AngularFireDatabase,public navCtrl: NavController, public navParams: NavParams) {
  	this.selectedCompanyAbbr = <string>navParams.get('abbr');
  	this.selectedCompany= gcompanies.company.get(this.selectedCompanyAbbr);
  	let ref=this.dataBase.database.ref("CompDesc/"+this.selectedCompanyAbbr);
    ref.once('value', (snap) => {
      if(snap.exists()){
       	this.desc=snap.val();
      }
     });
  }
  selectedCompanyAbbr: string; 
  selectedCompany: Company;
  desc="";
  getDesc(){
  	return this.desc;
  }

}
