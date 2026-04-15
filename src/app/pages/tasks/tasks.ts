import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task';
import { TaskCardComponent } from '../../task-card/task-card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragMove } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { NotificationService } from '../../services/notification';


@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskCardComponent, DragDropModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class Tasks {

  tasks: any[] = []; // Lista de tareas completa
  pendingTasks: any[] = []; // Nueva propiedad para tareas pendientes
  doneTasks: any[] = []; // Nueva propiedad para tareas completadas
  newTask: string = ''; // Nueva propiedad para el título de la nueva tarea
  errorMessage: string = ''; // Nueva propiedad para mensajes de error
  newTaskTitle: string = ''; // Nueva propiedad para el título
  newTaskDescription: string = ''; // Nueva propiedad para la descripción
  newTaskPriority: string = 'MEDIUM'; // Valor por defecto
  newTaskDeadline: string = ''; // Nueva propiedad para la fecha límite
  newTaskCategory: string = ''; // Nueva propiedad para la categoría
  searchText: string = ''; // Nueva propiedad para el texto de búsqueda
  newSubtask: any = {}; // Nueva propiedad para la subtarea
  currentFilter: string = 'ALL'; // Nueva propiedad para el filtro actual

  // Mantenemos el loading para el estado de la UI, pero quitamos SlowServerMessage
  loading = signal(true);
  
  constructor(private taskService: TaskService, 
    private route: ActivatedRoute,
    private notifService: NotificationService) {}
  
  ngOnInit() {
     // Scroll automático si hay fragmento (#kanban-section)
    this.route.fragment.subscribe(fragment => {
    if (fragment) {
      setTimeout(() => { // Un pequeño delay asegura que los datos ya se pintaron
        const element = document.getElementById(fragment);
        if (element) { element.scrollIntoView({ behavior: 'smooth' }); }
      }, 500);
    }
  });
     // Activar loading
      this.loading.set(true);

  // Tu código original para cargar tareas
    this.loadTasks();
  }

  // Carga las tareas desde el servicio y las ordena por fecha de creación (más recientes primero)
  loadTasks() { 
    this.loading.set(true); // Desactivar loading al recibir respuesta (éxito o error)

    this.taskService.getTasks().subscribe({
      next: (data) => {
        console.log("TAREAS RECIBIDAS:", data);  // ← AÑADE ESTO
        this.tasks = data;

        //Pasa las tareas al servicio para que busque fechas próximas
        this.notifService.checkDeadlines(this.tasks);

        this.loading.set(false); // Desactivar loading al recibir respuesta (éxito o error)
        

        // 🔥 sincronizar columnas
        this.pendingTasks = this.tasks.filter(t => t.status === 'PENDING');
        this.doneTasks    = this.tasks.filter(t => t.status === 'DONE');
        },
        error: () => {
          this.errorMessage = 'No se pudieron cargar las tareas.';
          this.loading.set(false); // Desactivar loading al recibir respuesta (éxito o error)
        }
      });
    }

  // Agrega una nueva tarea y descripción, prioridad, fecha límite y categoría
  addTask() { 
    if (!this.newTaskTitle.trim()) return;

    const task = { 
      title: this.newTaskTitle, 
      description: this.newTaskDescription, 
      priority: this.newTaskPriority, 
      deadline: this.newTaskDeadline,
      category: this.newTaskCategory,
    };

    console.log('TAREA A ENVIAR:', task); // ← AQUÍ
  
    this.taskService.createTask(task).subscribe({
      next: () => {
        this.newTaskTitle = '';
        this.newTaskDescription = '';
        this.newTaskPriority = 'MEDIUM';
        this.newTaskDeadline = '';
        this.newTaskCategory = '';
        this.loadTasks();
      },
      error: () => {
        this.errorMessage = 'No se pudo crear la tarea.';
      }
    });
  }

  // Elimina una tarea por su ID
  deleteTask(id: number) { 
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: () => {
        this.errorMessage = 'No se pudo borrar la tarea.';
      }
    });
  }

  editingTask: any = null;

  // Inicia la edición de una tarea, guardando una copia para no modificar en vivo
  startEdit(task: any) {
  this.editingTask = { ...task }; // copia para no modificar en vivo
  }

  // Guarda los cambios de la tarea editada
  updateTask(task: any) { // Guarda los cambios de la tarea editada
    this.taskService.updateTask(task).subscribe({
      next: () => {
        this.editingTask = null;
        this.loadTasks(); // refresca la lista
    },
    error: () => {
      this.errorMessage = 'No se pudo actualizar la tarea.';
    }
   });
  }

  // Cancela la edición y vuelve al estado normal
  cancelEdit() { 
    this.editingTask = null;
  }

  // Cambia el estado de la tarea (pendiente/completada)
  toggleTask(task: any) {
    this.taskService.toggleStatus(task.id).subscribe({
      next: () => {
        this.loadTasks(); // refresca la lista para mostrar el nuevo estado
      },
      error: () => {
        this.errorMessage = 'No se pudo cambiar el estado de la tarea.';
      }
    });
  }

  // Nueva función para establecer el filtro de tareas
  setFilter(filter: string) {
    this.currentFilter = filter;
  }

  // Devuelve la lista de tareas filtrada según el estado y el texto de búsqueda
  getFilteredTasks() {
    let filtered = this.tasks;

  // Aplica el filtro de estado
  if (this.currentFilter === 'PENDING') {
    filtered = filtered.filter(t => t.status === 'PENDING');
  }
  if (this.currentFilter === 'DONE') {
    filtered = filtered.filter(t => t.status === 'DONE');
  }
  
  // Filtrar por búsqueda
  if (this.searchText.trim() !== '') {
    const text = this.searchText.toLowerCase();

    filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(text) ||
      (t.description && t.description.toLowerCase().includes(text)) ||
      (t.category && t.category.toLowerCase().includes(text)) ||
      (t.priority && this.translatePriority(t.priority).toLowerCase().includes(text))
    );
  }

  return filtered;
 }

  // Ordena por fecha de creación, 'new' para más recientes primero, 'old' para más antiguas primero
  orderBy(mode: string) {
  if (mode === 'new') {
    this.tasks.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else {
    this.tasks.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }
 }

  // Traduce la prioridad de inglés a español para mostrar en la interfaz
  translatePriority(p: string) {
   switch (p) {
    case 'HIGH': return 'Alta';
    case 'MEDIUM': return 'Media';
    case 'LOW': return 'Baja';
    default: return p;
  }
 }

  // Verifica si una fecha dada ya ha pasado (es decir, si la tarea está vencida)
  isExpired(date: string) {
    return new Date(date) < new Date();
  }

  // Agrega una subtarea a una tarea específica
  addSubtask(task: any) {
    const title = this.newSubtask[task.id]?.trim();
    if (!title) return;

    this.taskService.addSubtask(task.id, { title }).subscribe({
      next: () => {
        this.newSubtask[task.id] = '';
        this.loadTasks();
      },
      error: () => {    
       this.errorMessage = 'No se pudo agregar la subtarea.';
      }
    });
  }

  // Cambia el estado de una subtarea (pendiente/completada)
  toggleSubtask(sub: any) {
    this.taskService.toggleSubtask(sub.id).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: () => {
        this.errorMessage = 'No se pudo cambiar el estado de la subtarea.';
      }
   });
   }

   // Elimina una subtarea por su ID
   deleteSubtask(id: number) {
    this.taskService.deleteSubtask(id).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: () => {
        this.errorMessage = 'No se pudo borrar la subtarea.';
      }
    });
  }

    // Agrega una subtarea desde el componente de tarjeta, recibiendo el evento con la tarea y el título  
    addSubtaskFromCard(event: { task: any, title: string }) {
      this.taskService.addSubtask(event.task.id, { title: event.title }).subscribe(() => {
        this.loadTasks();
    });
  }

    // Maneja el evento de arrastrar y soltar para reordenar tareas o moverlas entre columnas
    drop(event: CdkDragDrop<any[]>, newStatus: 'PENDING' | 'DONE') {

    // Reordenar dentro de la misma columna
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // 🔥 Actualizar orden en backend
      this.saveOrder(event.container.data);
      return;
    } 

    // Mover entre columnas
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    // Actualizar el estado de la tarea movida
      const movedTask = event.container.data[event.currentIndex];
      movedTask.status = newStatus;

    // Guardar en backend
      this.updateTask(this.editingTask ? this.editingTask : movedTask);
   }

    //Scroll suave al hacer drag
    scrollOnDrag(event: CdkDragMove, container: HTMLElement) {
      const scrollZone = 80; // px desde el borde
      const scrollSpeed = 10; // velocidad del scroll

      const { y } = event.pointerPosition;
      const top = container.getBoundingClientRect().top;
      const bottom = container.getBoundingClientRect().bottom;

      if (y < top + scrollZone) {
        container.scrollTop -= scrollSpeed;
      } else if (y > bottom - scrollZone) {
        container.scrollTop += scrollSpeed;
      }
    }

    // Guarda el nuevo orden de las tareas en el backend después de un drag and drop
    saveOrder(list: any[]) {
      const payload = list.map((task, index) => ({
      id: task.id,
      order: index
   }));

    this.taskService.updateOrder(payload).subscribe();
  }

  // Abre un modal para crear una nueva tarea (puede ser un formulario o un componente separado)
  openCreateModal() {
  // lógica para abrir el modal de creación de tarea
 }
  // Alterna entre modo claro y oscuro
  toggleTheme() {
  document.body.classList.toggle('dark');
 }

  // Cierra la sesión del usuario y redirige a la página de login
  logout() {
  // lógica de cerrar sesión
  }

  // Función para calcular si está vencida (se usa en el HTML del padre)
  checkIfOverdue(deadline: string | Date | undefined): boolean {
    if (!deadline) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Solo comparamos fechas, no horas
    const taskDate = new Date(deadline);
    return taskDate < today;
  }
  
}