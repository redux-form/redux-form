import { from, of, concat } from 'rxjs'
import { map, mergeMap, catchError } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import { startSubmit, stopSubmit } from 'redux-form'

import submit from './submit'
import { FORM_NAME } from './DispatchSubmit'

export const formEpic = action$ =>
  action$.pipe(
    ofType('FORM_EPIC'),
    mergeMap(action =>
      concat(
        of(startSubmit(FORM_NAME)),
        from(submit(action.payload)).pipe(
          map(response => stopSubmit(FORM_NAME)),
          catchError(error => of(stopSubmit(FORM_NAME, error.errors)))
        )
      )
    )
  )
