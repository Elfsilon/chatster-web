import { useEffect, useRef } from 'react'
import './UserView.Component.css'
import classNames from 'classnames'

type Props = {
  name: string
  stream: MediaStream | null
  cameraEnabled: boolean
}

export function UserView({ name, stream, cameraEnabled }: Props) {
  const refVideo = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!refVideo.current) return
    refVideo.current.srcObject = stream
  }, [stream])

  const vieoClasses = classNames('user-view__video', { opaque: !cameraEnabled })
  const labelClasses = classNames('user-view__label', { opaque: cameraEnabled })

  return (
    <div className="user-view">
      <div className={labelClasses}>{name}</div>
      <video className={vieoClasses} ref={refVideo} autoPlay></video>
    </div>
  )
}
