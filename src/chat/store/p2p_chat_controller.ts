import { StoreApi, UseBoundStore, create } from 'zustand'
import { ChatService } from '../services/Chat.Service'
import { errorMessageFrom } from './utils'
import { StateStatus } from './state_status'

type ChatState = {
  creatingChatStatus: StateStatus
  connectionStatus: StateStatus
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
      creatingChatStatus: StateStatus.idle(),
      connectionStatus: StateStatus.idle(),
      localStream: null,
      remoteStream: null,
    }))

    this.service.listenStreams('chat-remote-listener', (stream: MediaStream | null) => {
      this.store.setState(() => ({ remoteStream: stream }))
    })
  }

  public async create(chatName: string): Promise<string | undefined> {
    let connectionToken: string | undefined
    try {
      this.store.setState(() => ({ creatingChatStatus: StateStatus.pending() }))
      connectionToken = await this.service.createConnectionToken(chatName)
      this.service.chatToken = connectionToken
      this.store.setState(() => ({ creatingChatStatus: StateStatus.success() }))
    } catch (err) {
      console.error(err)
      const message = errorMessageFrom(err)
      this.store.setState(() => ({ creatingChatStatus: StateStatus.error(message) }))
    }

    return connectionToken
  }

  public async join(connectionToken: string) {
    this.service.chatToken = connectionToken
  }

  public async copyInviteLink() {
    const connectionToken = this.service.chatToken
    const link = `http://localhost:3001/chat/${connectionToken}`
    await navigator.clipboard.writeText(link)
  }

  public async establishPeerConnection(localStream: MediaStream) {
    try {
      this.store.setState(() => ({ connectionStatus: StateStatus.pending(), localStream }))

      await this.service.establishPeerConnection(localStream)

      this.store.setState(() => ({ connectionStatus: StateStatus.pending() }))
    } catch (err) {
      const message = errorMessageFrom(err)
      this.store.setState(() => ({ connectionStatus: StateStatus.error(message) }))
    }
  }

  public async closePeerConnection() {
    console.log('closePeerConnection')
    try {
      await this.service.closePeerConnection()
      this.store.setState(() => ({
        connectionStatus: StateStatus.idle(),
        localStream: null,
        remoteStream: null,
      }))
    } catch (err) {
      const message = errorMessageFrom(err)
      this.store.setState(() => ({ connectionStatus: StateStatus.error(message) }))
    }
  }
}
