import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IReply, IUser, IThread, formOperation } from 'src/app/model/model.interfaces';
import { AdminUserSelectionUnroutedComponent } from '../../user/admin-user-selection-unrouted/admin-user-selection-unrouted.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminThreadSelectionUnroutedComponent } from '../../thread/admin-thread-selection-unrouted/admin-thread-selection-unrouted.component';

@Component({
  selector: 'app-admin-reply-form-unrouted',
  templateUrl: './admin-reply-form-unrouted.component.html',
  styleUrls: ['./admin-reply-form-unrouted.component.css']
})
export class AdminReplyFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW'; // new or edit

  replyForm!: FormGroup;
  status: HttpErrorResponse | null = null;
  selectedUser: IUser | null = null;
  selectedThread: IThread | null = null;
  oDynamicDialogRef: DynamicDialogRef | undefined;
  oReply: IReply = { user: {} } as IReply;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private router: Router,
    private matSnackBar: MatSnackBar,
    public oDialogService: DialogService
  ) {
    this.initializeForm(this.oReply);
  }

  initializeForm(reply: IReply) {
    this.replyForm = this.formBuilder.group({
      id: [reply.id],
      title: [reply.title, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      body: [reply.body, [Validators.required, Validators.maxLength(1000)]],
      user: this.formBuilder.group({
        id: [reply.user.id]
      }),
      thread: this.formBuilder.group({
        id: [reply.user.threads]
      })
    });
  }
  

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.httpClient.get<IReply>("http://localhost:8083/reply/" + this.id).subscribe({
        next: (data: IReply) => {
          this.oReply = data;
          this.initializeForm(this.oReply);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.matSnackBar.open("Error reading reply from server.", '', { duration: 1200 });
        }
      });
    } else {
      this.initializeForm(this.oReply);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.replyForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.replyForm.valid) {
      if (this.operation == 'NEW') {
        this.httpClient.post<IReply>("http://localhost:8083/reply", this.replyForm.value).subscribe({
          next: (data: IReply) => {
            this.oReply = data;
            this.initializeForm(this.oReply);
            this.matSnackBar.open("Reply has been created.", '', { duration: 1200 });
            this.router.navigate(['/admin', 'reply', 'view', this.oReply]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.matSnackBar.open("Can't create reply.", '', { duration: 1200 });
          }
        });
      } else {
        this.httpClient.put<IReply>("http://localhost:8083/reply", this.replyForm.value).subscribe({
          next: (data: IReply) => {
            this.oReply = data;
            this.initializeForm(this.oReply);
            this.matSnackBar.open("Reply has been updated.", '', { duration: 1200 });
            this.router.navigate(['/admin', 'reply', 'view', this.oReply.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.matSnackBar.open("Can't update reply.", '', { duration: 1200 });
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
        this.oReply.user = oUser;
        this.replyForm.controls['user'].patchValue({ id: oUser.id });
      }
    });
  }

  onShowThreadsSelection() {
    this.oDynamicDialogRef = this.oDialogService.open(AdminThreadSelectionUnroutedComponent, {
      header: 'Select a Thread',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });
  
    this.oDynamicDialogRef.onClose.subscribe((oThread: IThread) => {
      if (oThread) {
        this.oReply.thread = oThread; 
        this.replyForm.controls['thread'].patchValue({ id: oThread.id }); 
      }
    });
  }
  
}
