import { Component, signal, OnInit, effect } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { NotificationService } from '../services/notification';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule,],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout implements OnInit {

  showToast = signal(false);
  showPanel = signal(false); // Para desplegar la campanita si quieres

  theme = signal(localStorage.getItem('theme') || 'light');

    // Inyectamos el NotificationService en el constructor
    constructor(
    private router: Router, 
    private cdr: ChangeDetectorRef,
    public notifService: NotificationService // Público para usarlo en el HTML
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    // EFECTO PARA EL POP-UP: Se dispara cuando cambia la cuenta de tareas urgentes
    effect(() => {
      if (this.notifService.urgentCount() > 0) {
        this.showToast.set(true);
        // Auto-cerrar el pop-up a los 6 segundos
        setTimeout(() => {
          this.showToast.set(false);
          this.cdr.detectChanges(); // Forzamos detección por si acaso
        }, 6000);
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    document.body.classList.toggle('dark-theme', this.theme() === 'dark');
  }

  togglePanel() {
  // .update(v => !v) cambia de true a false o viceversa automáticamente
  this.showPanel.update(value => !value);
  }

  // MÉTODO PARA EL POP-UP
  closeToast() {
    this.showToast.set(false);
  }

  toggleTheme() {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(newTheme);
    document.body.classList.toggle('dark-theme', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  goHome() {
  this.router.navigate(['/tasks']).then(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
    this.cdr.detectChanges();
  });
 }
  
  goToTasks() {
  if (this.router.url === '/tasks') {
    // Ya estamos en tasks → bajar directamente a Pendientes
    document.getElementById('pending-column')
      ?.scrollIntoView({ behavior: 'smooth' });
  } else {
    // Navegar a tasks y luego bajar a Pendientes
    this.router.navigate(['/tasks']).then(() => {
      setTimeout(() => {
        document.getElementById('pending-column')
          ?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    });
    this.cdr.detectChanges();
  }
 }

  goToProfile() {
  this.router.navigate(['/profile']).then(() => {
    this.cdr.detectChanges();
  });
}

}