/*
  MeaningPrimitives.ts
  --------------------
  Fluid linguistic fractals that flow like octopus chromatophores.
  Each primitive creates organic, recursive patterns that blend and breathe.
*/

export interface PrimitiveContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  time: number; // seconds since animation start
  intensity: number; // 0-1 (salience-weighted)
}

/* 1. Iridescent Shimmer – Ineffable Quality */
export function drawIridescentShimmer({ ctx, width, height, time, intensity }: PrimitiveContext) {
  if (intensity <= 0) return;
  
  // Multi-layered flowing gradients with fractal noise
  for (let layer = 0; layer < 3; layer++) {
    const phase = time * 0.15 + layer * 0.3;
    const scale = 1 + layer * 0.5;
    
    // Create flowing gradient mesh
    for (let x = 0; x < width; x += 20) {
      for (let y = 0; y < height; y += 20) {
        const noise1 = Math.sin(x * 0.01 * scale + phase) * Math.cos(y * 0.01 * scale + phase * 1.3);
        const noise2 = Math.sin(x * 0.007 * scale - phase * 0.7) * Math.cos(y * 0.013 * scale + phase);
        const hue = (phase * 180 + noise1 * 60 + noise2 * 40 + x * 0.5 + y * 0.3) % 360;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
        gradient.addColorStop(0, `hsla(${hue}, 85%, 65%, ${0.15 * intensity * (0.7 + noise1 * 0.3)})`);
        gradient.addColorStop(1, `hsla(${(hue + 30) % 360}, 85%, 65%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x - 15, y - 15, 40, 40);
      }
    }
  }
}

/* 2. Spiral Timeline – Temporal Flow */
export function drawSpiralTimeline({ ctx, centerX, centerY, time, intensity }: PrimitiveContext) {
  if (intensity <= 0) return;
  
  // Organic logarithmic spiral with flowing tendrils
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  
  for (let strand = 0; strand < 5; strand++) {
    const strandPhase = strand * 0.4 + time * 0.3;
    const a = 5; // spiral tightness
    const b = 0.2; // growth rate
    
    ctx.strokeStyle = `hsla(${50 + strand * 20}, 90%, 75%, ${0.2 * intensity})`;
    ctx.lineWidth = (3 - strand * 0.4) * intensity;
    ctx.beginPath();
    
    for (let t = 0; t < 20; t += 0.1) {
      const r = a * Math.exp(b * t);
      const angle = t + strandPhase;
      
      // Add organic wobble
      const wobble = Math.sin(t * 2 + time) * 5 * (1 - t / 20);
      const x = centerX + (r + wobble) * Math.cos(angle);
      const y = centerY + (r + wobble) * Math.sin(angle);
      
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      
      // Fractal sub-spirals
      if (t % 2 < 0.1 && intensity > 0.5) {
        ctx.save();
        ctx.strokeStyle = `hsla(${50 + strand * 20}, 90%, 85%, ${0.1 * intensity})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let st = 0; st < 2; st += 0.2) {
          const sr = 10 * Math.exp(0.3 * st);
          const sx = x + sr * Math.cos(angle + st * 3);
          const sy = y + sr * Math.sin(angle + st * 3);
          if (st === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.stroke();
  }
  ctx.restore();
}

/* 3. Thermal Gradient – Emotional Substrate */
export function drawThermalGradient({ ctx, width, height, time, intensity }: PrimitiveContext) {
  if (intensity <= 0) return;
  
  // Flowing thermal waves with organic boundaries
  const waveCount = 5;
  for (let wave = 0; wave < waveCount; wave++) {
    const wavePhase = time * 0.5 + wave * 0.8;
    const path = new Path2D();
    
    // Create organic wave shape
    path.moveTo(0, height / 2);
    for (let x = 0; x <= width; x += 10) {
      const y1 = height * 0.3 + Math.sin(x * 0.01 + wavePhase) * 50 * intensity;
      const y2 = height * 0.7 + Math.cos(x * 0.015 + wavePhase * 0.7) * 50 * intensity;
      const midY = (y1 + y2) / 2 + Math.sin(x * 0.005 + time) * 20;
      
      path.lineTo(x, midY);
    }
    path.lineTo(width, height);
    path.lineTo(0, height);
    path.closePath();
    
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    const heatShift = Math.sin(wavePhase) * 30;
    gradient.addColorStop(0, `hsla(${10 + heatShift}, 85%, 60%, ${0.2 * intensity})`);
    gradient.addColorStop(0.5, `hsla(${30 + heatShift}, 80%, 55%, ${0.15 * intensity})`);
    gradient.addColorStop(1, `hsla(${220 - heatShift}, 85%, 60%, ${0.2 * intensity})`);
    
    ctx.fillStyle = gradient;
    ctx.fill(path);
  }
}

/* 4. Tether Filaments – Relational Dynamics */
export function drawTetherFilaments({ ctx, centerX, centerY, width, height, time, intensity }: PrimitiveContext) {
  if (intensity <= 0) return;
  
  const connections = Math.round(4 + intensity * 4);
  
  for (let i = 0; i < connections; i++) {
    const angle = (i / connections) * Math.PI * 2 + time * 0.2;
    const targetR = Math.min(width, height) * (0.3 + Math.sin(time + i) * 0.1);
    const targetX = centerX + Math.cos(angle) * targetR;
    const targetY = centerY + Math.sin(angle) * targetR;
    
    // Draw flowing tether with recursive branching
    ctx.strokeStyle = `hsla(${160 + i * 20}, 85%, 70%, ${0.3 * intensity})`;
    
    function drawBranch(x1: number, y1: number, x2: number, y2: number, depth: number) {
      if (depth > 3 || intensity < 0.3) return;
      
      ctx.lineWidth = (2 - depth * 0.5) * intensity;
      ctx.beginPath();
      
      // Create organic curve with multiple control points
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const ctrlX1 = midX + Math.sin(time * 2 + depth) * 30;
      const ctrlY1 = midY + Math.cos(time * 2 + depth) * 30;
      const ctrlX2 = midX - Math.sin(time * 1.5 - depth) * 20;
      const ctrlY2 = midY - Math.cos(time * 1.5 - depth) * 20;
      
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(ctrlX1, ctrlY1, ctrlX2, ctrlY2, x2, y2);
      ctx.stroke();
      
      // Recursive branches
      if (Math.random() < 0.7 * intensity) {
        const branchAngle = angle + (Math.random() - 0.5) * 0.8;
        const branchX = midX + Math.cos(branchAngle) * 40;
        const branchY = midY + Math.sin(branchAngle) * 40;
        drawBranch(midX, midY, branchX, branchY, depth + 1);
      }
    }
    
    drawBranch(centerX, centerY, targetX, targetY, 0);
  }
}

/* 5. Luminosity Halo – Consciousness Level */
export function drawLuminosityHalo({ ctx, centerX, centerY, time, intensity }: PrimitiveContext) {
  if (intensity <= 0) return;
  
  // Organic breathing halo with flowing edges
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  
  for (let ring = 0; ring < 4; ring++) {
    const ringPhase = time + ring * 0.5;
    const baseRadius = (60 + ring * 40) * intensity;
    
    // Create organic ring shape
    ctx.beginPath();
    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
      const radiusVariation = Math.sin(angle * 5 + ringPhase) * 10 + 
                            Math.cos(angle * 3 - ringPhase * 0.7) * 15;
      const r = baseRadius + radiusVariation;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      
      if (angle === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    
    const gradient = ctx.createRadialGradient(centerX, centerY, baseRadius * 0.8, centerX, centerY, baseRadius * 1.2);
    gradient.addColorStop(0, `hsla(200, 90%, 85%, ${0.3 * intensity * (1 - ring * 0.2)})`);
    gradient.addColorStop(0.5, `hsla(180, 85%, 80%, ${0.2 * intensity * (1 - ring * 0.2)})`);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  ctx.restore();
}

/* 6. Interference Waves – Paradox Tension */
export function drawInterferenceWaves({ ctx, width, height, time, intensity }: PrimitiveContext) {
  if (intensity <= 0) return;
  
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  
  // Multiple wave sources creating interference patterns
  const sources = [
    { x: width * 0.3, y: height * 0.4, phase: 0 },
    { x: width * 0.7, y: height * 0.6, phase: Math.PI * 0.5 },
    { x: width * 0.5, y: height * 0.3, phase: Math.PI }
  ];
  
  sources.forEach((source, idx) => {
    const waveSpeed = 0.5 + idx * 0.2;
    
    for (let ring = 0; ring < 20; ring++) {
      const radius = ring * 20 - (time * 50 * waveSpeed) % 400;
      if (radius < 0) continue;
      
      ctx.beginPath();
      ctx.arc(source.x, source.y, radius, 0, Math.PI * 2);
      
      const alpha = (1 - radius / 400) * 0.15 * intensity;
      ctx.strokeStyle = `hsla(${330 + idx * 30}, 85%, 75%, ${alpha})`;
      ctx.lineWidth = 2 + Math.sin(ring * 0.5 + time * 3) * 1;
      ctx.stroke();
    }
  });
  
  ctx.restore();
}

/* 7. Symmetry Bloom – Archetypal Resonance */
export function drawSymmetryBloom({ ctx, centerX, centerY, time, intensity }: PrimitiveContext) {
  if (intensity <= 0) return;
  
  const petalCounts = [3, 5, 6, 8];
  const petalCount = petalCounts[Math.floor(intensity * 3.99)];
  
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(time * 0.1);
  
  // Recursive fractal petals
  function drawPetal(depth: number, scale: number, rotation: number) {
    if (depth > 3 || scale < 0.1) return;
    
    ctx.save();
    ctx.rotate(rotation);
    ctx.scale(scale, scale);
    
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      ctx.save();
      ctx.rotate(angle);
      
      // Organic petal shape
      ctx.beginPath();
      ctx.moveTo(0, 0);
      
      for (let t = 0; t <= 1; t += 0.05) {
        const petalWidth = Math.sin(t * Math.PI) * 30;
        const petalLength = t * 80;
        const wobble = Math.sin(t * Math.PI * 4 + time * 2) * 5 * (1 - t);
        
        const x = petalWidth + wobble;
        const y = petalLength;
        
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      for (let t = 1; t >= 0; t -= 0.05) {
        const petalWidth = Math.sin(t * Math.PI) * 30;
        const petalLength = t * 80;
        const wobble = Math.sin(t * Math.PI * 4 + time * 2) * 5 * (1 - t);
        
        ctx.lineTo(-petalWidth - wobble, petalLength);
      }
      
      ctx.closePath();
      
      const gradient = ctx.createRadialGradient(0, 40, 0, 0, 40, 80);
      gradient.addColorStop(0, `hsla(${270 + depth * 30}, 85%, 70%, ${0.3 * intensity * (1 - depth * 0.2)})`);
      gradient.addColorStop(1, `hsla(${290 + depth * 30}, 85%, 75%, ${0.1 * intensity * (1 - depth * 0.2)})`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.restore();
    }
    
    ctx.restore();
    
    // Recursive sub-blooms
    if (intensity > 0.6) {
      drawPetal(depth + 1, scale * 0.5, rotation + Math.PI / petalCount);
    }
  }
  
  drawPetal(0, 1, 0);
  ctx.restore();
}

/* 8. Morphing Metamorphosis – Transformative Potential */
export function drawMorphingMetamorphosis({ ctx, centerX, centerY, time, intensity }: PrimitiveContext) {
  if (intensity <= 0) return;
  
  ctx.save();
  ctx.translate(centerX, centerY);
  
  // Fluid shape morphing with organic transitions
  const morphPhase = time * 0.4 * (0.5 + intensity * 0.5);
  const shapeBlend = (Math.sin(morphPhase) + 1) / 2;
  
  // Create flowing organic shape
  ctx.beginPath();
  
  for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
    // Blend between multiple shape functions
    const triangleR = 60 + 30 * Math.cos(3 * angle);
    const circleR = 80;
    const starR = 70 + 40 * Math.cos(5 * angle);
    
    // Add organic noise
    const noise = Math.sin(angle * 8 + time * 3) * 5 + 
                 Math.cos(angle * 13 - time * 2) * 3;
    
    let r;
    if (shapeBlend < 0.33) {
      const t = shapeBlend * 3;
      r = triangleR * (1 - t) + circleR * t;
    } else if (shapeBlend < 0.66) {
      const t = (shapeBlend - 0.33) * 3;
      r = circleR * (1 - t) + starR * t;
    } else {
      const t = (shapeBlend - 0.66) * 3;
      r = starR * (1 - t) + triangleR * t;
    }
    
    r = (r + noise) * intensity;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    
    if (angle === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  
  ctx.closePath();
  
  // Flowing gradient fill
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 100);
  const hueShift = morphPhase * 180;
  gradient.addColorStop(0, `hsla(${hueShift % 360}, 85%, 65%, ${0.6 * intensity})`);
  gradient.addColorStop(0.5, `hsla(${(hueShift + 60) % 360}, 80%, 60%, ${0.4 * intensity})`);
  gradient.addColorStop(1, `hsla(${(hueShift + 120) % 360}, 85%, 55%, ${0.2 * intensity})`);
  
  ctx.fillStyle = gradient;
  ctx.fill();
  
  ctx.restore();
} 