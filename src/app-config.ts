import { environment } from "./environments";

export default {
  backend: {
    backendUrl: 'https://tfm-backend-jcuc.onrender.com' //'http://localhost:8080/'
  },
  tmdb: {
    apikey: environment.apiKey,
    apiUrl: 'https://api.themoviedb.org/3/',
    personBaseUrl: 'https://api.themoviedb.org/3/person/',
    imgUrl: 'https://image.tmdb.org/t/p/w1280',
    genreUrl:'https://api.themoviedb.org/3/genre/'
  },
};