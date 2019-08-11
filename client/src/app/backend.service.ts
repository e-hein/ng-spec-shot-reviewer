import { Injectable } from '@angular/core';
import { SsrServer, SpecShot, SpecShotFile } from 'api';
import { HttpClient } from '@angular/common/http';
import { take, map } from 'rxjs/operators';

const baseUrl = 'http://localhost:8090/ssr-server';

@Injectable({
  providedIn: 'root',
})
export class BackendService implements SsrServer {
  constructor(
    private http: HttpClient,
  ) {}

  public specShots(): Promise<SpecShot[]> {
    return this.http.get<SpecShot[]>(baseUrl + '/spec-shot').pipe(
      take(1),
      map((specShots) => this.addBaseUrls(specShots)),
    ).toPromise()
  }

  private addBaseUrls(specShots: SpecShot[]) {
    return specShots.map((specShot) => ({
      id: specShot.id,
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
      filename: baseUrl + '/' + specShotFile,
    }
  }
}
