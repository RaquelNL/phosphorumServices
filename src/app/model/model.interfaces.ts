import { HttpErrorResponse } from "@angular/common/http";

export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface Pageable {
    sort: Sort;
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
}

export interface IPage<T> {
    content: T[];
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: Sort;
    first: boolean;
    numberOfElements: number;
    empty: boolean;

    strSortField: string;
    strSortDirection: string;
    strFilter: string;
    strFilteredTitle: string;
    strFilteredMessage: string;
    nRecords: number;

    error: HttpErrorResponse;
}

export interface IEntity {
    id: number,
}

export interface IUser extends IEntity {
    name: string,
    surname: string,
    lastname: string,
    email: string,
    username: string,
    role: boolean,
    threads: number,
    replies: number
}

export interface IUserPage extends IPage<IUser> {
}

export interface IThread extends IEntity {
    title: string,
    user: IUser,
    replies: number
}

export interface IThreadPage extends IPage<IThread> {
}

export interface IReply extends IEntity {
    title: string,
    body: string,
    user: IUser,
    thread: IThread
}

export interface IReplyPage extends IPage<IReply> {
}

export type formOperation = 'EDIT' | 'NEW';