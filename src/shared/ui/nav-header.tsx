import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { defineConfig, loadEnv } from 'vite';

function NavHeader() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul className="relative mx-auto flex w-fit rounded-full p-1" onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}>
      <Tab setPosition={setPosition}>
        <Link to="/lite" className="[&.active]:font-bold">
          lite
        </Link>
      </Tab>
      <Tab setPosition={setPosition}>
        <Link to="/pro" className="[&.active]:font-bold">
          pro
        </Link>
      </Tab>
      <Tab setPosition={setPosition}>
        <a href={import.meta.env.VITE_DOCS_URL} target="_blank">
          docs
        </a>
      </Tab>
      <Cursor position={position} />
    </ul>
  );
}

const Tab = ({ children, setPosition }: { children: React.ReactNode; setPosition: any }) => {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-sm uppercase text-white mix-blend-difference md:px-5 md:py-3"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: any }) => {
  return <motion.li animate={position} className="boorder-white absolute z-0 rounded-full border-2 border-white md:h-11" />;
};

export default NavHeader;
