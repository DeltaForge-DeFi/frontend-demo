import { DebugPage } from '@/pages/debug';
import { createLazyFileRoute } from '@tanstack/react-router';


export const Route = createLazyFileRoute('/debug')({
  component: DebugPage,
});
