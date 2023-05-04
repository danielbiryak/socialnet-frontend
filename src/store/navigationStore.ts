import { create } from 'zustand'

interface NavigationState {
  currentPageStack: EPagesStack
  setPageStack: (page: EPagesStack) => void
}

export enum EPagesStack {
  UNAUTHORIZED = 'unauthorized',
  AUTHORIZED_MAIN = 'authorized:main'
}

export const useNavigationStore =
  create<NavigationState>((set) => ({
    currentPageStack: EPagesStack.UNAUTHORIZED,
    setPageStack: (page: EPagesStack) =>
      set({ currentPageStack: page })
  }))
