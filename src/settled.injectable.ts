import { getInjectable2 } from "@k8slens/injectable";
import { type IComputedValue, type IObservableValue, observable, runInAction } from "mobx";

export type Settled<T> =
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly value: T }
  | { readonly status: "failed" };

// Turns a promise into an observable that says whether it has arrived yet, so components can
// render a loading state without React Suspense (which leaks MobX observers in Lens).
export const settledInjectable = getInjectable2({
  id: "jaakko-settled",

  instantiate: () => {
    const boxes = new WeakMap<Promise<unknown>, IObservableValue<Settled<unknown>>>();

    const settled = <T>(promise: Promise<T>): IObservableValue<Settled<T>> => {
      const existing = boxes.get(promise);

      if (existing) return existing as IObservableValue<Settled<T>>;

      const box = observable.box<Settled<T>>({ status: "loading" }, { deep: false });

      boxes.set(promise, box as IObservableValue<Settled<unknown>>);
      promise.then(
        (value) => runInAction(() => box.set({ status: "ready", value })),
        () => runInAction(() => box.set({ status: "failed" })),
      );

      return box;
    };

    return () => settled;
  },
});

/** Reads a promised computed, as a subscription hands it out. */
export const readSettledComputed = <T>(box: IObservableValue<Settled<IComputedValue<T>>>): Settled<T> => {
  const current = box.get();

  return current.status === "ready" ? { status: "ready", value: current.value.get() } : current;
};
