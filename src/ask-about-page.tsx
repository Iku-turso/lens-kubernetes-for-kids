import { AskAiTerminal } from "@k8slens/ask-ai-contracts";
import { Div, Span } from "@k8slens/element-components";
import { PlainButton, PrimaryButton } from "@k8slens/input-components";
import { useInject } from "@k8slens/use-inject";
import { observer } from "mobx-react";
import { askAboutPageInjectable, ownScopeIdsInjectable } from "./ask-about-page.injectable";
import { guideStateInjectable } from "./guide-state.injectable";

const AskPanelBody = observer(() => {
  const askAboutPage = useInject(askAboutPageInjectable)().get();
  const ownScopeIds = useInject(ownScopeIdsInjectable)();

  if (askAboutPage.status === "looking-for-cluster") {
    return <Span $color="textMuted">🔎 Getting the helper ready…</Span>;
  }

  if (askAboutPage.status === "no-cluster") {
    return (
      <Span $color="textMuted">
        The helper needs a town to stand in. Add a cluster to Lens from the navigator on the left, then come back and
        ask away!
      </Span>
    );
  }

  return (
    <Div $flex={{ direction: "vertical", gap: "xs" }}>
      <Span $color="textMuted" $font={{ size: "s" }}>
        Every page has its own conversation. The helper uses your town "{askAboutPage.clusterName}" for real examples,
        and only looks, never changes anything.
      </Span>
      <Div $style={{ height: "26rem" }} $border={{ color: "borderPrimary", width: "xxs", radius: "m" }} $overflow="hidden">
        <AskAiTerminal
          key={askAboutPage.sessionId}
          sessionId={askAboutPage.sessionId}
          clusterId={askAboutPage.clusterId}
          scopeIds={ownScopeIds}
          context={askAboutPage.context}
        />
      </Div>
    </Div>
  );
});

export const AskAboutPage = observer(() => {
  const guideState = useInject(guideStateInjectable)();
  const isOpen = guideState.askPanelIsOpen.get();
  const ToggleButton = isOpen ? PlainButton : PrimaryButton;

  return (
    <Div
      $flex={{ direction: "vertical", gap: "s" }}
      $padding="m"
      $border={{ color: "borderPrimary", width: "xxs", radius: "m" }}
      $backgroundColor="backgroundPrimaryDimmed"
    >
      <Div $flex={{ direction: "horizontal", gap: "m", verticalAlign: "center", horizontalAlign: "space-between" }}>
        <Div $flex={{ direction: "vertical", gap: "xxs" }}>
          <Span $font={{ size: "s", bold: true }} $color="textMuted">
            🙋 GOT A QUESTION?
          </Span>
          <Span>Ask the AI helper anything about this page. It explains things like you're five.</Span>
        </Div>
        <ToggleButton onClick={guideState.toggleAskPanel}>{isOpen ? "Hide helper" : "Ask a question"}</ToggleButton>
      </Div>
      {isOpen && <AskPanelBody />}
    </Div>
  );
});
