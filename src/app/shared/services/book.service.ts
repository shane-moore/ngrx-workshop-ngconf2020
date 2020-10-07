import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as uuid from "uuid/v4";
import { BookModel, BookRequiredProps } from "../models";
import { mergeMap } from 'rxjs/operators';
import { timer } from 'rxjs';

const BASE_URL = "http://localhost:3000/books";
const HEADER = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class BooksService {
  constructor(private http: HttpClient) { }

  all() {
    return this.http.get<BookModel[]>(BASE_URL);
  }

  load(id: string) {
    return this.http.get<BookModel>(`${BASE_URL}/${id}`);
  }

  create(bookProps: BookRequiredProps) {
    const Book: BookModel = {
      id: uuid(),
      ...bookProps
    };

    // example to create lag on the switchMap in the effects file to where a user could click a bunch of times to creat book but only last one was
    // return timer(3000).pipe(
    //   mergeMap(() => {
    //     return this.http.post<BookModel>(
    //       `${BASE_URL}`,
    //       JSON.stringify(Book),
    //       HEADER
    //     );
    //   })
    // );

    return this.http.post<BookModel>(
      `${BASE_URL}`,
      JSON.stringify(Book),
      HEADER
    );
  }

  update(id: string, updates: BookRequiredProps) {
    return this.http.patch<BookModel>(
      `${BASE_URL}/${id}`,
      JSON.stringify(updates),
      HEADER
    );
  }

  delete(id: string) {
    return this.http.delete(`${BASE_URL}/${id}`);
  }
}
