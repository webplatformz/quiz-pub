import { $, component$, useTaskQrl } from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
import { createServerClient } from "supabase-auth-helpers-qwik";
import { supabase } from "~/lib/db";

const useDBTest = routeLoader$(async (requestEv) => {
  const supabaseClient = createServerClient(
    requestEv.env.get("PUBLIC_SUPABASE_URL")!,
    requestEv.env.get("PUBLIC_SUPABASE_ANON_KEY")!,
    requestEv
  );
  const { data } = await supabaseClient.from("game").select("*");
  return { data };
});

export default component$(() => {
  const code = useLocation().params.code;
  supabase
    .channel("changes")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "game", filter: `invite_code=eq.${code}` },
      payload => console.log(payload))
    .subscribe();
  const games = useDBTest();

  const updateGameName = $(async (ev, game) => {
    await supabase
      .from("game")
      .update({name: ev.target.value})
      .eq("id", game.id);
    console.log('UGN', game.id, ev.target.value);
  });

  return (
    <>
      <h1>ROOM: {code}</h1>
      {games.value.data?.map(game => (
        <>
          <h2>Game: {game.name}</h2>
          <input class="text-black" type="text" value={game.name} onInput$={ev => updateGameName(ev, game)} />
        </>
      ))}
    </>
  );
});