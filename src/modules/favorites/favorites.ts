import html from './favorites.tpl.html';
import { favoritesService } from '../../services/favorites.service';
import { Component } from '../component';
import { ProductList } from '../productList/productList';

// при клике на товар преходит совсем на другой товар
// доделать кнопку добавления в избранное
// что должно происходить с кнопкой после того как товар есть в избранном
// при добавлении первого избранного товара нужно перезапустить страницу для того что бы появилась сылка на переход на страницу избранное это не правильное поведение? (думаю нет но решил уточнить)

class Favorites extends Component {
  productList: ProductList;

  constructor(props: any) {
    super(props);

    this.productList = new ProductList();
    this.productList.attach(this.view.products);
  }

  async render() {
    const productsResp = await favoritesService.get();
    this.productList.update(productsResp);
  }
}

export const favoritesComp = new Favorites(html);
