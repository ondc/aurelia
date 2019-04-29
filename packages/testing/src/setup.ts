// import { HTMLTestContext } from './html-test-context';
// import { Constructable } from '@aurelia/kernel';
// import { Aurelia, CustomElementResource, ILifecycle } from '@aurelia/runtime';
// import { expect } from 'chai';

// export function cleanup(ctx: HTMLTestContext): void {
//   const body = ctx.doc.body;
//   let current = body.firstElementChild;
//   while (current != null) {
//     const next = current.nextElementSibling;
//     if (current.tagName === 'APP') {
//       body.removeChild(current);
//     }
//     current = next;
//   }
// }

// export function setup(ctx: HTMLTestContext, template: string | Node, $class: Constructable | null, ...registrations: any[]) {
//   const { container, lifecycle, observerLocator } = ctx;
//   container.register(...registrations);
//   const host = ctx.createElement('app');
//   const au = new Aurelia(container);
//   const App = CustomElementResource.define({ name: 'app', template }, $class);
//   const component = new App() as any;

//   return { container, lifecycle, host, au, component, observerLocator };
// }

// export function setupAndStart(ctx: HTMLTestContext, template: string | Node, $class: Constructable | null, ...registrations: any[]) {
//   const { container, lifecycle, host, au, component, observerLocator } = setup(ctx, template, $class, ...registrations);

//   au.app({ host, component });
//   au.start();

//   return { container, lifecycle, host, au, component, observerLocator };
// }

// export function setupWithDocument(ctx: HTMLTestContext, template: string | Node, $class: Constructable | null, ...registrations: any[]) {
//   const { container, lifecycle, host, au, component, observerLocator } = setup(ctx, template, $class, ...registrations);
//   ctx.doc.body.appendChild(host);
//   return { container, lifecycle, host, au, component, observerLocator };
// }

// export function setupWithDocumentAndStart(ctx: HTMLTestContext, template: string | Node, $class: Constructable | null, ...registrations: any[]) {
//   const { container, lifecycle, host, au, component, observerLocator } = setupWithDocument(ctx, template, $class, ...registrations);

//   au.app({ host, component });
//   au.start();

//   return { container, lifecycle, host, au, component, observerLocator };
// }

// export function tearDown(au: Aurelia, lifecycle: ILifecycle, host: HTMLElement) {
//   au.stop();
//   expect(lifecycle['flushCount']).to.equal(0);
//   host.remove();
// }

// const reg = /\s+/g;
// export function trimFull(text: string) {
//   return text.replace(reg, '');
// }
