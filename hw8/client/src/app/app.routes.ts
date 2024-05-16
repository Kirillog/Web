import { Routes } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Home'
    },
    {
        path: 'todolist',
        component: TodoListComponent,
        title: 'Todo list'
    },
    {
        path: 'add',
        component: DetailsComponent,
        title: 'Add todo item'
    },
    {
        path: 'items/:id',
        component: DetailsComponent,
        title: 'Item details'
    }
];
