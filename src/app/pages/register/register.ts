import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

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

  constructor(private authService: AuthService, private router: Router) {}

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
        this.successMessage = 'Usuario registrado correctamente. Ahora puedes iniciar sesión.';
        // Opcional: redirigir automáticamente al login después de unos segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error: any) => {
        console.error('Error en el registro', error);
        this.errorMessage = 'No se pudo registrar el usuario. Puede que el email o el usuario ya existan.';
      }
    });
  }
}