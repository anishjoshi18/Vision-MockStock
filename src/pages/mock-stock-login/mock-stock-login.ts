import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { Profile } from '../../models/profiles'
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { currUser } from '../../models/global';
import { TabsControllerPage } from '../tabs-controller/tabs-controller'     
import { Storage } from '@ionic/storage';    

@Component({
  selector: 'page-mock-stock-login',
  templateUrl: 'mock-stock-login.html'
})
export class MockStockLoginPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page

  @ViewChild('teamid') teamid;
  @ViewChild('password') password;


  
  constructor(private toastCtrl: ToastController, private storage: Storage, public loadingCtrl: LoadingController,public alertCtrl: AlertController, private data: AngularFireDatabase, private fire:AngularFireAuth, public navCtrl: NavController) {
     
  }

  loading:any={};
  
  

  presentToast(teamName: string) {
    let toast = this.toastCtrl.create({
      message: teamName+' signed in',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  presentLoadingDefault() {
    
    this.loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Logging In...',
      dismissOnPageChange: true
    });
    this.loading.present();

    setTimeout(() => {
      this.loading.dismiss();
    }, 20000 );
  }

  showAlert(message :string, submsg: string) {
    let alert = this.alertCtrl.create({
      title: message,
      subTitle: submsg,
      buttons: ['OK']
    });
    alert.present();
  }

  loginUser(){
    this.presentLoadingDefault();
    let that=this;
    let email="";
    let dataExists=false;
    let ref=this.data.database.ref("User/"+that.teamid.value);
    ref.once('value', function(snap){
      if(snap.exists()){
        console.log('Team ID Exists');
        var val=snap.val();
        email=val.email;
        if(val.part1!=null){
          dataExists=true;
          let profile : Profile ={};
          profile.balance=val.balance;
          profile.email=val.email;
          profile.part1=val.part1;
          profile.part2=val.part2;
          profile.rank=val.rank;
          profile.teamID=val.teamID;
          profile.teamName=val.teamName;
          currUser.profile=profile;
          that.storage.set('profile', profile);
        }
        if(email!=""){
          that.fire.auth.signInWithEmailAndPassword(email, that.password.value)
          .then(data => {
            let profile : Profile ={};
            if(!dataExists){
              profile.email=email;
              profile.teamID=that.teamid.value;
              currUser.profile=profile;
              that.storage.set('profile', profile);
              that.navCtrl.setRoot(ProfilePage);
            }
            else{
              that.presentToast(val.teamName);
              that.navCtrl.setRoot(TabsControllerPage);
            }
          })
          .catch(error => {
            that.loading.dismiss();
            that.showAlert(error,"");
            return;
          });
        }
      }
      else{
        that.loading.dismiss();
        that.showAlert("Invalid Team ID","Please enter a valid team ID");
        email="Invalid";
        return;
      }
    });
    setTimeout(() => {
      if(email==""){
        that.loading.dismiss();
        that.showAlert("Can't connect!","Check your internet connection");
        return;
      }
    }, 10000);
  }
  forgetPassword(){
    this.navCtrl.push(ForgotPasswordPage);  
  }
}
