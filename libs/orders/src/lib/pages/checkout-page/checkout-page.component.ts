
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart } from '../../models/cart';
import { CartService } from '../../services/cart.service';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';
import { OrdersService } from '../../services/orders.service';
import { UsersService } from '@argo/users';
import { ORDER_STATUS } from '../../orders.contants';
import { Subject, takeUntil } from 'rxjs';
import { StripeService } from 'ngx-stripe';
@Component({
  selector: 'orders-checkout-page',
  templateUrl: './checkout-page.component.html',
  styles: [
  ]
})
export class CheckoutPageComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private ordersService: OrdersService,
    private stripeService: StripeService
  ) { }
  
  
  checkoutFormGroup: FormGroup;
  isSubmitted = false;
  orderItems: OrderItem[] = [];
  userId: string;
  countries = [];
  unsubscribe$ : Subject<void> = new Subject();
  ngOnInit(): void {
    this._initCheckoutForm();
    this._autoFillUserData();
    this._getCartItems();
    this._getCountries();
  }

  ngOnDestroy(): void {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
  }

  
  private _autoFillUserData(){
    this.usersService.observeCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      
      if(user){
        this.userId = user.id;
        this.checkoutForm['name'].setValue(user['name']);
        this.checkoutForm['email'].setValue(user['email']);
        this.checkoutForm['phone'].setValue(user['phone']);
        this.checkoutForm['city'].setValue(user['city']);
        this.checkoutForm['country'].setValue(user['country']);
        this.checkoutForm['zip'].setValue(user['zip']);
        this.checkoutForm['apartment'].setValue(user['apartment']);
        this.checkoutForm['street'].setValue(user['street']);
      }
    })
  }

  private _getCountries() {
    this.countries = this.usersService.getCountries();
  }

  private _initCheckoutForm() {
    this.checkoutFormGroup  = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required],
      apartment: ['', Validators.required],
      street: ['', Validators.required]
      
    });
  }

  

  backToCart(){
    this.router.navigate(['/cart']);
  }

  get checkoutForm(){
    return this.checkoutFormGroup.controls;
  }

  placeOrder(){
    this.isSubmitted = true;
    if(this.checkoutFormGroup.invalid){
      return;
    }

    

    const order: Order = {
      orderItems: this.orderItems,
      shippingAddress1: this.checkoutForm['street'].value,
      shippingAddress2: this.checkoutForm['apartment'].value,
      city: this.checkoutForm['city'].value,
      zip: this.checkoutForm['zip'].value,
      country: this.checkoutForm['country'].value,
      phone: this.checkoutForm['phone'].value,
      status: 0,
      user: this.userId,
      dateOrdered: `${Date.now()}`
    };

    this.ordersService.cacheOrderData(order);

   

    this.ordersService.createCheckoutSession(this.orderItems).subscribe(error =>{
      if(error){
        console.log('error with payment');
      }
    });

  /*  this.ordersService.createOrder(order).subscribe(
      () => {
        console.log('aa');
      this.cartService.emptyCart();
      this.router.navigate(['/success']);
      
    }, 
    ()=> {
      console.log('ciao');
    });
*/
    
  }

  private _getCartItems(){
    const cart: Cart = this.cartService.getCart();
    this.orderItems = cart.items.map((item) => {
      return {
        product: item.productId,
        quantity: item.quantity
      };
    });

    console.log(this.orderItems);
  }
}
