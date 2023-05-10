import { component$, useSignal, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  const kvID = useSignal<string | undefined>();
  const doID = useSignal<string | undefined>();
  const store = useStore({ text: "Hi!" });

  return (
    <>
      <span>KV Quiz ID: {kvID.value}</span>
      <span>DO Quiz ID: {doID.value}</span>

      <input value={store.text} onInput$={(e) => {
        console.log(store.text);
        store.text = (e.target as HTMLInputElement).value;
      }} style="color:black;" />

      <button onClick$={async () => {
        try {
          const newId = await fetch("/quiz", {
            method: "PUT",
            body: JSON.stringify({
              quiz: { quiz: "bitch" }
            })
          }).then(res => res.text());
          kvID.value = newId;
          localStorage.setItem("quiz", newId);
        } catch (e) {
          console.log(e);
        }
      }}>
        Create Quiz
      </button>
      {kvID.value && <>
        <button onClick$={async () => {
          try {
            const quiz = await fetch(`/quiz?id=${kvID.value}`, {
              method: "GET"
            }).then(res => res.text());
            store.text = quiz;
          } catch (e) {
            console.log(e);
          }
        }}>
          Load Quiz
        </button>
        <button onClick$={async () => {
          try {
            const ws = new WebSocket(`wss://${window.location.host}/quiz/${kvID.value}`);
            ws.onmessage = (msg) => {
              console.log(msg);
            };
            ws.onopen = () => {
              ws.send(JSON.stringify({ message: "whatup" }));
              setTimeout(() => {
                ws.close();
                console.log("close it");
              }, 5000);
            };
          } catch (e) {
            console.log(e);
          }
        }}>
          Run Quiz
        </button>
      </>}
    </>
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
