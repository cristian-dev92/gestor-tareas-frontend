import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  // Lista de nombres de tareas urgentes
  notifications = signal<string[]>([]);
  // Contador automático
  urgentCount = computed(() => this.notifications().length);

  checkDeadlines(tasks: any[]) {
    const now = new Date();
    const urgentTasks: string[] = [];

    tasks.forEach(task => {
      // Solo avisar si no está terminada y tiene fecha
      if (task.deadline && task.status !== 'DONE') {
        const deadline = new Date(task.deadline);

        // Cálculo de diferencia en horas
        const diffInMs = deadline.getTime() - now.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);

        // Si falta menos de 48 horas
        if (diffInHours > 0 && diffInHours <= 48) {
          urgentTasks.push(task.title);
        }
      }
    });

    this.notifications.set(urgentTasks);
  }
}