import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Category } from '@argo/products';
import { ConfirmationService,  MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-categories-list',
  templateUrl: './categories-list.component.html',
  styles: [
  ]
})
export class CategoriesListComponent implements OnInit, OnDestroy {


  categories: Category[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endsubs$ : Subject<void> = new Subject();

  constructor(private router:Router, private confirmationService: ConfirmationService, private categoriesService: CategoriesService, private messageService: MessageService) { }

  ngOnInit(): void {
   this._getCategories();
   
  }

  ngOnDestroy(): void {
    this.endsubs$.next();
    this.endsubs$.complete(); 
  }

  deleteCategory(categoryId: string){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoriesService.deleteCategory(categoryId).subscribe(() =>{
          this._getCategories();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Category is deleted'
          });
        },
        () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Category could not be deleted'
          });
        });
      },
      reject: () => {
        
          this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
            
         
      }  
      });
    
  }

  updateCategory(categoryid: string){
    this.router.navigateByUrl(`categories/form/${categoryid}`)
  }

  private _getCategories() {
    this.categoriesService.getCategories().pipe(takeUntil(this.endsubs$)).subscribe(cats => {
      this.categories = cats;
    });
  }

}
