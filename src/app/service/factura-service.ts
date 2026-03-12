import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPage } from '../model/plist';
import { serverURL } from '../environment/environment';
import { IFactura } from '../model/factura';
import { PayloadSanitizerService } from './payload-sanitizer';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  constructor(
    private oHttp: HttpClient,
    private sanitizer: PayloadSanitizerService,
    private security: SecurityService,
  ) {}

  getPage(page: number, rpp: number, order: string = '', direction: string = '', id_usuario: number = 0): Observable<IPage<IFactura>> {
    // club admin may only see invoices of their club: this assumes backend supports id_usuario filter
    if (this.security.isClubAdmin()) {
      // TODO: convert user ids to those belonging club? front-end can't know; rely on backend
    }
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    if (id_usuario > 0) {
      return this.oHttp.get<IPage<IFactura>>(
        serverURL + 
        `/factura?page=${page}&size=${rpp}&sort=${order},${direction}&id_usuario=${id_usuario}`,
      );
    }
    return this.oHttp.get<IPage<IFactura>>(
      serverURL + `/factura?page=${page}&size=${rpp}&sort=${order},${direction}`
    );
  }

  get(id: number): Observable<IFactura> {
    return this.oHttp.get<IFactura>(`${serverURL}/factura/${id}`);
  }

  delete(id: number): Observable<number> {
    // club admins cannot delete invoices
    this.security.forbidClubAdminActions();
    return this.oHttp.delete<number>(serverURL + '/factura/' + id);
  }

  count(): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/factura/count');
  }

  update(factura: Partial<IFactura>): Observable<number> {
    // club admin may update invoices (restricted by backend/club filter)
    const body = this.sanitizer.sanitize(factura, { nestedIdFields: ['usuario'], removeFields: ['compras'] });
    return this.oHttp.put<number>(serverURL + '/factura', body);
  } 

  create(factura: Partial<IFactura>): Observable<number> {
    // club admin may create invoices; backend should restrict club
    const body = this.sanitizer.sanitize(factura, { nestedIdFields: ['usuario'], removeFields: ['compras'] });
    return this.oHttp.post<number>(serverURL + '/factura', body);
  }
}