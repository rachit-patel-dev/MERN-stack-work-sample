import { complement, compose, isNil, pickBy } from 'ramda';

const notNull = compose(complement(isNil));

/**
 * we need to remove undefined array means not required data.
 */
const cleanData = (entity: Record<string, any>) => pickBy(notNull, entity);

export { cleanData };
