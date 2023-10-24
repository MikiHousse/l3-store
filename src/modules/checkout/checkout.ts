import { Component } from '../component';
import { Product } from '../product/product';
import html from './checkout.tpl.html';
import { formatPrice } from '../../utils/helpers';
import { cartService } from '../../services/cart.service';
import { ProductData } from 'types';

class Checkout extends Component {
  products!: ProductData[];

  _getTotalPrice() {
    return this.products.reduce((acc, product) => (acc += product.salePriceU), 0);
  }

  async render() {
    this.products = await cartService.get();

    if (this.products.length < 1) {
      this.view.root.classList.add('is__empty');
      return;
    }

    this.products.forEach((product) => {
      const productComp = new Product(product, { isHorizontal: true });
      productComp.render();
      productComp.attach(this.view.cart);
    });

    const totalPrice = this._getTotalPrice();
    this.view.price.innerText = formatPrice(totalPrice);

    this.view.btnOrder.onclick = this._makeOrder.bind(this);
  }

  private async _makeOrder() {
    await cartService.clear();

    const totalPrice = this._getTotalPrice();
    const productIds = this.products.map((product) => product.brandId);
    const orderId = Math.pow(productIds[0], 2).toString(3);

    fetch('/api/sendEvent', {
      method: 'POST',
      body: JSON.stringify({
        type: 'purchase',
        payload: {
          orderId: orderId,
          totalPrice: totalPrice,
          productIds: productIds
        }
      })
    });

    fetch('/api/makeOrder', {
      method: 'POST',
      body: JSON.stringify(this.products)
    });
    window.location.href = '/?isSuccessOrder';
  }
}

export const checkoutComp = new Checkout(html);
