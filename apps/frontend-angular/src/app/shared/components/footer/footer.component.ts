import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  sections = [
    {
      title: 'Acerca de',
      links: ['Quiénes Somos', 'Nuestra Misión', 'Sustentabilidad', 'Blog'],
    },
    {
      title: 'Soporte',
      links: ['Centro de Ayuda', 'Contacto', 'Rastrear Orden', 'Devoluciones'],
    },
    {
      title: 'Política',
      links: ['Términos de Servicio', 'Privacidad', 'Cookies', 'Seguridad'],
    },
    {
      title: 'Comunidad',
      links: ['Facebook', 'Instagram', 'Twitter', 'LinkedIn'],
    },
  ];
}
