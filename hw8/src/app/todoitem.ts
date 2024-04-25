import { ITodoType } from "./todo-card/todo-card.component";

export interface ITodo {
    id?: number;
    title: string;
    description: string;
    status: ITodoType;
    date: Date;
    imagePath: string;
}
