import { Component, ChangeDetectorRef, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { rpp as RPP, rpp } from '../../../environment/environment';
import { EquipoService } from '../../../service/equipo';
import { IEquipo } from '../../../model/equipo';
import { IPage } from '../../../model/plist';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';

@Component({
  selector: 'app-plist-equipo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Paginacion, BotoneraRpp],
  templateUrl: './equipo-plist.html',
  styleUrls: ['./equipo-plist.css'],
})
export class PlistEquipo implements OnDestroy {
  private cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private equipoService: EquipoService = inject(EquipoService as any);

  aEquipos: IEquipo[] = [];
  // allEquipos holds the full dataset when doing a client-side global search
  allEquipos: IEquipo[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  totalPages: number = 1;
  totalElements: number = 0;
  sort: string = 'id,asc';

  rpp = RPP;

  loading: boolean = false;
  error: string | null = null;
  searchTerm: string = '';
  // When true we assume the backend is doing the global filtering and
  // page/total values returned by the server reflect the search.
  serverSearchActive: boolean = false;
  // When true we will perform a client-side global search: download all
  // records (if not already present) and then filter/paginate locally.
  clientGlobalSearchActive: boolean = false;
  // Debounce subject for live search
  private searchSubject: Subject<string> = new Subject<string>();
  private searchSub?: Subscription;

  ngOnInit() {
    this.loadPage();
    // subscribe to debounced search term changes
    this.searchSub = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((q: string) => {
      // set term and perform search
      this.searchTerm = q;
      this.onSearch();
    });
  }

  ngOnDestroy(): void {
    try { this.searchSub?.unsubscribe(); } catch (e) { }
  }

  loadPage(page: number = this.pageNumber) {
    this.loading = true;
    this.error = null;
    // If client-side global search is active, we must ensure we have the
    // full dataset and then filter/paginate locally.
    if (this.clientGlobalSearchActive) {
      const proceedWithLocalPagination = (all: IEquipo[]) => {
        this.allEquipos = all || [];
        // apply local filter across allEquipos
        const filtered = this.filterArray(this.allEquipos, this.searchTerm);
        this.totalElements = filtered.length;
        this.totalPages = Math.max(1, Math.ceil(this.totalElements / this.pageSize));
        this.pageNumber = Math.max(0, Math.min(page, this.totalPages - 1));
        const start = this.pageNumber * this.pageSize;
        this.aEquipos = filtered.slice(start, start + this.pageSize);
        this.loading = false;
        try { this.cd.detectChanges(); } catch (e) { }
      };

      // If we already downloaded all items and they look current, reuse them.
      if (this.allEquipos && this.allEquipos.length > 0 && !this.searchTermChanged()) {
        proceedWithLocalPagination(this.allEquipos);
      } else {
        // Attempt to fetch all items in a single request. We use a large page size
        // as a pragmatic approach; if the backend supports server search, that is
        // preferable and handled elsewhere.
        const bigRpp = 100000; // assumption: backend allows this size
        this.equipoService.getPage(0, bigRpp, 'id', 'asc').subscribe({
          next: (res: IPage<IEquipo>) => {
            proceedWithLocalPagination(res.content || []);
          },
          error: (err: any) => {
            this.loading = false;
            this.error = err?.message || ('Error ' + err?.status || 'Unknown');
            console.error('Error cargando equipos (all)', err);
          }
        });
      }

      return;
    }

    // Default: rely on backend paging/search behavior
    this.equipoService.getPage(page, this.pageSize, 'id', 'asc', this.serverSearchActive ? this.searchTerm : undefined).subscribe({
      next: (res: IPage<IEquipo>) => {
        this.aEquipos = res.content || [];
        this.pageNumber = res.number || 0;
        this.pageSize = res.size || this.pageSize;
        this.totalPages = res.totalPages || 1;
        this.totalElements = res.totalElements || 0;
        this.loading = false;
        try { this.cd.detectChanges(); } catch (e) { }
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err?.message || ('Error ' + err?.status || 'Unknown');
        console.error('Error cargando equipos', err);
      }
    });
  }

  // Simple heuristic to detect if searchTerm changed since last full download
  private lastSearchForAll: string = '';
  private searchTermChanged(): boolean {
    const cur = (this.searchTerm || '').toString().trim();
    if (cur !== this.lastSearchForAll) {
      this.lastSearchForAll = cur;
      return true;
    }
    return false;
  }

  // Helper to filter an array of equipos by a search string (same logic as previous getFilteredEquipos)
  private filterArray(arr: IEquipo[], qRaw: string): IEquipo[] {
    const q = (qRaw || '').toString().trim().toLowerCase();
    if (!q) return arr.slice();
    return arr.filter((e: IEquipo) => {
      const parts = [
        (e.id ?? '').toString(),
        e.nombre ?? '',
        e.categoria?.nombre ?? '',
        (e.categoria?.id ?? '').toString(),
        e.entrenador?.nombre ?? '',
        e.entrenador?.apellido1 ?? '',
        (e.jugadores ?? '').toString()
      ];
      return parts.join(' ').toLowerCase().includes(q);
    });
  }

  onSearch() {
    // start search from first page
    this.pageNumber = 0;
    const hasQuery = (String(this.searchTerm || '').trim().length > 0);
    // Use client-side global search to ensure search across ALL records and
    // pagination adapts to the filtered result set when there is a query.
    this.clientGlobalSearchActive = hasQuery;
    // When client-side global search is active we don't do server-side filtering.
    this.serverSearchActive = false;
    this.loadPage(0);
  }

  // Called from the template on ngModelChange so we can debounce typing
  onSearchTermChange(value: string) {
    // Emit to subject; the debounced subscriber will perform the search.
    this.searchSubject.next(value || '');
  }

  // Client-side filter for the current page results
  getFilteredEquipos(): IEquipo[] {
    // If either server or client global search is active, the items in
    // `aEquipos` already reflect the intended filtered page, so show them
    // directly without further filtering.
    if (this.serverSearchActive || this.clientGlobalSearchActive) {
      return this.aEquipos;
    }

    // Otherwise no global search is active and we show the current page's
    // items (no extra filtering needed).
    return this.aEquipos;
  }

  onPageChange(newPage: number) {
    if (newPage < 0) return;
    if (this.totalPages != null && newPage >= this.totalPages) return;
    this.loadPage(newPage);
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) pages.push(i);
    return pages;
  }

  onSizeChange(value: any) {
    this.pageSize = Number(value);
    this.loadPage(0);
  }

}
