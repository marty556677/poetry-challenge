import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PoetryService {
    constructor(private http: HttpClient) {}
    authors = ['shakespear', 'nope']
    baseUrl = 'https://poetrydb.org/';

    getAuthors(): Observable<String[]>
    {
        return this.http.get<AuthorsResponse>(this.baseUrl + 'author')
        .pipe(
            map((response: AuthorsResponse) => {
              return response.authors;
            }),
            catchError(this.handleError)
          );
    }
    getTitles(author: string): Observable<String[]>
    {
        const urlStr = this.baseUrl + 'author/' + encodeURI(author) + '/title';

        return this.http.get<TitleItem[]>(urlStr)
        .pipe(
            map((response: TitleItem[]) => {
                return response.map(x => x.title)
            }),
            catchError(this.handleError)
          );
    }
    getPoems(author: string, title: string): Observable<any>
    {
        let urlStr: string = "";
        if (author.length > 0 && title.length > 0){
          urlStr = this.baseUrl + 'author,title,poemcount/' + encodeURI(author) + ';' + encodeURI(title) + ";10";
        }
        else if (author.length > 0){ //author only search
          urlStr = this.baseUrl + 'author,poemcount/' + encodeURI(author) + ";10";
        }
        else if (title.length > 0){ //title only search
          urlStr = this.baseUrl + 'title,poemcount/' + encodeURI(title) + ";10";
        }
        
        return this.http.get<TitleItem[]>(urlStr)
        .pipe(
          catchError(this.handleError)
        )
    }

    private handleError(error: HttpErrorResponse) {
        console.error(error.message);
        return throwError(() => new Error('An error occurred, please try again.'))
      }
}

interface AuthorsResponse {
    authors: string[];
  }

  interface TitleItem {
    title: string;
  }

  interface PoemsItem {
    title: string;
    author: string;
    lines: string[];
    linecount: number;
  }


