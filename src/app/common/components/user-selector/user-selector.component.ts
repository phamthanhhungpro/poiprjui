import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './user-selector.component.html',
})
export class UserSelectorComponent implements OnInit {
  @ViewChild('inputElement') inputElement: ElementRef<HTMLInputElement>;
  @Input() label: string;
  @Input() options: any[] = []; // Replace with actual type
  @Output() selectionChange = new EventEmitter<{ action: string, items: any[] }>();

  @Input() length: number = 1000;
  searchControl = new FormControl();
  filteredOptions: Observable<any[]>; // Replace 'any' with actual type
  @Input() selectedItems: any[] = []; // Replace 'any' with actual type

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(null),
      map((item: any | null) => (item ? this._filter(item) : this.options.slice())),
      map(tvien => tvien.filter(m => !this.selectedItems.some(i => i.userName === m.userName)))
    );
  }

  private _filter(value: any): any[] {
    if (typeof (value) === 'object') {
      let res = this.options.filter(item => (item.fullName.toLowerCase().includes(value.fullName.toLowerCase())
        || item.userName.toLowerCase().includes(value.userName.toLowerCase())));
      return res;
    }

    if (value && value.startsWith('@')) {
      // delete @
      value = value.slice(1);
    }

    const filterValue = value.toLowerCase();

    return this.options.filter(item => (item.fullName.toLowerCase().includes(filterValue)
      || item.userName.toLowerCase().includes(filterValue)));
  }

  removeItem(item: any) {
    const index = this.selectedItems.indexOf(item);
    if (index >= 0) {
      this.selectedItems.splice(index, 1);
      this.searchControl.setValue(null);
      this.selectionChange.emit({ action: 'remove', items: this.selectedItems });
    }  

  }

  onOptionSelected(event: any) {
    if(this.selectedItems.length >= this.length) {
      this.openSnackBar(`Vui lòng chỉ chọn ${this.length} người`, 'Đóng');
      this.searchControl.setValue(null);
      this.inputElement.nativeElement.value = '';
      return;
    }
    const selectedOption = event.option.value;
    if (!this.selectedItems.includes(selectedOption)) {
      this.selectedItems.push(selectedOption);
      this.selectionChange.emit({ action: 'add', items: this.selectedItems });
    }
    this.searchControl.setValue(null);
    this.inputElement.nativeElement.value = '';
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 2000 });
  }
}
