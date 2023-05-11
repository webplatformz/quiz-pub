import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";

type StoredQuiz = {
  id: string,
  lastSaved: string,
  name: string,
  rounds: string,
  questions: string,
}

export default component$(() => {
  const store = useStore({ quizzes: [] });
  useVisibleTask$(() => {
    store.quizzes = JSON.parse(localStorage.getItem("quizzes") ?? "[]");
  });
  return <section class="section bright container">
    <h3>Quizzes</h3>
    {
      store.quizzes.map((game: StoredQuiz, index: number) => (
        <Quiz {...game} key={index} />
      ))
    }
    <div class="container container-center">
      <a href={"/edit"} class="button">Create Quiz</a>
    </div>
  </section>;
});


const Quiz = component$<StoredQuiz>(({ id, lastSaved, name, rounds, questions }) => {
  return <div class='w-full p-4 bg-blue-500'>
    {id}
    {lastSaved}
    {name}
    {rounds}
    {questions}
  </div>;
});

