import { SERVICE_URL } from 'config';
import api from '../api';

const notificationData = [
 
];
api.onGet(`${SERVICE_URL}/notifications`).reply(200, notificationData);
