import { allClusterRecordsReactiveInjectionToken, type ClusterRecord } from "@k8slens/cluster-contracts";
import { getInjectable2 } from "@k8slens/injectable";
import { kubeResourcesInjectionToken, coreV1, namespaceKind, nodeKind, podKind } from "@k8slens/kubernetes-contracts";
import type { Subscribable } from "@k8slens/subscribable";
import { computed, type IComputedValue } from "mobx";
import { readSettledComputed, type Settled, settledInjectable } from "./settled.injectable";

// Every cluster the user has, as a "town". The list stays pending while Lens knows no clusters at all.
export const townsInjectable = getInjectable2({
  id: "jaakko-towns",
  consumptions: [allClusterRecordsReactiveInjectionToken],

  instantiate: (di) => {
    const allClusterRecords = di.inject(allClusterRecordsReactiveInjectionToken);
    const settled = di.inject(settledInjectable)();
    const box = settled(allClusterRecords());
    const towns: IComputedValue<Settled<readonly ClusterRecord[]>> = computed(() => readSettledComputed(box));

    return () => towns;
  },
});

export interface TownCountSubscribables {
  readonly houses: Subscribable<readonly unknown[]>;
  readonly pods: Subscribable<readonly unknown[]>;
  readonly rooms: Subscribable<readonly unknown[]>;
}

// What lives in one town: its nodes (houses), pods and namespaces (rooms). One per cluster id, so
// every render of a town asks for the very same subscribables and shares one watch of each.
export const townCountSubscribablesInjectable = getInjectable2({
  id: "jaakko-town-count-subscribables",
  consumptions: [kubeResourcesInjectionToken],

  instantiate: (di) => {
    const kubeResources = di.inject(kubeResourcesInjectionToken)();

    return (clusterId: string): TownCountSubscribables => ({
      houses: kubeResources(nodeKind, coreV1, clusterId),
      pods: kubeResources(podKind, coreV1, clusterId),
      rooms: kubeResources(namespaceKind, coreV1, clusterId),
    });
  },
});
