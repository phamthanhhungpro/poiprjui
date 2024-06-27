import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

interface Task {
  title: string;
  labels: string[];
  dueDate: Date;
}

interface KanbanList {
  title: string;
  tasks: Task[];
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, DragDropModule ],
  templateUrl: './kanban.component.html',
})
export class KanbanComponent {
  kanbanLists: KanbanList[] = [
    {
      title: 'To do',
      tasks: [
        {
          title: 'Example that showcases all of the available bits on the card with a fairly long title compared to other cards',
          labels: ['Research', 'Wireframing', 'Design', 'Development', 'Bug'],
          dueDate: new Date('2024-06-17')
        },
        {
          title: 'Do a research about most needed admin applications',
          labels: ['Research'],
          dueDate: new Date('2024-06-17')
        },
        {
          title: 'Implement the Project dashboard',
          labels: ['Development'],
          dueDate: new Date('2024-06-27')
        },
        {
          title: 'Implement the Analytics dashboard',
          labels: ['Development'],
          dueDate: new Date('2024-06-26')
        }
      ]
    },
    {
      title: 'In progress',
      tasks: [
        {
          title: 'Analytics dashboard design',
          labels: ['Design'],
          dueDate: new Date('2024-06-15')
        },
        {
          title: 'Project dashboard design',
          labels: ['Design'],
          dueDate: new Date('2024-06-15')
        }
      ]
    },
    {
      title: 'In review',
      tasks: [
        {
          title: 'JWT Auth implementation',
          labels: ['Development'],
          dueDate: new Date('2024-06-15')
        }
      ]
    },
    {
      title: 'Completed',
      tasks: [
        {
          title: 'Create low fidelity wireframes',
          labels: ['Design'],
          dueDate: new Date('2024-06-17')
        },
        {
          title: 'Create high fidelity wireframes',
          labels: ['Design'],
          dueDate: new Date('2024-06-17')
        },
        {
          title: 'Collect information about most used admin layouts',
          labels: ['Research'],
          dueDate: new Date('2024-06-15')
        },
        {
          title: 'Do a research about latest UI trends',
          labels: ['Research'],
          dueDate: new Date('2024-06-15')
        },
        {
          title: 'Learn more about UX',
          labels: ['Research'],
          dueDate: new Date('2024-06-15')
        }
      ]
    }
  ];

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
