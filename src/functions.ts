import { type FeatureState } from '@getstanza/core';
import type { StanzaFeature } from './types/Common';

export function createFeaturesFromFeatureState(
  featureResponse: FeatureState[],
  enablementNumber: number
): StanzaFeature[] {
  return featureResponse
    .map((featureState) =>
      createFeatureFromFeatureState(featureState, enablementNumber)
    )
    .filter((feature): feature is StanzaFeature => feature !== undefined);
}

export function createFeatureFromFeatureState(
  {
    enabledPercent,
    featureName,
    messageEnabled,
    messageDisabled,
    lastRefreshTime,
  }: FeatureState,
  enablementNumber: number
): StanzaFeature | undefined {
  if (enabledPercent >= 100) {
    return {
      name: featureName,
      disabled: false,
      message: messageEnabled,
      lastRefreshTime,
    };
  } else if (
    // if the enabled percent is less than this context's enablement number, this feature is enabled
    enabledPercent > enablementNumber
  ) {
    return {
      name: featureName,
      disabled: false,
      message: messageEnabled,
      lastRefreshTime,
    };
  } else {
    /// if not use values for a disabled feature
    return {
      name: featureName,
      disabled: true,
      message: messageDisabled,
      lastRefreshTime,
    };
  }
}
