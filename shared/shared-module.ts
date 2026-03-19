import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgZorroAntdModule } from '../NgZorroAntdModule';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule, 
    RouterLink,
    RouterOutlet,
    NgZorroAntdModule
  ],
  exports:[
       CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule, 
    RouterLink,
    RouterOutlet,
    NgZorroAntdModule
  ]
})
export class SharedModule { }
