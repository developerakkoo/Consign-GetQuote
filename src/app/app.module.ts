import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

const firebaseConfig = {
  apiKey: "AIzaSyB8jWxZPWeAFvV1HFMnYtM5ohdKYPsk15E",
  authDomain: "consign-612af.firebaseapp.com",
  databaseURL: "https://consign-612af-default-rtdb.firebaseio.com",
  projectId: "consign-612af",
  storageBucket: "consign-612af.appspot.com",
  messagingSenderId: "524688990077",
  appId: "1:524688990077:web:6d3b2e5713bd3fb26cb614",
  measurementId: "G-7FPZJEQ3GK"
};

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule, 
    GooglePlaceModule,
    IonicStorageModule.forRoot({name: 'getquote'}),
   AngularFireModule.initializeApp(firebaseConfig), 
   AngularFireStorageModule, 
   AngularFireDatabaseModule,
   AngularFireAuthModule,
   AngularFirestoreModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
