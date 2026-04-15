import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-task-card',
  standalone: true,
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
  imports: [CommonModule, FormsModule, DatePipe]
})
export class TaskCardComponent {

  @Input() task: any;

  @Output() toggleTask = new EventEmitter<any>();
  @Output() toggleSubtask = new EventEmitter<any>();
  @Output() deleteTask = new EventEmitter<number>();
  @Output() deleteSubtask = new EventEmitter<number>();
  @Output() editTask = new EventEmitter<any>();
  @Output() addSubtask = new EventEmitter<{ task: any, title: string }>();
  @Input() isOverdue: boolean = false; // Solo la variable, sin la función aquí


  newSubtaskText: string = '';

  onToggleTask() {
    this.toggleTask.emit(this.task);
  }

  onToggleSub(sub: any) {
    this.toggleSubtask.emit(sub);
  }

  onDeleteTask() {
    this.deleteTask.emit(this.task.id);
  }

  onDeleteSub(id: number) {
    this.deleteSubtask.emit(id);
  }

  onEditTask() {
    this.editTask.emit(this.task);
  }

  onAddSubtask() {
    if (!this.newSubtaskText.trim()) return;
    this.addSubtask.emit({ task: this.task, title: this.newSubtaskText });
    this.newSubtaskText = '';
  }

  translatePriority(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'low':
        return 'Baja';
      case 'medium':
        return 'Media';
      case 'high':
        return 'Alta';
      default:
        return priority;
    } 
  }

}