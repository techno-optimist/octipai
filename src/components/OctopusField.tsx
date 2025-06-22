import React, { useEffect, useRef } from 'react';
import { MeaningDimensions } from './MeaningSalience';

interface Props {
  meaningData?: MeaningDimensions;
  isAnalyzing?: boolean;
  width?: number;
  height?: number;
}

const OctopusField: React.FC<Props> = ({
  meaningData,
  isAnalyzing = false,
  width = 800,
  height = 600,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
    if (!ctx) return;

    let time = 0;
    let animationId: number;

    const render = () => {
      if (!meaningData || isAnalyzing) {
        // Calm breathing state
        const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.8);
        const breathe = Math.sin(time * 0.5) * 0.1 + 0.9;
        gradient.addColorStop(0, `rgba(30, 20, 60, ${breathe})`);
        gradient.addColorStop(1, 'rgba(10, 10, 20, 1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        time += 0.016;
        animationId = requestAnimationFrame(render);
        return;
      }

      // CREATE THE UNIFIED OCTOPUS FIELD - now with CONTEXTUAL MEANING
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      
      // Extract meaning magnitudes
      const temporal = meaningData.TEMPORAL_FLOW;
      const ineffable = meaningData.INEFFABLE_QUALITY;
      const emotional = meaningData.EMOTIONAL_SUBSTRATE;
      const relational = meaningData.RELATIONAL_DYNAMICS;
      const consciousness = meaningData.CONSCIOUSNESS_LEVEL;
      const paradox = meaningData.PARADOX_TENSION;
      const archetypal = meaningData.ARCHETYPAL_RESONANCE;
      const transformative = meaningData.TRANSFORMATIVE_POTENTIAL;

      // CONTEXTUAL MEANING PATTERNS - different flow behaviors based on content
      const isLifeEvent = transformative > 0.8; // Birth, major transitions
      const isFamilyMoment = relational > 0.7; // Family gatherings, connections
      const isArchetypalScene = archetypal > 0.7; // Sacred, universal patterns
      const isHighlyIneffable = ineffable > 0.9; // Mystical, beyond words

      // The Octopus Becomes The Meaning...
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const index = (y * width + x) * 4;
          
          // Normalized coordinates
          const nx = x / width - 0.5;
          const ny = y / height - 0.5;
          const distFromCenter = Math.sqrt(nx * nx + ny * ny);
          const angle = Math.atan2(ny, nx);
          
          // SMOOTH BLENDING OF ALL MEANING INFLUENCES - no discrete boundaries
          
          // Life emergence spiral (always present, scaled by transformative potential)
          const emergenceSpiral = Math.sin(angle * 2 + time * 0.6 - distFromCenter * 6) * transformative;
          
          // Protective embrace circles (always present, scaled by relational dynamics)  
          const embraceCircles = Math.cos(distFromCenter * 4 + time * 0.4) * Math.sin(angle * 2 + time * 0.2) * relational;
          
          // Sacred geometry patterns (always present, scaled by archetypal resonance)
          const sacredPattern = Math.sin(angle * 4 + time * archetypal * 0.3) * Math.cos(distFromCenter * 8) * archetypal;
          
          // General consciousness flow (base layer for all content)
          const consciousnessFlow = Math.sin(angle * 1.5 + time * 0.5 + distFromCenter * 3) * consciousness;
          
          // BLEND ALL PATTERNS SMOOTHLY - no hard switches
          const baseFlow = (
            emergenceSpiral * 0.25 +
            embraceCircles * 0.25 + 
            sacredPattern * 0.25 +
            consciousnessFlow * 0.25
          );
          
          // TEMPORAL FLOW - creates movement through the field
          const temporalWave = temporal * Math.sin(x * 0.015 + time * temporal) * 
                              Math.cos(y * 0.012 - time * temporal * 0.7);
          
          // INEFFABLE QUALITY - iridescent shimmer that shifts across the field
          const ineffablePhase = time * ineffable * 0.3 + x * 0.006 + y * 0.005;
          const ineffableShimmer = Math.sin(ineffablePhase) * Math.cos(ineffablePhase * 1.2) * ineffable;
          
          // EMOTIONAL SUBSTRATE - thermal waves that carry feeling
          const emotionalHeat = emotional * Math.sin(x * 0.008 + time * emotional * 0.8) * 
                               Math.cos(y * 0.01 - time * emotional * 0.6);
          
          // CONSCIOUSNESS BREATHING - central luminosity that pulses
          const consciousnessGlow = consciousness * Math.exp(-distFromCenter * 1.5) * 
                                   (1 + Math.sin(time * 1.2 + distFromCenter * 3) * 0.15);
          
          // PARADOX INTERFERENCE - creates complexity in highly paradoxical content
          const paradoxNoise = paradox > 0.3 ? 
            Math.sin(x * 0.02 + time * paradox * 1.5) * Math.cos(y * 0.018 - time * paradox * 1.2) * paradox :
            0;
          
          // COMBINE ALL INFLUENCES INTO ONE UNIFIED FIELD
          
          // Base hue determined by meaning blend (no discrete color shifts)
          const baseHue = (
            30 * transformative + // Golden life energy
            120 * relational + // Nurturing greens  
            270 * archetypal + // Sacred purples
            200 * consciousness + // Consciousness blues
            angle * 28.6 + // Natural spiral progression
            time * 6 // Very slow evolution
          );
          
          // Smooth hue modulation from all influences
          const hueModulation = (
            ineffableShimmer * 20 + // Gentle shimmer
            emotionalHeat * 15 + // Emotional warmth
            temporalWave * 12 + // Temporal flow
            baseFlow * 18 + // Pattern influence
            paradoxNoise * 8 // Paradox complexity
          );
          
          const smoothedHue = (baseHue + hueModulation + 360) % 360;
          
          // Smooth luminosity blend
          const baseLuminosity = (
            0.3 + // Base luminosity
            transformative * 0.2 + // Life events are brighter
            consciousnessGlow * 0.15 + // Central glow
            Math.abs(baseFlow) * 0.1 + // Pattern brightness
            Math.abs(temporalWave) * 0.08 + // Temporal brightness
            ineffable * 0.12 // Ineffable adds luminosity
          );
          
          const contextualLuminosity = Math.max(0.15, Math.min(0.75, baseLuminosity));
          
          // Smooth saturation blend
          const baseSaturation = (
            0.5 + // Higher base saturation
            ineffable * 0.15 + // Ineffable increases color richness
            emotional * 0.1 + // Emotional content more vivid
            Math.abs(baseFlow) * 0.08 + // Pattern strength
            archetypal * 0.12 // Sacred content more saturated
          );
          
          const contextualSaturation = Math.max(0.3, Math.min(0.85, baseSaturation));
          
          // Smooth HSL to RGB conversion
          const h = smoothedHue / 360;
          const s = contextualSaturation;
          const l = contextualLuminosity;
          
          const c = (1 - Math.abs(2 * l - 1)) * s;
          const x_comp = c * (1 - Math.abs(((h * 6) % 2) - 1));
          const m = l - c / 2;
          
          let r, g, b;
          const hSix = h * 6;
          if (hSix < 1) {
            r = c; g = x_comp; b = 0;
          } else if (hSix < 2) {
            r = x_comp; g = c; b = 0;
          } else if (hSix < 3) {
            r = 0; g = c; b = x_comp;
          } else if (hSix < 4) {
            r = 0; g = x_comp; b = c;
          } else if (hSix < 5) {
            r = x_comp; g = 0; b = c;
          } else {
            r = c; g = 0; b = x_comp;
          }
          
          // Very subtle field modulation
          const smoothFieldModulation = (baseFlow + temporalWave) * 0.01;
          
          // Final color values with gentle clamping
          data[index] = Math.max(0, Math.min(255, Math.floor((r + m + smoothFieldModulation) * 255)));
          data[index + 1] = Math.max(0, Math.min(255, Math.floor((g + m + smoothFieldModulation) * 255)));
          data[index + 2] = Math.max(0, Math.min(255, Math.floor((b + m + smoothFieldModulation) * 255)));
          data[index + 3] = 255;
        }
      }
      
      // Apply the unified field to canvas
      ctx.putImageData(imageData, 0, 0);
      
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
        background: '#000',
        imageRendering: 'auto',
      }}
    />
  );
};

export default OctopusField; 