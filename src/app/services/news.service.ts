import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { NewsResponse, Article, ArticlesByCategoryAndPage} from '../interfaces';

const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private articlesByCategoryAndPage: ArticlesByCategoryAndPage = {};

  constructor(private http: HttpClient) { }

  getTopHeadLines(): Observable<Article[]> {
    return this.getTopHeadLinesByCategory('business');
  }

  getTopHeadLinesByCategory(category: string, loadMore: boolean = false): Observable<Article[]> {
    if (loadMore) {
      return this.getArticlesByCategory(category);
    }

    if (this.articlesByCategoryAndPage[category]) {
      return of(this.articlesByCategoryAndPage[category].articles);
    }

    return this.getArticlesByCategory(category);
  }

  private executeQuery<T>( endpoint: string ) {
    console.log('Petición HTTP realizada');
    return this.http.get<T>(`${ apiUrl }${ endpoint }`, {
      params: {
        apiKey,
        country: 'us',
      }
    });
   }

  private getArticlesByCategory(category: string): Observable<Article[]>{
    if (!Object.keys(this.articlesByCategoryAndPage).includes(category)) {
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: []
      };
      }

    const page = this.articlesByCategoryAndPage[category].page + 1;
    console.log('page:', page);
    console.log(this.articlesByCategoryAndPage);

    return this.executeQuery<NewsResponse>(`/top-headlines?category=${category}&page=${page}`)
      .pipe(
        map(({articles}) => {
          if (articles.length === 0) {
            return this.articlesByCategoryAndPage[category].articles;
          };

          this.articlesByCategoryAndPage[category] = {
            page,
            articles: [...this.articlesByCategoryAndPage[category].articles, ...articles]
          };
          console.log(this.articlesByCategoryAndPage[category]);
          return this.articlesByCategoryAndPage[category].articles;
        })
      );
  }


}

