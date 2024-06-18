import { ThemePalette } from "@angular/material/core";

export interface Task {
    name: string;
    completed: boolean;
    color: ThemePalette;
    value?: string;
    subtasks?: Task[];
  }