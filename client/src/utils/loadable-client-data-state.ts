import { ReplaySubject, Observable } from 'rxjs';
import { doNothing } from './do-nothing.const';

export class LoadableClientDataState<R> {
  private latestStateReplay = new ReplaySubject<R>(1);
  private runningReload: Promise<void> | false = false;

  constructor(
    private _reload: () => Promise<R>,
  ) {}

  public asObservable(): Observable<R> {
    return this.lazyInit();
  }

  private lazyInit() {
    this.lazyInitDone();
    this.reload();
    return this.asObservable();
  }

  private lazyInitDone() {
    this.lazyInitDone = doNothing;
    const replayAsObservable = this.latestStateReplay.asObservable();
    this.asObservable = () => replayAsObservable;
  }

  public reload(): Promise<void> {
    if (this.runningReload) {
      return this.runningReload;
    }

    const runningReload = this._reload().then((update) => {
      this.runningReload = false;
      this.latestStateReplay.next(update);
    });
    this.runningReload = runningReload;
    return runningReload;
  }

  public update(updated: R): void {
    this.lazyInitDone();
    this.latestStateReplay.next(updated);
  }
}
