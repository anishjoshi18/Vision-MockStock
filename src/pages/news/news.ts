import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { gnews, newNews } from '../../models/global';
import { News } from '../../models/gnews';
import { NewsPPage } from '../news-p/news-p';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class NewsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  constructor(public navCtrl: NavController) {
  }

  ionViewDidLoad(){
    newNews.new=false;
  }
  
  lnews=gnews.news;
  cla="arr";

  swipeEvent(e) {
    if(e.direction == '2'){
       this.navCtrl.parent.select(2);
    }
    else if(e.direction == '4'){
       this.navCtrl.parent.select(0);
    }
  }
  
  showNews(snews: News){
    newNews.new=false;
    this.navCtrl.push(NewsPPage, {snews});
  }
  
  newsKeys(){
    return Array.from( this.lnews.keys()).sort().reverse();
  }
}
