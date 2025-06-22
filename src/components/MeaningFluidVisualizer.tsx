'use client';
import { useEffect, useRef } from 'react';

interface MeaningDimensions {
  TEMPORAL_FLOW: number;
  INEFFABLE_QUALITY: number;
  EMOTIONAL_SUBSTRATE: number;
  RELATIONAL_DYNAMICS: number;
  CONSCIOUSNESS_LEVEL: number;
  PARADOX_TENSION: number;
  ARCHETYPAL_RESONANCE: number;
  TRANSFORMATIVE_POTENTIAL: number;
}

interface MeaningFluidVisualizerProps {
  meaningData?: MeaningDimensions;
  isAnalyzing?: boolean;
  width?: number;
  height?: number;
}

function MeaningFluidVisualizer({
  meaningData,
  isAnalyzing = false,
  width = 800,
  height = 600,
}: MeaningFluidVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    let time = 0;
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Octopus chromatophore simulation - flowing meaning fields
    function drawOctopusSkin() {
      if (!ctx) return;

      // Clear with transparency
      ctx.clearRect(0, 0, width, height);

      if (isAnalyzing && !meaningData) {
        // Analysis state - gentle pulsing anticipation
        drawAnalysisField();
        return;
      }

      if (!meaningData) return;

      // Create organic gradient fields based on meaning dimensions
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      // SMOOTH OCTOPUS SKIN - PIXEL PERFECT ORGANIC FLOW
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const index = (y * width + x) * 4;
          
          // Calculate distance from center for radial effects  
          const dx = (x - centerX) / width;
          const dy = (y - centerY) / height;
          const distFromCenter = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);

          // Generate ultra-smooth flowing meaning-based colors
          const color = calculateSmoothMeaningColor(x, y, distFromCenter, angle, time, meaningData);
          
          data[index] = color.r;     // Red
          data[index + 1] = color.g; // Green
          data[index + 2] = color.b; // Blue
          data[index + 3] = color.a; // Alpha
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Add flowing overlay patterns
      drawMeaningOverlays();
    }

         function calculateSmoothMeaningColor(x: number, y: number, distFromCenter: number, angle: number, time: number, meaning: MeaningDimensions) {
       // SACRED GEOMETRY & VIBRATIONAL COLOR FREQUENCIES
       
       // ULTRA-SMOOTH SACRED GEOMETRY WITH MICRO-FREQUENCIES
       const phi = 1.618033988749;
       
       // Multi-layered golden ratio spirals with smooth transitions
       const goldenSpiral1 = Math.sin(angle * phi + distFromCenter * phi * 4 + time * meaning.TEMPORAL_FLOW * phi * 0.7) * 0.5 + 0.5;
       const goldenSpiral2 = Math.cos(angle * phi * 0.618 + distFromCenter * phi * 2.5 + time * meaning.TEMPORAL_FLOW * phi * 0.5) * 0.3 + 0.7;
       const goldenSpiral = (goldenSpiral1 * 0.7 + goldenSpiral2 * 0.3);
       
       // Smooth continuous flower of life (no discrete grid)
       const flowerFreq = 0.015; // Much finer frequency
       const flowerPhase1 = Math.sin(x * flowerFreq + y * flowerFreq * 0.866 + time * meaning.ARCHETYPAL_RESONANCE * 1.3) * 0.5 + 0.5;
       const flowerPhase2 = Math.cos(x * flowerFreq * 0.866 + y * flowerFreq + time * meaning.ARCHETYPAL_RESONANCE * 0.9) * 0.5 + 0.5;
       const flowerOfLife = (flowerPhase1 * 0.6 + flowerPhase2 * 0.4);
       
       // Smooth merkaba with organic pulsing
       const merkaba1 = Math.sin(angle * 2.8 + distFromCenter * 6.2 - time * meaning.TRANSFORMATIVE_POTENTIAL * 1.1) * 0.5 + 0.5;
       const merkaba2 = Math.cos(angle * 3.2 + distFromCenter * 7.8 + time * meaning.INEFFABLE_QUALITY * 1.7) * 0.5 + 0.5;
       const merkaba = (merkaba1 * merkaba2 * 0.8 + (merkaba1 + merkaba2) * 0.1);
       
       // Smooth vesica piscis consciousness fields
       const vesicaCenter1 = { x: centerX - 30, y: centerY };
       const vesicaCenter2 = { x: centerX + 30, y: centerY };
       const dist1 = Math.sqrt((x - vesicaCenter1.x) * (x - vesicaCenter1.x) + (y - vesicaCenter1.y) * (y - vesicaCenter1.y));
       const dist2 = Math.sqrt((x - vesicaCenter2.x) * (x - vesicaCenter2.x) + (y - vesicaCenter2.y) * (y - vesicaCenter2.y));
       const vesicaWave1 = Math.sin(dist1 * 0.08 + time * 0.8) * 0.5 + 0.5;
       const vesicaWave2 = Math.sin(dist2 * 0.08 + time * 0.6) * 0.5 + 0.5;
       const vesicaPiscis = ((vesicaWave1 + vesicaWave2) * 0.5) * meaning.RELATIONAL_DYNAMICS;
       
       // Smooth fibonacci waves with natural frequencies
       const fibWave1 = (Math.sin(x * 0.0018 + time * meaning.TEMPORAL_FLOW * 0.7) + Math.sin(y * 0.0029 + time * 0.4)) * 0.25 + 0.5;
       const fibWave2 = (Math.cos(x * 0.0047 + time * 0.5) + Math.cos(y * 0.0076 + time * meaning.ARCHETYPAL_RESONANCE * 0.8)) * 0.25 + 0.5;
       
       // Additional smoothing layers for ultra-organic flow
       const organicFlow1 = Math.sin(x * 0.008 + y * 0.006 + time * meaning.INEFFABLE_QUALITY * 2.1) * 0.3 + 0.7;
       const organicFlow2 = Math.cos(x * 0.005 + y * 0.009 + time * meaning.EMOTIONAL_SUBSTRATE * 1.6) * 0.3 + 0.7;
       
       // VIBRATIONAL COLOR HARMONICS - Map meaning to chakra frequencies
       const emotional = meaning.EMOTIONAL_SUBSTRATE;
       const ineffable = meaning.INEFFABLE_QUALITY;
       const temporal = meaning.TEMPORAL_FLOW;
       const archetypal = meaning.ARCHETYPAL_RESONANCE;
       const paradox = meaning.PARADOX_TENSION;
       
       // Ultra-smooth base hue with organic flow modulation
       let baseHue = (emotional * 360 + goldenSpiral * 80 + flowerOfLife * 50 + organicFlow1 * 30) % 360;
       
       // Smooth color harmony transitions based on meaning dimensions
       let hue1, hue2, hue3;
       const ineffableThreshold = 0.8 + Math.sin(time * 0.3) * 0.1; // Dynamic threshold
       const temporalThreshold = 0.7 + Math.cos(time * 0.4) * 0.1;
       
       if (ineffable > ineffableThreshold) {
         // Ethereal triadic harmony with organic modulation
         hue1 = baseHue + organicFlow2 * 15;
         hue2 = (baseHue + 120 + fibWave1 * 20) % 360;
         hue3 = (baseHue + 240 + fibWave2 * 20) % 360;
       } else if (temporal > temporalThreshold) {
         // Golden temporal complementary with flow
         hue1 = baseHue + vesicaPiscis * 25;
         hue2 = (baseHue + 137.5 + goldenSpiral * 30) % 360; // Golden angle
         hue3 = (baseHue + 180 + merkaba * 25) % 360;   // Complementary
       } else {
         // Analogous harmony with smooth transitions
         hue1 = baseHue + organicFlow1 * 20;
         hue2 = (baseHue + 30 + organicFlow2 * 15) % 360;
         hue3 = (baseHue - 30 + 360 + (fibWave1 + fibWave2) * 10) % 360;
       }
       
       // Organic saturation with multiple influences
       const saturation = Math.min(1.0, 0.5 + archetypal * 0.3 + merkaba * 0.2 + flowerOfLife * 0.15 + organicFlow1 * 0.15);
       
       // Dynamic brightness with smooth organic pulsing
       const brightness = Math.min(1.0, 0.3 + ineffable * 0.4 + Math.abs(fibWave1 + fibWave2) * 0.2 + 
                                   Math.abs(vesicaPiscis) * 0.15 + organicFlow2 * 0.2);
       
       // Choose primary hue based on geometric influences
       let primaryHue;
       if (goldenSpiral > 0.6) primaryHue = hue1;
       else if (merkaba > 0.6) primaryHue = hue2;
       else primaryHue = hue3;
       
       // Convert HSV to RGB with sacred geometry modulation
       const hueNorm = primaryHue / 360;
       const c = brightness * saturation;
       const x_val = c * (1 - Math.abs(((hueNorm * 6) % 2) - 1));
       const m = brightness - c;
       
       let r_base, g_base, b_base;
       const hue_sector = Math.floor(hueNorm * 6);
       
       switch(hue_sector) {
         case 0: r_base = c; g_base = x_val; b_base = 0; break;
         case 1: r_base = x_val; g_base = c; b_base = 0; break;
         case 2: r_base = 0; g_base = c; b_base = x_val; break;
         case 3: r_base = 0; g_base = x_val; b_base = c; break;
         case 4: r_base = x_val; g_base = 0; b_base = c; break;
         default: r_base = c; g_base = 0; b_base = x_val; break;
       }
       
       // Final ultra-smooth color with organic flow modulation
       const rModulation = 1 + goldenSpiral * 0.15 + organicFlow1 * 0.1 + paradox * Math.sin(time * 2.8) * 0.08;
       const gModulation = 1 + flowerOfLife * 0.15 + organicFlow2 * 0.1 + fibWave1 * 0.08;
       const bModulation = 1 + merkaba * 0.15 + (organicFlow1 + organicFlow2) * 0.05 + vesicaPiscis * 0.08;
       
       const r = Math.floor(((r_base + m) * 255) * Math.min(1.2, rModulation));
       const g = Math.floor(((g_base + m) * 255) * Math.min(1.2, gModulation));
       const b = Math.floor(((b_base + m) * 255) * Math.min(1.2, bModulation));
       
       // Smooth alpha with organic breathing
       const alphaBase = 0.35 + ineffable * 0.35 + Math.abs(fibWave2) * 0.15;
       const organicAlphaPulse = Math.sin(time * 1.2 + x * 0.01 + y * 0.01) * 0.1;
       const alpha = Math.floor(255 * Math.min(1.0, alphaBase + organicAlphaPulse));

       return {
         r: Math.max(0, Math.min(255, r)),
         g: Math.max(0, Math.min(255, g)),
         b: Math.max(0, Math.min(255, b)),
         a: Math.max(0, Math.min(255, alpha))
       };
     }

    function drawAnalysisField() {
      if (!ctx) return;
      
      // Gentle anticipatory pulsing during analysis
      const pulse = Math.sin(time * 3) * 0.3 + 0.7;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) * 0.7);
      
      gradient.addColorStop(0, `rgba(147, 51, 234, ${pulse * 0.6})`);
      gradient.addColorStop(0.5, `rgba(99, 102, 241, ${pulse * 0.4})`);
      gradient.addColorStop(1, `rgba(59, 130, 246, ${pulse * 0.2})`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    function drawMeaningOverlays() {
      if (!ctx || !meaningData) return;

      // GOLDEN RATIO TEMPORAL SPIRALS (φ = 1.618)
      if (meaningData.TEMPORAL_FLOW > 0.5) {
        const phi = 1.618033988749;
        const spiralIntensity = meaningData.TEMPORAL_FLOW;
        
        // Create golden ratio color gradients
        const spiralGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200);
        spiralGradient.addColorStop(0, `rgba(255, 215, 0, ${spiralIntensity * 0.8})`);
        spiralGradient.addColorStop(0.618, `rgba(255, 140, 0, ${spiralIntensity * 0.6})`); // Golden ratio stop
        spiralGradient.addColorStop(1, `rgba(255, 80, 80, ${spiralIntensity * 0.3})`);
        
        ctx.strokeStyle = spiralGradient;
        ctx.lineWidth = 1 + spiralIntensity * 2;
        ctx.globalCompositeOperation = 'screen';
        
        for (let spiralNum = 0; spiralNum < 2; spiralNum++) {
          ctx.beginPath();
          for (let t = 0; t < Math.PI * 8; t += 0.05) {
            const r = 20 * Math.pow(phi, t / (Math.PI * 2)) * (0.5 + spiralIntensity * 0.5);
            const x = centerX + r * Math.cos(t + time * spiralIntensity + spiralNum * Math.PI);
            const y = centerY + r * Math.sin(t + time * spiralIntensity + spiralNum * Math.PI);
            
            if (t === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
      }

      // FLOWER OF LIFE SACRED GEOMETRY
      if (meaningData.ARCHETYPAL_RESONANCE > 0.6) {
        const resonance = meaningData.ARCHETYPAL_RESONANCE;
        const flowerRadius = 60 + resonance * 40;
        
        // Sacred flower gradient
        const flowerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, flowerRadius * 2);
        flowerGradient.addColorStop(0, `rgba(180, 100, 255, ${resonance * 0.7})`);
        flowerGradient.addColorStop(0.5, `rgba(100, 200, 255, ${resonance * 0.5})`);
        flowerGradient.addColorStop(1, `rgba(255, 100, 180, ${resonance * 0.3})`);
        
        ctx.strokeStyle = flowerGradient;
        ctx.lineWidth = 1.5;
        ctx.globalCompositeOperation = 'overlay';
        
        // Seven overlapping circles in flower of life pattern
        const circles = [
          { x: 0, y: 0 },
          { x: flowerRadius, y: 0 },
          { x: -flowerRadius, y: 0 },
          { x: flowerRadius/2, y: flowerRadius * Math.sin(Math.PI/3) },
          { x: -flowerRadius/2, y: flowerRadius * Math.sin(Math.PI/3) },
          { x: flowerRadius/2, y: -flowerRadius * Math.sin(Math.PI/3) },
          { x: -flowerRadius/2, y: -flowerRadius * Math.sin(Math.PI/3) },
        ];
        
        circles.forEach((circle, i) => {
          ctx.beginPath();
          const phaseShift = (i * Math.PI * 2) / 7;
          const dynamicRadius = flowerRadius * (1 + Math.sin(time * 2 + phaseShift) * 0.1);
          ctx.arc(
            centerX + circle.x + Math.cos(time * 0.5) * 10,
            centerY + circle.y + Math.sin(time * 0.5) * 10,
            dynamicRadius,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        });
        ctx.globalCompositeOperation = 'source-over';
      }

      // MERKABA STAR TETRAHEDRON
      if (meaningData.TRANSFORMATIVE_POTENTIAL > 0.6) {
        const transformation = meaningData.TRANSFORMATIVE_POTENTIAL;
        const merkabSize = 100 + transformation * 80;
        
        // Merkaba cosmic gradient
        const merkabGradient = ctx.createLinearGradient(
          centerX - merkabSize, centerY - merkabSize,
          centerX + merkabSize, centerY + merkabSize
        );
        merkabGradient.addColorStop(0, `rgba(255, 50, 150, ${transformation * 0.9})`);
        merkabGradient.addColorStop(0.5, `rgba(50, 255, 200, ${transformation * 0.7})`);
        merkabGradient.addColorStop(1, `rgba(150, 50, 255, ${transformation * 0.9})`);
        
        ctx.strokeStyle = merkabGradient;
        ctx.lineWidth = 2 + transformation * 2;
        ctx.globalCompositeOperation = 'screen';
        
        // Draw interlocking tetrahedrons
        for (let tetra = 0; tetra < 2; tetra++) {
          const rotation = time * transformation + tetra * Math.PI;
          
          // Create 6 points of the star
          const points = [];
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6 + rotation;
            const radius = merkabSize * (0.8 + Math.sin(time * 3 + i) * 0.2);
            points.push({
              x: centerX + radius * Math.cos(angle),
              y: centerY + radius * Math.sin(angle)
            });
          }
          
          // Connect all points in star pattern
          ctx.beginPath();
          for (let i = 0; i < points.length; i++) {
            const nextI = (i + 2) % points.length; // Creates star pattern
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[nextI].x, points[nextI].y);
          }
          ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
      }

      // VESICA PISCIS CONSCIOUSNESS INTERSECTION
      if (meaningData.RELATIONAL_DYNAMICS > 0.7) {
        const relation = meaningData.RELATIONAL_DYNAMICS;
        const vesicaRadius = 90 + relation * 60;
        const separation = vesicaRadius * 1.2;
        
        // Consciousness intersection gradient
        const vesicaGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, vesicaRadius * 2);
        vesicaGradient.addColorStop(0, `rgba(100, 255, 100, ${relation * 0.8})`);
        vesicaGradient.addColorStop(0.5, `rgba(255, 255, 100, ${relation * 0.6})`);
        vesicaGradient.addColorStop(1, `rgba(100, 100, 255, ${relation * 0.4})`);
        
        ctx.strokeStyle = vesicaGradient;
        ctx.lineWidth = 2;
        ctx.globalCompositeOperation = 'overlay';
        
        // Two intersecting circles creating vesica piscis
        const center1 = { 
          x: centerX - separation/2 + Math.cos(time * 0.7) * 20, 
          y: centerY + Math.sin(time * 0.7) * 20 
        };
        const center2 = { 
          x: centerX + separation/2 + Math.cos(time * 0.7 + Math.PI) * 20, 
          y: centerY + Math.sin(time * 0.7 + Math.PI) * 20 
        };
        
        [center1, center2].forEach(center => {
          ctx.beginPath();
          ctx.arc(center.x, center.y, vesicaRadius, 0, Math.PI * 2);
          ctx.stroke();
        });
        ctx.globalCompositeOperation = 'source-over';
      }

      // FIBONACCI INEFFABLE PATTERNS
      if (meaningData.INEFFABLE_QUALITY > 0.8) {
        const ineffable = meaningData.INEFFABLE_QUALITY;
        const fibSequence = [1, 1, 2, 3, 5, 8, 13, 21];
        
        // Ineffable ethereal gradient
        const fibGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 300);
        fibGradient.addColorStop(0, `rgba(255, 255, 255, ${ineffable * 0.9})`);
        fibGradient.addColorStop(0.618, `rgba(200, 220, 255, ${ineffable * 0.7})`); // Golden ratio
        fibGradient.addColorStop(1, `rgba(180, 180, 255, ${ineffable * 0.3})`);
        
        ctx.strokeStyle = fibGradient;
        ctx.globalCompositeOperation = 'soft-light';
        
        fibSequence.forEach((fib, i) => {
          const goldenAngle = 137.5 * Math.PI / 180; // Golden angle in radians
          const angle = i * goldenAngle + time * ineffable * 0.5;
          const radius = fib * 8;
          
          ctx.lineWidth = Math.sqrt(fib) * 0.5;
          ctx.beginPath();
          
          // Draw fibonacci spiral arms
          for (let t = 0; t < Math.PI * 2; t += 0.1) {
            const spiralRadius = radius * (1 + t / (Math.PI * 2));
            const x = centerX + spiralRadius * Math.cos(angle + t);
            const y = centerY + spiralRadius * Math.sin(angle + t);
            
            if (t === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        });
        ctx.globalCompositeOperation = 'source-over';
      }
    }

    let animationId: number;
    
    function animate() {
      time += 0.016; // ~60fps
      drawOctopusSkin();
      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [meaningData, isAnalyzing, width, height]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-purple-500/20 rounded-lg"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 0, 20, 0.9) 0%, rgba(0, 0, 0, 0.95) 70%)',
          filter: isAnalyzing ? 'brightness(1.1) saturate(1.2) blur(0.5px)' : 'brightness(0.9)',
          transition: 'filter 0.5s ease',
          imageRendering: 'auto',
          transform: 'translateZ(0)', // Hardware acceleration
          backfaceVisibility: 'hidden'
        }}
      />
      
      {/* Meaning dimension overlay */}
      {meaningData && (
        <div className="absolute top-2 left-2 text-xs text-white/70 space-y-1">
          <div>Ineffable: {(meaningData.INEFFABLE_QUALITY * 100).toFixed(0)}%</div>
          <div>Temporal Flow: {(meaningData.TEMPORAL_FLOW * 100).toFixed(0)}%</div>
          <div>Archetypal: {(meaningData.ARCHETYPAL_RESONANCE * 100).toFixed(0)}%</div>
        </div>
      )}
      
      {isAnalyzing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/80 text-sm font-light animate-pulse">
            Extracting meaning essence...
          </div>
        </div>
      )}
    </div>
  );
}

export default MeaningFluidVisualizer; 