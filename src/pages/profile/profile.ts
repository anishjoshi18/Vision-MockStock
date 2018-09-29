import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Profile } from '../../models/profiles';
import { AngularFireDatabase } from 'angularfire2/database';
import { currUser } from '../../models/global';
import { TabsControllerPage } from '../tabs-controller/tabs-controller';
import { Storage } from '@ionic/storage'; 

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(private storage: Storage, private data:AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
  }

  profile : Profile ={};
  
  createProfile(){
    if(this.profile.teamName==null||this.profile.part1==null||this.profile.part2==null||this.profile.teamName.length==0||this.profile.part1.length==0||this.profile.part2.length==0)
      return;
  	currUser.profile.teamName=this.profile.teamName;
  	currUser.profile.part1=this.profile.part1;
  	currUser.profile.part2=this.profile.part2;
  	currUser.profile.balance=500000;
  	currUser.profile.rank=0;
    currUser.profile.eval=500000; 
    this.storage.set('profile', currUser.profile);
  	this.data.object('User/'+currUser.profile.teamID).set(currUser.profile)
  		.then(()=> this.navCtrl.setRoot(TabsControllerPage));
  }
}
