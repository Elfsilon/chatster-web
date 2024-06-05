import { StoreApi, UseBoundStore, create } from 'zustand'
import { ChatService } from '../services/Chat.Service'
import { errorMessageFrom } from './utils'
import { StateStatus } from './state_status'

type ChatState = {
  status: StateStatus
  localStream: MediaStream | null
  remoteStream: MediaStream | null
}

export class ChatController {
  private store: UseBoundStore<StoreApi<ChatState>>

  get useChatState(): UseBoundStore<StoreApi<ChatState>> {
    return this.store
  }

  constructor(private service: ChatService) {
    this.store = create<ChatState>(() => ({
      status: StateStatus.idle(),
      localStream: null,
      remoteStream: null,
    }))

    this.service.listenStreams('chat-remote-listener', (stream: MediaStream | null) => {
      this.store.setState(() => ({ remoteStream: stream }))
    })
  }

  public async establishPeerConnection(localStream: MediaStream) {
    try {
      this.store.setState(() => ({ status: StateStatus.pending(), localStream }))

      await this.service.establishPeerConnection(localStream)

      this.store.setState(() => ({ status: StateStatus.pending() }))
    } catch (err) {
      const message = errorMessageFrom(err)
      this.store.setState(() => ({ status: StateStatus.error(message) }))
    }
  }
}
