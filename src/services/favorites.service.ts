import localforage from 'localforage';
import { ProductData } from 'types';

const DBs = '__wb-favorite';

class FavoritesService {
  init() {
    this._updCounters();
  }

  async addProduct(product: ProductData) {
    const products = await this.get();
    await this.set([...products, product]);
  }

  async removeProduct(product: ProductData) {
    const products = await this.get();
    await this.set(products.filter(({ id }) => id !== product.id));
  }

  async get(): Promise<ProductData[]> {
    return (await localforage.getItem(DBs)) || [];
  }

  async set(data: ProductData[]) {
    await localforage.setItem(DBs, data);
    this._updCounters();
  }

  async isInFavorite(product: ProductData) {
    const products = await this.get();
    return products.some(({ id }) => id === product.id);
  }

  private async _updCounters() {
    const products = await this.get();
    const count = products.length >= 10 ? '9+' : products.length;

    document
      .querySelectorAll('.js__favorite-counter')
      //@ts-ignore
      .forEach(($el: HTMLElement) => ($el.innerText = String(count || '')));

    document
      .querySelectorAll('.js__favorite')
      //@ts-ignore
      .forEach(($el: HTMLElement) => $el.classList.add(count ? '' : 'hide'));
  }
}

export const favoritesService = new FavoritesService();
