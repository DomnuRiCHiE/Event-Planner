import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
    selector: "app-input-date",
    templateUrl: "./input-date.component.html",
    styleUrls: ["./input-date.component.css"],
    standalone: true,
    imports: [FormsModule],
})
export class InputDateComponent {
    @Input() label: string | undefined;
    @Input() value: string | undefined;
}
