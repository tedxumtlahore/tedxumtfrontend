import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  const showToast = useCallback((msg) => {
    setMessage(msg)
    setVisible(true)
    window.clearTimeout(showToast._timer)
    showToast._timer = window.setTimeout(() => setVisible(false), 3200)
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={`toast${visible ? ' show' : ''}`} id="toast">
        {message}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
