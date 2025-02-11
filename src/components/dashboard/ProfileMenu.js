import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const ProfileMenu = () => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center text-black">
        <span className="text-black">Mon Profil</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-5 h-5 ml-1" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-primary/5' : ''
                } block w-full px-4 py-2 text-left text-sm text-gray-700`}
              >
                Mon Profil
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-primary/5' : ''
                } block w-full px-4 py-2 text-left text-sm text-gray-700`}
              >
                Mes anciens voyages
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-primary/5' : ''
                } block w-full px-4 py-2 text-left text-sm text-gray-700`}
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