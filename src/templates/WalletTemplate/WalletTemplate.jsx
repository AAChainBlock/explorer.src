import React from 'react';


import { Header, Footer } from 'components';


// import {
//   AppHeader,
//   AppFooter
// } from '@coreui/react';



const WalletTemplate = ({
  children = undefined
  ,history}) =>{
  return  (
  <div className="template-walletTemplate">
    <Header history = { history ? history : {} } />
      {children}
      <Footer />
  </div>
)
}

export default WalletTemplate;
