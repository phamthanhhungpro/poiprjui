import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightUsernames'
})
export class HighlightUsernamesPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    return value.replace(/(@\w+)/g, (match) => `<span matTooltip="User: ${match}" class="text-blue">${match}</span>`);
  }
}
