import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  negocio?: string;
  telefono?: string;
}

export interface LoginRequest {
  email: string;
  password: string;  // Mantener password en el frontend
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Usar configuración del environment para la URL de la API
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verificar si hay un token almacenado al inicializar
    this.checkStoredAuth();
  }

  private checkStoredAuth(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        try {
          const userData = JSON.parse(user);
          this.currentUserSubject.next(userData);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          this.logout();
        }
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Mapear password a contraseña para el backend
    const backendCredentials = {
      email: credentials.email,
      contraseña: credentials.password
    };
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, backendCredentials)
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            // Almacenar token y usuario
            if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
              localStorage.setItem('token', response.token);
              localStorage.setItem('user', JSON.stringify(response.user));
            }
            
            // Actualizar el estado del usuario actual
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  logout(): void {
    // Limpiar almacenamiento local
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    // Actualizar el estado
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null && this.getToken() !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.rol : null;
  }

  // Métodos para verificar permisos específicos
  canAccessModule(module: string): boolean {
    const role = this.getUserRole();
    if (!role) return false;

    switch (module) {
      case 'users':
        return role === 'administrador';
      case 'products':
        return role === 'administrador' || role === 'productor';
      case 'surveys':
        return role === 'administrador' || role === 'visitante';
      case 'reports':
        return role === 'administrador' || role === 'organizador';
      default:
        return false;
    }
  }

  getSessionDuration(): string {
    const role = this.getUserRole();
    switch (role) {
      case 'administrador':
        return '8 horas';
      case 'productor':
      case 'organizador':
        return '24 horas';
      case 'visitante':
        return '15 minutos';
      default:
        return 'No definido';
    }
  }

  getAllowedModules(): string {
    const role = this.getUserRole();
    switch (role) {
      case 'administrador':
        return 'Todos los módulos (Central + Submódulos)';
      case 'productor':
        return 'Gestión de Productos';
      case 'organizador':
        return 'Reportes y Métricas';
      case 'visitante':
        return 'Encuestas de Satisfacción';
      default:
        return 'Ninguno';
    }
  }

  // Headers con autenticación para otras peticiones
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }
}
