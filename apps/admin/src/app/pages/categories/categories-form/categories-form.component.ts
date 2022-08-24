
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService, Category } from '@argo/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { Location} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [
  ]
})
export class CategoriesFormComponent implements OnInit {

  form: FormGroup;
  isSubmitted  = false;
  editMode = false;
  currentCategoryID : string;

  constructor(private route:ActivatedRoute, private location: Location, private messageService: MessageService, private formBuilder: FormBuilder, private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name:['', Validators.required],
      icon:['', Validators.required],
      color:['#fff']

    });

    this._checkEditMode();
  }

  onSubmit(){
    this.isSubmitted = true;
    if(this.form.invalid){
      return; 
    }
    const category : Category = {
      id: this.currentCategoryID,
      name: this.form.value.name,
      icon: this.form.value.icon,
      color: this.form.value.color
    }
    if(this.editMode){
      this._updateCategory(category);
    }else {
      this._addCategory(category);
    }
    
    //console.log(this.form.value.name);
    //console.log(this.form.value.icon);

    
  }

  private _addCategory(category: Category) {
    this.categoriesService.createCategory(category).subscribe((category: Category)=> {
      this.messageService.add({severity:'success',summary:'Success',detail:`Category ${category.name} is created`});
    timer(2000).toPromise().then(() => {
      this.location.back();
    })    
    },
        ()=>{
          this.messageService.add({severity:'error',summary:'Error',detail:'Category is not created'});
        });
  }

  private _updateCategory(category: Category){
    this.categoriesService.updateCategory(category).subscribe(() => {
      this.messageService.add({severity:'success',summary:'Success',detail:'Category is updated'});
    timer(2000).toPromise().then(() => {
      this.location.back();
    })    
    },
        ()=>{
          this.messageService.add({severity:'error',summary:'Error',detail:'Category is not updated'});
        });
  }

  private _checkEditMode() {
    this.route.params.subscribe(params => {
      if(params['id']){
        this.editMode = true;
        this.currentCategoryID = params['id'];
        this.categoriesService.getCategory(params['id']).subscribe(category => {
          this.categoryForm['name'].setValue(category.name);
          this.categoryForm['icon'].setValue(category.icon);
          this.categoryForm['color'].setValue(category.color);
        })
      }
    });

  }

  get categoryForm(){
    return this.form.controls;
  }

}
