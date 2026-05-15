import { Plant } from '../entities/Plant';
import { RESEARCH_CONSTANTS } from '../constants';

/**
 * Manages calculations related to Research Points (RP).
 */
export class ResearchManager {
  /**
   * Calculates the total Research Points (RP) earned from a set of plants.
   * 
   * Formula: Σ ([Base RP] + [Health Bonus]) * [Difficulty Multiplier] * [Density Multiplier]
   * 
   * Health Bonus: (Current Health / Max Health) * 10.
   * 
   * @param plants List of plants harvested.
   * @param difficulty Current game difficulty multiplier.
   * @returns Total RP earned.
   */
  static calculateRP(plants: Plant[], difficulty: number): number {
    let totalRP = 0;
    const speciesCounts: Record<string, number> = {};

    // Tally species counts for density multipliers
    plants.forEach(p => {
      const speciesId = p.getSpeciesId();
      speciesCounts[speciesId] = (speciesCounts[speciesId] || 0) + 1;
    });

    plants.forEach(p => {
      // Base RP from entity
      const base = p.getBaseRP();

      // Health Bonus: (Current Health / Max Health) * RESEARCH_CONSTANTS.HEALTH_BONUS_SCALE.
      const healthBonus = (p.health / p.maxHealth) * RESEARCH_CONSTANTS.HEALTH_BONUS_SCALE;

      // Density Multiplier from entity
      const densityMult = p.getDensityMultiplier(speciesCounts[p.getSpeciesId()]);

      totalRP += (base + healthBonus) * difficulty * densityMult;
    });

    return Math.floor(totalRP);
  }
}
