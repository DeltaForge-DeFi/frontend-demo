import { openLooping } from '@/pages/lite/ui/openLooping';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useState } from 'react';

export const ScriptCloseLooping = () => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

  async function onClick() {
    await openLooping(amount);
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center space-x-2 rounded-lg border-2 p-4">
      <div className="mb-3">Script for Open Looping</div>
      <Input
        className="mb-3"
        type="address"
        placeholder="Address"
        value={address}
        onChange={(e) => {
          console.log(e.target.value);
          setAddress(e.target.value);
        }}
      />
      <Input
        className="mb-3"
        type="amount"
        placeholder="Amount"
        value={amount}
        onChange={(e) => {
          console.log(e.target.value);
          setAddress(e.target.value);
        }}
      />
      <Button onClick={onClick}>Open Looping</Button>
    </div>
  );
};
