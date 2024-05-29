import { useState } from 'react'
import { AppButton } from '../AppButton/AppButton.Component'
import './ChatOverlay.Component.css'

type Props = {
  cameraEnabled: boolean
  microEnabled: boolean
  toggleMicro?: () => void
  toggleCamera?: () => void
  onLeave?: () => void
}

export function ChatOverlay({ microEnabled, cameraEnabled, toggleMicro, toggleCamera, onLeave }: Props) {
  return (
    <div className="chat-overlay">
      <div className="chat-overlay__top">
        <p className="chat-overlay__name">Chat name</p>
        <AppButton name="Copy invite link" disabled={false} />
      </div>
      <div className="chat-overlay__controls">
        <div onClick={toggleMicro}>{microEnabled ? 'Disable micro' : 'Enable micro'}</div>
        <div onClick={toggleCamera}>{cameraEnabled ? 'Disable camera' : 'Enable camera'}</div>
        <div onClick={onLeave}>Leave</div>
      </div>
    </div>
  )
}
