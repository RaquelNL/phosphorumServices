import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IThread, IThreadPage } from '../model/model.interfaces';

@Injectable()
export class ThreadAjaxService {

    sUrl: string = "http://localhost:8083/thread";

    constructor(private oHttpClient: HttpClient) { }

    getOne(id: number): Observable<IThread> {
        return this.oHttpClient.get<IThread>(`${this.sUrl}/${id}`);
    }

    getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string): Observable<IThreadPage> {
        if (!size) size = 10;
        if (!page) page = 0;
        return this.oHttpClient.get<IThreadPage>(`${this.sUrl}?size=${size}&page=${page}&sort=${orderField},${orderDirection}`);
    }

    removeOne(id: number | undefined): Observable<number> {
        if (id) {
            return this.oHttpClient.delete<number>(`${this.sUrl}/${id}`);
        } else {            
            return new Observable<number>();
        }
    }
}
