import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';

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
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
