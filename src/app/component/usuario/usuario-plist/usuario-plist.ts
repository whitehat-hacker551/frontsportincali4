import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { serverURL } from '../../../environment/environment';
import { IPage } from '../../../model/plist';

type UsuarioRelacion = {
  id: number;
  descripcion?: string;
  nombre?: string;
};

type UsuarioItem = {
  id: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  username: string;
  fechaAlta: string;
  genero: number;
  tipousuario: UsuarioRelacion;
  rolusuario: UsuarioRelacion;
  club: UsuarioRelacion;
  comentarios: number;
  puntuaciones: number;
  comentarioarts: number;
  carritos: number;
  facturas: number;
};

@Component({
  selector: 'app-usuario-plist',
  imports: [CommonModule],
  templateUrl: './usuario-plist.html',
  styleUrl: './usuario-plist.css',
  standalone: true
})
export class UsuarioPlist {
  oPage: IPage<UsuarioItem> | null = null;
  numPage: number = 0;
  numRpp: number = 10;
  filtro: string = '';
  isLoading: boolean = false;
  isFilling: boolean = false;
  errorMessage: string = '';
  fillErrorMessage: string = '';
  totalElementsCount: number = 0;
  fillAmount: number = 25;
  rppOptions: number[] = [5, 10, 20, 50, 100];

  constructor(private oHttp: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();
    const filterValue = this.filtro.trim();
    let url = `${serverURL}/usuario?page=${this.numPage}&size=${this.numRpp}&sort=id,asc`;
    if (filterValue) {
      url += `&nombre=${encodeURIComponent(filterValue)}`;
    }

    this.oHttp.get<IPage<UsuarioItem>>(url).subscribe({
      next: (data: IPage<UsuarioItem>) => {
        this.oPage = data;
        this.totalElementsCount = data.totalElements ?? 0;
        if (this.numPage > 0 && this.numPage >= data.totalPages) {
          this.numPage = data.totalPages - 1;
          this.getPage();
          return;
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.errorMessage = 'No se pudo cargar la lista de usuarios.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onSearch(value: string) {
    this.filtro = value;
    this.numPage = 0;
    this.getPage();
  }

  setFillAmount(value: string) {
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && parsed > 0) {
      this.fillAmount = parsed;
    }
  }

  fillUsuarios() {
    if (this.isFilling) {
      return;
    }
    this.isFilling = true;
    this.fillErrorMessage = '';
    this.cdr.markForCheck();
    const url = `${serverURL}/usuario/fill/${this.fillAmount}`;
    this.oHttp.post<number>(url, null).subscribe({
      next: () => {
        this.isFilling = false;
        this.getPage();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.fillErrorMessage = 'No se pudieron rellenar usuarios.';
        this.isFilling = false;
        this.cdr.markForCheck();
      }
    });
  }

  goToPage(numPage: number) {
    if (numPage < 0) {
      return false;
    }
    this.numPage = numPage;
    this.getPage();
    return false;
  }

  onRppChange(n: number | string) {
    const parsed = typeof n === 'string' ? Number(n) : n;
    if (Number.isNaN(parsed) || parsed <= 0) {
      return;
    }
    this.numRpp = parsed;
    this.numPage = 0;
    this.getPage();
  }

  trackById(index: number, usuario: UsuarioItem) {
    return usuario.id;
  }

  getGeneroLabel(genero: number) {
    return genero === 0 ? 'H' : 'M';
  }
}
