import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PartidoService } from '../../../service/partido';
import { LigaService } from '../../../service/liga';
import { IPartido } from '../../../model/partido';
import { ILiga } from '../../../model/liga';

@Component({
  selector: 'app-partido-form-unrouted',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './partido-form.html',
  styleUrls: ['./partido-form.css']
})
export class PartidoFormAdminUnrouted implements OnInit {
  @Input() partido: IPartido | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oPartidoService = inject(PartidoService);
  private oLigaService = inject(LigaService);
  private dialog = inject(MatDialog);

  partidoForm!: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  submitting = signal(false);
  ligas = signal<ILiga[]>([]);
  selectedLiga = signal<ILiga | null>(null);
  displayIdLiga = signal<number | null>(null);

  constructor() {
    effect(() => {
      const p = this.partido;
      if (p && this.partidoForm) {
        this.loadPartidoData(p);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadLigas();

    if (this.partido) {
      this.loadPartidoData(this.partido);
    }
  }

  private initForm(): void {
    this.partidoForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      rival: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      id_liga: [null, Validators.required],
      local: [null, [Validators.required, Validators.min(0), Validators.max(1)]],
      resultado: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    });

    this.partidoForm.get('id_liga')?.valueChanges.subscribe((id) => {
      if (id) {
        this.loadLiga();
      } else {
        this.selectedLiga.set(null);
        this.displayIdLiga.set(null);
      }
    });
  }

  private loadPartidoData(partido: IPartido): void {
    this.partidoForm.patchValue({
      id: partido.id,
      rival: partido.rival,
      id_liga: partido.liga?.id,
      local: partido.local !== undefined && partido.local !== null ? Number(partido.local) : null,
      resultado: partido.resultado,
    });
    if (partido.liga) {
      this.syncLiga(partido.liga.id);
    }
  }

  private loadLiga(): void {
    const idLiga = this.partidoForm.get('id_liga')?.value;
    if (idLiga) {
      this.oLigaService.get(idLiga).subscribe({
        next: (liga) => {
          this.selectedLiga.set(liga);
          this.displayIdLiga.set(liga.id);
        },
        error: (err: HttpErrorResponse) => {
          this.snackBar.open('Error cargando la liga', 'Cerrar', { duration: 4000 });
          console.error(err);
        },
      });
    } else {
      this.selectedLiga.set(null);
      this.displayIdLiga.set(null);
    }
  }

  private loadLigas(): void {
    this.oLigaService.getPage(0, 1000, 'nombre', 'asc').subscribe({
      next: (page) => {
        this.ligas.set(page.content);
        const idActual = this.partidoForm.get('id_liga')?.value;
        if (idActual) {
          this.syncLiga(idActual);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error cargando ligas', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  private syncLiga(idLiga: number): void {
    this.displayIdLiga.set(idLiga);
    const ligaSeleccionada = this.ligas().find((l) => l.id === idLiga);
    if (ligaSeleccionada) {
      this.selectedLiga.set(ligaSeleccionada);
    } else {
      this.selectedLiga.set(null);
    }
  }

  get rival() { return this.partidoForm.get('rival'); }
  get id_liga() { return this.partidoForm.get('id_liga'); }
  get local() { return this.partidoForm.get('local'); }
  get resultado() { return this.partidoForm.get('resultado'); }

  onSubmit(): void {
    if (this.partidoForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
      return;
    }

    this.submitting.set(true);

    const partidoData: any = {
      rival: this.partidoForm.value.rival,
      liga: { id: this.partidoForm.value.id_liga },
      local: Number(this.partidoForm.value.local) === 1,
      resultado: this.partidoForm.value.resultado,
    };

    if (this.mode === 'edit' && this.partido?.id) {
      partidoData.id = this.partido.id;
      this.oPartidoService.update(partidoData).subscribe({
        next: (id: number) => {
          this.snackBar.open('Partido actualizado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el partido');
          this.snackBar.open('Error actualizando el partido', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        }
      });
    } else {
      this.oPartidoService.create(partidoData).subscribe({
        next: (id: number) => {
          this.snackBar.open('Partido creado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el partido');
          this.snackBar.open('Error creando el partido', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        }
      });
    }
  }

  onCancel(): void { this.formCancel.emit(); }
}
