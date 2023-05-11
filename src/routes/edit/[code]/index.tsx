import { component$, useStore, useStyles$ } from "@builder.io/qwik";
import { Form, routeAction$, useLocation, z, zod$ } from "@builder.io/qwik-city";

import editStyles from "../edit.module.css";
import styles from "../styles.css?inline";
import type { QuizSave } from "~/lib/models/quiz-save.model";
import { supabase } from "~/lib/db";
import QuizForm from "~/lib/quiz-form";

export const useSubmitFormAction = routeAction$(
    async (props) => {
      console.log('props', props);
      const newQuiz = JSON.parse(props.quizState);
      const {data} = await supabase
        .from('quiz')
        .insert(newQuiz)
        .select()
        .single();
      console.log(data);
      return {
        success: true,
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
            name: "Round - 1",
            questions: ["Question 1"]
        }]
    } as QuizSave;
});

export default component$(() => {
    useStyles$(styles);
    const loc = useLocation();
    console.log(loc.params.code);
    const action = useSubmitFormAction();
    const quiz = useStore(quizInitializier(), {deep: true});

    return (
     <QuizForm quiz={quiz} save={action}/>
    );
});

interface QuizProps {
    quiz: QuizSave;
}

export const AddRound = component$<QuizProps>((props) => {
    const quiz = props.quiz;
    return (
        <button type="button"
                onClick$={() => {
                    quiz.rounds.push({
                        name: "Round - " + (quiz.rounds.length + 1),
                        questions: ["Question 1"]
                    })
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

export const QuestionList = component$<QuestionProps>((props) => {
    const quiz = props.quiz;
    const rIndex: number = props.roundIndex;
    const qIndex: number = props.questionIndex;
    const question: string = props.question;
    return (
        <>
            <label for={`round-${rIndex}-Q-${qIndex}`}>
                {`Question ${qIndex + 1}`}
            </label>
            <input type="text"
                   id={`round-${rIndex}-Q-${qIndex}`}
                   name={`round-${rIndex}-Q-${qIndex}`}
                   placeholder={question}
                   class={editStyles.input}
                   onInput$={(e: any) => {
                       const round = quiz.rounds[rIndex];
                       round.questions = round.questions.map((q, i) => (i === qIndex ? e.target.value : q));
                       quiz.rounds = quiz.rounds.map((r, i) => (i === rIndex ? round : r));
                   }}
            />
        </>
    );
});

interface RoundProps {
    quiz: QuizSave;
    roundIndex: number
    roundName: string
}

export const RoundList = component$<RoundProps>((props) => {
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
                placeholder={roundName}
                class={editStyles.input}
                onInput$={(e: any) => {
                    const round = quiz.rounds[rIndex];
                    round.name = e.target.value;
                    quiz.rounds = quiz.rounds.map((r, i) => (i === rIndex ? round : r));
                }}
            />

            {(quiz.rounds[rIndex].questions || []).map((question, qIndex) => (
                <QuestionList
                    key={`round-${rIndex}-Q-${qIndex}`}
                    quiz={quiz}
                    questionIndex={qIndex}
                    roundIndex={rIndex}
                    question={`Question ${qIndex + 1}`}
                />
            ))}
            <button
                type="button"
                onClick$={() => {
                    const round = quiz.rounds[rIndex];
                    round.questions = [...round.questions, `Question ${round.questions.length + 1}`];
                    quiz.rounds = quiz.rounds.map((r, i) => (i === rIndex ? round : r));
                }}
            >
                Add Question
            </button>
            <div></div>
        </li>
    );
});
