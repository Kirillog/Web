import { Injectable } from '@angular/core';
import { ITodo } from './todoitem';
import { apiurl } from './constants';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor() { }

  async getAllTodo(status: string): Promise<ITodo[]> {
    let request = `${apiurl}?all&status.status=${status}`;
    console.log(
      "request: ", status
    )
    const data = await fetch(request);
    return await data.json();
  }

  async getTodoFilteredByName(title: string): Promise<ITodo[]> {
    let request = `${apiurl}?filter&title.title=${title}`;
    console.log(
      "request: ", title
    )
    const data = await fetch(request);
    return await data.json();
  }

  async addTodo(data: ITodo): Promise<ITodo> {
    console.log("trying to add...: ", data);
    const resp = await fetch(`${apiurl}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    })
    return await resp.json();
  }

  async updateTodo(id: number, data: ITodo): Promise<ITodo> {
    console.log("data: ", data)
    const resp = await fetch(`${apiurl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    })
    return await resp.json();
  }
}
