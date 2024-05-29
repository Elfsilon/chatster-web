import { useNavigate, useParams } from 'react-router-dom'
import './Chat.Screen.css'
import { useEffect, useMemo, useState } from 'react'
import { UserView } from '../../components/UserView/UserView.Component'
import { ChatUserControls } from '../../components/ChatUserControls.Component'
import { ChatOverlay } from '../../components/ChatOverlay/ChatOverlay.Component'

export function ChatScreen() {
  const navigate = useNavigate()
  const { chatID } = useParams()

  const [microEnabled, setMicroEnabled] = useState<boolean>(false)
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(true)

  const [userStream, setUserStream] = useState<MediaStream | null>(null)
  const [userList, setUserList] = useState<string[]>([
    'Леха',
    'Толик Вайлд',
    'Flutter team',
    'Стиви Черчиль',
    'Макс',
    'Стиви Черчиль',
  ])

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
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    switchTracks(stream.getAudioTracks(), microEnabled)
    setUserStream(stream)
  }

  const switchTracks = async (tracks: MediaStreamTrack[], value: boolean) => {
    tracks.forEach((t) => (t.enabled = value))
  }

  const toggleMicro = () => {
    if (userStream) {
      const newValue = !microEnabled
      switchTracks(userStream.getAudioTracks(), newValue)
      setMicroEnabled(newValue)
    }
  }

  const toggleCamera = () => {
    if (userStream) {
      const newValue = !cameraEnabled
      switchTracks(userStream.getVideoTracks(), newValue)
      setCameraEnabled(newValue)
    }
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
      <div className={gridClass}>
        {userList
          .filter((_, index) => index < 6)
          .map((user, index) => (
            <UserView
              key={`${index}-user`}
              name={user}
              stream={user === 'Макс' ? userStream : null}
              cameraEnabled={cameraEnabled}
            />
          ))}
      </div>
    </div>
  )
}
