import CardsList from './components/cards-list/';
import CardDetails from './components/card-details/';
import AdminCards from './components/admin-card/';
import Login from './components/login/';

export default [
  { path: '', component: CardsList },
  { path: 'createcard', component: AdminCards },
  { path: 'Carta', redirectTo: 'cards', pathMatch: 'prefix' },
  { path: 'cards', children: [
    { path: 'artist/:artist', component: CardsList },
    { path: ':code', component: CardDetails },
    { path: ':code/edit', component: AdminCards }
  ] },
  { path: 'login', component: Login }
];
