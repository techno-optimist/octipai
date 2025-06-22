import React, { useEffect, useRef } from 'react';
import {
  drawIridescentShimmer,
  drawSpiralTimeline,
  drawThermalGradient,
  drawTetherFilaments,
  drawLuminosityHalo,
  drawInterferenceWaves,
  drawSymmetryBloom,
  drawMorphingMetamorphosis,
  PrimitiveContext,
} from './MeaningPrimitives';
import { computeSalience, MeaningDimensions, DimensionKey } from './MeaningSalience';

interface Props {
  meaningData?: MeaningDimensions;
  isAnalyzing?: boolean;
  width?: number;
  height?: number;
}

const MeaningVisualizerV2: React.FC<Props> = ({
  meaningData,
  isAnalyzing = false,
  width = 800,
  height = 600,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mapping from dimension key to primitive draw function
  const primitiveMap: Record<DimensionKey, (ctx: PrimitiveContext) => void> = {
    INEFFABLE_QUALITY: drawIridescentShimmer,
    TEMPORAL_FLOW: drawSpiralTimeline,
    EMOTIONAL_SUBSTRATE: drawThermalGradient,
    RELATIONAL_DYNAMICS: drawTetherFilaments,
    CONSCIOUSNESS_LEVEL: drawLuminosityHalo,
    PARADOX_TENSION: drawInterferenceWaves,
    ARCHETYPAL_RESONANCE: drawSymmetryBloom,
    TRANSFORMATIVE_POTENTIAL: drawMorphingMetamorphosis,
  } as const;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (!meaningData || isAnalyzing) {
        // Gentle breathing gradient when analyzing or no data
        const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.7);
        const pulse = Math.sin(time * 1.5) * 0.15 + 0.85;
        gradient.addColorStop(0, `rgba(120, 100, 255, ${0.5 * pulse})`);
        gradient.addColorStop(1, `rgba(30, 30, 60, ${0.8 * pulse})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      } else {
        const { intensities } = computeSalience(meaningData);
        const commonCtx: Omit<PrimitiveContext, 'intensity'> = {
          ctx,
          width,
          height,
          centerX: width / 2,
          centerY: height / 2,
          time,
        };
        // Draw primitives, order doesn't matter much, but luminosity halo first for layering
        (Object.keys(intensities) as DimensionKey[]).forEach((key) => {
          const intensity = intensities[key];
          if (intensity <= 0.01) return;
          primitiveMap[key]({ ...commonCtx, intensity });
        });
      }

      time += 0.016;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [meaningData, isAnalyzing, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        borderRadius: '0.5rem',
        border: '1px solid rgba(255,255,255,0.05)',
        background: '#000',
      }}
    />
  );
};

export default MeaningVisualizerV2; 