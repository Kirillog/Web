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

  async addTodo(data: ITodo): Promise<ITodo> {
    console.log("trying to add...: ", data);
    const resp = await fetch(`${apiurl}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(data)
    })
    return await resp.json();
  }

  async updateTodo(id: number, data: ITodo): Promise<ITodo> {
    const resp = await fetch(`${apiurl}/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(data)
    })
    return await resp.json();
  }
}
