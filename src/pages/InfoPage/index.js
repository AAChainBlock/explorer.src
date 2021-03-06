import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./InfoPage'),
  loading: () => true
});
