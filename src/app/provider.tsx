'use client'

import TopBar from '@/shared/components/TopBar'
import { persistor, store } from '@/store/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TopBar/>
        {children}
      </PersistGate>
    </Provider>
  )
}
