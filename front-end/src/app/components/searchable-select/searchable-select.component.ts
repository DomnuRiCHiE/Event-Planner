import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
    selector: "app-searchable-select",
    templateUrl: "./searchable-select.component.html",
    styleUrls: ["./searchable-select.component.css"],
    standalone: true,
    imports: [FormsModule],
})
export class SearchableSelectComponent {
    @Input() label: string | undefined;
    @Input() options: string[] | undefined;
    @Input() selectedOption: string | undefined;
    searchText: string = "";
}
