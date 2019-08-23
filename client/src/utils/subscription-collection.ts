import { Subscription } from 'rxjs';

export class SubscriptionCollection {
  private subscriptions: Subscription[] = [];

  public push = this.subscriptions.push.bind(this.subscriptions);

  public onDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.push = () => {
      throw new Error('subscription collection already destroyed');
    };
    delete this.subscriptions;
  }
}
