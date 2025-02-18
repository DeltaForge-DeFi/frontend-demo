import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useState } from 'react';

export const ReadGMXShortPosition = () => {
  const dsProxy = localStorage.getItem('ds_proxy');
  const [address, setAddress] = useState(dsProxy || '');
  const [data, setDate] = useState({
    poolAddress: null,
    availableBorrowsBase: null,
    totalDebtBase: null,
    healthFactor: null,
    ltv: null,
  });

  return (
    <div className="flex w-full max-w-sm flex-col items-center space-x-2 rounded-lg border-2 p-4">
      <div className="mb-3">Read Looping Position By Address:</div>
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
      {/* <Button onClick={onClick}>Get Data</Button> */}
      <div className="relative w-[300px] space-y-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="my-2 rounded-lg border p-2">
            <div className="overflow-scroll text-gray-600">
              <p className="text-sm font-semibold">{key}</p>
              <p className="p-5 text-gray-600">{value ? value : 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
