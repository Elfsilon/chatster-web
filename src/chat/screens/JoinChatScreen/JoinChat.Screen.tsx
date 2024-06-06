import { useContext, useMemo, useState } from 'react'
import { AppButton } from '../../components/AppButton/AppButton.Component'
import { AppInput } from '../../components/AppInput/AppInput.Component'
import { Tabs } from '../../components/TabsComponent/Tabs.Component'
import { useNavigate } from 'react-router-dom'
import { DepManagerContext } from '../../../core/contexts/DepManager.Context'
import { ChatController } from '../../store/p2p_chat_controller'
import { DepKeys } from '../../../core/constants/dependency_keys'
import './JoinChat.Screen.css'

export function JoinChatScreen() {
  const navigate = useNavigate()

  const deps = useContext(DepManagerContext)
  const controller: ChatController = deps.provide(DepKeys.chatController)

  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0)
  const [text, setText] = useState<string>('')

  const [placeholder, buttonName] = useMemo(() => {
    if (selectedTabIndex === 0) {
      return ['Connection token', 'Join']
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

  const openChat = async () => {
    navigate(`/chat/${text}`)
  }

  const createChat = async () => {
    const token = await controller.create(text)
    if (token) {
      navigate(`/chat/${token}`)
    }
  }

  const onClickButton = () => {
    if (selectedTabIndex === 0) {
      openChat()
    } else {
      createChat()
    }
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
