import { component$ } from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "supabase-auth-helpers-qwik";

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
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  supabase
    .channel("changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "game" }, payload => console.log(payload))
    .subscribe();
  const games = useDBTest();
  const code = useLocation().params.code;
  return (
    <>
      <h1>ROOM: {code}</h1>
      {games.value.data?.map(game => (
        <h2>Game: {game.name}</h2>
      ))}
    </>
  );
});