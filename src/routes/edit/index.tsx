import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { $, component$, useSignal, useStore, useStyles$, useVisibleTask$ } from "@builder.io/qwik";

import editStyles from "./edit.module.css";
import styles from "./styles.css?inline";
import type { QuizSave } from "~/lib/models/quiz-save.model";
import type { StoredQuiz } from "~/routes/all-games";

export const quizInitializer = (() => {
    return {
        name: "",
        rounds: [{
            name: "",
            questions: [""]
        }],
        date: new Date().getTime()
    } as QuizSave;
});

export const useSavedQuiz = routeLoader$(async (requestEvent) => {
    const searchParams = requestEvent.url.searchParams;
    const code = searchParams.get("code");
    if (!code) {
        return quizInitializer();
    }

    const quiz: Omit<QuizSave, "id"> = await fetch(`https://quiz-pub.pages.dev/api/quiz?id=${code}`, {
        method: "GET"
    }).then(res => res.json());
    return { id: code, ...quiz };
});

export default component$(() => {
    useStyles$(styles);
    const savedQuiz = useSavedQuiz();
    const quiz = useStore(savedQuiz.value, { deep: true });
    const adminToken = useSignal("");
    useVisibleTask$(() => {
        const quizzes: StoredQuiz[] = JSON.parse(localStorage.getItem("quizzes") ?? "[]");
        const sq = quizzes.find(storedQuiz => storedQuiz.id === quiz.id);
        if (!sq) {
            return;
        }
        adminToken.value = sq.adminToken;
    });

    const save = $(async () => {
        try {
            const newQuizId: { uuid: string, adminToken: string } = await fetch("/api/quiz", {
                method: "PUT",
                headers: {
                    authorization: quiz.adminToken ?? ""
                },
                body: JSON.stringify(quiz)
            }).then(res => res.json());
            const newQuiz = {
                id: newQuizId.uuid,
                name: quiz.name,
                rounds: quiz.rounds.length,
                questions: quiz.rounds.reduce((prev, current) => prev + current.questions.length, 0),
                lastSaved: quiz.date,
                adminToken: newQuizId.adminToken
            };
            const quizzes = JSON.parse(localStorage.getItem("quizzes") ?? "[]");
            const quizToReplace = quizzes.find((lsQuiz: StoredQuiz) => lsQuiz.id === newQuiz.id);
            if (quizToReplace) {
                Object.assign(quizToReplace, newQuiz);
            } else {
                quizzes.push(newQuiz);
            }
            localStorage.setItem("quizzes", JSON.stringify(quizzes));
        } catch (e) {
            console.log(e);
        }

    });

    return (
        <section class="section bright container">
            <h3>Quiz{quiz.id && ` (id: ${quiz.id})`}: «{quiz.name}»</h3>
            <div class="container container-center">
                <div class={editStyles.createQuiz}>
                    <input
                        type="text"
                        name="name"
                        value={quiz.name}
                        placeholder="Quiz name"
                        class={editStyles.input}
                        onInput$={(e: any) => quiz.name = e.target.value}
                    />

                    {quiz?.rounds?.length && (
                        <ul class={editStyles.round}>
                            {quiz.rounds.map((round, index) => (
                                <RoundList
                                    key={`round-${index}`}
                                    quiz={quiz}
                                    roundIndex={index}
                                />
                            ))}
                        </ul>
                    )}

                    <AddRound quiz={quiz} />
                    <button type="submit" onClick$={save}>save</button>
                </div>
            </div>
        </section>
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
}

export const QuestionList = component$<QuestionProps>((props) => {
    const quiz = props.quiz;
    const rIndex: number = props.roundIndex;
    const qIndex: number = props.questionIndex;
    const round = quiz.rounds[rIndex];
    return (
        <>
            <label for={`round-${rIndex}-Q-${qIndex}`}>
                {`Question ${qIndex + 1}`}
            </label>
            <input type="text"
                   id={`round-${rIndex}-Q-${qIndex}`}
                   placeholder={`Question ${qIndex + 1}`}
                   value={round.questions[qIndex]}
                   class={editStyles.input}
                   onInput$={(e: any) => {
                       round.questions = round.questions.map((q, i) => (i === qIndex ? e.target.value : q));
                       quiz.rounds = quiz.rounds.map((r, i) => (i === rIndex ? round : r));
                   }}
            />
            <button
                type="button"
                onClick$={() => {
                    round.questions = (round.questions || []).filter((q, i) => i !== qIndex);
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
}

export const RoundList = component$<RoundProps>((props) => {
    const quiz = props.quiz;
    const rIndex: number = props.roundIndex;
    return (
        <li>
            <label for={`round-${props.roundIndex}`}>
                {`Round ${props.roundIndex + 1}`}
            </label>
            <input
                type="text"
                id={`round-${rIndex}`}
                placeholder={`Round ${rIndex + 1}`}
                value={quiz.rounds[rIndex].name}
                class={editStyles.input}
                onInput$={(e: any) => {
                    const round = quiz.rounds[rIndex];
                    round.name = e.target.value;
                    quiz.rounds = quiz.rounds.map((r, i) => (i === rIndex ? round : r));
                }}
            />
            <button
                type="button"
                onClick$={() => {
                    quiz.rounds = quiz.rounds.filter((r, i) => i !== rIndex);
                }}
            >
                X
            </button>

            {(quiz.rounds[rIndex].questions || []).map((question, qIndex) => (
                <QuestionList
                    key={`round-${rIndex}-Q-${qIndex}`}
                    quiz={quiz}
                    questionIndex={qIndex}
                    roundIndex={rIndex}
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
            <div></div>
            <div></div>
        </li>
    );
});

export const head: DocumentHead = {
    title: "Quiz Pub"
};
