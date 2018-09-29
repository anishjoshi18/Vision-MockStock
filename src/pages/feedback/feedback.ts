import { Component,  ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { currUser } from '../../models/global';
import { OptionsPage } from '../options/options';
/**
 * Generated class for the FeedbackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  @ViewChild('msg') msg;
  

  constructor(private data: AngularFireDatabase,public navCtrl: NavController, public navParams: NavParams) {
  }

  save(){
    if(this.msg.value!=''){
  	  var newKey = (''+this.data.database.ref().child('news').push().key).slice(1,10);
    	var newTran={};
    	console.log(this.msg.value);
    	newTran['/feedback/' +currUser.profile.teamID + '/'+ newKey]=this.msg.value;
    	this.data.database.ref().update(newTran);  
    	this.navCtrl.push(OptionsPage);
     }
  }
 
}
