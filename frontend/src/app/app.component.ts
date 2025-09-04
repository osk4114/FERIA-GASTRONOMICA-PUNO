import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService, User, LoginRequest } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Feria Gastronómica Puno';
  
  // Estado de autenticación
  isLoggedIn = false;
  currentUser: User | null = null;
  activeModule = '';
  
  // Estado del login
  isLoading = false;
  loginError = '';
  
  // Datos de login
  loginData: LoginRequest = {
    email: '',
    password: ''
  };
  
  // Datos de la aplicación (se cargarán desde el backend)
  users: any[] = [];
  products: any[] = [];
  
  // Datos de encuesta
  surveyData = {
    rating: '5'
  };
  
  constructor(private authService: AuthService) {}
  
  ngOnInit() {
    // Suscribirse al estado del usuario
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = user !== null;
      
      if (this.isLoggedIn) {
        this.loadUserData();
      }
    });
  }
  
  login() {
    if (!this.loginData.email || !this.loginData.password) {
      this.loginError = 'Por favor, ingresa email y contraseña';
      return;
    }

    this.isLoading = true;
    this.loginError = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          console.log(`¡Bienvenido ${response.user.nombre}! Sesión iniciada como ${response.user.rol}`);
          this.loginData = { email: '', password: '' };
        } else {
          this.loginError = response.message || 'Error en el inicio de sesión';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error de login:', error);
        
        if (error.status === 401) {
          this.loginError = 'Email o contraseña incorrectos';
        } else if (error.status === 0) {
          this.loginError = 'Error de conexión. Verifica que el backend esté ejecutándose en http://localhost:3000';
        } else {
          this.loginError = error.error?.message || 'Error del servidor. Intenta nuevamente.';
        }
      }
    });
  }
  
  logout() {
    this.authService.logout();
    this.activeModule = '';
    this.users = [];
    this.products = [];
    this.loginData = { email: '', password: '' };
    this.loginError = '';
  }
  
  loadUserData() {
    // Aquí cargaríamos datos reales desde la API
    // Por ahora mantenemos datos de ejemplo hasta implementar los endpoints
    this.users = [
      { name: 'Administrador Sistema', email: 'admin@feriapuno.com', role: 'administrador' },
      { name: 'Rosa Mamani', email: 'rosa.mamani@gmail.com', role: 'productor' },
      { name: 'María Condori', email: 'maria.condori@gmail.com', role: 'organizador' },
      { name: 'Juan Visitante', email: 'juan.visitante@gmail.com', role: 'visitante' }
    ];
    
    this.products = [
      { name: 'Quinua Real', description: 'Quinua orgánica del Altiplano', price: 12.50 },
      { name: 'Chuño', description: 'Papa deshidratada tradicional', price: 8.00 },
      { name: 'Trucha Frita', description: 'Trucha fresca del Lago Titicaca', price: 25.00 },
      { name: 'Api Morado', description: 'Bebida caliente tradicional', price: 5.00 }
    ];
  }
  
  submitSurvey() {
    // TODO: Implementar envío real de encuesta al backend
    alert(`¡Gracias por tu opinión! Calificación: ${this.surveyData.rating}/5`);
    this.surveyData.rating = '5';
  }
  
  // Métodos delegados al servicio de autenticación
  getSessionTime(): string {
    return this.authService.getSessionDuration();
  }
  
  getAllowedModules(): string {
    return this.authService.getAllowedModules();
  }
  
  canAccessModule(module: string): boolean {
    return this.authService.canAccessModule(module);
  }
}
