import { useState } from 'react'
import { AppButton } from '../AppButton/AppButton.Component'
import './ChatOverlay.Component.css'
import { CameraControl, EndCallControl, MicroControl } from '../../OverlayControlButton/OverlayControlButton'

type Props = {
  cameraEnabled: boolean
  microEnabled: boolean
  toggleMicro?: () => void
  toggleCamera?: () => void
  onLeave?: () => void
  copyLink?: () => void
}

export function ChatOverlay({ microEnabled, cameraEnabled, toggleMicro, toggleCamera, onLeave, copyLink }: Props) {
  return (
    <div className="chat-overlay">
      <div className="chat-overlay__top">
        <p className="chat-overlay__name">Chat name</p>
        <AppButton name="Copy invite link" disabled={false} onClick={copyLink} />
      </div>
      <div className="chat-overlay__controls">
        <CameraControl enabled={cameraEnabled} onClick={toggleCamera} />
        <MicroControl enabled={microEnabled} onClick={toggleMicro} />
        <EndCallControl onClick={onLeave} />
      </div>
    </div>
  )
}
