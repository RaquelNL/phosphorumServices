import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { IReply, IReplyPage} from 'src/app/model/model.interfaces';
import { AdminReplyDetailUnroutedComponent } from '../admin-reply-detail-unrouted/admin-reply-detail-unrouted.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-reply-plist-unrouted',
  templateUrl: './admin-reply-plist-unrouted.component.html',
  styleUrls: ['./admin-reply-plist-unrouted.component.css']
})

export class AdminReplyPlistUnroutedComponent implements OnInit {

  oPage: any = [];
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oReplyToRemove: IReply | null = null;

  constructor(
    private oHttpClient: HttpClient,
    public oDialogService: DialogService,    
    private oCconfirmationService: ConfirmationService,
    private oMatSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getPage();
  }

  getPage(): void {
    this.oHttpClient.get<IReplyPage>("http://localhost:8083/reply" + "?size=" + this.oPaginatorState.rows + "&page=" + this.oPaginatorState.page + "&sort=" + this.orderField + "," + this.orderDirection).subscribe({
      next: (data: IReplyPage) => {
        this.oPage = data;
        this.oPaginatorState.pageCount = data.totalPages;
        console.log(this.oPaginatorState);
      },
      error: (error: HttpErrorResponse) => {
        this.oPage.error = error;
        this.status = error;
      }
    })
  }

  onPageChang(event: PaginatorState) {
    this.oPaginatorState.rows = event.rows;
    this.oPaginatorState.page = event.page;
    this.getPage();
  }

  doOrder(fieldorder: string) {
    this.orderField = fieldorder;
    if (this.orderDirection == "asc") {
      this.orderDirection = "desc";
    } else {
      this.orderDirection = "asc";
    }
    this.getPage();
  }

  ref: DynamicDialogRef | undefined;

  doView(u: IReply) {
    this.ref = this.oDialogService.open(AdminReplyDetailUnroutedComponent, {
      data: {
        id: u.id
      },
      header: 'View of reply',
      width: '50%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false
    });
  }

  doRemove(u: IReply) {
    this.oReplyToRemove = u;
    this.oCconfirmationService.confirm({
      accept: () => {
        this.oMatSnackBar.open("The reply has been removed.", '', { duration: 1200 });
        this.oHttpClient.delete("http://localhost:8083/reply/" + this.oReplyToRemove?.id).subscribe({
          next: () => {
            this.getPage();
          },
          error: (error: HttpErrorResponse) => {
            this.oPage.error = error;
            this.status = error;
            this.oMatSnackBar.open("The reply hasn't been removed.", "", { duration: 1200 });
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.oMatSnackBar.open("The reply hasn't been removed.", "", { duration: 1200 });
      }
    });
  }

}
