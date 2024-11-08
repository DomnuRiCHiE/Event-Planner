import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { InputTextComponent } from "../input-text/input-text.component";

@Component({
    selector: "event-form",
    templateUrl: "./event-form.component.html",
    styleUrls: ["./event-form.component.css"],
    standalone: true,
    imports: [FormsModule, InputTextComponent],
})
export class EventFormComponent {
    name: string = "";
    email: string = "";

    onSubmit() {
        console.log("Form submitted!");
        console.log("Name:", this.name);
        console.log("Email:", this.email);
    }
}
