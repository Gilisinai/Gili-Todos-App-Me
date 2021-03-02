import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AngularMaterialModule } from "../angular-material.module";

import {TodoCreateComponent} from './todo-create/todo-create.component'
import {TodoListCopmonent} from './todo-list/todo-list.component'


@NgModule({
    declarations: [
        TodoCreateComponent,
        TodoListCopmonent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule
    ]
})
export class TodosModule {}