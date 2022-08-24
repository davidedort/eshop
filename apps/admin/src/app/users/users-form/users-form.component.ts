import { Component, OnInit } from '@angular/core';
import { Location} from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User, UsersService } from '@argo/users';
import { timer } from 'rxjs';
import * as countriesLib from 'i18n-iso-countries';
import { ThisReceiver } from '@angular/compiler';

declare const require;
@Component({
  selector: 'admin-users-form',
  templateUrl: './users-form.component.html',
  styles: [
  ]
})
export class UsersFormComponent implements OnInit {

  form: FormGroup;
  isSubmitted  = false;
  editMode = false;
  currentUserID : string;
  countries = [];

  constructor(private route:ActivatedRoute, private location: Location, private messageService: MessageService, private formBuilder: FormBuilder, private usersService: UsersService) { }

  ngOnInit(): void {
   this._initUserForm();
    this._getCountries();
    this._checkEditMode();
  }

  private _getCountries() {
    this.countries = this.usersService.getCountries();
  }

  private _initUserForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      isAdmin: [false],
      street: [''],
      apartment: [''],
      zip: [''],
      city: [''],
      country: ['']
    });
  }

  onSubmit(){
    this.isSubmitted = true;
    if(this.form.invalid){
      return; 
    }
    const user : User = {
      id: this.currentUserID,
      name: this.form.value.name,
      email: this.form.value.email,
      password: this.form.value.password,
      phone: this.form.value.phone,
      isAdmin: this.form.value.isAdmin,
      street: this.form.value.street,
      apartment: this.form.value.apartment,
      zip: this.form.value.zip,
      city: this.form.value.city,
      country: this.form.value.country
    };

    if(this.editMode){
      this._updateUser(user);
    }else {
      this._addUser(user);
    }
    
    //console.log(this.form.value.name);
    //console.log(this.form.value.icon);

    
  }

  private _addUser(user: User) {
    this.usersService.createUser(user).subscribe((user: User)=> {
      this.messageService.add({severity:'success',summary:'Success',detail:`User ${user.name} is created`});
    timer(2000).toPromise().then(() => {
      this.location.back();
    })    
    },
        ()=>{
          this.messageService.add({severity:'error',summary:'Error',detail:'User is not created'});
        });
  }

  private _updateUser(user: User){
    this.usersService.updateUser(user).subscribe(() => {
      this.messageService.add({severity:'success',summary:'Success',detail:'User is updated'});
    timer(2000).toPromise().then(() => {
      this.location.back();
    })    
    },
        ()=>{
          this.messageService.add({severity:'error',summary:'Error',detail:'User is not updated'});
        });
  }

  private _checkEditMode() {
    this.route.params.subscribe(params => {
      if(params['id']){
        this.editMode = true;
        this.currentUserID = params['id'];
        this.usersService.getUser(params['id']).subscribe(user => {
          this.userForm['name'].setValue(user.name);
          this.userForm['email'].setValue(user.email);
          this.userForm['phone'].setValue(user.phone);
          this.userForm['isAdmin'].setValue(user.isAdmin);
          this.userForm['street'].setValue(user.street);
          this.userForm['apartment'].setValue(user.apartment);
          this.userForm['zip'].setValue(user.zip);
          this.userForm['city'].setValue(user.city);
          this.userForm['country'].setValue(user.country);
          this.userForm['password'].setValidators([]);
          this.userForm['password'].updateValueAndValidity();
        })
      }
    });

  }

  get userForm(){
    return this.form.controls;
  }

  onCancel(){
    this.location.back();
  }

  
}
