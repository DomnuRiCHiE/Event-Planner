import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';

// ...existing code...

@NgModule({
  declarations: [
    AppComponent,
    // ...existing code...
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    // ...existing code...
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
