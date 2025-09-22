import { createContext, useContext } from 'react'

export const ModalContext = createContext<{ closeModal: () => void } | null>(null)

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) throw new Error('useModal debe usarse dentro de ModalContext.Provider')
  return context
}
