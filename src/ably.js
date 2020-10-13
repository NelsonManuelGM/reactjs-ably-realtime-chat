import {Realtime} from 'ably/browser/static/ably-commonjs.js';
import {API_KEY_ADMIN} from "./apikey";

window.Ably = new Realtime({key: API_KEY_ADMIN, clientId: 'admin'});