import { Injectable } from '@angular/core';
import { ITodo } from './todoitem';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  todos: ITodo[] = [];

  constructor() { }
}
