import { getInjectable2 } from "@k8slens/injectable";
import { mainViewTabHostKind } from "@k8slens/main-view-contracts";
import { focusTabInjectionToken, openTabInjectionToken, tabIsOpenInjectionToken } from "@k8slens/tab-contracts";
import { guideTabId, guideTabKind } from "./guide-tab-kind";
import { guideStateInjectable } from "./guide-state.injectable";

// Opens the storybook tab, or brings it to the front when it is already open. Given a cluster id,
// it also turns to the "Your towns" chapter with that cluster highlighted.
export const openGuideInjectable = getInjectable2({
  id: "jaakko-open-guide",
  consumptions: [openTabInjectionToken, focusTabInjectionToken, tabIsOpenInjectionToken],

  instantiate: (di) => {
    const openTab = di.inject(openTabInjectionToken.for(mainViewTabHostKind).for(guideTabKind).for(di.scopeIds))();
    const focusTab = di.inject(focusTabInjectionToken.for(mainViewTabHostKind).for(guideTabKind).for(di.scopeIds))();
    const isOpen = di.inject(tabIsOpenInjectionToken.for(mainViewTabHostKind).for(guideTabKind).for(di.scopeIds))();
    const guideState = di.inject(guideStateInjectable)();

    return () => async (clusterId?: string) => {
      if (clusterId) guideState.showTown(clusterId);

      if (await isOpen({ tabId: guideTabId })) {
        await focusTab({ tabId: guideTabId });
      } else {
        await openTab({ tabId: guideTabId });
      }
    };
  },
});
