import React from 'react';
import MenuAuthority from "../../components/MenuAuthority";
import Header from '../../components/Header';

const ReadDataAuthority = () => {
  return (
    <div>
    <Header />
    <div className="ReadDocuments">
     <MenuAuthority />
      Read Data
    </div>
    </div>
  );
};

export default ReadDataAuthority;