import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'
import { HttpClient } from "@angular/common/http"
import { map } from 'rxjs/operators'

import { Todo } from './todo.model'
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

const BACKEND_URL = `${environment.apiUrl}/todos/`

@Injectable({ providedIn: 'root' })
export class TodoService {
    private todos: Todo[] = []
    private todosUpdated = new Subject<{posts: Todo[], postCount: number}>()

    constructor(private http: HttpClient, private router: Router) { }

    getTodos(todosPerPage: number, currentPage: number , userId: string) {
        const queryParams = `?pagesize=${todosPerPage}&page=${currentPage}&userid=${userId}`
        this.http.get<{message: string, posts: any, maxPosts: number}>(`${BACKEND_URL}${queryParams}`)
            .pipe(map((todoData) => {
                return {posts: todoData.posts.map(todo => {
                    return {
                        title: todo.title,
                        content: todo.content,
                        isCompleted: todo.isCompleted,
                        id: todo._id,
                        creator: todo.creator
                    }
                }) , maxPosts: todoData.maxPosts}
            }))
            .subscribe(transformedPostsData => {
                this.todos = transformedPostsData.posts
                this.todosUpdated.next({posts: [...this.todos], postCount: transformedPostsData.maxPosts })
            })
    }

    getTodoUpdateListener() {
        return this.todosUpdated.asObservable()
    }

    getTodo(id: string) {
        return this.http.get<{_id: string; title: string; content: string; isCompleted: boolean; creator: string;}>(`${BACKEND_URL}${id}`)
    }

    addTodo(title: string, content: string, isCompleted: boolean) {
        const todo: Todo = {id: null, title: title,isCompleted: isCompleted, content: content, creator: null }
        this.http.post<{message: string, postId: string}>(BACKEND_URL, todo)
         .subscribe((responseData) => {
            this.router.navigate(["/"])
         })
    }

    updateTodo(id: string, title: string, content: string, isCompleted: boolean) {
        const todo: Todo = { id: id, title: title, content: content, isCompleted: isCompleted,  creator: null}
        this.http.put(`${BACKEND_URL}${id}`, todo)
            .subscribe(response => {
                this.router.navigate(["/"])
            })
    }

    toggleCheck(todo:Todo) {
        console.log("entered toggle check")
        this.http.put(`${BACKEND_URL}toggle/${todo.id}`,todo)
            .subscribe(response => {
                console.log(response)
            })
    }


    deleteTodo(todoId: string) {
        return this.http.delete(`${BACKEND_URL}${todoId}`)
         
    }
}