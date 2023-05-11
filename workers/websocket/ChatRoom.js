class ChatRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.sessions = [];
    this.count = 0;
  }

  async fetch(request, env) {
    const pair = new WebSocketPair();
    this.count = this.count + 1;
    await this.handleSession(pair[1]);
    return new Response(null, { status: 101, webSocket: pair[0] });
  }

  async handleSession(webSocket) {
    webSocket.accept();
    this.sessions.push(webSocket);

    webSocket.onmessage = msg => {
      webSocket.send(`${this.count} ${msg.data}`);
    };
  }
}

export { ChatRoom };