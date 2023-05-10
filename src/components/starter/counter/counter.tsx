import { component$, useSignal } from "@builder.io/qwik";
import styles from "./counter.module.css";

export default component$(() => {
  const id = useSignal<string | undefined>();
  return (
    <div class={styles["counter-wrapper"]}>
      <button class="button-dark button-small" onClick$={async () => {
        try {
          const newId = await fetch("/api", {
            method: "PUT",
            body: JSON.stringify({
              quiz: { quiz: "bitch" }
            })
          }).then(res => res.text());
          id.value = newId;
          localStorage.setItem("quiz", newId);
        } catch (e) {
          console.log(e);
        }
      }}>
        -
      </button>
      {id.value}
      {id.value && <button class="button-dark button-small" onClick$={async () => {
        try {
          const quiz = await fetch(`/api?id=${id.value}`, {
            method: "GET"
          }).then(res => res.text());
          console.log(quiz);
        } catch (e) {
          console.log(e);
        }
      }}>
        +
      </button>}
    </div>
  );
});
