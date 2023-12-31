import { useContext, useEffect, useState } from 'react';
import { StanzaReactContext } from '../context/StanzaContext';
import { StanzaContextName } from '../context/StanzaContextName';
import type { StanzaContext } from '../types/Common';
import { getContextStale } from '../context';

export const useStanzaContext = (
  contextName?: string
): StanzaContext | undefined => {
  const providedContextName = useContext(StanzaContextName);
  const [state, setState] = useState<StanzaContext | undefined>();
  const stanzaInstance = useContext(StanzaReactContext);

  if (stanzaInstance === undefined) {
    throw Error('Component needs to be wrapped with StanzaProvider');
  }

  const contextChanges = stanzaInstance.contextChanges;

  const resultContextName = contextName ?? providedContextName;

  if (resultContextName === undefined) {
    throw Error(
      'Component needs to be wrapped with WithStanzaContextName to use useStanzaContext without a contextName parameter'
    );
  }

  useEffect(() => {
    state?.name !== resultContextName &&
      setState(getContextStale(resultContextName));
  }, [state, resultContextName]);

  useEffect(() => {
    contextChanges.addChangeListener(async (context) => {
      if (context.name === resultContextName) {
        setState(context);
      }
    });

    return () => {
      contextChanges.removeChangeListener(async (context) => {
        if (context.name === resultContextName) {
          setState(undefined);
        }
      });
    };
  }, [contextChanges, resultContextName]);

  return state;
};
