class ChatRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.sessions = [];
  }

  async fetch(request, env) {
    const pair = new WebSocketPair();
    await this.handleSession(pair[1]);
    return new Response(null, { status: 101, webSocket: pair[0] });
  }

  async handleSession(webSocket) {
    webSocket.accept();
    this.sessions.push(webSocket);

    webSocket.onmessage = msg => {
      webSocket.send(`${this.state.storage.get('quiz')} ${msg.data}`);
    };
  }
}

export { ChatRoom };