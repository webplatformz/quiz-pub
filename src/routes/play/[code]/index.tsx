import type { NoSerialize } from "@builder.io/qwik";
import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import type { StoredQuiz } from "~/routes/all-games";

type Message = {
    type: "PLAYER_UPDATE",
    value: string[]
};

export default component$(() => {
    const location = useLocation();
    const store = useStore<{ ws: NoSerialize<WebSocket | undefined> }>({ ws: undefined });
    const quiz = useStore<{ players: string[] }>({ players: [] });

    useVisibleTask$(async ({ cleanup }) => {
        const join = (): WebSocket | undefined => {
            console.log("join");
            if (store.ws && store.ws.readyState !== WebSocket.CLOSED) {
                return;
            }
            console.log("join 2");
            const code = location.params.code;
            const name = new URL(location.url).searchParams.get("name");
            if (!name) {
                return;
            }
            const quizzes: StoredQuiz[] = JSON.parse(localStorage.getItem("quizzes") ?? "[]");
            const quiz = quizzes.find(quiz => quiz.id === code);

            try {
                const auth = quiz ? `&auth=${quiz.adminToken}` : "";
                return new WebSocket(`wss://${window.location.host}/joinquiz/${code}?name=${name}${auth}`);
            } catch (e) {
                console.log(e);
            }
        };

        const addHandlers = (ws: WebSocket) => {
            ws.onmessage = (msg) => {
                try {
                    const message: Message = JSON.parse(msg.data);
                    switch (message.type) {
                        case "PLAYER_UPDATE": {
                            quiz.players = message.value;
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            };
            ws.onerror = (error) => {
                console.log(error);
            };
            ws.onclose = async () => {
                console.log("close");
                const newWs = await join();
                if (!newWs) {
                    console.log("fuck ws couldnt be opened");
                    return;
                }
                addHandlers(newWs);
            };
        };

        const ws = join();
        if (!ws) {
            console.log("fuck ws couldnt be openend");
            return;
        }
        addHandlers(ws);
        cleanup(() => {
            ws.close();
        });
    });

    return <div>
        <span>Connected: {`${store.ws?.readyState}`}</span>
        <ul>{
            quiz.players.map((player, index) => {
                return <li key={index}>{player}</li>;
            })
        }</ul>
    </div>;
});