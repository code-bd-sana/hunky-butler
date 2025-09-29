'use client'
import { store } from '@/store/store'
import React from 'react'
import { Provider } from 'react-redux'

export default function ReduxProvider({children}) {
  return (
  <Provider store={store}>

      <div>
        {children}
    </div>
  </Provider>
  )
}
