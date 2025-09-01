import React, { Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import Loading from '../loading'

export default function login() {
  return (
    <div>
      <Suspense fallback={<Loading /> as unknown as React.ReactNode}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
