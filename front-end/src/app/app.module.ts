import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
// ...existing code...

@NgModule({
  declarations: [
    AppComponent,
    // ...existing code...
  ],
  imports: [
    FormsModule,
    // ...existing code...
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }