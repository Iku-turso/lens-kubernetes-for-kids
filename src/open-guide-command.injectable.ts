import { getCommandInjectableBunch } from "@k8slens/command-palette-contracts";
import { openGuideInjectable } from "./open-guide.injectable";

export default getCommandInjectableBunch({
  id: "jaakko.open-kubernetes-for-kids",
  title: "Kubernetes for Kids: Open",
  action: {
    instantiate: (di) => {
      const openGuide = di.inject(openGuideInjectable)();

      return () => () => openGuide();
    },
  },
});
