import { $, component$, createContextId, useComputed$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link, useNavigate } from "@builder.io/qwik-city";

export const QuizContext = createContextId<{ currentQuiz: string }>(
    "quiz.context"
);

export default component$(() => {
    const joinCode = useSignal("");
    const nav = useNavigate();
    const isInvalidJoinCode = useComputed$(() => joinCode.value === "" || joinCode.value.length !== 6);
    const playQuiz = $(async () => {
        if (isInvalidJoinCode.value) {
            return;
        }
        return nav(`/play/${joinCode.value}`);
    });
    return (
        <div class="h-screen flex flex-col pt-[30vh]">
            <div class="flex flex-col justify-center w-full max-w-lg gap-4 mx-auto">
                <div class="flex flex-row justify-between gap-4 ">
                    <input value={joinCode.value} onInput$={(e) => {
                        joinCode.value = (e.target as HTMLInputElement).value;
                    }} class="text-black p-2 rounded w-full" placeholder="Join Code" />
                    <button class="block w-24 disabled:bg-gray-600" disabled={isInvalidJoinCode.value}
                            onClick$={playQuiz}>
                        Join
                    </button>
                </div>
                <div class="flex flex-row justify-between gap-4">
                    <Link href={"/edit"} class="button w-full">Create Quiz</Link>
                    <Link href={"/all-games"} class="button w-full">My Quizzes</Link>
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = {
    title: "Welcome to Qwik",
    meta: [
        {
            name: "description",
            content: "Qwik site description"
        }
    ]
};
