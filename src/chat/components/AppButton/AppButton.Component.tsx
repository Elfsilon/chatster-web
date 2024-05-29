import classNames from 'classnames'
import './AppButton.Component.css'

type Props = {
  name: string
  disabled: boolean
  onClick?: () => void
}

export function AppButton({ name, disabled, onClick }: Props) {
  const buttonClass = classNames('app-button', { 'app-button--disabled': disabled })

  return (
    <div className={buttonClass} onClick={() => onClick?.()}>
      {name}
    </div>
  )
}
