import { useContext, useMemo, useState } from 'react'
import { AppButton } from '../../components/AppButton/AppButton.Component'
import { AppInput } from '../../components/AppInput/AppInput.Component'
import { Tabs } from '../../components/TabsComponent/Tabs.Component'
import './JoinChat.Screen.css'
import { useNavigate } from 'react-router-dom'
import { DepManagerContext } from '../../../core/contexts/DepManager.Context'
import { ChatController } from '../../store/p2p_chat_controller'
import { DepKeys } from '../../../core/constants/dependency_keys'

export function JoinChatScreen() {
  const navigate = useNavigate()

  const deps = useContext(DepManagerContext)
  const controller: ChatController = deps.provide(DepKeys.chatController)

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

  const isTokenValid = (token: string): boolean => true

  // TODO: prettify
  const validateInviteURL = (link: URL): [boolean, string | undefined] => {
    const parts = link.pathname.split('/')

    const isUrlValid =
      parts.length === 3 &&
      parts[0].length === 0 &&
      parts[1].length > 0 &&
      parts[1] === 'chat' &&
      parts[2].length > 0 &&
      isTokenValid(parts[2])

    const token = isUrlValid ? parts[2] : undefined

    return [isUrlValid, token]
  }

  const openChat = async () => {
    const url = new URL(text)
    const [isValid, token] = validateInviteURL(url)
    if (isValid) {
      await controller.join(token!)
      navigate(url.pathname)
    } else {
      console.error('Invalid invite link')
    }
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
