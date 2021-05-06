import React from 'react';

import { Header, Footer, Menu } from 'components';


// import {
//   AppHeader,
//   AppFooter
// } from '@coreui/react';



const WalletTemplate = ({
  children = undefined
  ,history}) =>{
  return  (
  <div className="template-walletTemplate">
    <Header hideSearch={true} history = { history ? history : {} } />
    <Menu />
      {children}
      <Footer />
  </div>
)
}

export default WalletTemplate;
