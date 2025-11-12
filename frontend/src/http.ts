import axios from 'axios';

const api = axios.create({
  baseURL: 'https://smokkkkiiii.ru:8443', // адрес твоего бэка
  headers: {
    'Content-Type': 'application/json',
  },
});

export const startGame = async (userId: string) => {
  try {
    const response = await api.post('/api/start-game', { user_id: userId });
    return response.data;
  } catch (error: any) {
    console.error('Ошибка при старте игры:', error.response || error.message);
    throw error;
  }
};

export default api;
