import {
  Stanza,
  type FeatureState,
  groupBy,
  identity,
  utils,
} from '@getstanza/core';
import type { StanzaContext } from './types/Common';
import { createFeaturesFromFeatureState } from './functions';

const { getConfig, getEnablementNumber, getEnablementNumberStale } =
  utils.globals;

export const createContext = (
  name: string,
  featureStates: FeatureState[],
  enablementNumber: number,
  ready = false
): StanzaContext => {
  const features = createFeaturesFromFeatureState(
    featureStates,
    enablementNumber
  ).reduce(groupBy('name', identity), {});

  return {
    name,
    featuresNames: Object.keys(features),
    features,
    ready,
  };
};

export async function getContextHot(name: string): Promise<StanzaContext> {
  const features = getContextFeatures(name);
  const newFeatures = await Stanza.getFeatureStatesHot(features);
  const enablementNumber = await getEnablementNumber();
  return createContext(name, newFeatures, enablementNumber, true);
}

export function getContextStale(name: string): StanzaContext {
  const features = getContextFeatures(name);
  const featureStates = Stanza.getFeatureStatesStale(features);
  const enablementNumber = getEnablementNumberStale();
  return createContext(name, featureStates, enablementNumber, true);
}

export async function getContext(name: string): Promise<StanzaContext> {
  const features = getContextFeatures(name);
  const featureStates = await Stanza.getFeatureStates(features);
  const enablementNumber = await getEnablementNumber();
  return createContext(name, featureStates, enablementNumber, true);
}

function getContextFeatures(name: string): string[] {
  const contextConfig = getConfig().contextConfigs[name];
  if (contextConfig === undefined) {
    throw new Error(`Configuration for context ${name} is not found.`);
  }
  return contextConfig.features;
}
