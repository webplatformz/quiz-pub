import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import type { QuizSave } from "~/lib/models/quiz-save.model";

export default component$(() => {
  const store = useStore({ quizzes: [] });
  useVisibleTask$(() => {
    store.quizzes = JSON.parse(localStorage.getItem("quizzes") ?? "[]");
  });
  return <>
    {
      store.quizzes.map((game: QuizSave) => (
        <>{game.name}</>
      ))
    }
  </>;
});