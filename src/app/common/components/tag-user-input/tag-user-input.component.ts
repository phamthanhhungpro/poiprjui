import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { startWith, map } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomDropdownComponent } from '../custom-dropdown/custom-dropdown.component';

@Component({
  selector: 'app-tag-user-input',
  standalone: true,
  imports: [CommonModule, MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CustomDropdownComponent],
  templateUrl: './tag-user-input.component.html',
  styleUrl: './tag-user-input.component.scss'
})
export class TagUserInputComponent {
  @Input() listTag: { key: string, value: string }[] = [];
  @Input() listPerson: { key: string, value: string }[] = [];
  @Output() inputValueChange = new EventEmitter<string>();

  inputControl = new FormControl();
  filteredOptions: { key: string, value: string }[] = [];

  ngOnInit() {
    this.inputControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    ).subscribe(filtered => this.filteredOptions = filtered);
  }

  onInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.filteredOptions = this._filter(input);
    this.inputValueChange.emit(this.inputControl.value); // Emit the input value
  }

  private _filter(value: string): { key: string, value: string }[] {
    if (!value) return [];

    const cursorPosition = (document.getElementById('input-field') as HTMLInputElement).selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const match = textBeforeCursor.match(/[@#][^@#\s]*$/);

    if (!match) return [];

    const filterValue = match[0].toLowerCase();

    if (filterValue.startsWith('#')) {
      return this.listTag.filter(option => option.key.toLowerCase().includes(filterValue.substring(1)));
    } else if (filterValue.startsWith('@')) {
      return this.listPerson.filter(option => option.key.toLowerCase().includes(filterValue.substring(1)));
    } else {
      return [];
    }
  }

  onOptionSelected(option: { key: string, value: string }): void {
    const inputElement = document.getElementById('input-field') as HTMLInputElement;
    const cursorPosition = inputElement.selectionStart;
    const inputValue = this.inputControl.value;
    const textBeforeCursor = inputValue.substring(0, cursorPosition);
    const textAfterCursor = inputValue.substring(cursorPosition);

    const match = textBeforeCursor.match(/[@#][^@#\s]*$/);
    if (match) {
      const newTextBeforeCursor = textBeforeCursor.substring(0, match.index) + match[0][0] + option.value + ' ';
      this.inputControl.setValue(newTextBeforeCursor + textAfterCursor);
      this.setCaretPosition(inputElement, newTextBeforeCursor.length);
      this.inputValueChange.emit(this.inputControl.value); // Emit the input value after selection
    }
  }

  setCaretPosition(inputElement: HTMLInputElement, position: number): void {
    setTimeout(() => {
      inputElement.setSelectionRange(position, position);
      inputElement.focus();
    }, 0);
  }
}
