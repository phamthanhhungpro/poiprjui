import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormControlName, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface Option {
  key: string;
  value: string;
}

@Component({
  standalone: true,
  selector: 'app-searchable-select',
  templateUrl: './searchable-select.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    NgxMatSelectSearchModule,
  ]
})
export class SearchableSelectComponent implements OnInit {
  @Input() options: Option[] = [];
  @Input() label: string = "Select an option";

  @Input() placeholder: string = 'Select an option';
  @Input() noEntriesFoundLabel: string = 'Không tìm thấy kết quả';
  @Output() selectionChange = new EventEmitter<string>();
  searchControl = new FormControl();
  filteredOptions: Observable<Option[]>;

  ngOnInit() {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): Option[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.value.toLowerCase().includes(filterValue));
  }

  onSelectionChange(event: any) {
    this.selectionChange.emit(event.value);
  }
}
