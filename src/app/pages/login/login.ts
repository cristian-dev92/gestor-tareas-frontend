import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  username: string = '';
  password: string = '';
  errormessage: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private uiService: UiService
  ) {}

  onLogin() {
    const credentials = { 
      username: this.username, 
      password: this.password 
    };

    this.executeLogin(credentials);
  }

  // Acceso Rápido Demo: Envía las credenciales fijas directamente sin requerir otro clic
  loginDemo() {
    const demoCredentials = { 
      username: 'demo', 
      password: 'demo1234' 
    };

    this.executeLogin(demoCredentials);
  }

  private executeLogin(credentials: any) {
    this.authService.login(credentials).subscribe({
      next: (response) => {
        localStorage.clear(); // Borra el token viejo antes de intentar generar uno nuevo
        this.authService.saveToken(response.token);
        this.router.navigate(['/tasks']).then(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      },
      error: () => {
        this.uiService.mostrarToast('Nombre o contraseña incorrecto pruebe otra vez', 'error');
      }
    });
  }
}
