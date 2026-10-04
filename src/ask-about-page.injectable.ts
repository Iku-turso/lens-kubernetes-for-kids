import { getInjectable2 } from "@k8slens/injectable";
import { computed } from "mobx";
import type { Chapter } from "./chapters";
import { guideStateInjectable } from "./guide-state.injectable";
import { townsInjectable } from "./towns.injectable";

export type AskAboutPage =
  | { readonly status: "looking-for-cluster" }
  | { readonly status: "no-cluster" }
  | { readonly status: "ready"; readonly clusterId: string; readonly clusterName: string; readonly sessionId: string; readonly context: string };

const briefingFor = (chapter: Chapter, clusterName: string) =>
  [
    "The user is reading **Kubernetes for Kids**, a Lens extension that explains Kubernetes to complete beginners as a picture book, the way you would explain it to a five-year-old.",
    "",
    "## How to answer",
    "- Answer like a friendly teacher talking to a curious five-year-old: short sentences, everyday words, one idea at a time.",
    "- Stay inside the storybook's metaphors (below) so your answers match what the user just read: containers are lunchboxes, pods are peas in a pod, nodes are houses, a cluster is a town with a town hall, a deployment is a wish like \"I always want 3 snowmen\", a service is one phone number, an ingress is the town gate, namespaces are rooms with name tags, ConfigMaps are recipe cards, Secrets are locked diaries, volumes are backpacks, Lens is binoculars and kubectl is a walkie-talkie.",
    "- After the simple answer, you may add one line starting with \"Grown-up word:\" that names the real Kubernetes term.",
    "- The user is a learner. Do not change anything in the cluster; only look, and only when it helps explain with a real example.",
    `- The conversation is attached to the user's cluster \"${clusterName}\", which the storybook calls one of their \"towns\". Use it for real examples when asked, such as how many houses (nodes) or pea pods (pods) it has.`,
    "",
    `## The page the user is on: ${chapter.emoji} ${chapter.title}`,
    "",
    ...chapter.story,
    ...(chapter.grownUpWord ? ["", `Grown-up word: **${chapter.grownUpWord.word}**: ${chapter.grownUpWord.meaning}`] : []),
    ...(chapter.seeItInLens ? ["", `Where to see it in Lens: ${chapter.seeItInLens}`] : []),
  ].join("\n");

// What the "Ask a question" panel of the current page needs: the cluster the conversation runs
// against (the one the reader came from, else a connected one, else any), a session per page and
// cluster so every page keeps its own conversation, and the briefing about the page.
export const askAboutPageInjectable = getInjectable2({
  id: "jaakko-ask-about-page",

  instantiate: (di) => {
    const guideState = di.inject(guideStateInjectable)();
    const towns = di.inject(townsInjectable)();

    const askAboutPage = computed((): AskAboutPage => {
      const settledTowns = towns.get();

      if (settledTowns.status === "loading") return { status: "looking-for-cluster" };
      if (settledTowns.status === "failed" || settledTowns.value.length === 0) return { status: "no-cluster" };

      const highlightedId = guideState.highlightedClusterId.get();
      const town =
        settledTowns.value.find((candidate) => candidate.id === highlightedId) ??
        settledTowns.value.find((candidate) => candidate.isConnected.get()) ??
        settledTowns.value[0];
      const chapter = guideState.currentChapter.get();
      const clusterName = town.name.get();

      return {
        status: "ready",
        clusterId: town.id,
        clusterName,
        sessionId: `kubernetes-for-kids.${chapter.id}.${town.id}`,
        context: briefingFor(chapter, clusterName),
      };
    });

    return () => askAboutPage;
  },
});

// A component has no scope of its own, so the Ask AI terminal takes the extension's from here.
export const ownScopeIdsInjectable = getInjectable2({
  id: "jaakko-own-scope-ids",
  instantiate: (di) => () => di.scopeIds,
});
