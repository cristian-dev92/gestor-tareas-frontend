# TaskFlow – Frontend (Angular)

Aplicación de gestión de tareas con Angular y Spring Boot. Incluye autenticación, perfil de usuario, CRUD de tareas y diseño UI profesional.

TaskFlow es una aplicación moderna de gestión de tareas diseñada para ofrecer una experiencia rápida, intuitiva y visualmente fácil para todos.  

Este repositorio contiene el frontend desarrollado con **Angular**, totalmente integrado con un backend en **Spring Boot**.

---

## 🌐 Demo pública

Frontend desplegado en Vercel.

El backend está en Render y puede tardar 40–60 segundos en despertar en la primera carga.

🔗 Demo: <https://gestor-tareas-frontend-eight.vercel.app/>

---

## 🚀 Características principales

- 🔐 **Autenticación:** Registro, login y persistencia de sesión mediante JWT.
- 📋 **Tablero Kanban:** Organización de tareas por estados (Pendiente, En Proceso, Completado).
- 🔔 **Sistema de Alertas:** Notificaciones visuales para tareas que vencen en las próximas 48 horas.
- 📅 **Control de Vencimientos:** Indicadores visuales automáticos para tareas atrasadas.
- 👤 **Gestión de perfil:** Edición de datos de usuario y personalización.
- 🌓 **Modo Adaptativo:** Interfaz optimizada para una experiencia visual profesional.

---

## 🛠️ Tecnologías utilizadas

- **Angular** (Standalone Components & Signals)
- **TypeScript**
- **Angular CDK** (Drag & Drop functionality)
- **RxJS** (Gestión de flujos de datos)
- **JWT Authentication** & **Guards** de navegación.
- **HTML5 / CSS3** (Variables dinámicas y diseño responsive)
- **Render / Vercel** (opcional para despliegue)

---

## 📦 Instalación y ejecución

1.  **Clonar el repositorio:**

```bash
git clone https://github.com/tuusuario/taskflow-frontend.git
cd taskflow-frontend
```

2.  **Instalar dependencias:**

```bash
    npm install
```

3.  **Ejecutar el servidor de desarrollo:**

```bash
    ng serve
```
    La aplicación estará disponible en: `http://localhost:4200`

## 🗂️ Estructura del Proyecto (Key Folders)

```text
src/app/
├── layout/             # Estructuras de página 
├── pages/              # Vistas principales (home, login, profile, register, tasks)
├── services/           # Lógica de negocio (auth, notification, task)
├── task-card/          # Vista de tarjetas 
├── environmnets/       # URL para conectar con el backend en producción
├── app.config.ts       # Configuracion principal
├── app.routes.ts       # Definición de rutas y navegación     
└── auth.interceptor.ts # Gestión centralizada de tokens JWT y Guards para usuarios autenticados

📄 Licencia

Este proyecto está bajo la licencia MIT.
Puedes usarlo, modificarlo y adaptarlo libremente.

👨‍💻 Autor

Cristian Alhambra — Full Stack Developer  
Especializado en Angular, Spring Boot y desarrollo de aplicaciones web modernas.
