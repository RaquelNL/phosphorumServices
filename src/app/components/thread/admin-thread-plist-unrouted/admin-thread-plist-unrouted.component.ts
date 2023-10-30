import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { IThread, IThreadPage } from 'src/app/model/model.interfaces';
import { AdminThreadDetailUnroutedComponent } from '../admin-thread-detail-unrouted/admin-thread-detail-unrouted.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-thread-plist-unrouted',
  templateUrl: './admin-thread-plist-unrouted.component.html',
  styleUrls: ['./admin-thread-plist-unrouted.component.css']
})
export class AdminThreadPlistUnroutedComponent implements OnInit {
  oPage: any = [];
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oThreadToRemove: IThread | null = null;
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
    this.oHttpClient.get<IThreadPage>("http://localhost:8083/thread" + "?size=" + this.oPaginatorState.rows + "&page=" + this.oPaginatorState.page + "&sort=" + this.orderField + "," + this.orderDirection).subscribe({
      next: (data: IThreadPage) => {
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

  doView(u: IThread) {
    this.ref = this.oDialogService.open(AdminThreadDetailUnroutedComponent, {
      data: {
        id: u.id
      },
      header: 'View of thread',
      width: '50%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false
    });
  }

  doRemove(u: IThread) {
    this.oThreadToRemove = u;
    this.oCconfirmationService.confirm({
      accept: () => {
        this.oMatSnackBar.open("The thread has been removed.", '', { duration: 1200 });
        this.oHttpClient.delete("http://localhost:8083/thread/" + this.oThreadToRemove?.id).subscribe({
          next: () => {
            this.getPage();
          },
          error: (error: HttpErrorResponse) => {
            this.oPage.error = error;
            this.status = error;
            this.oMatSnackBar.open("The thread hasn't been removed.", "", { duration: 1200 });
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.oMatSnackBar.open("The thread hasn't been removed.", "", { duration: 1200 });
      }
    });
  }

}
