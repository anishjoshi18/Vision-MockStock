import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StartAppPage } from './start-app';

@NgModule({
  declarations: [
    StartAppPage,
  ],
  imports: [
    IonicPageModule.forChild(StartAppPage),
  ],
})
export class StartAppPageModule {}
