import { AUTH_PAGES } from '@/constants/auth'

export const APP_ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  account: '/account',
  checkout: '/checkout',
  orders: '/orders',
  admin: '/admin',
  categories: '/categories',
}

export const AUTH_ROUTES = [AUTH_PAGES.signIn, AUTH_PAGES.signUp]

export const PUBLIC_ROUTES = [APP_ROUTES.home , APP_ROUTES.categories , ...AUTH_ROUTES]

export const PROTECTED_ROUTE_PREFIXES = [
  APP_ROUTES.dashboard,
  APP_ROUTES.account,
  APP_ROUTES.checkout,
  APP_ROUTES.orders,
  APP_ROUTES.admin,
  APP_ROUTES.categories,
]

export const DEFAULT_AUTHENTICATED_REDIRECT = APP_ROUTES.dashboard

export const matchesRoute = (pathname, route) =>
  pathname === route || pathname.startsWith(`${route}/`)

export const isAuthRoute = (pathname) =>
  AUTH_ROUTES.some((route) => matchesRoute(pathname, route))

export const isProtectedRoute = (pathname) =>
  PROTECTED_ROUTE_PREFIXES.some((route) => matchesRoute(pathname, route))

export const isPublicRoute = (pathname) =>
  PUBLIC_ROUTES.some((route) => matchesRoute(pathname, route))
