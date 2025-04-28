import { Button } from "@/shared/ui/Button";


export const PositionAmountDisplay = ({ isLoading, longAmount, shortAmount }: { isLoading: boolean; longAmount: string; shortAmount: string }) => {
  return (
    <div className="my-2 mb-4 border border-white p-5 shadow-[10px_10px_10px_10px_rgba(255,_255,_255,_0.05)]">
      {isLoading ? (
        <label className="mb-2 block text-white">Calculating positions...</label>
      ) : (
        <>
          <label className="mb-2 block text-white">Long: {longAmount} USDC</label>
          <label className="mb-2 block text-white">Short: {shortAmount} USDC</label>
        </>
      )}
    </div>
  );
};

export const DepositWindow = ({
  amount,
  onChange,
  calculate,
  handleConfirm,
  isLoading,
  shortData,
  longData,
}: {
  amount: string;
  onChange: (e: any) => void;
  calculate: () => void;
  handleConfirm: () => void;
  isLoading: boolean;
  shortData: any;
  longData: any
}) => {
  return (
    <>
      <div className="mb-4 flex w-full flex-row justify-between">
        <div>
          <div className="text-right text-white">Enter Deposit Amount</div>
        </div>
      </div>
      <div className="flex-row border border-white p-10">
        <div className="flex items-center justify-center">
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex flex-row">
                <div className="flex flex-col w-full">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        onChange(e);
                      }
                    }}
                    className={`mb-2 w-full rounded border ${Number(amount) < 5 && amount !== ''
                        ? 'border-red-500'
                        : 'border-white'
                      } bg-gray-900 p-2 text-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                    placeholder="Amount in USDC"
                  />
                  <div className="h-5 mb-2">
                  {Number(amount) < 5 && amount !== '' && (
                    <span className="text-red-500 text-sm">
                      Amount must be at least 5 USDC
                    </span>
                  )}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={calculate} 
                  className={`ml-5 mr-4 ${isLoading && 'bg-gray-500 cursor-not-allowed'}`}
                  disabled={Number(amount) < 5}
                >
                  Calculate
                </Button>
              </div>
              <PositionAmountDisplay
                shortAmount={shortData ? `${Number(shortData.shortAmount).toFixed(4)}` : '0'}
                isLoading={isLoading}
                longAmount={longData ? `${Number(longData.longAmount).toFixed(4)}` : '0'}
              />
              <Button 
                variant="outline" 
                className={`w-full ${!shortData || !longData && 'bg-gray-500 cursor-not-allowed'}`}
                onClick={handleConfirm}
                disabled={!shortData || !longData}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

