import { getInjectable2 } from "@k8slens/injectable";
import { action, computed, observable } from "mobx";
import { type ChapterId, chapters } from "./chapters";

// Which page of the storybook is open, which town the reader came from, and their quiz answers.
export const guideStateInjectable = getInjectable2({
  id: "jaakko-guide-state",

  instantiate: () => {
    const currentChapterId = observable.box<ChapterId>("hello");
    const highlightedClusterId = observable.box<string | undefined>(undefined);
    const quizAnswers = observable.map<string, number>();

    const currentIndex = computed(() => chapters.findIndex((chapter) => chapter.id === currentChapterId.get()));

    const state = {
      currentChapter: computed(() => chapters[currentIndex.get()] ?? chapters[0]),
      chapterNumber: computed(() => currentIndex.get() + 1),
      hasPrevious: computed(() => currentIndex.get() > 0),
      hasNext: computed(() => currentIndex.get() < chapters.length - 1),
      highlightedClusterId: computed(() => highlightedClusterId.get()),

      goTo: action((id: ChapterId) => currentChapterId.set(id)),
      goToPrevious: action(() => {
        const previous = chapters[currentIndex.get() - 1];

        if (previous) currentChapterId.set(previous.id);
      }),
      goToNext: action(() => {
        const next = chapters[currentIndex.get() + 1];

        if (next) currentChapterId.set(next.id);
      }),
      showTown: action((clusterId: string) => {
        highlightedClusterId.set(clusterId);
        currentChapterId.set("your-towns");
      }),

      answerOf: (questionId: string) => quizAnswers.get(questionId),
      answer: action((questionId: string, answerIndex: number) => {
        if (!quizAnswers.has(questionId)) quizAnswers.set(questionId, answerIndex);
      }),
      resetQuiz: action(() => quizAnswers.clear()),
      answeredCount: computed(() => quizAnswers.size),
    };

    return () => state;
  },
});
