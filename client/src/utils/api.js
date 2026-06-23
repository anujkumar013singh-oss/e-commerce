import axios from 'axios';

axios.defaults.withCredentials = true;

export const fetchProducts = async (params = {}) => {
  const { data } = await axios.get('/api/products', { params });
  return data;
};

export const fetchProduct = async (id) => {
  const { data } = await axios.get(`/api/products/${id}`);
  return data;
};

export const fetchProductsByIds = async (ids) => {
  const { data } = await axios.get('/api/products', { params: { ids: ids.join(','), limit: 200 } });
  return data;
};

export const fetchTrending = async () => {
  const { data } = await axios.get('/api/products/trending');
  return data;
};

export const placeOrder = async (orderData) => {
  const { data } = await axios.post('/api/orders', orderData);
  return data;
};

export const trackOrder = async (trackingId, mobile) => {
  const { data } = await axios.get('/api/orders/track', { params: { trackingId, mobile } });
  return data;
};
