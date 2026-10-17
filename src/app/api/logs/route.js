import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const getHeaderValue = (headers, name) => {
  if (!headers) return ''
  if (typeof headers.get === 'function') {
    return headers.get(name) || ''
  }
  return headers[name] || headers[name.toLowerCase()] || ''
}

const getClientIp = (req) => {
  const headers = req?.headers
  return (
    getHeaderValue(headers, 'cf-connecting-ip') ||
    getHeaderValue(headers, 'x-real-ip') ||
    (getHeaderValue(headers, 'x-forwarded-for').split(',')[0] || '').trim() ||
    ''
  )
}

const LOG_DIR = process.env.LOG_DIR || 'logs'
const LOG_DIR_MODE = process.env.LOG_DIR_MODE || '0777'

const getLogFilePath = (date) => {
  const logDir = path.isAbsolute(LOG_DIR)
    ? LOG_DIR
    : path.join(/* turbopackIgnore: true */ process.cwd(), LOG_DIR)
  const fileName = `${date}.log`
  return { logDir, filePath: path.join(logDir, fileName) }
}

const parseMode = (value) => {
  if (!value) return undefined
  const parsed = parseInt(value, 8)
  return Number.isNaN(parsed) ? undefined : parsed
}

export async function POST(req) {
  try {
    const now = new Date()
    const date = now.toISOString().slice(0, 10)
    const { logDir, filePath } = getLogFilePath(date)
    const mode = parseMode(LOG_DIR_MODE)

    let payload = {}
    try {
      payload = await req.json()
    } catch {
      payload = {}
    }

    const entry = {
      timestamp: now.toISOString(),
      ip: getClientIp(req),
      userAgent: getHeaderValue(req.headers, 'user-agent'),
      ...payload,
    }

    await fs.mkdir(logDir, { recursive: true, mode })
    if (process.platform !== 'win32' && mode) {
      await fs.chmod(logDir, mode).catch(() => {})
    }
    await fs.appendFile(filePath, `${JSON.stringify(entry)}\n`, mode ? { mode } : undefined)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Log write error:', error)
    return NextResponse.json({ error: 'Log write error' }, { status: 500 })
  }
}
