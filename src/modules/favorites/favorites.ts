import html from './favorites.tpl.html';
import { favoritesService } from '../../services/favorites.service';
import { Component } from '../component';
import { ProductList } from '../productList/productList';

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
