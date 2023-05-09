import {fetch} from 'dist/_worker';

class ChatRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.sessions = [];
  }

  async fetch() {
    const pair = new WebSocketPair();
    await this.handleSession(pair[1]);
    return new Response(null, { status: 101, webSocket: pair[0] });
  }

  async handleSession(webSocket) {
    // @ts-ignore
    webSocket.accept();
    this.sessions.push(webSocket);

    webSocket.onmessage = msg => {
      webSocket.send(msg.data);
    }
  }
}

export { fetch, ChatRoom };