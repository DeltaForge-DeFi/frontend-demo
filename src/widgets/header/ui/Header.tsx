import '@rainbow-me/rainbowkit/styles.css';
import { Link } from '@tanstack/react-router';
import { ConnectWallet } from './ConnectWallet';
import NavHeader from '@/shared/ui/nav-header';

export const Header: React.FC = () => {
  return (
    <div className="mt-3 flex w-full justify-between">
      <div>
        <Link to="/">
          <div className="mt-4 flex w-full items-center justify-center">
            <span className="font-boldtext-white text-center text-2xl">DELT▽ F△RGE</span>
          </div>
        </Link>
      </div>
      <div className="flex gap-2 p-2" style={{ fontSize: '12px' }}>
        <NavHeader />
      </div>
      <div className="flex items-center justify-center">
        {/* <Link to="/">
          <div className="mr-left">
            <span className="block cursor-pointer px-3 py-1.5 text-sm uppercase text-white mix-blend-difference md:px-5 md:py-3">profile</span>
          </div>
        </Link> */}
        <ConnectWallet />
      </div>
    </div>
  );
};
