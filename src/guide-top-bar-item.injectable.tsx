import { Button } from "@k8slens/element-components";
import { HelpOutlineIcon } from "@k8slens/icon";
import { getTopBarItemInjectableBunch } from "@k8slens/top-bar-contracts";
import { useInject } from "@k8slens/use-inject";
import { openGuideInjectable } from "./open-guide.injectable";

const OpenGuideButton = () => {
  const openGuide = useInject(openGuideInjectable)();

  return (
    <Button
      $interactive
      $padding="xs"
      $border={{ radius: "m" }}
      $flex={{ verticalAlign: "center" }}
      $onClick={() => openGuide()}
      $tooltip="Kubernetes for Kids: Kubernetes explained like you're 5"
      aria-label="Kubernetes for Kids"
    >
      <HelpOutlineIcon $size="m" />
    </Button>
  );
};

export default getTopBarItemInjectableBunch({
  id: "jaakko-open-guide-top-bar-item",
  side: "right",
  orderNumber: 15,
  Component: OpenGuideButton,
});
