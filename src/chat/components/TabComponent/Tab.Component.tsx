import classNames from 'classnames'
import './Tab.Component.css'

type Props = {
  index: number
  name: string
  selected: boolean
  onClick: (index: number) => void
}

export function Tab({ index, name, selected, onClick }: Props) {
  const tabClass = classNames('tab', { 'tab--selected': selected })

  return (
    <div className={tabClass} onClick={() => onClick(index)}>
      {name}
    </div>
  )
}
