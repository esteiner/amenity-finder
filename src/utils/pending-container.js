// mixin for implementing the pending-state protocol (https://github.com/justinfagnani/pending-state-protocol)

export const PendingContainer = (base) => class extends base {
  static get properties() {
    return {
      hasPendingChildren: { type: Boolean },
      pendingCount: { type: Number },
    }
  }

  constructor() {
    super();
    this.addEventListener('pending-state', async (e) => {
      this.hasPendingChildren = true;
      this.pendingCount++;
      await e.detail.promise;
      this.pendingCount--;
      this.hasPendingChildren = this.pendingCount !== 0;
    });
  }
}
