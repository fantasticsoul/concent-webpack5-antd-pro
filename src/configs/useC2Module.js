/** @typedef {import('types/store').Modules} Modules */
import { useConcent } from 'concent';

export function useModGroovySet() {
  /** @type {import('types/store').CtxM<{}, 'GroovySet'>} */
  const ctx = useConcent('GroovySet');
  return ctx;
}
