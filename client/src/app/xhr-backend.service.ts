import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpecShot, SpecShotFile } from 'api';
import { map, take } from 'rxjs/operators';
import { BackendService } from './backend.service';

const baseUrl = 'http://localhost:8090/ssr-server';

@Injectable({
  providedIn: 'root',
})
export class XhrBackendService extends BackendService {
  constructor(
    private http: HttpClient,
  ) {
    super();
  }

  public specShots(): Promise<SpecShot[]> {
    return this.http.get<SpecShot[]>(baseUrl + '/spec-shot').pipe(
      take(1),
      map((specShots) => this.addBaseUrls(specShots)),
    ).toPromise();
  }

  private addBaseUrls(specShots: SpecShot[]) {
    return specShots.map((specShot) => ({
      ...specShot,
      actual: this.addBaseUrl(specShot.actual),
      diff: this.addBaseUrl(specShot.diff),
      baseline: this.addBaseUrl(specShot.baseline),
    } as SpecShot));
  }

  private addBaseUrl(specShotFile: SpecShotFile | false): SpecShotFile | false {
    if (!specShotFile) {
      return false;
    }

    return {
      ...specShotFile,
      filename: baseUrl + '/image/' + specShotFile.filename,
    };
  }

  public approve(id: string) {
    return this.http
      .put(baseUrl + '/spec-shot/' + id + '/approve', '', { responseType: 'text' })
      .pipe(take(1)).toPromise().then(() => {})
    ;
  }
  public disapprove(id: string) {
    return this.http
      .put(baseUrl + '/spec-shot/' + id + '/disapprove', '', { responseType: 'text' })
      .pipe(take(1)).toPromise().then(() => {})
    ;
  }

  public applyApprovements(ids: string[]) {
    return this.http
      .post<SpecShot[]>(baseUrl + '/applyApprovements', { ids })
      .pipe(take(1)).toPromise()
    ;
  }
}
