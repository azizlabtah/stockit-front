'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Error500 from './components/common/Error500'
import { API_ROUTES } from '@/constants/api'

export default function Error({ error, reset }) {
    const pathname = usePathname()
    const loggedRef = useRef(false)

    useEffect(() => {
        if (!error || loggedRef.current) return
        loggedRef.current = true

        fetch(API_ROUTES.commonLogs, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'page_500',
                message: error?.message || 'Unknown error',
                pathname,
            }),
            keepalive: true,
        }).catch(() => {})
    }, [error, pathname])

    return <Error500 reset={reset} />
}
