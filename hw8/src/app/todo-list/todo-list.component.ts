import { Component, OnInit, inject } from '@angular/core';
import { TodoCardComponent } from '../todo-card/todo-card.component';
import { TodoService } from '../todo.service';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ItemsService } from '../items.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [MatListModule, MatButtonModule, TodoCardComponent, RouterModule, DatePipe],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit {
  itemService = inject(ItemsService);
  todoService = inject(TodoService);
  filterByStatus = '';
  today: number = Date.now();

  constructor() { }

  ngOnInit(): void {
    this.getAllTodos();
  }

  getAllTodos() {
    this.todoService.getAllTodo(this.filterByStatus).then(
      (response) => {
        this.itemService.todos = response;
        console.log("Todos: ", this.itemService.todos)
      },
    );
  }

  onFilterByStatus(status: string) {
    this.filterByStatus = status;
    this.getAllTodos();
  }

  filterResults(title: string) {
    this.todoService.getTodoFilteredByName(title).then(
      (response) => {
        this.itemService.todos = response;
        console.log("Todos: ", this.itemService.todos)
      },
    );
  }
}

