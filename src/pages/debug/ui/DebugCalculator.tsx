import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useState } from 'react';

export const Calculator = () => {
  const [address, setAddress] = useState('');

  function onClick() {
    alert(address);
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center space-x-2 rounded-lg border-2 p-4">
      <div className="mb-3">Calculator</div>
      <Input
        className="mb-3"
        type="amount"
        placeholder="amount"
        value={address}
        onChange={(e) => {
          console.log(e.target.value);
          setAddress(e.target.value);
        }}
      />
      <Button onClick={onClick}>Calculator</Button>
    </div>
  );
};
