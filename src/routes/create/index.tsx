import { component$, useStore } from "@builder.io/qwik";
import QuizForm from "~/lib/quiz-form";
import { routeAction$, z, zod$ } from "@builder.io/qwik-city";
import { supabase } from "~/lib/db";
import { QuizSave } from "~/lib/models/quiz-save.model";

export const useSubmitFormAction = routeAction$(
  async (props) => {
    const newQuiz = JSON.parse(props.quizState);
    const { data } = await supabase
      .from("quiz")
      .insert(newQuiz)
      .select()
      .single();
    console.log(data);
    if (data) {
      return {
        success: true,
        redirect: `/edit/${data.id}`
      };
    }
    return {
      success: false
    };
  },
  zod$({
    quizState: z.any()
  })
);

export const quizInitializier = (() => {
  return {
    name: "",
    rounds: [{
      name: "",
      questions: [""]
    }]
  } as QuizSave;
});

export default component$(() => {
  const saveAction = useSubmitFormAction();
  const quiz = useStore(quizInitializier(), { deep: true });
  return (
    <QuizForm quiz={quiz} save={saveAction} />
  );
});