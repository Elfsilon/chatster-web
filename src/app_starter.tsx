import { ChatService } from './chat/services/Chat.Service'
import { ChatController } from './chat/store/p2p_chat_controller'
import { DepKeys } from './core/constants/dependency_keys'
import { DependencyManager } from './core/dependency_manager'
import './index.css'

export function configureDependencyManager(): DependencyManager {
  const manager = new DependencyManager()

  registerServices(manager)
  registerControllers(manager)

  return manager
}

function registerServices(manager: DependencyManager) {
  manager.register(DepKeys.chatService, () => new ChatService())
}

function registerControllers(manager: DependencyManager) {
  manager.register(DepKeys.chatController, (injector) => {
    const chatService = injector.provide(DepKeys.chatService)
    return new ChatController(chatService)
  })
}
