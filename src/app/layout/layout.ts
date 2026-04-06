import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule,],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout implements OnInit {

  theme = signal(localStorage.getItem('theme') || 'light');

  ngOnInit() {
    document.body.classList.toggle('dark-theme', this.theme() === 'dark');
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

  constructor(private router: Router) {}

  goHome() {
  this.router.navigate(['/tasks']).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  }
 }
 
}