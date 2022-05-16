import { SERVICE_URL } from 'config';
import api from '../api';

const notificationData = [
  {
    id: 1,
    img: '/img/profile/profile-1.webp',
    title: 'profile-1',
    detail: 'New space request',
    link: '#/',
  },
];
api.onGet(`${SERVICE_URL}/notifications`).reply(200, notificationData);
