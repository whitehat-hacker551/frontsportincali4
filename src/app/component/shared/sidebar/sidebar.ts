import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  menuItems = signal<any[]>([
    {
      label: 'Home',
      icon: 'house-fill',
      route: '/',
    },
    { label: 'Clubes', icon: 'building', route: '/club' },
    {
      label: 'Noticias',
      icon: 'newspaper',
      children: [
        { label: 'Noticias', icon: 'pencil-square', route: '/noticia' },
        { label: 'Comentarios', icon: 'chat-left-text', route: '/comentario' },
        { label: 'Puntuaciones', icon: 'star-fill', route: '/puntuacion' },
      ],
    },
    {
      label: 'Gestión',
      icon: 'gear',
      children: [
        { label: 'Temporadas', icon: 'calendar', route: '/temporada' },
        { label: 'Categorías', icon: 'tags', route: '/categoria' },
        { label: 'Equipos', icon: 'people-fill', route: '/equipo' },
        { label: 'Ligas', icon: 'trophy', route: '/liga' },
        { label: 'Partidos', icon: 'play-fill', route: '/partido' },
        { label: 'Jugadores', icon: 'person-fill', route: '/jugador' },
        { label: 'Cuotas', icon: 'credit-card', route: '/cuota' },
        { label: 'Pagos', icon: 'cash-coin', route: '/pago' },
      ],
    },
    {
      label: 'Tienda',
      icon: 'shop',
      children: [
        { label: 'Artículos', icon: 'bag-fill', route: '/articulo' },
        { label: 'Tipos de Artículos', icon: 'bookmark-fill', route: '/tipoarticulo' },
        { label: 'Compras', icon: 'cart-fill', route: '/compra' },
        { label: 'Facturas', icon: 'receipt', route: '/factura' },
        { label: 'Carritos', icon: 'bag-check', route: '/carrito' },
        { label: 'Comentarios de Artículos', icon: 'chat-dots', route: '/comentarioart' },
      ],
    },
    {
      label: 'Usuarios',
      icon: 'people',
      route: '/usuario',
      children: [
        { label: 'Usuarios', icon: 'people', route: '/usuario' },
        { label: 'Tipos de Usuario', icon: 'tags-fill', route: '/tipousuario' },
        { label: 'Roles de Usuario', icon: 'shield-check', route: '/rolusuario' },
      ],
    },
  ]);
}
