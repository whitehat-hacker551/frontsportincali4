import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RolusuarioFormAdminUnrouted } from '../form-unrouted/rolusuario-form';

@Component({
  selector: 'app-rolusuario-new-routed',
  standalone: true,
  imports: [CommonModule, RolusuarioFormAdminUnrouted],
  templateUrl: './rolusuario-new.html',
  styleUrls: ['./rolusuario-new.css'],
})
export class RolusuarioNewAdminRouted {
  private router = inject(Router);

  onFormSuccess(): void {
    this.router.navigate(['/rolusuario']);
  }

  onFormCancel(): void {
    this.router.navigate(['/rolusuario']);
  }
}
