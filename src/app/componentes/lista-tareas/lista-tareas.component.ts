// src/app/componentes/lista-tareas/lista-tareas.component.ts
import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tarea } from '../../models/tarea.model';
import { BuscadorTareaComponent } from '../buscador-tarea/buscador-tarea.component';
@Component({
  selector: 'app-lista-tareas',
  standalone: true,
  imports: [CommonModule, BuscadorTareaComponent],
  templateUrl: './lista-tareas.component.html',
  styleUrls: ['./lista-tareas.component.css']
})
export class ListaTareasComponent {
  // Estado gestionado con Angular Signals
  tareas = signal<Tarea[]>([
    { id: 1, titulo: 'Aprender Event Binding en Angular', prioridad: 'Alta', completada: false },
    { id: 2, titulo: 'Practicar @Output() e EventEmitter', prioridad: 'Media', completada: true }
  ]);
  filtroTexto = signal<string>('');
  ultimoMensajeGlobal = signal<string>('Ninguno');
  // Recibe la tarea emitida por el hijo (@Output)
  onAgregarTarea(nueva: { titulo: string; prioridad: 'Baja' | 'Media' | 'Alta' }): void {
    const nuevaTarea: Tarea = {
      id: Date.now(),
      titulo: nueva.titulo,
      prioridad: nueva.prioridad,
      completada: false
    };
    this.tareas.update(lista => [...lista, nuevaTarea]);
  }
  // Recibe el texto de filtro desde el hijo
  onFiltrar(texto: string): void {
    this.filtroTexto.set(texto);
  }
  // Alterna el estado completado
  toggleCompletada(id: number): void {
    this.tareas.update(lista => 
      lista.map(t => t.id === id ? { ...t, completada: !t.completada } : t)
    );
  }
  // Elimina una tarea
  eliminarTarea(id: number, event: Event): void {
    event.stopPropagation(); // Detiene la propagación del clic al contenedor
    this.tareas.update(lista => lista.filter(t => t.id !== id));
  }
  // Filtro computado manual
  get tareasFiltradas(): Tarea[] {
    const f = this.filtroTexto().toLowerCase();
    return this.tareas().filter(t => t.titulo.toLowerCase().includes(f));
  }
  // Evento Global con @HostListener (Escucha la tecla Escape)
  @HostListener('window:keydown.escape', ['$event'])
  onEscapeGlobal(e: Event): void {
    this.filtroTexto.set('');
    this.ultimoMensajeGlobal.set('Se presionó ESC (Filtro limpiado)');
  }
}
