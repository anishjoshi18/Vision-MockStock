import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsPPage } from './news-p';

@NgModule({
  declarations: [
    NewsPPage,
  ],
  imports: [
    IonicPageModule.forChild(NewsPPage),
  ],
})
export class NewsPPageModule {}
