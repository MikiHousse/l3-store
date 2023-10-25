import { Component } from '../component';
import { ProductList } from '../productList/productList';
import { formatPrice } from '../../utils/helpers';
import { ProductData } from 'types';
import html from './productDetail.tpl.html';
import { cartService } from '../../services/cart.service';
import { favoritesService } from '../../services/favorites.service';

class ProductDetail extends Component {
  more: ProductList;
  product?: ProductData;

  constructor(props: any) {
    super(props);

    this.more = new ProductList();
    this.more.attach(this.view.more);
  }

  async render() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = Number(urlParams.get('id'));

    const productResp = await fetch(`/api/getProduct?id=${productId}`);
    this.product = await productResp.json();

    if (!this.product) return;

    const { id, src, name, description, salePriceU } = this.product;

    this.view.photo.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.description.innerText = description;
    this.view.price.innerText = formatPrice(salePriceU);
    this.view.btnBuy.onclick = this._addToCart.bind(this);
    this.view.btnFav.onclick = this._toggleFavorite.bind(this);
    this._setInFavorite();

    const isInCart = await cartService.isInCart(this.product);

    if (isInCart) this._setInCart();

    fetch(`/api/getProductSecretKey?id=${id}`)
      .then((res) => res.json())
      .then((secretKey) => {
        this.view.secretKey.setAttribute('content', secretKey);
      });

    fetch('/api/getPopularProducts')
      .then((res) => res.json())
      .then((products) => {
        this.more.update(products);
      });
  }

  async _getFavoriteProducts() {
    const favoritProducts = await favoritesService.get();
    console.log(favoritProducts, this.product?.brandId);
    return favoritProducts.some((product) => product.brandId === this.product?.brandId);
  }

  private _addToFavorite() {
    if (!this.product) return;

    favoritesService.addProduct(this.product);
  }

  private _removeFromFavorite() {
    if (!this.product) return;

    favoritesService.removeProduct(this.product);
  }

  private async _toggleFavorite() {
    if (!this.product) return;

    const isCurentProductFavorite = await this._getFavoriteProducts();

    if (isCurentProductFavorite) {
      this._removeFromFavorite();
    } else {
      this._addToFavorite();
    }

    this._setInFavorite();
  }

  private _addToCart() {
    if (!this.product) return;

    cartService.addProduct(this.product);
    this._setInCart();
  }

  private _setInCart() {
    this.view.btnBuy.innerText = '✓ В корзине';
    this.view.btnBuy.disabled = true;
  }

  private async _setInFavorite() {
    await this._getFavoriteProducts();
    const isCurentProductFavorite = await this._getFavoriteProducts();

    if (isCurentProductFavorite) {
      this.view.btnFavSvg.setAttribute('fill', 'var(--key-color)');
    } else {
      this.view.btnFavSvg.setAttribute('fill', 'var(--text-dark-color)');
    }
  }
}

export const productDetailComp = new ProductDetail(html);
