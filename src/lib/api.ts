import { projectId } from '../../utils/supabase/info'

const BASE = `https://${projectId}.supabase.co/functions/v1/server/make-server-f021205c`

const tok = () => localStorage.getItem('bd_token') || ''
const auth = () => ({ Authorization: `Bearer ${tok()}` })
const json = (data: unknown) => ({ 'Content-Type': 'application/json', ...auth() })

async function req<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const r = await fetch(`${BASE}${path}`, opts)
  return r.json()
}

export const api = {
  seed: () => req('/seed', { method: 'POST' }),

  signup: (data: Record<string, string>) =>
    req('/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),

  login: (email: string, password: string) =>
    req('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }),

  logout: () =>
    req('/auth/logout', { method: 'POST', headers: auth() }),

  me: () => req('/auth/me', { headers: auth() }),

  getUsers: () => req('/users', { headers: auth() }),

  getUser: (id: string) => req(`/user/${id}`, { headers: auth() }),

  updateUser: (id: string, data: Record<string, unknown>) =>
    req(`/user/${id}`, { method: 'PUT', headers: json(data), body: JSON.stringify(data) }),

  getDepositMethods: () => req('/deposit-methods', { headers: auth() }),

  updateDepositMethods: (data: unknown) =>
    req('/deposit-methods', { method: 'PUT', headers: json(data), body: JSON.stringify(data) }),

  getTransactions: (userId: string) =>
    req(`/transactions/${userId}`, { headers: auth() }),

  addTransaction: (data: unknown) =>
    req('/transactions', { method: 'POST', headers: json(data), body: JSON.stringify(data) }),

  getChat: (userId: string) => req(`/chat/${userId}`, { headers: auth() }),

  sendChat: (userId: string, message: string) =>
    req('/chat', { method: 'POST', headers: json({}), body: JSON.stringify({ userId, message }) }),

  getAllChats: () => req('/admin/chats', { headers: auth() }),

  getAdminSettings: () => req('/admin/settings', { headers: auth() }),

  updateAdminSettings: (data: unknown) =>
    req('/admin/settings', { method: 'PUT', headers: json(data), body: JSON.stringify(data) }),
}
