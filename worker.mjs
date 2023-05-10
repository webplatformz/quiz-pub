import { ChatRoom } from "./ChatRoom.js";

const fetch = async (request, env, ctx) => {
  console.log(ctx);
  const url = new URL(request.url);
  const path = url.pathname.slice(1).split("/");

  if (!path[0]) {
    // Serve our HTML at the root path.
    return new Response("", { status: 400 });
  }

  switch (path[0]) {
    case "api":
      return handleApiRequest(path.slice(1), request, env);

    default:
      return new Response("Not found", { status: 404 });
  }
};

const handleApiRequest = (path, request, env) => {
  if (request.headers.get("Upgrade") === "websocket") {
    const room = env.rooms.get("YOIHO");
    return room.fetch();
  }
  const id = env.rooms.newUniqueId();
  return new Response(id.toString());
};

const test = () => {
  throw new Error("well shit");
}

export { ChatRoom };
export default { fetch, test };
