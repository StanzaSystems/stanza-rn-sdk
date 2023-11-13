import React, { useEffect } from 'react';
import { StanzaReactContext } from './StanzaContext';
import {
  Stanza,
  StanzaChangeTarget,
  type StanzaCoreConfig,
} from '@getstanza/core';
import type { StanzaContext } from '../types/Common';
import { getContextStale } from '../context';

export interface StanzaProviderProps {
  children?: React.ReactNode;
  config: StanzaCoreConfig;
}

const contextChanges = new StanzaChangeTarget<StanzaContext>();

export const StanzaProvider: React.FunctionComponent<StanzaProviderProps> = (
  props
) => {
  const { children, config } = props;

  const featureToContextMap = config.contextConfigs.reduce<
    Record<string, string[]>
  >((result, contextConfig) => {
    contextConfig.features.forEach((feature) => {
      result[feature] = result[feature] ?? [];
      result[feature]?.push(contextConfig.name);
    });
    return result;
  }, {});

  useEffect(() => {
    Stanza.init(config);

    const featureListener = Stanza.featureChanges.addChangeListener(
      (featureState) => {
        featureToContextMap[featureState.featureName]?.forEach(
          (contextName) => {
            contextChanges.dispatchChange(getContextStale(contextName));
          }
        );
      }
    );

    const enablementNumberListener =
      Stanza.enablementNumberChanges.addChangeListener(() => {
        new Set(Object.values(featureToContextMap).flat()).forEach(
          (contextName) => {
            contextChanges.dispatchChange(getContextStale(contextName));
          }
        );
      });

    return () => {
      Stanza.featureChanges.removeChangeListener(featureListener);
      Stanza.enablementNumberChanges.removeChangeListener(
        enablementNumberListener
      );
    };
  }, [config, featureToContextMap]);

  return (
    <StanzaReactContext.Provider
      value={{
        contextChanges: contextChanges,
        featureChanges: Stanza.featureChanges,
      }}
    >
      {children}
    </StanzaReactContext.Provider>
  );
};
