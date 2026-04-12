import api from './api';

export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (userData) => api.put('/users/profile', userData);
export const deleteAccount = () => api.delete('/users/profile');
export const exportData = () => api.get('/users/export');

const userService = {
  getUserProfile,
  updateUserProfile,
  deleteAccount,
  exportData
};

export default userService;
