import { component$, useStore, useStyles$, useVisibleTask$ } from "@builder.io/qwik";

import styles from "./styles.css?inline";
import { supabase } from "~/lib/db";
import { quizzesLSKey } from "~/lib/constants";
import { QuizSave } from "~/lib/models/quiz-save.model";
import { Link, routeAction$ } from "@builder.io/qwik-city";
import { QuizOverviewBox } from "~/lib/quiz-overview-box";
import { randomId } from "~/lib/utils/random-id";

export const useRun = routeAction$(async ({id}, re) => {
  const response = await supabase
    .from("quiz")
    .select()
    .eq("id", id)
    .single();
  const quiz = response.data as QuizSave;
  const created = await supabase
    .from('game')
    .insert({name: quiz.name, rounds: quiz.rounds, join_code: randomId()})
    .select('id')
    .single();
  if (created.data) {
      re.redirect(301, `/run/${created.data?.id}`);
      return {
        success: true
      }
  }
  return {
    success: false
  }
});

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
  const run = useRun();

  return (
    <section class="section bright container">
      <h3>Quizzes</h3>
      <Link class="w-1/3 p-3 my-3 button block" href="/create">Create New</Link>
      {store.quizzes.map((q, index) => (
        <QuizOverviewBox id={q.id}
                         lastSaved={""}
                         name={q.name}
                         rounds={q.rounds.length}
                         questions={q.rounds.flatMap(r => r.questions).length}
                         run={run}
                         key={index}
        />
      ))}
    </section>
  );
});
