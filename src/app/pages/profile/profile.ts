import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  user: any = null;

  editMode = false;

  // Campos editables
  editedUsername = '';
  editedEmail = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    private authservice: AuthService, 
    private router: Router, 
    private cdr: ChangeDetectorRef,
    private uiService: UiService
  ) {}

  ngOnInit() {
    this.loadUser();

  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd && event.urlAfterRedirects === '/profile') {
      this.loadUser();
    }
  });
}

  loadUser() {
    this.authservice.getCurrentUser().subscribe({
      next: (data) => {
        console.log("DATOS RECIBIDOS:", data);
        this.user = data;

        // Inicializamos los campos editables
        this.editedUsername = this.user.username;
        this.editedEmail = this.user.email;

        //¡FORZAR DETECCIÓN DE CAMBIOS AQUÍ!
        this.cdr.detectChanges();
      },
      error: () => this.uiService.mostrarToast('No se pudo cargar el perfil', 'error')
    });
  }

  enableEdit() {
    // Bloqueo si es el usuario demo
    if (this.user?.username === 'demo') {
      this.uiService.mostrarToast('El usuario demo es de solo lectura y no se puede modificar.', 'warning');
      return;
    }

    this.editMode = true;
    this.editedUsername = this.user.username;
    this.editedEmail = this.user.email;
  }

  cancel() {
    this.editMode = false;

    // Restaurar valores originales
    this.editedUsername = this.user.username;
    this.editedEmail = this.user.email;
    this.newPassword = '';
    this.confirmPassword = '';
  }

  saveChanges() {
    if (this.newPassword && this.newPassword !== this.confirmPassword) {
      this.uiService.mostrarToast('Las contraseñas no coinciden', 'warning');
      return;
    }

    const updatedUser: any = {
      username: this.editedUsername,
      email: this.editedEmail,
      password: this.newPassword || null
    };

    if (this.newPassword) {
      updatedUser.password = this.newPassword;
    }

    this.authservice.updateUser(updatedUser).subscribe({
        next: (response: any) => {

        //Guardar el nuevo token que devuelve el backend
        this.authservice.saveToken(response.token);

        //Actualizar el usuario en Angular
        this.user = response.user;

        //Salir del modo edición
       this.editMode = false;

        //Limpiar campos
        this.newPassword = '';
        this.confirmPassword = '';

        //Forzar refresco tras actualizar
        this.cdr.detectChanges();
        this.uiService.mostrarToast('¡Perfil actualizado con éxito!', 'success');
       },
      error: (err) => {
        if (err.status === 403) {
          this.uiService.mostrarToast('El usuario demo es de solo lectura y no se puede modificar.', 'warning');
        } else {
          this.uiService.mostrarToast('No se pudo actualizar el perfil', 'error');
        }
      }
    });
  }
}