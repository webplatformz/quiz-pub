import { ChatRoom } from "./ChatRoom.js";

const fetch = async (request, env) => {
  if (request.headers.get("Upgrade") !== "websocket") {
    return new Response("wtf are you doing", { status: 400 });
  }
  return new Response(request);
  // const url = new URL(request.url);
  // const path = url.pathname.slice(1).split("/");
  //
  // if (!path[0]) {
  //   // Serve our HTML at the root path.
  //   return new Response("", { status: 400 });
  // }
  //
  // switch (path[0]) {
  //   case "api":
  //     return handleApiRequest(path.slice(1), request, env);
  //
  //   default:
  //     return new Response("Not found", { status: 404 });
  // }
};

const handleApiRequest = (path, request, env) => {
  if (request.headers.get("Upgrade") === "websocket") {
    const room = env.rooms.get("YOIHO");
    return room.fetch();
  }
  const id = env.rooms.newUniqueId();
  return new Response(id.toString());
};


export { ChatRoom };
export default { fetch };
