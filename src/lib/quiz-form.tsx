import { component$ } from "@builder.io/qwik";
import { ActionStore, Form } from "@builder.io/qwik-city";
import editStyles from "~/routes/edit/edit.module.css";
import { AddRound, RoundList } from "~/routes/edit/[code]";
import { QuizSave } from "~/lib/models/quiz-save.model";

export default component$((props: {quiz: QuizSave, save: ActionStore<unknown, {quizState: any}, boolean>}) => {
  const quiz = props.quiz;
  return (
    <section class="section bright container">
      <h3>Quiz: «{quiz.name}»</h3>
      <div class="container container-center">
        <Form action={props.save} class={editStyles.createQuiz}>
          <input
            type="text"
            name="name"
            value={quiz.name}
            placeholder="Quiz name"
            class={editStyles.input}
            onInput$={(e: any) => quiz.name = e.target.value}
          />

          {quiz.rounds.length && (
            <ul class={editStyles.round}>
              {quiz.rounds.map((round, index) => (
                <RoundList
                  key={`round-${index}`}
                  quiz={quiz}
                  roundIndex={index}
                  roundName={round.name}
                />
              ))}
            </ul>
          )}

          <AddRound quiz={quiz}/>

          <input type="hidden" name="quizState" value={JSON.stringify(quiz)}/>
          <button type="submit">save</button>
        </Form>
      </div>
    </section>
  )
})