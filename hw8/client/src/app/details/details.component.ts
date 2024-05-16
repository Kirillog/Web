import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TodoService } from '../todo.service';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { ITodoStatus } from '../todo-card/todo-card.component';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ItemsService } from '../items.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})

export class DetailsComponent {
  @Input() todoList!: TodoListComponent;

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  todoService = inject(TodoService);
  itemService = inject(ItemsService);
  todoStatus = ITodoStatus;

  title = new FormControl('', [Validators.required]);
  description = new FormControl('', [Validators.required]);
  status = new FormControl('OPEN', [Validators.required]);
  date = new FormControl(new Date(), []);
  imagePath = new FormControl('', []);
  todoForm: FormGroup = new FormGroup({
    title: this.title,
    description: this.description,
    status: this.status,
    date: this.date,
    imagePath: this.imagePath
  })
  todoId: number | null = null;

  constructor() {
    const id = this.route.snapshot.params['id']
    this.todoId = parseInt(id, 10);
    if (!Number.isNaN(this.todoId)) {
      const item = this.itemService.todos[this.todoId];
      this.todoForm.patchValue({
        title: item.title,
        description: item.description,
        status: item.status,
        date: item.date,
        imagePath: item.imagePath,
      });
    }
  }

  onSubmit() {
    if (this.todoForm.valid) {
      if (!Number.isNaN(this.todoId)) {
        this.todoService
          .updateTodo(this.todoId!, { id: this.todoId!, ...this.todoForm.value })
          .then((response) => {
            this.itemService.todos[this.todoId!] = response;
          },
          );
      } else {
        this.todoService.addTodo(this.todoForm.value).then((response) => {
          this.itemService.todos[this.todoId!] = response;
        },
        );
      }
      this.router.navigateByUrl("/todolist")
    } else {
      this.todoForm.markAllAsTouched();
    }
  }
}