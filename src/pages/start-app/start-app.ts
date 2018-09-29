import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Profile } from '../../models/profiles';
import { AngularFireDatabase } from 'angularfire2/database';
import { currUser } from '../../models/global';
import { TabsControllerPage } from '../tabs-controller/tabs-controller';
import { MockStockLoginPage } from '../mock-stock-login/mock-stock-login';

/**
 * Generated class for the StartAppPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-start-app',
  templateUrl: 'start-app.html',
})
export class StartAppPage {

  constructor(private toastCtrl: ToastController,private data: AngularFireDatabase, private storage: Storage,public navCtrl: NavController, public navParams: NavParams) {
  	this.authenticated();
  }

  presentToast(teamName: string) {
    let toast = this.toastCtrl.create({
      message: teamName+' signed in',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  authenticated(){
    let that=this;
    this.storage.get('profile').then((val)=>{
      let profile : Profile ={};
      profile.teamID=val.teamID;
      let ref=this.data.database.ref("User/"+val.teamID);
      ref.once('value', function(snap){
        if(snap.exists()){
          var val=snap.val();
          let profile : Profile ={};
          profile.balance=val.balance;
          profile.email=val.email;
          profile.part1=val.part1;
          profile.part2=val.part2;
          profile.rank=val.rank;
          profile.teamID=val.teamID;
          profile.teamName=val.teamName;
          currUser.profile=profile;
          that.presentToast(val.teamName);
          that.navCtrl.setRoot(TabsControllerPage);
        }
      });
    })
    .catch(error => {
      console.log('User Not logged IN '+error);
      that.navCtrl.setRoot(MockStockLoginPage);  
    });
  }

}
