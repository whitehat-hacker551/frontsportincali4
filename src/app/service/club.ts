import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { serverURL } from '../environment/environment';
import { IClub } from '../model/club';
import { IPage } from '../model/plist';
import { PayloadSanitizerService } from './payload-sanitizer';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  private http = inject(HttpClient);
  private sanitizer = inject(PayloadSanitizerService);
  private url = `${serverURL}/club`;
  private security = inject(SecurityService);

  get(id: number): Observable<IClub> {
    return this.http.get<IClub>(`${this.url}/${id}`);
  }

  getPage(
    page: number,
    size: number,
    sort: string = 'id',
    direction: string = 'asc'
  ): Observable<IPage<IClub>> {
    const url = `${this.url}?page=${page}&size=${size}&sort=${sort},${direction}`;
    if (this.security.isClubAdmin()) {
      // fetch full page, then filter to own club
      return this.http.get<IPage<IClub>>(url).pipe(
        map((pageData) => {
          const clubId = this.security.getClubId();
          if (clubId != null) {
            const filtered = pageData.content.filter((c) => c.id === clubId);
            return {
              ...pageData,
              content: filtered,
              totalElements: filtered.length,
              totalPages: Math.ceil(filtered.length / pageData.size),
            } as IPage<IClub>;
          }
          return pageData;
        }),
      );
    }
    return this.http.get<IPage<IClub>>(url);
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.url}/count`);
  }

  delete(id: number): Observable<number> {
    this.security.forbidClubAdminActions();
    return this.http.delete<number>(`${this.url}/${id}`);
  }
     update(club: Partial<IClub>): Observable<number> {
     this.security.forbidClubAdminActions();
     const body = this.sanitizer.sanitize(club);
     return this.http.put<number>(serverURL + '/club', body);
   }
  // create
  create(club: IClub): Observable<number> {
    this.security.forbidClubAdminActions();
    const body = this.sanitizer.sanitize(club);
    return this.http.post<number>(serverURL + '/club', body);
  }
}
