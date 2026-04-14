import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getTasks(): Observable<any> {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  createTask(task: any): Observable<any> {
    return this.http.post(this.apiUrl, task, this.getHeaders());
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  updateTask(task: any) {
  return this.http.put(`${this.apiUrl}/${task.id}`, task, this.getHeaders());
  }

  toggleStatus(id: number) {
  return this.http.put(`${this.apiUrl}/${id}/toggle`, {}, this.getHeaders());
 }

  addSubtask(taskId: number, subtask: any) {
  return this.http.post(`${this.apiUrl}/${taskId}/subtasks`, subtask);
 }

  toggleSubtask(subtaskId: number) {
  return this.http.patch(`${this.apiUrl}/subtasks/${subtaskId}/toggle`, {});
 }

  deleteSubtask(subtaskId: number) {
  return this.http.delete(`${this.apiUrl}/subtasks/${subtaskId}`);
 }

 updateOrder(list: { id: number; order: number }[]) {
  return this.http.post('/api/tasks/reorder', list);
 }
 
}