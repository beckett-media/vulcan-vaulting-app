import { useWalletModalContext } from '../../hooks/useWalletModal';
import { BasicModal } from './BasicModal';
import { WalletSelector } from './WalletSelector';

export const WalletModal = () => {
  const { isWalletModalOpen, setWalletModalOpen } = useWalletModalContext();

  return (
    <BasicModal open={isWalletModalOpen} setOpen={setWalletModalOpen}>
      <WalletSelector />
    </BasicModal>
  );
};
