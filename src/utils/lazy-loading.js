import { directive } from 'lit-html';

const resolved = new WeakSet();
export const lazyLoad = directive((importPromise, value) =>
  (part) => {
    if (!resolved.has(part)) {
      importPromise.then(() => resolved.add(part));
      const event = new CustomEvent('pending-state', {
        composed: true,
        bubbles: true,
        detail: { promise: importPromise }
      });
      part.startNode.parentNode.dispatchEvent(event);
    }
    part.setValue(value);
  }
);
