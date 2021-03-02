import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./auth/auth.guard";
import { TodoCreateComponent } from "./posts/todo-create/todo-create.component";
import { TodoListCopmonent } from "./posts/todo-list/todo-list.component";

const routes: Routes = [
    { path: '', component: TodoListCopmonent , canActivate: [AuthGuard] },
    { path: 'create' , component: TodoCreateComponent, canActivate: [AuthGuard]},
    { path: 'edit/:postId', component: TodoCreateComponent,  canActivate: [AuthGuard]},
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule { }