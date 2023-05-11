import { component$, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  const store = useStore({ joinCode: "" });

  return (
    <div class='h-screen flex flex-col pt-[30vh]'>
      <div class="flex flex-col justify-center w-full max-w-lg gap-4 mx-auto">
        <div class="flex flex-row justify-between gap-4 ">
          <input value={store.joinCode} onInput$={(e) => {
            store.joinCode = (e.target as HTMLInputElement).value;
          }} class="text-black p-2 rounded w-full" placeholder='Join Code' />
          <button class="block w-24">
            Join
          </button>
        </div>
        <div class="flex flex-row justify-between gap-4">
          <Link href={"/create"} class="button w-full">Create Quiz</Link>
          <Link href={"/all-games"} class="button w-full">My Quizzes</Link>
        </div>
      </div>

      {/*<button onClick$={async () => {*/}
      {/*  try {*/}
      {/*    const ws = new WebSocket(`wss://${window.location.host}/quiz/${store.joinCode}`);*/}
      {/*    ws.onmessage = (msg) => {*/}
      {/*      console.log(msg);*/}
      {/*    };*/}
      {/*    ws.onopen = () => {*/}
      {/*      ws.send(JSON.stringify({ message: "whatup" }));*/}
      {/*    };*/}

      {/*    ws.onclose = () => {*/}
      {/*      console.log("closed");*/}
      {/*    };*/}
      {/*  } catch (e) {*/}
      {/*    console.log(e);*/}
      {/*  }*/}
      {/*}}>*/}
      {/*  Join Quiz*/}
      {/*</button>*/}
      {/*create game*/}
      {/*see all games*/}
      {/*run a game -> host*/}
      {/*join a game -> player*/}
      {/*<span>KV Quiz ID: {store.kvID}</span>*/}

      {/*<input value={store.text} onInput$={(e) => {*/}
      {/*  console.log(store.text);*/}
      {/*  store.text = (e.target as HTMLInputElement).value;*/}
      {/*}} style="color:black;" />*/}

      {/*<input value={store.kvID} onInput$={(e) => {*/}
      {/*  console.log(store.kvID);*/}
      {/*  store.kvID = (e.target as HTMLInputElement).value;*/}
      {/*}} style="color:black;" />*/}


      {/*{store.kvID !== "" && <>*/}
      {/*  <button onClick$={async () => {*/}
      {/*    try {*/}
      {/*      const quiz = await fetch(`/quiz?id=${store.kvID}`, {*/}
      {/*        method: "GET"*/}
      {/*      }).then(res => res.text());*/}
      {/*      store.text = quiz;*/}
      {/*    } catch (e) {*/}
      {/*      console.log(e);*/}
      {/*    }*/}
      {/*  }}>*/}
      {/*    Load Quiz*/}
      {/*  </button>*/}
      {/*  <button onClick$={async () => {*/}
      {/*    try {*/}
      {/*      const ws = new WebSocket(`wss://${window.location.host}/quiz/${store.kvID}`);*/}
      {/*      ws.onmessage = (msg) => {*/}
      {/*        console.log(msg);*/}
      {/*      };*/}
      {/*      ws.onopen = () => {*/}
      {/*        ws.send(JSON.stringify({ message: "whatup" }));*/}
      {/*      };*/}

      {/*      ws.onclose = () => {*/}
      {/*        console.log("closed");*/}
      {/*      };*/}
      {/*    } catch (e) {*/}
      {/*      console.log(e);*/}
      {/*    }*/}
      {/*  }}>*/}
      {/*    Run Quiz*/}
      {/*  </button>*/}
      {/*</>}*/}
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
