import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { News } from '../../models/gnews';

/**
 * Generated class for the NewsPPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news-p',
  templateUrl: 'news-p.html',
})
export class NewsPPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.lnews = <News>navParams.get('snews');
  }

  lnews: News;

}
