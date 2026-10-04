import { ClickableDiv, Div, H1, P, Span } from "@k8slens/element-components";
import { PlainButton, PrimaryButton } from "@k8slens/input-components";
import { mainViewTabHostKind } from "@k8slens/main-view-contracts";
import { getTabKindInjectableBunch, type TabProps } from "@k8slens/tab-contracts";
import { useInject } from "@k8slens/use-inject";
import { observer } from "mobx-react";
import { type Chapter, chapters, quizQuestions } from "./chapters";
import { guideStateInjectable } from "./guide-state.injectable";
import { guideTabKind } from "./guide-tab-kind";
import styles from "./guide.module.scss";
import { AskAboutPage } from "./ask-about-page";
import { ChapterIllustration } from "./illustrations";
import { Towns } from "./towns";

const GuideTitle = (_props: TabProps<typeof mainViewTabHostKind>) => <Div>🧸 Kubernetes for Kids</Div>;

const ChapterList = observer(() => {
  const guideState = useInject(guideStateInjectable)();
  const current = guideState.currentChapter.get();

  return (
    <Div
      $flex={{ direction: "vertical", gap: "xxs" }}
      $className={styles.chapterList}
      $padding="m"
      $backgroundColor="backgroundSecondary"
      $overflow="auto"
    >
      <Span $font={{ size: "s", bold: true }} $color="textMuted" $padding={{ horizontal: "s", vertical: "xs" }}>
        CHAPTERS
      </Span>
      {chapters.map((chapter, index) => (
        <ClickableDiv
          key={chapter.id}
          $flex={{ direction: "horizontal", gap: "m", verticalAlign: "center" }}
          $padding={{ horizontal: "s", vertical: "s" }}
          $border={{ radius: "m" }}
          $interactive={{ active: chapter.id === current.id }}
          $color={chapter.id === current.id ? "textHighlight" : "textDefault"}
          $onClick={() => guideState.goTo(chapter.id)}
        >
          <Span $className={styles.chapterIcon}>{chapter.emoji}</Span>
          <Span>
            {index + 1}. {chapter.title}
          </Span>
        </ClickableDiv>
      ))}
    </Div>
  );
});

const InfoBox = ({ heading, children }: { heading: string; children: React.ReactNode }) => (
  <Div
    $flex={{ direction: "vertical", gap: "xs" }}
    $padding="m"
    $border={{ color: "borderPrimary", width: "xxs", radius: "m" }}
    $backgroundColor="backgroundPrimaryDimmed"
  >
    <Span $font={{ size: "s", bold: true }} $color="textMuted">
      {heading}
    </Span>
    {children}
  </Div>
);

const Quiz = observer(() => {
  const guideState = useInject(guideStateInjectable)();
  const score = quizQuestions.filter((question) => guideState.answerOf(question.id) === question.correctIndex).length;
  const finished = guideState.answeredCount.get() === quizQuestions.length;

  return (
    <Div $flex={{ direction: "vertical", gap: "l" }}>
      {quizQuestions.map((question, questionIndex) => {
        const picked = guideState.answerOf(question.id);
        const answered = picked !== undefined;

        return (
          <InfoBox key={question.id} heading={`QUESTION ${questionIndex + 1}`}>
            <Span $font={{ size: "l", bold: true }}>{question.question}</Span>
            <Div $flex={{ direction: "horizontal", gap: "s", wrap: true }}>
              {question.answers.map((answer, answerIndex) => {
                const Button = answered && answerIndex === question.correctIndex ? PrimaryButton : PlainButton;

                return (
                  <Button
                    key={answer}
                    $disabled={answered && answerIndex !== question.correctIndex && answerIndex !== picked}
                    onClick={() => guideState.answer(question.id, answerIndex)}
                  >
                    {answered && answerIndex === picked ? (picked === question.correctIndex ? "✅ " : "❌ ") : ""}
                    {answer}
                  </Button>
                );
              })}
            </Div>
            {answered && (
              <Span $color={picked === question.correctIndex ? "success" : "notice"}>
                {picked === question.correctIndex ? "Yes! " : "Not quite. "}
                {question.why}
              </Span>
            )}
          </InfoBox>
        );
      })}
      {finished && (
        <Div $flex={{ direction: "vertical", gap: "s", horizontalAlign: "left" }}>
          <Span $font={{ size: "xl", bold: true }}>
            {score === quizQuestions.length ? "🏆" : "🌟"} You got {score} out of {quizQuestions.length}!
            {score === quizQuestions.length ? " You're a Kubernetes captain!" : " Great try!"}
          </Span>
          <PlainButton onClick={guideState.resetQuiz}>Try again</PlainButton>
        </Div>
      )}
    </Div>
  );
});

