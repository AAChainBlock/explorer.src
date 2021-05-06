import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./ResourceMng'),
  loading: () => true
});
