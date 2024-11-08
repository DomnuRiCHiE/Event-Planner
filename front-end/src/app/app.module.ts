import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { InputTextComponent } from './components/input-text/input-text.component';
import { FormComponent } from './components/event-form/form.component';
// ...existing code...

@NgModule({
  declarations: [
    AppComponent,
    InputTextComponent,
    FormComponent,
    // ...existing code...
  ],
  imports: [
    BrowserModule,
    FormsModule,
    // ...existing code...
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }