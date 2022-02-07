/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Article } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private _localArticles: Article[] = [];

  constructor(private storage: Storage) {
    this.init();
  }

  get getlocalArticles() {
    return [...this._localArticles];
  }

  async init() {
    const storage = await this.storage.create();
    // eslint-disable-next-line no-underscore-dangle
    this._storage = storage;
    this.loadFavorites();
  }

  async saveOrRemoveArticle(article: Article) {
    const exists = this._localArticles.find(localArticle => localArticle.title === article.title);
    console.log(exists);
    if (!exists) {
      this._localArticles = [article, ...this._localArticles];
    } else {
      this._localArticles = this._localArticles.filter(localArticle => localArticle.title !== article.title);
    }
    this._storage.set('articles', this._localArticles);
  }

  async loadFavorites() {
    try {
      const articles = await this._storage.get('articles');
      this._localArticles = articles || [];
    } catch (error) {
      this._localArticles = [];
    }
  }

  articleInFavorites(article: Article): boolean {
    return !!this._localArticles.find(localArticle => localArticle.title === article.title);
  }

}
