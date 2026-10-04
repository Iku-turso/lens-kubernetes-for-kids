import type { ClusterRecord } from "@k8slens/cluster-contracts";
import { Div, Span } from "@k8slens/element-components";
import type { Subscribable } from "@k8slens/subscribable";
import { useSubscribable } from "@k8slens/subscribable-react";
import { useInject } from "@k8slens/use-inject";
import { observer } from "mobx-react";
import { guideStateInjectable } from "./guide-state.injectable";
import styles from "./guide.module.scss";
import { readSettledComputed, settledInjectable } from "./settled.injectable";
import { townCountSubscribablesInjectable, townsInjectable } from "./towns.injectable";

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

// How many of something live in a town, kept current while the town is on screen.
const useCount = (subscribable: Subscribable<readonly unknown[]>) => {
  const settled = useInject(settledInjectable)();
  const { value } = useSubscribable(subscribable);
  const result = readSettledComputed(settled(value));

  return result.status === "ready" ? { status: "ready" as const, value: result.value.length } : result;
};

const TownCounts = observer(({ clusterId }: { clusterId: string }) => {
  const subscribables = useInject(townCountSubscribablesInjectable)(clusterId);
  const houses = useCount(subscribables.houses);
  const pods = useCount(subscribables.pods);
  const rooms = useCount(subscribables.rooms);

  const show = (count: typeof houses, one: string, many: string) =>
    count.status === "ready" ? plural(count.value, one, many) : count.status === "loading" ? `counting ${many}…` : `${many}: can't peek`;

  return (
    <Div $flex={{ direction: "vertical", gap: "xs" }}>
      <Div $flex={{ direction: "horizontal", gap: "l", wrap: true }}>
        <Span>🏠 {show(houses, "house (node)", "houses (nodes)")}</Span>
        <Span>🫛 {show(pods, "pea pod (pod)", "pea pods (pods)")}</Span>
        <Span>🗂️ {show(rooms, "room (namespace)", "rooms (namespaces)")}</Span>
      </Div>
      {houses.status === "ready" && pods.status === "ready" && houses.value > 0 && (
        <Span $color="textMuted">
          {houses.value === 1
            ? `All ${plural(pods.value, "pod lives", "pods live")} in one single house. Cosy!`
            : `That's about ${Math.round(pods.value / houses.value)} pea pods in every house.`}
        </Span>
      )}
    </Div>
  );
});

const Town = observer(({ town, highlighted }: { town: ClusterRecord; highlighted: boolean }) => {
  const isAwake = town.isConnected.get();
  const color = town.color.get();

  return (
    <Div
      $flex={{ direction: "horizontal", gap: "m", verticalAlign: "top" }}
      $padding="m"
      $border={{ color: highlighted ? "primary" : "borderPrimary", width: highlighted ? "xs" : "xxs", radius: "m" }}
      $backgroundColor="backgroundPrimaryDimmed"
    >
      <Span $className={styles.townEmoji}>{isAwake ? "🏘️" : "😴"}</Span>
      <Div $flex={{ direction: "vertical", gap: "xs" }}>
        <Div $flex={{ direction: "horizontal", gap: "s", verticalAlign: "center" }}>
          {color && <Span $className={styles.colorDot} $style={{ backgroundColor: color }} />}
          <Span $font={{ size: "l", bold: true }}>{town.name.get()}</Span>
          {highlighted && <Span $color="primary">← you came from here</Span>}
        </Div>
        {isAwake ? (
          <>
            <Span>Awake! Lens is visiting this town right now, so we can peek inside.</Span>
            <TownCounts clusterId={town.id} />
          </>
        ) : (
          <Span $color="textMuted">
            Sleeping. Lens isn't visiting this town right now. Click it in the navigator on the left to wake it up, then
            come back to peek inside.
          </Span>
        )}
      </Div>
    </Div>
  );
});

export const Towns = observer(() => {
  const towns = useInject(townsInjectable)().get();
  const guideState = useInject(guideStateInjectable)();
  const highlightedClusterId = guideState.highlightedClusterId.get();

  if (towns.status === "loading") {
    return (
      <Span $color="textMuted">
        🔎 Looking for your towns… If nothing shows up, you don't have any clusters in Lens yet. Add one from the
        navigator on the left, and it will appear here.
      </Span>
    );
  }

  if (towns.status === "failed") {
    return <Span $color="warning">Oops, we couldn't find your towns this time.</Span>;
  }

  const awake = towns.value.filter((town) => town.isConnected.get()).length;

  return (
    <Div $flex={{ direction: "vertical", gap: "m" }}>
      <Span $font={{ size: "l" }}>
        You have {plural(towns.value.length, "town", "towns")}. {awake === 0 ? "None" : awake} of them{" "}
        {awake === 1 ? "is" : "are"} awake.
      </Span>
      {towns.value.map((town) => (
        <Town key={town.id} town={town} highlighted={town.id === highlightedClusterId} />
      ))}
    </Div>
  );
});
