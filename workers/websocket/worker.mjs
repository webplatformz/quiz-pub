import { ChatRoom } from "./ChatRoom.js";

const fetch = async (request, env) => {
  if (request.headers.get("Upgrade") !== "websocket") {
    return new Response("wtf are you doing", { status: 400 });
  }
  const url = new URL(request.url);
  const path = url.pathname.slice(1).split("/");
  if (!path[1]) {
    return new Response("wtf are you doing 2", { status: 400 });
  }
  const id = env.rooms.idFromName(path[1]);
  const room = env.rooms.get(id);
  return room.fetch(request, env);
};

export { ChatRoom };
export default { fetch };