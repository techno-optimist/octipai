import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";
import { MeaningDimensions } from './MeaningSalience';

import './MeaningIridescence.css';

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;

// McKenna's Meaning Dimensions
uniform float uIneffable;
uniform float uTemporal;
uniform float uEmotional;
uniform float uRelational;
uniform float uConsciousness;
uniform float uParadox;
uniform float uArchetypal;
uniform float uTransformative;

varying vec2 vUv;

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

  // Mouse influence modulated by meaning
  uv += (uMouse - vec2(0.5)) * uAmplitude * (1.0 + uIneffable * 0.5);

  // Base flow influenced by meaning dimensions
  float d = -uTime * 0.5 * uSpeed * (0.5 + uTemporal * 0.5);
  float a = 0.0;
  
  // Meaning-driven flow complexity
  float iterations = 6.0 + uConsciousness * 4.0; // Higher consciousness = more complex patterns
  
  for (float i = 0.0; i < 10.0; ++i) {
    if (i >= iterations) break;
    
    // Flow patterns influenced by different meaning dimensions
    float emergenceFlow = cos(i - d - a * uv.x * (1.0 + uTransformative * 2.0)); // Life emergence
    float embraceFlow = sin(uv.y * i + a * (1.0 + uRelational * 1.5)); // Protective embrace
    float sacredFlow = cos(i * 1.618 + uArchetypal * 3.14159) * 0.3; // Golden ratio sacred geometry
    
    a += emergenceFlow + embraceFlow * uRelational + sacredFlow * uArchetypal;
    d += sin(uv.y * i + a) * (1.0 + uEmotional * 0.8); // Emotional substrate
  }
  
  // Paradox creates interference patterns
  d += uTime * 0.5 * uSpeed + sin(uTime + uParadox * 6.28) * uParadox * 0.2;
  
  // Color calculation with meaning-based shifts
  vec3 baseCol = vec3(
    cos(uv * vec2(d, a)) * 0.6 + 0.4, 
    cos(a + d) * 0.5 + 0.5
  );
  
  // Meaning-driven color shifts
  vec3 lifeGold = vec3(1.0, 0.9, 0.6) * uTransformative; // Golden life energy
  vec3 embraceGreen = vec3(0.6, 1.0, 0.8) * uRelational; // Nurturing embrace
  vec3 sacredPurple = vec3(0.8, 0.6, 1.0) * uArchetypal; // Sacred geometry
  vec3 consciousnessBlue = vec3(0.6, 0.8, 1.0) * uConsciousness; // Consciousness flow
  
  // Blend meaning colors
  vec3 meaningColor = (lifeGold + embraceGreen + sacredPurple + consciousnessBlue) * 0.25;
  
  // Final color composition
  vec3 col = cos(baseCol * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  col = mix(col, meaningColor, 0.4); // Blend base with meaning colors
  
  // Ineffable shimmer overlay
  float shimmer = sin(uTime * 2.0 + dot(uv, uv) * 10.0) * 0.5 + 0.5;
  col += shimmer * uIneffable * 0.15 * vec3(1.0, 1.0, 1.0);
  
  gl_FragColor = vec4(col, 1.0);
}
`;

interface Props {
  meaningData?: MeaningDimensions;
  isAnalyzing?: boolean;
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
  width?: number;
  height?: number;
}

export default function MeaningIridescence({
  meaningData,
  isAnalyzing = false,
  color = [1, 1, 1],
  speed = 1.0,
  amplitude = 0.1,
  mouseReact = true,
  width = 800,
  height = 600,
  ...rest
}: Props) {
  const ctnDom = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;
    const renderer = new Renderer();
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);

    let program: Program;

    function resize() {
      const scale = window.devicePixelRatio || 1;
      renderer.setSize(ctn.offsetWidth * scale, ctn.offsetHeight * scale);
      if (program) {
        program.uniforms.uResolution.value = new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height
        );
      }
    }
    window.addEventListener("resize", resize, false);
    resize();

    const geometry = new Triangle(gl);
    
    // Get meaning values or defaults for calm state
    const meaningValues = meaningData ? {
      ineffable: meaningData.INEFFABLE_QUALITY,
      temporal: meaningData.TEMPORAL_FLOW,
      emotional: meaningData.EMOTIONAL_SUBSTRATE,
      relational: meaningData.RELATIONAL_DYNAMICS,
      consciousness: meaningData.CONSCIOUSNESS_LEVEL,
      paradox: meaningData.PARADOX_TENSION,
      archetypal: meaningData.ARCHETYPAL_RESONANCE,
      transformative: meaningData.TRANSFORMATIVE_POTENTIAL,
    } : {
      ineffable: 0.1,
      temporal: 0.1,
      emotional: 0.1,
      relational: 0.1,
      consciousness: 0.2,
      paradox: 0.0,
      archetypal: 0.1,
      transformative: 0.1,
    };

    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(...color) },
        uResolution: {
          value: new Color(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height
          ),
        },
        uMouse: { value: new Float32Array([mousePos.current.x, mousePos.current.y]) },
        uAmplitude: { value: amplitude },
        uSpeed: { value: isAnalyzing ? speed * 0.3 : speed },
        // McKenna's Meaning Dimensions
        uIneffable: { value: meaningValues.ineffable },
        uTemporal: { value: meaningValues.temporal },
        uEmotional: { value: meaningValues.emotional },
        uRelational: { value: meaningValues.relational },
        uConsciousness: { value: meaningValues.consciousness },
        uParadox: { value: meaningValues.paradox },
        uArchetypal: { value: meaningValues.archetypal },
        uTransformative: { value: meaningValues.transformative },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    let animateId: number;

    function update(t: number) {
      animateId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    }
    animateId = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

    function handleMouseMove(e: MouseEvent) {
      const rect = ctn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mousePos.current = { x, y };
      program.uniforms.uMouse.value[0] = x;
      program.uniforms.uMouse.value[1] = y;
    }
    if (mouseReact) {
      ctn.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      if (mouseReact) {
        ctn.removeEventListener("mousemove", handleMouseMove);
      }
      if (ctn.contains(gl.canvas)) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [color, speed, amplitude, mouseReact, meaningData, isAnalyzing]);

  return (
    <div
      ref={ctnDom}
      className="meaning-iridescence-container"
      style={{ width, height, borderRadius: '0.5rem', overflow: 'hidden' }}
      {...rest}
    />
  );
} 