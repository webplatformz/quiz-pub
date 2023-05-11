import { component$, useStore, useStyles$, useVisibleTask$ } from "@builder.io/qwik";

import styles from "./styles.css?inline";
import { supabase } from "~/lib/db";
import { quizzesLSKey } from "~/lib/constants";

export default component$(() => {
  useStyles$(styles);
  const store = useStore<{ quizzes: any[] }>({ quizzes: [] });
  useVisibleTask$(async () => {
    const quizIds = JSON.parse(localStorage.getItem(quizzesLSKey) ?? "[]");
    store.quizzes = (await supabase
      .from("quiz")
      .select()
      .in("id", quizIds))
      .data ?? [];
  });

  return (
    <section class="section bright container">
      <h3>Quizzes</h3>
      {store.quizzes.map(q => (<h2>{q.name}</h2>))}
    </section>
  );
});
