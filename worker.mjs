const fetch = async (request, env) => {
  if (request.headers.get("Upgrade") === "websocket") {
    const room = env.rooms.get("YOIHO");
    return room.fetch();
  }
  return new Response("shit", { status: 444 });
};

export default { fetch };
