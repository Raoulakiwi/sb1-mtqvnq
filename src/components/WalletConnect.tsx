import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Wallet, LogOut } from 'lucide-react';

export const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
    >
      <Wallet className="w-4 h-4 mr-2" />
      Connect Wallet
    </button>
  );
};