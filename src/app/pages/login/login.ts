import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    const credentials = { 
      username: this.username, 
      password: this.password 
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        localStorage.clear(); //Borra el token viejo antes de intentar generar uno nuevo
        this.authService.saveToken(response.token);
        this.router.navigate(['/tasks']).then(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },
      error: () => {
        this.errormessage = 'Username or password is incorrect. Please try again.';
      }
    });
  }
}
