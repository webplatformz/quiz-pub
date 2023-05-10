import { component$, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  const store = useStore({ text: "Hi!", kvID: "" });
  
  return (
    <>
      <span>KV Quiz ID: {store.kvID}</span>

      <input value={store.text} onInput$={(e) => {
        console.log(store.text);
        store.text = (e.target as HTMLInputElement).value;
      }} style="color:black;" />

      <input value={store.kvID} onInput$={(e) => {
        console.log(store.kvID);
        store.kvID = (e.target as HTMLInputElement).value;
      }} style="color:black;" />

      <button onClick$={async () => {
        try {
          const newId = await fetch("/quiz", {
            method: "PUT",
            body: JSON.stringify({
              quiz: { quiz: "bitch" }
            })
          }).then(res => res.text());
          store.kvID = newId;
          localStorage.setItem("quiz", newId);
        } catch (e) {
          console.log(e);
        }
      }}>
        Create Quiz
      </button>
      {store.kvID !== "" && <>
        <button onClick$={async () => {
          try {
            const quiz = await fetch(`/quiz?id=${store.kvID}`, {
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
            const ws = new WebSocket(`wss://${window.location.host}/quiz/${store.kvID}`);
            ws.onmessage = (msg) => {
              console.log(msg);
            };
            ws.onopen = () => {
              ws.send(JSON.stringify({ message: "whatup" }));
            };

            ws.onclose = () => {
              console.log("closed");
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
