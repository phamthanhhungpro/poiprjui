// multi-select.component.ts
import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [MatSelectModule, MatCheckboxModule, NgFor],
  templateUrl: './multi-select.component.html',
})
export class MultiSelectComponent {
  options: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  selectedValues: string[] = [];

  toggleSelection(option: string) {
    const index = this.selectedValues.indexOf(option);
    if (index === -1) {
      this.selectedValues.push(option);
    } else {
      this.selectedValues.splice(index, 1);
    }
  }

  onSelectionChange(event: any) {
    this.selectedValues = event.value;
  }
}
