import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private uiService: UiService
  ) {}

  onRegister() {
    const newUser = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(newUser).subscribe({
      next: () => {
        localStorage.clear(); // Limpiamos por si acaso hay basura de otra sesión
        this.uiService.mostrarToast('Usuario registrado correctamente. Ahora puedes iniciar sesión', 'success');
        // Opcional: redirigir automáticamente al login después de unos segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: () => {
        this.uiService.mostrarToast('No se pudo registrar el usuario. Puede que el email o el usuario ya existan', 'error');
      }
    });
  }
}