import React from 'react';
import MenuPromoter from '../../components/MenuPromoter';
import Header from '../../components/Header';

const HomePromoter = () => {
  return (
    <div>
        <Header />
    <div className="home">
     <MenuPromoter />
      Home
    </div>
    </div>
  );
};

export default HomePromoter;