import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { QuizOverviewBox } from "~/lib/quiz-overview-box";

export type StoredQuiz = {
    id: string,
    lastSaved: string,
    name: string,
    rounds: string | number,
    questions: string | number,
}

export default component$(() => {
    const store = useStore({ quizzes: [] });
    useVisibleTask$(() => {
        store.quizzes = JSON.parse(localStorage.getItem("quizzes") ?? "[]");
    });
    return <div class="section bright container">
        <div class="flex flex-row justify-between mb-4">
            <h3>Quizzes</h3>
            <a href={"/edit"} class="button">Create Quiz</a>
        </div>

        <div class="flex flex-col gap-4">
            {
                store.quizzes.map((game: StoredQuiz, index: number) => (
                    <QuizOverviewBox {...game} key={index} />
                ))
            }
        </div>
    </div>;
});
