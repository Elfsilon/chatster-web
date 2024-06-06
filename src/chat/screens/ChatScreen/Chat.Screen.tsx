import './Chat.Screen.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { UserView } from '../../components/UserView/UserView.Component'
import { ChatOverlay } from '../../components/ChatOverlay/ChatOverlay.Component'
import { DepManagerContext } from '../../../core/contexts/DepManager.Context'
import { DepKeys } from '../../../core/constants/dependency_keys'
import { ChatController } from '../../store/p2p_chat_controller'

export function ChatScreen() {
  const { token } = useParams()

  const navigate = useNavigate()

  const deps = useContext(DepManagerContext)
  const controller: ChatController = deps.provide(DepKeys.chatController)
  const { localStream, remoteStream, connectionStatus } = controller.useChatState()

  const [microEnabled, setMicroEnabled] = useState<boolean>(false)
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(true)

  useEffect(() => {
    init()

    return () => {
      controller.closePeerConnection()
    }
  }, [])

  const init = async () => {
    if (token) {
      await controller.join(token)
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      await controller.establishPeerConnection(localStream)
      switchTracks(localStream.getAudioTracks(), microEnabled)
    }
  }

  const switchTracks = async (tracks: MediaStreamTrack[], value: boolean) => {
    tracks.forEach((t) => (t.enabled = value))
  }

  const toggleMicro = () => {
    if (localStream) {
      const newValue = !microEnabled
      switchTracks(localStream.getAudioTracks(), newValue)
      setMicroEnabled(newValue)
    }
  }

  const toggleCamera = () => {
    if (localStream) {
      const newValue = !cameraEnabled
      switchTracks(localStream.getVideoTracks(), newValue)
      setCameraEnabled(newValue)
    }
  }

  const onLeave = async () => {
    await controller.closePeerConnection()
    navigate('/')
  }

  const onCopyLink = () => {
    controller.copyConnectionToken()
  }

  let content: JSX.Element
  if (connectionStatus.errorMessage) {
    content = <div>Error: {connectionStatus.errorMessage}</div>
  } else {
    content = (
      <div className="chat-grid">
        <UserView key="my-view" name="test" stream={localStream} cameraEnabled={true} />
        {remoteStream ? (
          <UserView key={`remote-user-view`} name="remote-peer" stream={remoteStream} cameraEnabled={true} />
        ) : null}
      </div>
    )
  }

  return (
    <div className="chat-screen">
      <ChatOverlay
        microEnabled={microEnabled}
        cameraEnabled={cameraEnabled}
        toggleMicro={toggleMicro}
        toggleCamera={toggleCamera}
        onLeave={onLeave}
        copyLink={onCopyLink}
      />
      {content}
    </div>
  )
}
