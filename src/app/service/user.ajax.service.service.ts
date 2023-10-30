import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser, IUserPage } from '../model/model.interfaces';

@Injectable()
export class UserAjaxService {

    sUrl: string = "http://localhost:8083/user";

    constructor(
        private oHttpClient: HttpClient
    ) { }

    getOne(id: number): Observable<IUser> {
        return this.oHttpClient.get<IUser>(this.sUrl + "/" + id);
    }

    getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string): Observable<IUserPage> {
        if (!size) size = 10;
        if (!page) page = 0;
        return this.oHttpClient.get<IUserPage>(this.sUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection);
    }

    removeOne(id: number | undefined): Observable<number> {
        if (id) {
            return this.oHttpClient.delete<number>(this.sUrl + "/" + id);
        } else {            
            return new Observable<number>();
        }
    }
}
