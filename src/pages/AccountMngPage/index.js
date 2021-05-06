import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./AccountMng'),
  loading: () => true
});
