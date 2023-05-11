import { component$ } from "@builder.io/qwik";
import { ActionStore, Link, routeAction$ } from "@builder.io/qwik-city";
import { StoredQuiz } from "~/routes/all-games";
import { supabase } from "~/lib/db";
import { QuizSave } from "~/lib/models/quiz-save.model";
import { randomId } from "~/lib/utils/random-id";

export const QuizOverviewBox = component$<StoredQuiz & {run: ActionStore<any, any>}>(({ id, lastSaved, name, rounds, questions , run}) => {
  return <section class="w-full p-4 bg-slate-800 rounded flex flex-col gap-2">
    <span class="text-2xl font-bold">{name}</span>
    <span>Rounds: {rounds}</span>
    <span>Questions: {questions}</span>
    <span>{lastSaved}</span>
    <div class="flex flex-row w-full justify-between gap-4 mt-2">
      <Link class="button w-1/3 p-3" href={`/edit/${id}`}>Edit</Link>
      <button onClick$={() => run.submit({id})} class="w-1/3 p-3">Run</button>
      <button class="w-1/3 p-3 bg-red-700">Delete</button>
    </div>
  </section>;
});