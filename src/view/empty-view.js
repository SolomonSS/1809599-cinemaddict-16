import AbstractView from './abstract-view.js';

const createEmptyTemplate = () =>'<h2 class="films-list__title">There are no movies in our database</h2>';

export default class EmptyView extends AbstractView{
  get template(){
    return createEmptyTemplate();
  }
}

