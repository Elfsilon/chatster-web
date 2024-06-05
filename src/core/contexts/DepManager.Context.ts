import { createContext } from 'react'
import { DependencyManager } from '../dependency_manager'

export const DepManagerContext = createContext<DependencyManager>(new DependencyManager())
