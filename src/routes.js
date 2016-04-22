import CardsList from './client/components/cards-list/';
import CardDetails from './client/components/card-details/';
import AdminCards from './client/components/admin-card/';
import Login from './client/components/login/';

export default [
  { path: '/', as: 'Cards', component: CardsList },
  { path: '/cards/artist/:artist', as: 'CardsByArtist', component: CardsList },
  { path: '/createcard', as: 'CreateCard', component: AdminCards },
  { path: '/cards/:code', as: 'CardDetails', component: CardDetails },
  { path: '/cards/:code/edit', as: 'EditCard', component: AdminCards },
  { path: '/login/', as: 'Login', component: Login }
];
