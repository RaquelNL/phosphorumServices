import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { IUser, IUserPage } from 'src/app/model/model.interfaces';

@Component({
  selector: 'app-admin-user-selection-unrouted',
  templateUrl: './admin-user-selection-unrouted.component.html',
  styleUrls: ['./admin-user-selection-unrouted.component.css']
})

export class AdminUserSelectionUnroutedComponent implements OnInit {

  oPage: any = [];
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oUserToRemove: IUser | null = null;

  constructor(
    private oHttpClient: HttpClient,
    public oDialogService: DialogService,
    public oDynamicDialogRef: DynamicDialogRef
  ) { }

  ngOnInit() {
    this.getPage();
  }

  getPage(): void {
    this.oHttpClient.get<IUserPage>("http://localhost:8083/user" + "?size=" + this.oPaginatorState.rows + "&page=" + this.oPaginatorState.page + "&sort=" + this.orderField + "," + this.orderDirection).subscribe({
      next: (data: IUserPage) => {
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

  onSelectUser(oUser: IUser) {
    this.oDynamicDialogRef.close(oUser);
  }


}