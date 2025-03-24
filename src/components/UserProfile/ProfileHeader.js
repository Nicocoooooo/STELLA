import React from 'react';
import { Link } from 'react-router-dom';
import ProfileMenu from '../dashboard/ProfileMenu';

const Header = () => {
  return (
    <div className="w-full">
      {/* Barre supérieure : Logo à gauche, menu à droite */}
      <div className="flex justify-between items-center mb-6 sm:mb-8 md:mb-12">
        <Link to="/">
          <img
            src={require('../../assets/images/Logo.png')}
            alt="Stella"
            className="h-10 sm:h-12 md:h-16"
          />
        </Link>
        <ProfileMenu />
      </div>
    </div>
  );
};

export default Header;
