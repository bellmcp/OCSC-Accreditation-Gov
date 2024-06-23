import { get, isEmpty } from 'lodash'
import * as uiActions from 'modules/ui/actions'
import { eraseCookie } from 'utils/cookies'

const PATH = process.env.REACT_APP_BASE_PATH

export const handleApiError = (
  err: any,
  dispatch: any,
  templateMessage: string = ''
) => {
  const status = get(err, 'response.status', '')
  const errorMessagefromAPI = get(err, 'response.data.mesg', '')

  if (!isEmpty(errorMessagefromAPI)) {
    dispatch(
      uiActions.setFlashMessage(
        `<b>${
          templateMessage ? `${templateMessage} ` : ''
        }เกิดข้อผิดพลาด ${status}</b><br/>${errorMessagefromAPI}`,
        'error'
      )
    )
  } else {
    const status = get(err, 'response.status', '')
    const title = get(err, 'response.statusText', '')
    const message = get(err, 'message', 'โปรดลองใหม่อีกครั้ง')
    dispatch(
      uiActions.setFlashMessage(
        `<b>${
          templateMessage ? `${templateMessage} ` : ''
        }เกิดข้อผิดพลาด ${status}</b><br/>${!isEmpty(title) ? title : message}`,
        'error'
      )
    )
  }

  // session expired
  if (status === 401) {
    eraseCookie('token')
    eraseCookie('firstName')
    eraseCookie('lastName')
    eraseCookie('id')
    eraseCookie('workplace')
    eraseCookie('contact')
    eraseCookie('seal') // for ocsc job
    eraseCookie('ministry') // for ocsc job
    eraseCookie('ministryId') // for ocsc job
    eraseCookie('department') // for ocsc job
    eraseCookie('departmentId') // for ocsc job

    const from = sessionStorage.getItem('from')
    if (from !== '' && from !== null && from !== undefined) {
      sessionStorage.removeItem('from')
      window.location.href = from
    } else {
      setTimeout(() => {
        window.location.href = `${PATH}/login`
        window.location.reload()
      }, 2000)
    }
  }
}
