import * as R from 'ramda';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

export const hasStatus = R.propEq('status');
export const has401Status = hasStatus(401);
export const has403Status = hasStatus(403);
export const hasAuthErrorStatus = R.anyPass([has401Status, has403Status]);
export const isHttpResponse = response => response instanceof HttpResponse;
export const isHttpErrorResponse = response =>
  response instanceof HttpErrorResponse;
export const isHttpAuthErrorResponse = R.allPass([
  hasAuthErrorStatus,
  isHttpErrorResponse
]);
