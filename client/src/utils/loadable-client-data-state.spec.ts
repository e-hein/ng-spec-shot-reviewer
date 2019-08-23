import { LoadableClientDataState } from './loadable-client-data-state';
import { take } from 'rxjs/operators';

describe('utils loadable client data state', () => {
  it('when not subscribed then should not load', () => {
    const loadState = jasmine.createSpy('loadState');
    // tslint:disable-next-line: no-unused-expression
    new LoadableClientDataState(loadState);
    expect(loadState).not.toHaveBeenCalled();
  });

  it('when called the first time it should load client data state', async () => {
    const loadState = jasmine.createSpy('loadState').and.returnValue(Promise.resolve({}));
    const loadableClientState = new LoadableClientDataState(loadState);

    await loadableClientState.asObservable().pipe(take(1)).toPromise();

    expect(loadState).toHaveBeenCalled();
  });

  it('when called the multiple times it should load client data state only once', async () => {
    const loadState = jasmine.createSpy('loadState').and.returnValue(Promise.resolve({}));
    const loadableClientState = new LoadableClientDataState(loadState);

    const calls = [
      loadableClientState.asObservable().pipe(take(1)).toPromise(),
      loadableClientState.asObservable().pipe(take(1)).toPromise(),
      loadableClientState.asObservable().pipe(take(1)).toPromise(),
    ];
    await Promise.all(calls);

    expect(loadState).toHaveBeenCalledTimes(1);
  });

  it('reload should load client data state again', async () => {
    const loadState = jasmine.createSpy('loadState').and.returnValue(Promise.resolve({}));
    const loadableClientState = new LoadableClientDataState(loadState);

    const calls = [
      loadableClientState.asObservable().pipe(take(1)).toPromise(),
      loadableClientState.asObservable().pipe(take(1)).toPromise(),
      loadableClientState.asObservable().pipe(take(1)).toPromise(),
    ];
    await Promise.all(calls);

    await loadableClientState.reload();

    expect(loadState).toHaveBeenCalledTimes(2);
  });

  it('reload should distribute updates to all subscriptions', async () => {
    const loadState: () => Promise<string> = jasmine.createSpy('loadState').and.returnValues(Promise.resolve('a'), Promise.resolve('b'));
    const loadableClientState = new LoadableClientDataState(loadState);
    let lastValue: string;

    const subscription = loadableClientState.asObservable().subscribe((value) => lastValue = value);
    await loadableClientState.asObservable().pipe(take(1)).toPromise();
    expect(lastValue).toBe('a');

    await loadableClientState.reload();
    expect(lastValue).toBe('b');

    expect(loadState).toHaveBeenCalledTimes(2);
    subscription.unsubscribe();
  });

  it('reload should distribute updates to all subscriptions', async () => {
    let resolveResponse: (response: string) => void;
    const loadState: () => Promise<string> = jasmine.createSpy('loadState')
      .and.returnValue(new Promise(resolve => resolveResponse = resolve))
    ;
    const loadableClientState = new LoadableClientDataState(loadState);

    const calls = [
      loadableClientState.asObservable().pipe(take(1)).toPromise(),
      loadableClientState.asObservable().pipe(take(1)).toPromise(),
      loadableClientState.asObservable().pipe(take(1)).toPromise(),
    ];
    loadableClientState.reload();
    loadableClientState.reload();

    expect(loadState).toHaveBeenCalledTimes(1);

    resolveResponse('a');
    await Promise.all(calls);
  });

  it('when value exists should not initialize anymore', async () => {
    let resolveResponse: (response: string) => void;
    const loadState: () => Promise<string> = jasmine.createSpy('loadState')
      .and.returnValue(new Promise(resolve => resolveResponse = resolve))
    ;
    const loadableClientState = new LoadableClientDataState(loadState);

    const calls = [
      loadableClientState.asObservable().pipe(take(1)).toPromise(),
      loadableClientState.asObservable().pipe(take(1)).toPromise(),
      loadableClientState.asObservable().pipe(take(1)).toPromise(),
    ];
    loadableClientState.reload();
    loadableClientState.reload();

    expect(loadState).toHaveBeenCalledTimes(1);

    resolveResponse('a');
    await Promise.all(calls);
  });

  it('update should distribute updates to all subscriptions', async () => {
    const loadState = jasmine.createSpy('loadState').and.returnValue(Promise.resolve('b'));
    const loadableClientState = new LoadableClientDataState(loadState);

    loadableClientState.update('a');
    const result = await loadableClientState.asObservable().pipe(take(1)).toPromise();

    expect(loadState).not.toHaveBeenCalled();
    expect(result).toBe('a');
  });
});
