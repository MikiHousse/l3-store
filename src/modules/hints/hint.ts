import { Component } from '../component';
import html from './hints.tpl.html';

class Homepage extends Component {
  constructor(props: any) {
    super(props);
  }
}

export const hints = new Homepage(html);
