import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsSearchComponent } from './components/products-search/products-search.component';
import { CategoriesBannerComponent } from './components/categories-banner/categories-banner.component';
import { RouterModule, Routes } from '@angular/router';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { OrdersModule } from '@argo/orders';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { FeaturedProductsComponent } from './components/featured-products/featured-products.component';
import { ButtonModule } from 'primeng/button';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { UiModule } from '@argo/ui';

const routes: Routes = [
    {
        path: 'products',
        component: ProductListComponent
    },
    {
        path: 'category/:categoryid',
        component: ProductListComponent
    },
    {
        path: 'products/:productid',
        component: ProductPageComponent
    }
]
@NgModule({
    imports: [
        CommonModule, 
        OrdersModule,
        RouterModule.forChild(routes), 
        RouterModule, 
        ButtonModule,
        CheckboxModule,
        FormsModule,
        RatingModule,
        InputNumberModule,
        UiModule],
    declarations: [ ProductsSearchComponent, CategoriesBannerComponent, ProductItemComponent, FeaturedProductsComponent, ProductListComponent, ProductPageComponent ],
    exports:[ProductsSearchComponent, CategoriesBannerComponent, ProductItemComponent, FeaturedProductsComponent, ProductListComponent, ProductPageComponent]
})
export class ProductsModule {}
