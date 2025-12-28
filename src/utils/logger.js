// src/utils/logger.js

const isDevelopment = import.meta.env.DEV

export const logger = {
  log(...args) {
    if (isDevelopment) {
      console.log('[Zalldi]', ...args)
    }
  },
  
  info(...args) {
    if (isDevelopment) {
      console.info('[Zalldi Info]', ...args)
    }
  },
  
  warn(...args) {
    if (isDevelopment) {
      console.warn('[Zalldi Warning]', ...args)
    }
  },
  
  error(...args) {
    console.error('[Zalldi Error]', ...args)
  },
  
  debug(...args) {
    if (isDevelopment) {
      console.debug('[Zalldi Debug]', ...args)
    }
  },
  
  table(data) {
    if (isDevelopment) {
      console.table(data)
    }
  },
  
  group(label) {
    if (isDevelopment) {
      console.group(label)
    }
  },
  
  groupEnd() {
    if (isDevelopment) {
      console.groupEnd()
    }
  },
  
  time(label) {
    if (isDevelopment) {
      console.time(label)
    }
  },
  
  timeEnd(label) {
    if (isDevelopment) {
      console.timeEnd(label)
    }
  }
}