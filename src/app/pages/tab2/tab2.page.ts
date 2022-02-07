import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Article } from 'src/app/interfaces';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  @ViewChild(IonInfiniteScroll, {static: true}) infiniteScrolll: IonInfiniteScroll;
  categories: string[] = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
  selectedCategory: string = this.categories[0];
  articles: Article[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.getTopHeadLinesByCategory(this.selectedCategory);
  }

  segmentChanged(event: Event) {
    this.selectedCategory = (event as CustomEvent).detail.value;
    this.getTopHeadLinesByCategory(this.selectedCategory);
  }

  getTopHeadLinesByCategory(category: string) {
    this.newsService.getTopHeadLinesByCategory(category)
      .subscribe(articles => this.articles = [...articles]);
  }

  loadData() {
    this.newsService.getTopHeadLinesByCategory(this.selectedCategory, true)
      .subscribe(articles => {
        if (articles.length === this.articles.length) {
          this.infiniteScrolll.disabled = true;
          return;
        }
        this.articles = articles;
        this.infiniteScrolll.complete();
      });
  }

}
