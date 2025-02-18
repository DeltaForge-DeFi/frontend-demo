import { Header } from '@/widgets/header';
import { ReadLoopingPosition } from './ReadLoopingPosition';
import { Calculator } from './DebugCalculator';
import { ScriptOpenLooping } from './ScriptOpenLooping';
import { ScriptCloseLooping } from './ScriptCloseLooping';

export const DebugPage = () => {
  return (
    <div className="container mx-auto">
      <Header />
      <div className="flex min-h-screen w-full flex-col justify-between p-10">
        <div className="grid grid-cols-3 gap-x-2 gap-y-2">
          <ReadLoopingPosition />
          <Calculator />
          <ScriptOpenLooping />
          <ScriptCloseLooping />
        </div>
      </div>
    </div>
  );
};
