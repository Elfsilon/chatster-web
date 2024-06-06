import { io } from 'socket.io-client'
import { ClientSocket } from './Chat.Service.types'
import axios from 'axios'

type ConnectionTokenResponse = {
  token: string
}

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun.l.google.com:5349' },
    { urls: 'stun:stun1.l.google.com:3478' },
    { urls: 'stun:stun1.l.google.com:5349' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:5349' },
    { urls: 'stun:stun3.l.google.com:3478' },
    { urls: 'stun:stun3.l.google.com:5349' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:5349' },
  ],
}

// const API_URL = 'http://localhost:3000'
// const WS_URL = 'ws://localhost:3000/signalling'

const API_URL = 'https://chatster-production.up.railway.app'
const WS_URL = 'https://chatster-production.up.railway.app/signalling'

type StreamListener = (stream: MediaStream | null) => void

type ServerPermission = {
  status: boolean
  message: string
}

export class ChatService {
  private connectionToken?: string
  get chatToken(): string | undefined {
    return this.connectionToken
  }
  set chatToken(token: string | undefined) {
    this.connectionToken = token
  }

  private socket?: ClientSocket
  private peerConnection?: RTCPeerConnection

  private localStream: MediaStream | null = null
  private remoteStreamListeners = new Map<string, StreamListener>()

  public listenStreams(tag: string, remoteStreamListener: StreamListener) {
    this.remoteStreamListeners.set(tag, remoteStreamListener)
  }

  public unlistenStreams(tag: string) {
    this.remoteStreamListeners.delete(tag)
  }

  public async createConnectionToken(chatName: string): Promise<string> {
    const res = await axios.get(`${API_URL}/p2p/token`)
    const data: ConnectionTokenResponse = res.data
    return data.token
  }

  /**
   * Must be called after setting the connectionToken
   */
  public async establishPeerConnection(localStream?: MediaStream): Promise<void> {
    if (localStream) {
      this.localStream = localStream
    }

    if (!this.localStream) {
      throw Error('unable to establish peer connection: localStream is null or undefined')
    }

    this.socket?.disconnect()
    this.peerConnection?.close()

    this.socket = io(WS_URL, {
      auth: {
        token: this.connectionToken,
      },
    })
    const permission = await this.getServerPermission(this.socket)
    if (!permission.status) {
      throw Error(permission.message)
    }

    this.peerConnection = await this.setupPeerConnection(this.localStream, this.socket)

    this.registerHandlers(this.socket, this.peerConnection)

    this.socket.emit('get-my-role')
  }

  public async closePeerConnection(): Promise<void> {
    this.peerConnection?.close()
    this.peerConnection = undefined

    this.socket?.close()
    this.socket = undefined
  }

  private notifyRemoteStreamListeners(stream: MediaStream | null) {
    this.remoteStreamListeners.forEach((listener) => {
      listener(stream)
    })
  }

  private async setupPeerConnection(stream: MediaStream, socket: ClientSocket): Promise<RTCPeerConnection> {
    const pc = new RTCPeerConnection(RTC_CONFIG)

    for (const track of stream.getTracks()) {
      pc.addTrack(track, stream)
    }

    pc.addTransceiver('video')
    // this.peerConnection.addTransceiver('audio')

    pc.addEventListener('icecandidate', ({ candidate }) => {
      if (candidate !== null) {
        socket.emit('ice-candidate-from-client', candidate)
      }
    })

    pc.addEventListener('track', async ({ streams }) => {
      const remoteStream = streams[0]
      if (remoteStream) {
        this.notifyRemoteStreamListeners(remoteStream)
      }
    })

    return pc
  }

  private registerHandlers(socket: ClientSocket, pc: RTCPeerConnection): void {
    this.setupCallerSpecificHandlers(socket, pc)
    this.setupCalleeSpecificHandlers(socket, pc)
    this.setupCommonHandlers(socket, pc)
  }

  private setupCallerSpecificHandlers(socket: ClientSocket, pc: RTCPeerConnection): void {
    socket.on('other-peer-ready', async () => {
      const offer = await pc.createOffer()
      const localDescription = new RTCSessionDescription(offer)
      pc.setLocalDescription(localDescription)

      socket.emit('offer-from-client', offer)
    })

    socket.on('answer-from-other-peer', async (answer) => {
      const remoteDescription = new RTCSessionDescription(answer)
      await pc.setRemoteDescription(remoteDescription)
    })
  }

  private setupCalleeSpecificHandlers(socket: ClientSocket, pc: RTCPeerConnection): void {
    socket.on('offer-from-other-peer', async (offer) => {
      const remoteDescription = new RTCSessionDescription(offer)
      await pc.setRemoteDescription(remoteDescription)

      const answer = await pc.createAnswer()
      const localDescription = new RTCSessionDescription(answer)
      await pc.setLocalDescription(localDescription)

      socket.emit('answer-from-client', answer)
    })
  }

  private setupCommonHandlers(socket: ClientSocket, pc: RTCPeerConnection): void {
    socket.on('your-role-is', (role) => {
      if (role === 'callee') {
        socket.emit('ready')
      }
    })

    socket.on('ice-candidate-from-other-peer', (candidate) => {
      pc.addIceCandidate(candidate)
    })

    socket.on('other-peer-disconnected', () => {
      // Recreate peer connection with the old local stream
      this.notifyRemoteStreamListeners(null)
      if (this.connectionToken) {
        this.establishPeerConnection()
      } else {
        throw Error('unable to establish peer connection: connectionToken is missing')
      }
    })
  }

  async getServerPermission(socket: ClientSocket): Promise<ServerPermission> {
    return new Promise((resolve) => {
      socket.on('server-permission', (status, message) => {
        resolve({ status, message })
      })
    })
  }
}
