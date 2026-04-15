import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../services/task'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  loading = signal(false);
  showSlowServerMessage = signal(false);

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    // 1. Iniciamos el proceso de "despertar"
    this.loading.set(true);
    
    // Mostramos el aviso tras 3 segundos si aún no ha respondido
    setTimeout(() => {
      if (this.loading()) this.showSlowServerMessage.set(true);
    }, 3000);

    // 2. Petición "Ping" al servidor
    this.taskService.getTasks().subscribe({
      next: () => this.finishLoading(),
      error: () => this.finishLoading() // Aunque dé 401 (no logueado), el servidor ya despertó
    });
  }

  private finishLoading() {
    this.loading.set(false);
    this.showSlowServerMessage.set(false);
  }
}