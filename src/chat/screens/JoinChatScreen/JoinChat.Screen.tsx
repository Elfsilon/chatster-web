import { useMemo, useState } from 'react'
import { AppButton } from '../../components/AppButton/AppButton.Component'
import { AppInput } from '../../components/AppInput/AppInput.Component'
import { Tabs } from '../../components/TabsComponent/Tabs.Component'
import './JoinChat.Screen.css'
import { useNavigate } from 'react-router-dom'

export function JoinChatScreen() {
  const navigate = useNavigate()

  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0)
  const [text, setText] = useState<string>('')

  const [placeholder, buttonName] = useMemo(() => {
    if (selectedTabIndex === 0) {
      return ['Invite link', 'Join']
    }

    return ['Chat name', 'Create']
  }, [selectedTabIndex])

  const clearInputField = () => {
    setText('')
  }

  const onClickTab = (index: number) => {
    clearInputField()
    setSelectedTabIndex(index)
  }

  const onClickButton = () => {
    if (selectedTabIndex === 0) {
      openChat(text)
    } else {
      // TODO
      openChat(text)
    }
  }

  const openChat = (chatID: string) => {
    navigate(`chat/${chatID}`)
  }

  return (
    <section className="join-screen">
      <div className="join-screen__content">
        <Tabs tabNames={['Join chat', 'Create chat']} selectedIndex={selectedTabIndex} onClick={onClickTab} />
        <div className="join-screen__content-row">
          <AppInput placeholder={placeholder} value={text} onChange={(value) => setText(value)} />
          <AppButton name={buttonName} disabled={text.length === 0} onClick={onClickButton} />
        </div>
      </div>
    </section>
  )
}
