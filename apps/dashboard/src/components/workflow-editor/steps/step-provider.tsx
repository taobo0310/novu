import { createContext, useMemo, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';

import { useWorkflow } from '@/components/workflow-editor/workflow-provider';
import { useFetchStep } from '@/hooks/use-fetch-step';
import { StepDataDto, StepTypeEnum } from '@novu/shared';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { createContextHook } from '@/utils/context';
import { Step } from '@/utils/types';

export type StepEditorContextType = {
  isPending: boolean;
  step?: StepDataDto;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<StepDataDto, Error>>;
};

export const StepContext = createContext<StepEditorContextType>({} as StepEditorContextType);

export const StepProvider = ({ children }: { children: ReactNode }) => {
  const { workflow } = useWorkflow();
  const { stepSlug = '' } = useParams<{
    workflowSlug: string;
    stepSlug: string;
  }>();
  const { step, isPending, refetch } = useFetchStep({
    workflowSlug: workflow?.slug,
    stepSlug,
  });

  const value = useMemo(() => ({ isPending, step, refetch }), [isPending, step, refetch]);

  return <StepContext.Provider value={value}>{children}</StepContext.Provider>;
};

export const useStep = createContextHook(StepContext);

export const STEP_NAME_BY_TYPE: Record<StepTypeEnum, string> = {
  email: 'Email Step',
  chat: 'Chat Step',
  in_app: 'In-App Step',
  sms: 'SMS Step',
  push: 'Push Step',
  digest: 'Digest Step',
  delay: 'Delay Step',
  trigger: 'Trigger Step',
  custom: 'Custom Step',
};

export const createStep = (type: StepTypeEnum): Step => ({
  name: STEP_NAME_BY_TYPE[type],
  stepId: '',
  slug: '_st_',
  type,
  _id: crypto.randomUUID(),
});