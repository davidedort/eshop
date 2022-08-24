import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CartItemsDetailed } from '../../models/cart';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-cart-page',
  templateUrl: './cart-page.component.html',
  styles: [
  ]
})
export class CartPageComponent implements OnInit, OnDestroy {

  cartItemsDetailed : CartItemsDetailed[] = [];
  cartCount = 0;
  endSubs$ : Subject<void> = new Subject();
  constructor(
    private router: Router,
    private cartService: CartService,
    private ordersService: OrdersService
  ) { }

  ngOnInit(): void {
    this._getCartDetails();
  }

  ngOnDestroy(): void {
      this.endSubs$.next();
      this.endSubs$.complete();
  }

  private _getCartDetails(){
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe(respCart => {
      this.cartItemsDetailed = [];
      this.cartCount = respCart?.items.length ?? 0;
      respCart.items.forEach((cartItem) => {
        this.ordersService.getProduct(cartItem.productId).subscribe((respProducts) => {
          this.cartItemsDetailed.push({
            product: respProducts,
            quantity: cartItem.quantity
          })
        })
      });
    });
  }

  backToShop(){
    this.router.navigate(['/products']);
  }

  deleteCartItem(cartItem: CartItemsDetailed ){
    this.cartService.deleteCartItem(cartItem.product.id);
  }

  updateCartItemQuantity(event, cartItem: CartItemsDetailed){
    
    this.cartService.setCartItem({
      productId: cartItem.product.id,
      quantity: event.value
    }, true );
  }

}
