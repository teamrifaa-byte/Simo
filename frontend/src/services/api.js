import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Injection automatique du token JWT
api.interceptors.request.use((config) => {
  let token = null;
  try { token = localStorage.getItem('marinfo_token'); } catch (_) { token = null; }
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirection vers /login si 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      try {
        localStorage.removeItem('marinfo_token');
        localStorage.removeItem('marinfo_user');
      } catch (_) {}
    }
    return Promise.reject(err);
  }
);

export default api;

// ----- Endpoints groupés par domaine -----
export const authAPI = {
  login:      (data) => api.post('/auth/login', data),
  register:   (data) => api.post('/auth/register', data),
  loginAdmin: (data) => api.post('/auth/admin/login', data),
};

export const articleAPI = {
  list:   (params) => api.get('/articles', { params }),
  get:    (id)     => api.get(`/articles/${id}`),
  create: (data)   => api.post('/admin/articles', data),
  update: (id, d)  => api.put(`/admin/articles/${id}`, d),
  delete: (id)     => api.delete(`/admin/articles/${id}`),
  ruptures:()      => api.get('/admin/articles/rupture'),
};

export const catalogueAPI = {
  categories: ()    => api.get('/categories'),
  genres:     (cat) => api.get('/genres', { params: { categorieId: cat } }),
  createCat:  (d)   => api.post('/admin/categories', d),
  updateCat:  (id, d)=> api.put(`/admin/categories/${id}`, d),
  deleteCat:  (id)  => api.delete(`/admin/categories/${id}`),
  createGenre:(d)   => api.post('/admin/genres', d),
};

export const commandeAPI = {
  create: (data) => api.post('/commandes', data),
  mine:   ()     => api.get('/commandes/mes-commandes'),
  detail: (id)   => api.get(`/commandes/${id}`),
  accuse: (id)   => api.post(`/commandes/${id}/accuse-reception`),
  // admin
  all:    ()     => api.get('/admin/commandes'),
  setEtat:(id, etat) => api.patch(`/admin/commandes/${id}/etat`, null, { params: { etat } }),
  livrer: (id, d) => api.post(`/admin/commandes/${id}/livraison`, d),
};

export const promotionAPI = {
  actives: ()  => api.get('/promotions/actives'),
  all:     ()  => api.get('/admin/promotions'),
  create:  (d) => api.post('/admin/promotions', d),
  delete:  (id)=> api.delete(`/admin/promotions/${id}`),
};

export const adminAPI = {
  dashboard:  ()  => api.get('/admin/dashboard'),
  reappros:   ()  => api.get('/admin/reapprovisionnements'),
  demanderReappro: (articleId, quantite, fournisseur) =>
    api.post('/admin/reapprovisionnements', null, { params: { articleId, quantite, fournisseur } }),
  receptionner: (id) => api.post(`/admin/reapprovisionnements/${id}/receptionner`),
};
