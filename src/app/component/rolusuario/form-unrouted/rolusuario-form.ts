import { Component, Input, Output, EventEmitter, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RolusuarioService } from '../../../service/rolusuario';
import { IRolusuario } from '../../../model/rolusuario';

@Component({
  selector: 'app-rolusuario-form-unrouted',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rolusuario-form.html',
  styleUrls: ['./rolusuario-form.css'],
})
export class RolusuarioFormAdminUnrouted implements OnInit {
  @Input() rolusuario: IRolusuario | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oRolusuarioService = inject(RolusuarioService);

  rolusuarioForm!: FormGroup;
  submitting = signal(false);

  ngOnInit(): void {
    this.initForm();
    if (this.rolusuario) {
      this.loadData(this.rolusuario);
    }
  }

  private initForm(): void {
    this.rolusuarioForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    });
  }

  private loadData(r: IRolusuario): void {
    this.rolusuarioForm.patchValue({ id: r.id ?? 0, descripcion: r.descripcion ?? '' });
  }

  onSubmit(): void {
    if (this.rolusuarioForm.invalid) {
      this.rolusuarioForm.markAllAsTouched();
      return;
    }
    this.submitting.set(true);

    const payload: any = { descripcion: this.rolusuarioForm.value.descripcion };

    if (this.mode === 'edit' && this.rolusuario?.id) {
      payload.id = this.rolusuario.id;
      this.oRolusuarioService.update(payload).subscribe({
        next: () => {
          this.submitting.set(false);
          this.snackBar.open('Rol actualizado', 'Cerrar', { duration: 3000 });
          this.formSuccess.emit();
        },
        error: (err) => {
          console.error(err);
          this.submitting.set(false);
          this.snackBar.open('Error actualizando rol', 'Cerrar', { duration: 4000 });
        },
      });
    } else {
      this.oRolusuarioService.create(payload).subscribe({
        next: () => {
          this.submitting.set(false);
          this.snackBar.open('Rol creado', 'Cerrar', { duration: 3000 });
          this.formSuccess.emit();
        },
        error: (err) => {
          console.error(err);
          this.submitting.set(false);
          this.snackBar.open('Error creando rol', 'Cerrar', { duration: 4000 });
        },
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
