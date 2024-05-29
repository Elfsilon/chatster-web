import './AppInput.Component.css'

type Props = {
  value: string
  placeholder: string
  onChange?: (value: string) => void
}

export function AppInput({ value, placeholder, onChange }: Props) {
  return (
    <input className="app-input" placeholder={placeholder} value={value} onChange={(e) => onChange?.(e.target.value)} />
  )
}
