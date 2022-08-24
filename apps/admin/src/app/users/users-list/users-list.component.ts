import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UsersService } from '@argo/users';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'admin-users-list',
  templateUrl: './users-list.component.html',
  styles: [
  ]
})
export class UsersListComponent implements OnInit, OnDestroy {

 
  users: User[] = [];
  endsubs$ : Subject<void> = new Subject();

  constructor(private router:Router, private confirmationService: ConfirmationService, private usersService: UsersService, private messageService: MessageService) { }

  ngOnInit(): void {
   this._getUsers();
  }

  ngOnDestroy(): void {
    this.endsubs$.next();
    this.endsubs$.complete(); 
  }

  deleteUser(userId: string){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.deleteUser(userId).subscribe(() =>{
          this._getUsers();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User is deleted'
          });
        },
        () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'User could not be deleted'
          });
        });
      },
      reject: () => {
        
          this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
            
         
      }  
      });
    
  }

  updateUser(userid: string){
    this.router.navigateByUrl(`users/form/${userid}`)
  }

    getNomeCountry(countryKey: string){
    if (countryKey){
      return this.usersService.getCountry(countryKey);
    } else {
      return 'N/A';
    }
  }

  private _getUsers() {
    this.usersService.getUsers().pipe(takeUntil(this.endsubs$)).subscribe(users => {
      this.users = users;
    });
  }
}
