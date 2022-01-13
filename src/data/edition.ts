import { Tier, Cycle } from './enum';

export interface Edition {
  tier: Tier;
  cycle: Cycle;
}

export function isEditionEqual(a: Edition, b: Edition): boolean {
  return a.tier === b.tier && a.cycle === b.cycle;
}
