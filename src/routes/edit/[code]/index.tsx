import { component$, useStore, useStyles$ } from "@builder.io/qwik";
import { routeAction$, routeLoader$, z, zod$ } from "@builder.io/qwik-city";
import styles from "../styles.css?inline";
import QuizForm from "~/lib/quiz-form";
import { supabase } from "~/lib/db";
import { QuizSave } from "~/lib/models/quiz-save.model";

export const useLoadQuiz = routeLoader$(async (props) => {
  return (await supabase
    .from("quiz")
    .select()
    .eq("id", props.params.code)
    .single())
    .data as QuizSave;
});

export const useSubmitFormAction = routeAction$(
  async (props) => {
    const newQuiz = JSON.parse(props.quizState);
    await supabase
      .from("quiz")
      .update(newQuiz)
      .eq("id", newQuiz.id);
    return {
      success: true
    };
  },
  zod$({
    quizState: z.any()
  })
);

export default component$(() => {
  useStyles$(styles);
  const loadQuiz = useLoadQuiz();
  const quiz = useStore(loadQuiz.value);
  console.log(quiz);
  const action = useSubmitFormAction();

  return (
    <QuizForm quiz={quiz} save={action} />
  );
});
