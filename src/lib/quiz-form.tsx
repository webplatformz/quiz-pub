import { component$ } from "@builder.io/qwik";
import { ActionStore, Form } from "@builder.io/qwik-city";
import editStyles from "~/routes/edit/edit.module.css";
import { QuizSave } from "~/lib/models/quiz-save.model";

export default component$((props: { quiz: QuizSave, save: ActionStore<unknown, { quizState: any }, boolean> }) => {
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

          <AddRound quiz={quiz} />

          <input type="hidden" name="quizState" value={JSON.stringify(quiz)} />
          <button type="submit">save</button>
        </Form>
      </div>
    </section>
  );
});

interface QuizProps {
  quiz: QuizSave;
}

const AddRound = component$<QuizProps>((props) => {
  const quiz = props.quiz;
  return (
    <button type="button"
            onClick$={() => {
              quiz.rounds.push({
                name: "",
                questions: [""]
              });
            }}>
      Add Round
    </button>
  );
});

interface QuestionProps {
  quiz: QuizSave;
  roundIndex: number;
  questionIndex: number;
  question: string;
}

const QuestionList = component$<QuestionProps>((props) => {
  const quiz = props.quiz;
  const rIndex: number = props.roundIndex;
  const qIndex: number = props.questionIndex;
  const round = quiz.rounds[rIndex];
  const question: string = props.question;
  return (
    <>
      <label for={`round-${rIndex}-Q-${qIndex}`}>
        {`Question ${qIndex + 1}`}
      </label>
      <input type="text"
             id={`round-${rIndex}-Q-${qIndex}`}
             name={`round-${rIndex}-Q-${qIndex}`}
             placeholder={`Question ${qIndex + 1}`}
             value={question}
             class={editStyles.input}
             onInput$={(e: any) => {
               round.questions = round.questions.map((q, i) => (i === qIndex ? e.target.value : q));
               quiz.rounds = quiz.rounds.map((r, i) => (i === rIndex ? round : r));
             }}
      />
      <button
        type="button"
        onClick$={() => {
          console.log("deleting BEFORE", qIndex, question, round.questions);
          round.questions = (round.questions || []).filter((q, i) => i !== qIndex);
          console.log("deleting AFTER", qIndex, question, round.questions);
          quiz.rounds = quiz.rounds.map((r, i) => (i === rIndex ? round : r));
        }}
      >
        X
      </button>
    </>
  );
});

interface RoundProps {
  quiz: QuizSave;
  roundIndex: number;
  roundName: string;
}

const RoundList = component$<RoundProps>((props) => {
  const quiz = props.quiz;
  const rIndex: number = props.roundIndex;
  const roundName: string = props.roundName;
  return (
    <li>
      <label for={`round-${props.roundIndex}`}>
        {`Round ${props.roundIndex + 1}`}
      </label>
      <input
        type="text"
        id={`round-${rIndex}`}
        name={`round-${rIndex}`}
        placeholder={`Round ${rIndex + 1}`}
        class={editStyles.input}
        onInput$={(e: any) => {
          const round = quiz.rounds[rIndex];
          round.name = e.target.value;
          quiz.rounds = quiz.rounds.map((r, i) => (i === rIndex ? round : r));
        }}
      />
      <div></div>

      {(quiz.rounds[rIndex].questions || []).map((question, qIndex) => (
        <QuestionList
          key={`round-${rIndex}-Q-${qIndex}`}
          quiz={quiz}
          questionIndex={qIndex}
          roundIndex={rIndex}
          question={question}
        />
      ))}
      <button
        type="button"
        onClick$={() => {
          const round = quiz.rounds[rIndex];
          round.questions = [...round.questions, ""];
          quiz.rounds = quiz.rounds.map((r, i) => (i === rIndex ? round : r));
        }}
      >
        Add Question
      </button>
    </li>
  );
});
