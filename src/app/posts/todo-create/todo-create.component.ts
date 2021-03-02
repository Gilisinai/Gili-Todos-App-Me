import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from 'src/app/auth/auth.service'

import { TodoService } from '../todos.service'
import { Todo } from '../todo.model'


@Component({
    selector: 'app-post-create',
    templateUrl: './todo-create.component.html',
    styleUrls: ['./todo-create.component.css']
})
export class TodoCreateComponent implements OnInit, OnDestroy {

    enteredContent= ''
    enteredTitle=''
    todo: Todo;
    isLoading = false;
    form: FormGroup
    private mode = 'create'
    private todoId: string
    private authStatusSub: Subscription

    constructor(public todosService: TodoService, public route: ActivatedRoute, private authService: AuthService) {}

    ngOnInit() {
        this.authStatusSub = this.authService.getAuthStatusListenter().subscribe(
            authStatus => {
                this.isLoading = false
            })
        this.form = new FormGroup({
            title: new FormControl(null, 
                {validators: [Validators.required, Validators.minLength(3)]
            }),
            content: new FormControl(null,
                 {validators: [Validators.required]
            })
        })
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('postId')) {
                this.mode = 'edit'
                this.todoId = paramMap.get('postId')
                this.isLoading = true
                this.todosService.getTodo(this.todoId).subscribe(todoData => {
                    this.isLoading = false
                    this.todo = {id: todoData._id, title: todoData.title, content: todoData.content, isCompleted: todoData.isCompleted, creator: todoData.creator}
                    this.form.setValue({
                        title: this.todo.title,
                        content: this.todo.content
                    })
                })

            } else {
                this.mode = 'create'
                this.todoId = null
            }
        })
    }

    onSaveTodo() {
        if(this.form.invalid) {
            return
        }
        this.isLoading = true
        if (this.mode === 'create') {
            this.todosService.addTodo(this.form.value.title, this.form.value.content, this.form.value.isCompleted)
        } else {
            this.todosService.updateTodo(this.todoId, this.form.value.title, this.form.value.content, this.form.value.isCompleted)
        }
        this.form.reset()
    }

    ngOnDestroy() {
       this.authStatusSub.unsubscribe() 
    }
}