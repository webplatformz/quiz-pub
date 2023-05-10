import { $, component$ } from "@builder.io/qwik";
import MockQuiz from "../../../test.json";
import { useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
  const nav = useNavigate();
  const createQuiz = $(async () => {
    try {
      const newQuizId = await fetch("/quiz", {
        method: "PUT",
        body: JSON.stringify(MockQuiz)
      }).then(res => res.text());
      const quizzes = JSON.parse(localStorage.getItem("quizzes") ?? "[]");
      quizzes.push(newQuizId);
      localStorage.setItem("quizzes", JSON.stringify(quizzes));
      await nav(`/all-games?new-game=${newQuizId}`);
    } catch (e) {
      console.log(e);
    }

  });
  return <div class='flex flex-col justify-center max-w-lg gap-4 mx-auto'>
    <pre>{JSON.stringify(MockQuiz, null, 2)}</pre>
    <button onClick$={createQuiz}>
      Create Quiz
    </button>
  </div>;
});