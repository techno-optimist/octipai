export interface MeaningDimensions {
  TEMPORAL_FLOW: number;
  INEFFABLE_QUALITY: number;
  EMOTIONAL_SUBSTRATE: number;
  RELATIONAL_DYNAMICS: number;
  CONSCIOUSNESS_LEVEL: number;
  PARADOX_TENSION: number;
  ARCHETYPAL_RESONANCE: number;
  TRANSFORMATIVE_POTENTIAL: number;
}

export type DimensionKey = keyof MeaningDimensions;

export interface SalienceResult {
  intensities: Record<DimensionKey, number>; // 0-1 after salience weighting
  ordered: DimensionKey[]; // sorted by original magnitude desc
}

/**
 * Computes salience-weighted intensities such that:
 *  – The three highest raw magnitudes are kept at full normalised strength.
 *  – Remaining dimensions are multiplied by FADE_FACTOR (default 0.15).
 */
export function computeSalience(
  meaning: MeaningDimensions,
  fadeFactor = 0.15
): SalienceResult {
  // Convert to entries and find max for normalisation
  const entries = Object.entries(meaning) as [DimensionKey, number][];
  const maxVal = Math.max(...entries.map(([, v]) => v), 0.00001);
  // Sort by raw magnitude desc
  const ordered = [...entries].sort((a, b) => b[1] - a[1]).map(([k]) => k);
  const topThree = new Set(ordered.slice(0, 3));
  const intensities: Record<DimensionKey, number> = {} as Record<DimensionKey, number>;
  for (const [key, value] of entries) {
    const normalised = value / maxVal; // 0-1
    intensities[key] = topThree.has(key) ? normalised : normalised * fadeFactor;
  }
  return { intensities, ordered };
} 