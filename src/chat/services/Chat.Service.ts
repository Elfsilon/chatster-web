import { io } from 'socket.io-client'
import { ClientSocket } from './Chat.Service.types'

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

const URL = 'ws://localhost:3000/signalling'

type StreamListener = (stream: MediaStream | null) => void

type ServerPermission = {
  status: boolean
  message: string
}

export class ChatService {
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
      this.establishPeerConnection()
    })

    // socket.on('kicked', () => {
    //   console.log('You were kicked')
    // })
  }

  async getServerPermission(socket: ClientSocket): Promise<ServerPermission> {
    return new Promise((resolve) => {
      socket.on('server-permission', (status, message) => {
        resolve({ status, message })
      })
    })
  }

  public async establishPeerConnection(localStream?: MediaStream): Promise<void> {
    if (localStream) {
      this.localStream = localStream
    }

    if (!this.localStream) {
      throw Error('unable to establish peer connection: localStream is null or undefined')
    }

    this.socket?.disconnect()
    this.peerConnection?.close()

    this.socket = io(URL)
    const permission = await this.getServerPermission(this.socket)
    if (!permission.status) {
      throw Error(permission.message)
    }

    this.peerConnection = await this.setupPeerConnection(this.localStream, this.socket)

    this.registerHandlers(this.socket, this.peerConnection)

    this.socket.emit('get-my-role')
  }
}
