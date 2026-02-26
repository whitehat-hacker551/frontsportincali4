import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RolusuarioService } from '../../../service/rolusuario';
import { IRolusuario } from '../../../model/rolusuario';
import { RolusuarioFormAdminUnrouted } from '../form-unrouted/rolusuario-form';

@Component({
  selector: 'app-rolusuario-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, RolusuarioFormAdminUnrouted],
  templateUrl: './rolusuario-edit.html',
  styleUrl: './rolusuario-edit.css',
})
export class RolusuarioEditAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private oRolusuarioService = inject(RolusuarioService);
  private snackBar = inject(MatSnackBar);

  id = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  rolusuario = signal<IRolusuario | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.error.set('ID de rol de usuario no válido');
      this.loading.set(false);
      return;
    }
    const nid = Number(idParam);
    if (isNaN(nid)) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }
    this.id.set(nid);
    this.loadRolusuario(nid);
  }

  private loadRolusuario(id: number): void {
    this.oRolusuarioService.get(id).subscribe({
      next: (r: IRolusuario) => {
        this.rolusuario.set(r);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error cargando el rol de usuario');
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void {
    this.router.navigate(['/rolusuario']);
  }

  onFormCancel(): void {
    this.router.navigate(['/rolusuario']);
  }
}
