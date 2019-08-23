import { SubscriptionCollection } from './index';
import { Subscription } from 'rxjs';

describe('utils subscription collection', () => {
  it('when destroyed then it should unsubscribe all subscriptions', () => {
    const subscriptions = new SubscriptionCollection();
    const subscribed = { a: true, b: true, c: true };

    subscriptions.push(
      { unsubscribe: () => { delete subscribed.a; } } as Subscription,
      { unsubscribe: () => { delete subscribed.b; } } as Subscription,
      { unsubscribe: () => { delete subscribed.c; } } as Subscription,
    );

    subscriptions.onDestroy();
    expect(Object.keys(subscribed).length).toBe(0);
  });

  it('when pushing subscriptions after destroy then it should throw', () => {
    const subscriptions = new SubscriptionCollection();

    subscriptions.onDestroy();

    expect(() => subscriptions.push({} as Subscription)).toThrow();
  });
});