const ChapterExtras = ({ chapter }: { chapter: Chapter }) => {
  if (chapter.id === "your-towns") return <Towns />;
  if (chapter.id === "quiz") return <Quiz />;

  return null;
};

const ChapterPage = observer(() => {
  const guideState = useInject(guideStateInjectable)();
  const chapter = guideState.currentChapter.get();

  return (
    <Div $flexChild={1} $overflow="auto" $padding={{ horizontal: "3xl", vertical: "xxl" }}>
      <Div $className={styles.page} $flex={{ direction: "vertical", gap: "l" }}>
        <Div $flex={{ direction: "horizontal", gap: "l", verticalAlign: "center" }}>
          <Span $className={styles.bigEmoji}>{chapter.emoji}</Span>
          <Div $flex={{ direction: "vertical", gap: "xxs" }}>
            <Span $color="textMuted" $font={{ size: "s" }}>
              Chapter {guideState.chapterNumber.get()} of {chapters.length}
            </Span>
            <H1 $font={{ size: "3xl", bold: true }} $color="textHighlight">
              {chapter.title}
            </H1>
          </Div>
        </Div>

        <Div $border={{ color: "borderPrimary", width: "xxs", radius: "l" }} $overflow="hidden">
          <ChapterIllustration chapterId={chapter.id} label={`Illustration: ${chapter.title}`} />
        </Div>

        {chapter.story.map((paragraph) => (
          <P key={paragraph} $className={styles.story}>
            {paragraph}
          </P>
        ))}

        <ChapterExtras chapter={chapter} />

        {chapter.grownUpWord && (
          <InfoBox heading="🎓 THE GROWN-UP WORD">
            <Span $font={{ bold: true }}>{chapter.grownUpWord.word}</Span>
            <Span>{chapter.grownUpWord.meaning}</Span>
          </InfoBox>
        )}

        {chapter.seeItInLens && (
          <InfoBox heading="🔭 SEE IT IN LENS">
            <Span>{chapter.seeItInLens}</Span>
          </InfoBox>
        )}

        <AskAboutPage />

        <Div $flex={{ direction: "horizontal", gap: "s", horizontalAlign: "space-between" }} $padding={{ top: "l" }}>
          <PlainButton $disabled={!guideState.hasPrevious.get()} onClick={guideState.goToPrevious}>
            ← Back
          </PlainButton>
          <PrimaryButton $disabled={!guideState.hasNext.get()} onClick={guideState.goToNext}>
            Next →
          </PrimaryButton>
        </Div>
      </Div>
    </Div>
  );
});

const Guide = (_props: TabProps<typeof mainViewTabHostKind>) => (
  <Div $flex={{ direction: "horizontal", verticalAlign: "stretch" }} $height="full" $width="full" $backgroundColor="backgroundPrimary">
    <ChapterList />
    <ChapterPage />
  </Div>
);

export default getTabKindInjectableBunch({
  tabHostKind: mainViewTabHostKind,
  kind: guideTabKind,
  Component: Guide,
  Title: GuideTitle,
});
