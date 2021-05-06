import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./TransactionQueryPage'),
  loading: () => false
});
