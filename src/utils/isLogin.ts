import { getCookie } from 'utils/cookies'

export const isLogin = () => {
  const token = getCookie('token')
  if (token === null) {
    return false
  }
  if (token !== '' || token !== undefined) {
    return true
  }
  return false
}
