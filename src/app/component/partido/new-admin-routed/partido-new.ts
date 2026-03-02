import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PartidoFormAdminUnrouted } from '../form-admin-unrouted/partido-form';

@Component({
  selector: 'app-partido-new-routed',
  standalone: true,
  imports: [CommonModule, PartidoFormAdminUnrouted],
  templateUrl: './partido-new.html',
  styleUrl: './partido-new.css',
})
export class PartidoNewAdminRouted {
  private router = inject(Router);

  onFormSuccess(): void {
    this.router.navigate(['/partido']);
  }

  onFormCancel(): void {
    this.router.navigate(['/partido']);
  }
}
