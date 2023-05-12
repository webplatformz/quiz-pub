import { $, component$, PropFunction, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { supabase } from "~/lib/db";
import { Round } from "~/lib/models/quiz-save.model";

interface QuizPlayerGame {
  name: string;
  join_code: string;
  rounds: Round[];
}

export const useLoadQuiz = routeLoader$(async (re) => {
  const gameId = re.params.code;
  const { data } = await supabase
    .from("game")
    .select("name,join_code,rounds")
    .eq("join_code", gameId)
    .single();
  return data as QuizPlayerGame;
});

export default component$(() => {
  const loadedQuiz = useLoadQuiz();
  const name = useSignal('');
  const quiz = useStore(loadedQuiz.value);
  useVisibleTask$(() => {
    const storedName = localStorage.getItem(quiz.join_code);
    if (storedName) {
      name.value = storedName;
    }
  })
  const setNameAction = $((newName: string) => {
    name.value = newName
    localStorage.setItem(quiz.join_code, name.value);
  });
  return (
    <>
      <h1>{quiz.name}</h1>
      <p>Join Code: <b>{quiz.join_code}</b></p>
      {name.value}
      {!name.value ? (
        <NameForm name={name.value} setName={setNameAction}/>
      ) : (
        <ul>
          {quiz.rounds.map((r, index) => (
            <li key={r.name}>
              <h2>Round {index + 1}: {r.name}</h2>
              {r.questions.map(q => (
                <div>
                  <p>{q}</p>
                  <input type="text" class="text-black" />
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </>
  );
});

const NameForm = component$((props: { name: string, setName: PropFunction<(newName: string) => unknown> }) => {
  const name = useSignal(props.name);
  return <section>
    <input type="text" placeholder="name" class="text-black" bind:value={name} />
    <button type="submit" onClick$={() => props.setName(name.value)}>Join</button>
  </section>;
});