import { component$, useStore } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { supabase } from "~/lib/db";
import { Round } from "~/lib/models/quiz-save.model";

interface QuizGame {
  id: string;
  name: string;
  join_code: string;
  rounds: Round[];
  answers: string[];
}

export const useLoadQuiz = routeLoader$(async (re) => {
  const gameId = re.params.code;
  const { data } = await supabase
    .from("game")
    .select()
    .eq("id", gameId)
    .single();
  return data as QuizGame;
});

export default component$(() => {
  const loadedQuiz = useLoadQuiz();
  const quiz = useStore(loadedQuiz.value);
  return (
    <>
      <h1>{quiz.name}</h1>
      <p>Join Code: <b>{quiz.join_code}</b></p>
      <ul>
        {quiz.rounds.map((r, index) => (
          <>
            <h2>Round {index + 1}: {r.name}</h2>
            {r.questions.map(q => <p>{q}</p>)}
          </>
        ))}
      </ul>
    </>
  );
});
