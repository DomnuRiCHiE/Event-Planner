import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class InputTextComponent {
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() placeholder: string = '';
}
