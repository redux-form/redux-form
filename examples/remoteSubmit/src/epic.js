import { from, of, merge } from 'rxjs'
import { map, mergeMap, catchError } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import { startSubmit, setSubmitSucceeded, setSubmitFailed } from 'redux-form'
import submit from './submit'

export const formEpic = action$ =>
  action$.pipe(
    ofType('FORM_EPIC'),
    mergeMap(action =>
      merge(
        of(startSubmit('remoteSubmit')),
        from(submit(action.payload)).pipe(
          map(response => setSubmitSucceeded('remoteSubmit')),
          catchError(error => of(setSubmitFailed('remoteSubmit')))
        )
      )
    )
  )
