import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./CoinMng'),
  loading: () => true
});
