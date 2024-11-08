import { Component, Input } from "@angular/core";

@Component({
    selector: "app-input-number",
    templateUrl: "./input-number.component.html",
    styleUrls: ["./input-number.component.css"],
})
export class InputNumberComponent {
    @Input() label: string | undefined;
    @Input() value: number | undefined;
    @Input() placeholder: string | undefined;
}
