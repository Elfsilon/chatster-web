import classNames from 'classnames'
import './OverlayControlButton.css'

export function EndCallIcon({ fillColor }: { fillColor?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill={fillColor ?? 'white'}
    >
      <path d="M480-640q118 0 232.5 47.5T916-450q12 12 12 28t-12 28l-92 90q-11 11-25.5 12t-26.5-8l-116-88q-8-6-12-14t-4-18v-114q-38-12-78-19t-82-7q-42 0-82 7t-78 19v114q0 10-4 18t-12 14l-116 88q-12 9-26.5 8T136-304l-92-90q-12-12-12-28t12-28q88-95 203-142.5T480-640Z" />
    </svg>
  )
}

export function CameraIcon({ fillColor }: { fillColor?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill={fillColor ?? 'white'}
    >
      <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h480q33 0 56.5 23.5T720-720v180l126-126q10-10 22-5t12 19v344q0 14-12 19t-22-5L720-420v180q0 33-23.5 56.5T640-160H160Z" />
    </svg>
  )
}

export function CameraOffIcon({ fillColor }: { fillColor?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill={fillColor ?? 'white'}
    >
      <path d="m720-540 126-126q10-10 22-5t12 19v344q0 14-12 19t-22-5L713-427q-10 14-28.5 17T652-421L341-732q-10-10-11.5-21t3.5-22q5-11 14-18t23-7h270q33 0 56.5 23.5T720-720v180Zm74 486L54-794q-11-11-11-28t11-28q11-11 28-11t28 11l740 740q11 11 11 28t-11 28q-11 11-28 11t-28-11ZM160-800l560 560q0 33-23.5 56.5T640-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800Z" />
    </svg>
  )
}

export function MicroIcon({ fillColor }: { fillColor?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill={fillColor ?? 'white'}
    >
      <path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm-40 240v-83q-92-13-157.5-78T203-479q-2-17 9-29t28-12q17 0 28.5 11.5T284-480q14 70 69.5 115T480-320q72 0 127-45.5T676-480q4-17 15.5-28.5T720-520q17 0 28 12t9 29q-14 91-79 157t-158 79v83q0 17-11.5 28.5T480-120q-17 0-28.5-11.5T440-160Z" />
    </svg>
  )
}

export function MicroOffIcon({ fillColor }: { fillColor?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill={fillColor ?? 'white'}
    >
      <path d="M672-377q-14-8-18-24.5t4-30.5q7-11 11.5-23.5T676-481q4-17 15.5-28t28.5-11q17 0 28 12t9 29q-3 23-10.5 45T727-392q-8 14-24.5 18.5T672-377ZM532-542 383-691q-11-11-17-25.5t-6-30.5v-13q0-50 35-85t85-35q50 0 85 35t35 85v189q0 27-24.5 37.5T532-542Zm-92 382v-84q-92-12-157.5-77T203-479q-2-17 9-29t28-12q17 0 28.5 11.5T284-480q14 70 69.5 115T480-320q34 0 64.5-10.5T600-360l57 57q-29 23-63.5 38.5T520-244v84q0 17-11.5 28.5T480-120q-17 0-28.5-11.5T440-160Zm324 76L84-764q-11-11-11-28t11-28q11-11 28-11t28 11l680 680q11 11 11 28t-11 28q-11 11-28 11t-28-11Z" />{' '}
    </svg>
  )
}

// export function OverlayControlButton({ enabled, onClick }: Props) {
//   return (
//     <div>
//       <EndCallIcon />
//       {/* <CameraIcon />
//       <CameraOffIcon />
//       <MicroIcon />
//       <MicroOffIcon /> */}
//     </div>
//   )
// }
interface DefaultControlProps {
  onClick?: () => void
}

interface ControlProps extends DefaultControlProps {
  enabled: boolean
}

export function EndCallControl({ onClick }: DefaultControlProps) {
  return (
    <div className="overlay-button overlay-button__red" onClick={onClick}>
      <EndCallIcon />
    </div>
  )
}

export function MicroControl({ enabled, onClick }: ControlProps) {
  const controlClasses = classNames('overlay-button', { 'overlay-button__disabled': !enabled })

  return (
    <div className={controlClasses} onClick={onClick}>
      {enabled ? <MicroIcon /> : <MicroOffIcon fillColor="#232323" />}
    </div>
  )
}

export function CameraControl({ enabled, onClick }: ControlProps) {
  const controlClasses = classNames('overlay-button', { 'overlay-button__disabled': !enabled })

  return (
    <div className={controlClasses} onClick={onClick}>
      {enabled ? <CameraIcon /> : <CameraOffIcon fillColor="#232323" />}
    </div>
  )
}
