import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { YourSharesPage } from './your-shares';

@NgModule({
  declarations: [
    YourSharesPage,
  ],
  imports: [
    IonicPageModule.forChild(YourSharesPage),
  ],
})
export class YourSharesPageModule {}
