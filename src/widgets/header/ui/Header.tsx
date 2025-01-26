import '@rainbow-me/rainbowkit/styles.css';
import { Link } from '@tanstack/react-router';
import { ConnectWallet } from './ConnectWallet';


export const Header: React.FC = () => {
  return (
    <>
      <div className="full-width container mx-auto flex justify-between mt-4">
        <div className="flex gap-2 p-2" style={{ fontSize: '12px' }}>
          //
          <Link to="/" className="[&.active]:font-bold">
            HOME
          </Link>
          //
          <Link to="/lite" className="[&.active]:font-bold">
           LITE
          </Link>
          //
          <Link to="/about" className="[&.active]:font-bold">
            ABOUT
          </Link>
        </div>
        <div>
          <Link to="/">
            <small style={{ fontSize: '16px' }}>DELTA</small> Forge
          </Link>
        </div>
        <div>
          <ConnectWallet />
        </div>
      </div>
    </>
  );
};
