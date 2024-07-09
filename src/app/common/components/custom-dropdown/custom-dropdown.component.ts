import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-dropdown.component.html',
  styleUrl: './custom-dropdown.component.scss'
})
export class CustomDropdownComponent {
  @Input() filteredOptions: { key: string, value: string }[] = [];
  @Output() optionSelected = new EventEmitter<{ key: string, value: string }>();

  selectOption(option: { key: string, value: string }) {
    this.optionSelected.emit(option);
  }
}
