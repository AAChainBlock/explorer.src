import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./ContractMng'),
  loading: () => true
});
