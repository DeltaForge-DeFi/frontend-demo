import { BadgeDelta } from "@/shared/ui/badge-delta";
import { Button } from "@/shared/ui/Button";

export const WithdrawWindow = ({ withdraw }: { withdraw: () => void }) => {
    return (
      <div className="mb-20 flex justify-center">
        <Button variant="outline" onClick={async () => await withdraw()}>
          Withdraw
        </Button>
        <BadgeDelta variant="solid" deltaType="increase" iconStyle="line" value="9.3%" className="mr-3" />
      </div>
    );
  };