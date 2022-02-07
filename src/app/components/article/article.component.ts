import { Component, Input } from '@angular/core';
import { Article } from 'src/app/interfaces';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { ActionSheetButton, ActionSheetController, Platform, ToastController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {

  @Input() article: Article;
  @Input() index: number;

  constructor(private iab: InAppBrowser,
              private platform: Platform,
              private storageService: StorageService,
              private actionSheetCtrl: ActionSheetController,
              private socialSharing: SocialSharing,
              private toastCtrl: ToastController) { }

  openArticle() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      console.log('ios or android');
      const browser = this.iab.create(this.article.url);
      browser.show();
      return;
    }

    window.open(this.article.url, '_blank');
  }

  async onOpenMenu() {

    const articleInFavorites = this.storageService.articleInFavorites(this.article);
    const actionSheetButtons: ActionSheetButton[] = [
      {
        text: articleInFavorites ? 'Delete favorite' : 'Favorite',
        icon: articleInFavorites ? 'heart' : 'heart-outline',
        handler: () => this.onToggleFavorite()
      },
      {
        text: 'Cancel',
        icon: 'close-outline',
        role: 'cancel'
      }
    ];

    const share: ActionSheetButton = {
      text: 'Share',
      icon: 'share-outline',
      handler: () => this.onShareArticle()
    };

    if (this.platform.is('capacitor')) {
      actionSheetButtons.unshift(share);
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Options',
      buttons: actionSheetButtons
    });

    await actionSheet.present();
  }

  onShareArticle() {
    this.socialSharing.share(
    this.article.title,
    this.article.source.name,
    null,
    this.article.url
    );
  }

  onToggleFavorite() {
    const articleInFavorites = this.storageService.articleInFavorites(this.article);
    if (articleInFavorites) {
      this.presentToast('Deleted from favorites');
    } else {
      this.presentToast('Added to favorites');
    }
    this.storageService.saveOrRemoveArticle(this.article);
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }

}
