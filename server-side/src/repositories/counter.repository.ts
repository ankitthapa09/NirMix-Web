import Counter from '../models/counterModel.js';

/**
 * Atomically increment and return the next sequence number for a given key.
 * Upserts the counter on first use, so concurrent creates get distinct numbers.
 */
export async function getNextSequence(key: string): Promise<number> {
  const counter = await Counter.findByIdAndUpdate(
    key,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}
