import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PartidoService } from '../../../service/partido';
import { IPartido } from '../../../model/partido';
import { PartidoFormAdminUnrouted } from '../form-admin-unrouted/partido-form';

@Component({
  selector: 'app-partido-edit',
  standalone: true,
  imports: [CommonModule, PartidoFormAdminUnrouted],
  templateUrl: './partido-edit.html',
  styleUrl: './partido-edit.css',
})
export class PartidoEditAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private oPartidoService = inject(PartidoService);
  private snackBar = inject(MatSnackBar);

  partido = signal<IPartido | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === '0') {
      this.error.set('ID de partido no válido');
      this.loading.set(false);
      return;
    }

    const id = Number(idParam);

    if (isNaN(id)) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.loadPartido(id);
  }

  private loadPartido(id: number): void {
    this.oPartidoService.get(id).subscribe({
      next: (partido: IPartido) => {
        this.partido.set(partido);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el partido');
        this.snackBar.open('Error cargando el partido', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void { this.router.navigate(['/partido']); }

  onFormCancel(): void { this.router.navigate(['/partido']); }
}
