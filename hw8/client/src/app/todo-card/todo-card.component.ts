import { Component, Input } from '@angular/core';
import { ITodo } from '../todoitem';
import { imageUrls } from '../constants';


export type ITodoType = 'OPEN' | 'PROGRESS' | 'DONE';
export const ITodoStatus = ['OPEN', 'PROGRESS', 'DONE'];

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [],
  templateUrl: './todo-card.component.html',
  styleUrl: './todo-card.component.scss',
})
export class TodoCardComponent {
  @Input() type: ITodoType = 'OPEN';
  @Input() todo!: ITodo;
  imageUrl: string = imageUrls[getRandomInt(imageUrls.length)];
}
