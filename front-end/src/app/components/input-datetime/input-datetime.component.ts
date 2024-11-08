import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "app-input-datetime",
    templateUrl: "./input-datetime.component.html",
    styleUrls: ["./input-datetime.component.css"],
})
export class InputDateTimeComponent {
    @Input() label: string | undefined;
    @Input() value: Date | undefined;
    @Output() valueChange = new EventEmitter<Date>();

    onDateTimeChange(event: any) {
        this.value = new Date(event.target.value);
        this.valueChange.emit(this.value);
    }
}
