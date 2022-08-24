import { createAction, props } from '@ngrx/store';
import { User } from '../models/user';
import { UsersEntity } from './users.models';

export const buildUserSession = createAction('[Users] Build User Session');


export const buildUserSessionSuccess = createAction(
    '[Users] Build User Session Succes', props<{ users: User }>()
    );

export const buildUserSessionFailed = createAction('[Users] Build User Session failed');
