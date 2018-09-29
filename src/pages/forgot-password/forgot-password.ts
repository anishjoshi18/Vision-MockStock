import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,AlertController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { MockStockLoginPage } from '../mock-stock-login/mock-stock-login';
import { AngularFireDatabase } from 'angularfire2/database';



/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

	@ViewChild('teamid') teamid;

  constructor(private loadingCtrl:LoadingController,private alertCtrl:AlertController,private data: AngularFireDatabase,private toastCtrl: ToastController, private fire:AngularFireAuth,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  showAlert(message :string, submsg: string) {
    let alert = this.alertCtrl.create({
      title: message,
      subTitle: submsg,
      buttons: ['OK']
    });
    alert.present();
  }


  presentToast(email: string) {
    let toast = this.toastCtrl.create({
      message: 'Email sent to '+email,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }



  loading:any;
  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Sending Mail...',
      spinner: 'dots'
    });

    this.loading.present();

    setTimeout(() => {
      this.loading.dismiss();
    }, 10000);
  }


  forgotPassword(){
    this.presentLoadingDefault();
    let that=this;
    let email="";
    let ref=this.data.database.ref("User/"+this.teamid.value);
    ref.once('value', function(snap){
      if(snap.exists()){
        console.log('Team ID Exists');
        var val=snap.val();
        email=val.email;
        if(email!=""){
          that.fire.auth.sendPasswordResetEmail(email)
            .then(function() {
              that.loading.dismiss();
              that.presentToast(email);
              that.navCtrl.setRoot(MockStockLoginPage);
            })
            .catch(function(error) {
              that.loading.dismiss();
              console.log(error);
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
}
