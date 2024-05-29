import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { JoinChatScreen } from '../chat/screens/JoinChatScreen/JoinChat.Screen'
import { ChatScreen } from '../chat/screens/ChatScreen/Chat.Screen'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JoinChatScreen />} />
        <Route path="chat/:chatID" element={<ChatScreen />} />
      </Routes>
    </BrowserRouter>
  )
}
