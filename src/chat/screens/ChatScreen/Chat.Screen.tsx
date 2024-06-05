import { useNavigate, useParams } from 'react-router-dom'
import './Chat.Screen.css'
import { useContext, useEffect, useMemo, useState } from 'react'
import { UserView } from '../../components/UserView/UserView.Component'
import { ChatOverlay } from '../../components/ChatOverlay/ChatOverlay.Component'
import { DepManagerContext } from '../../../core/contexts/DepManager.Context'
import { DepKeys } from '../../../core/constants/dependency_keys'
import { ChatController } from '../../store/store'

export function ChatScreen() {
  const { chatID } = useParams()
  const navigate = useNavigate()

  const deps = useContext(DepManagerContext)
  const controller: ChatController = deps.provide(DepKeys.chatController)
  const { localStream, remoteStream, status } = controller.useChatState()

  const [userList, setUserList] = useState<string[]>(['Max', 'Toli Wild'])
  const [microEnabled, setMicroEnabled] = useState<boolean>(false)
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(true)

  const gridClass = useMemo(() => {
    if (userList.length <= 1) {
      return `chat-grid-1`
    } else if (userList.length <= 2) {
      return `chat-grid-2`
    } else if (userList.length <= 4) {
      return `chat-grid-4`
    }
    return `chat-grid-6`
  }, [userList])

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true })
    await controller.establishPeerConnection(localStream)
    // const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    // switchTracks(stream.getAudioTracks(), microEnabled)
    // setUserStream(stream)
  }

  const switchTracks = async (tracks: MediaStreamTrack[], value: boolean) => {
    // tracks.forEach((t) => (t.enabled = value))
  }

  const toggleMicro = () => {
    // if (userStream) {
    const newValue = !microEnabled
    //   switchTracks(userStream.getAudioTracks(), newValue)
    setMicroEnabled(newValue)
    // }
  }

  const toggleCamera = () => {
    // if (userStream) {
    const newValue = !cameraEnabled
    //   switchTracks(userStream.getVideoTracks(), newValue)
    setCameraEnabled(newValue)
    // }
  }

  const onLeave = () => {
    navigate('/')
  }

  return (
    <div className="chat-screen">
      <ChatOverlay
        microEnabled={microEnabled}
        cameraEnabled={cameraEnabled}
        toggleMicro={toggleMicro}
        toggleCamera={toggleCamera}
        onLeave={onLeave}
      />
      {status.errorMessage ? (
        <div>Error: {status.errorMessage}</div>
      ) : (
        <div className={gridClass}>
          {userList
            .filter((_, index) => index < 6)
            .map((user, index) => (
              <UserView
                key={`${index}-user`}
                name={user}
                stream={index == 0 ? localStream : remoteStream}
                cameraEnabled={cameraEnabled}
              />
            ))}
        </div>
      )}
    </div>
  )
}
