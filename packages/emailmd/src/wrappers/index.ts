import type { WrapperFn } from '../mjml.js';
import { defaultWrapper } from './default.js';

export { defaultWrapper } from './default.js';

const builtInWrappers: Record<string, WrapperFn> = {
  default: defaultWrapper,
};

export function resolveWrapper(wrapper?: string | WrapperFn): WrapperFn {
  if (wrapper === undefined) return defaultWrapper;
  if (typeof wrapper === 'function') return wrapper;
  const fn = builtInWrappers[wrapper];
  if (!fn) throw new Error(`Unknown wrapper: "${wrapper}". Available: ${Object.keys(builtInWrappers).join(', ')}`);
  return fn;
}
