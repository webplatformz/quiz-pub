import { component$, useStore, useStyles$, useVisibleTask$ } from "@builder.io/qwik";

import styles from "./styles.css?inline";
import { supabase } from "~/lib/db";
import { quizzesLSKey } from "~/lib/constants";
import { Quiz } from "~/routes/all-games";
import { QuizSave } from "~/lib/models/quiz-save.model";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  useStyles$(styles);
  const store = useStore<{ quizzes: QuizSave[] }>({ quizzes: [] });
  useVisibleTask$(async () => {
    const quizIds = JSON.parse(localStorage.getItem(quizzesLSKey) ?? "[]");
    store.quizzes = ((await supabase
      .from("quiz")
      .select()
      .in("id", quizIds))
      .data ?? []) as QuizSave[];
  });

  return (
    <section class="section bright container">
      <h3>Quizzes</h3>
      <Link class="w-1/3 p-3 my-3 button block" href="/create">Create New</Link>
      {store.quizzes.map((q, index) => (
        <Quiz id={q.id}
              lastSaved={""}
              name={q.name}
              rounds={q.rounds.length}
              questions={q.rounds.flatMap(r => r.questions).length}
              key={index}
        />
      ))}
    </section>
  );
});
