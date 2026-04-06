import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';

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

  constructor(private authservice: AuthService) {}

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    this.authservice.getCurrentUser().subscribe({
      next: (data) => {
        console.log("DATOS RECIBIDOS:", data);
        this.user = data;

        // Inicializamos los campos editables
        this.editedUsername = this.user.username;
        this.editedEmail = this.user.email;
      },
      error: () => console.error('No se pudo cargar el perfil')
    });
  }

  enableEdit() {
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
      alert('Las contraseñas no coinciden');
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

        // ⭐ Guardar el nuevo token que devuelve el backend
        this.authservice.saveToken(response.token);

        // ⭐ Actualizar el usuario en Angular
        this.user = response.user;

        // ⭐ Salir del modo edición
       this.editMode = false;

        // ⭐ Limpiar campos
        this.newPassword = '';
        this.confirmPassword = '';
       },
      error: () => alert("No se pudo actualizar el perfil")
    });
  }
}