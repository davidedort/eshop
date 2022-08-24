import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UiModule } from '@argo/ui'

import {AccordionModule} from 'primeng/accordion';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NavComponent } from './shared/nav/nav.component';
import { ProductsModule } from '@argo/products';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OrdersModule } from '@argo/orders';
import { ToastModule } from 'primeng/toast';
import { MessagesComponent } from './shared/messages/messages.component';
import { MessageService } from 'primeng/api';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { JwtInterceptor, UsersModule } from '@argo/users';
import { NgxStripeModule } from 'ngx-stripe';

 const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'products', component: ProductListComponent }
];

@NgModule({
    declarations: [
        AppComponent, 
        HomePageComponent, 
        ProductListComponent, 
        HeaderComponent, 
        FooterComponent, 
        NavComponent, 
        MessagesComponent,
    
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule, 
        RouterModule.forRoot(routes),
        HttpClientModule, 
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        ProductsModule,
        UiModule,
        AccordionModule,
        OrdersModule,
        ToastModule,
        UsersModule,
        NgxStripeModule.forRoot('pk_test_51LZzaSDokS02pNXwlJ8JqlKhD8RfYvQlnJxocMoGKPhmOQrzPfPNSv8tb19zTvd7sXLEbDeFL6aOkpvDdRcBFvlp00DLGbZXes')
    ],
    providers: [MessageService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi:true}],
    bootstrap: [AppComponent],
    exports: [
      MessagesComponent
    ]
})
export class AppModule {}
