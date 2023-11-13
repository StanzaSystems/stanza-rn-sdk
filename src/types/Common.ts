import type { FeatureState, StanzaChangeEmitter } from '@getstanza/core';

export interface StanzaFeature {
  name: string;
  disabled: boolean;
  message?: string | undefined;
  lastRefreshTime: number;
}

export interface StanzaContext {
  readonly name: string;
  featuresNames: string[];
  features: Record<string, StanzaFeature>;
  ready: boolean;
}

export interface StanzaInstance {
  contextChanges: StanzaChangeEmitter<StanzaContext>;
  featureChanges: StanzaChangeEmitter<FeatureState>;
}
