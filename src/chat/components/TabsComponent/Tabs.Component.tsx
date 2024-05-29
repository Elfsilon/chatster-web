import { Tab } from '../TabComponent/Tab.Component'
import './Tabs.Component.css'

type Props = {
  tabNames: string[]
  selectedIndex: number
  onClick: (index: number) => void
}

export function Tabs({ tabNames, selectedIndex, onClick }: Props) {
  return (
    <div className="tabs">
      {tabNames.map((name, index) => {
        const isSelected = index === selectedIndex
        return <Tab key={name} index={index} name={name} selected={isSelected} onClick={onClick} />
      })}
    </div>
  )
}
