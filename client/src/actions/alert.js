import { v4 as uuid } from 'uuid'
import { set_alert, remove_alert } from "./types";

export const setAlert = (msg, alertType) => dispatch => {
  const id = uuid()
  dispatch({
    type: set_alert,
    payload: { msg, alertType, id }
  })
}
