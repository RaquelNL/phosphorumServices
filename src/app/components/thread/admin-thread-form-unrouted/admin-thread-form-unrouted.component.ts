import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IThread, IUser, formOperation } from 'src/app/model/model.interfaces';
import { AdminUserSelectionUnroutedComponent } from '../../user/admin-user-selection-unrouted/admin-user-selection-unrouted.component';

@Component({
  selector: 'app-admin-thread-form-unrouted',
  templateUrl: './admin-thread-form-unrouted.component.html',
  styleUrls: ['./admin-thread-form-unrouted.component.css']
})
export class AdminThreadFormUnroutedComponent implements OnInit {
  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW'; //new or edit

  threadForm!: FormGroup;
  oThread: IThread = { user: {} } as IThread;
  status: HttpErrorResponse | null = null;

  oDynamicDialogRef: DynamicDialogRef | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private oHttpClient: HttpClient,
    private router: Router,
    private oMatSnackBar: MatSnackBar,
    public oDialogService: DialogService
  ) {
    this.initializeForm(this.oThread);
  }

  initializeForm(oThread: IThread) {
    this.threadForm = this.formBuilder.group({
      id: [oThread.id],
      title: [oThread.title, [Validators.required, Validators.minLength(1), Validators.maxLength(2048)]],
      user: this.formBuilder.group({
        id: [oThread.user.id]
      })
    });
  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.oHttpClient.get<IThread>("http://localhost:8083/thread/" + this.id).subscribe({
        next: (data: IThread) => {
          this.oThread = data;
          this.initializeForm(this.oThread);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.oMatSnackBar.open("Error reading thread from server.", '', { duration: 1200 });
        }
      })
    } else {
      this.initializeForm(this.oThread);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.threadForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.threadForm.valid) {
      if (this.operation === 'NEW') {
        this.oHttpClient.post<IThread>('http://localhost:8083/thread', this.threadForm.value).subscribe({
          next: (data: IThread) => {
            this.oThread = { "user": {} } as IThread;
            this.initializeForm(this.oThread); //el id se genera en el servidor
            this.oMatSnackBar.open('Thread has been created.', '', { duration: 1200 });
            this.router.navigate(['/admin', 'thread', 'view', data]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open('Failed to create thread.', '', { duration: 1200 });
          }
        });
      } else {
        this.oHttpClient.put<IThread>('http://localhost:8083/thread', this.threadForm.value).subscribe({
          next: (data: IThread) => {
            this.oThread = data;
            this.initializeForm(this.oThread);
            this.oMatSnackBar.open('Thread has been updated.', '', { duration: 1200 });
            this.router.navigate(['/admin', 'thread', 'view', this.oThread.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open('Failed to update thread.', '', { duration: 1200 });
          }
        });
      }
    }
  }

  onShowUsersSelection() {
    this.oDynamicDialogRef = this.oDialogService.open(AdminUserSelectionUnroutedComponent, {
      header: 'Select a User',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.oDynamicDialogRef.onClose.subscribe((oUser: IUser) => {
      if (oUser) {
        console.log(oUser);
        this.oThread.user = oUser;
        this.threadForm.controls['user'].patchValue({ id: oUser.id })    //controls['id'].setValue(oUser.id);
        //this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: product.name });
      }
    });
  }

}
