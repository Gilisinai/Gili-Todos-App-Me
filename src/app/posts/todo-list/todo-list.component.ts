import { Component, OnDestroy, OnInit } from '@angular/core'
import { PageEvent } from '@angular/material/paginator'
import { Subscription } from 'rxjs'
import { AuthService } from 'src/app/auth/auth.service'

import { Todo } from '../todo.model'
import { TodoService } from '../todos.service'

@Component({
    selector: 'app-post-list',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.css']
})
export class TodoListCopmonent implements OnInit, OnDestroy {

    todos: Todo[] = []
    isLoading = false
    totalPosts = 0
    todosPerPage = 5;
    currentPage = 1
    pageSizeOptions = [1,2,5,10]
    userIsAuthenticated = false
    userId: string;
    private todosSub: Subscription;
    private authStatusSub: Subscription;

    constructor(public todosService: TodoService, private authService: AuthService) {}

    ngOnInit() {
        this.isLoading = true
        this.userId = this.authService.getUserId()
        this.todosService.getTodos(this.todosPerPage, this.currentPage, this.userId);
        this.todosSub = this.todosService.getTodoUpdateListener().subscribe((todosData: {posts: Todo[], postCount: number}) => {
            this.isLoading = false
            this.totalPosts = todosData.postCount
            this.todos = todosData.posts
        })
        this.userIsAuthenticated = this.authService.getIsAuth()
        this.authStatusSub = this.authService
            .getAuthStatusListenter()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated
                this.userId = this.authService.getUserId()
            })
    }

    onChangedPage(pageData: PageEvent) {
        this.isLoading = true
        this.currentPage = pageData.pageIndex + 1
        this.todosPerPage = pageData.pageSize
        this.todosService.getTodos(this.todosPerPage, this.currentPage,this.userId);
    }

    onToggleCheck(post: Todo) {
        console.log(this.todos)
        this.todosService.toggleCheck(post)
        const toCheck = this.todos.find(todo => todo.id == post.id)
        toCheck.isCompleted = !toCheck.isCompleted
        
    }
   
    onDelete(todoId: string) {
        this.isLoading = true
        this.todosService.deleteTodo(todoId).subscribe(() => {
            this.todosService.getTodos(this.todosPerPage, this.currentPage, this.userId)
        }, () => {
            this.isLoading = false
        })
    }

    ngOnDestroy() {
        this.todosSub.unsubscribe()
        this.authStatusSub.unsubscribe()
    }
}