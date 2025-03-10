import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer l'identifiant de l'utilisateur du localStorage
    localStorage.removeItem('userId');
    // Rediriger vers la page de connexion
    navigate('/login');
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center text-gray-700 hover:text-primary transition-colors font-outfit">
        <span>Mon Profil</span>
        <ChevronDown className="w-4 h-4 ml-1.5 text-gray-400" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-lg py-2 border border-gray-50">
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-primary/5 text-primary' : 'text-gray-700'
                } block w-full px-6 py-2.5 text-left text-base font-outfit transition-colors`}
              >
                Mon Profil
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => navigate('/past-trips')}
                className={`${
                  active ? 'bg-primary/5 text-primary' : 'text-gray-700'
                } block w-full px-6 py-2.5 text-left text-base font-outfit transition-colors`}
              >
                Mes anciens voyages
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleLogout}
                className={`${
                  active ? 'bg-primary/5 text-primary' : 'text-gray-700'
                } block w-full px-6 py-2.5 text-left text-base font-outfit transition-colors`}
              >
                Se déconnecter
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ProfileMenu;