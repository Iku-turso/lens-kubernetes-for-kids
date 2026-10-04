import { clusterNavigatorItemKind } from "@k8slens/cluster-contracts";
import { DropDownMenuItemRow } from "@k8slens/drop-down-menu-items";
import { HelpOutlineIcon } from "@k8slens/icon";
import {
  getNavigatorItemMenuItemInjectableBunch,
  type NavigatorItemOfKind,
  navigatorItemDropDownMenuOrderNumbers,
} from "@k8slens/navigator-contracts";
import { useInject } from "@k8slens/use-inject";
import { openGuideInjectable } from "./open-guide.injectable";

const ExplainCluster = ({ data }: { data: NavigatorItemOfKind<typeof clusterNavigatorItemKind> }) => {
  const openGuide = useInject(openGuideInjectable)();
  const [clusterId] = data.ids;

  return (
    <DropDownMenuItemRow Icon={HelpOutlineIcon} $onClick={() => openGuide(clusterId)}>
      Explain like I'm 5
    </DropDownMenuItemRow>
  );
};

export default getNavigatorItemMenuItemInjectableBunch({
  id: "jaakko-explain-cluster-menu-item",
  forItemsOfKind: clusterNavigatorItemKind,
  orderNumber: navigatorItemDropDownMenuOrderNumbers.sectionEnd + 100,
  Component: ExplainCluster,
});
