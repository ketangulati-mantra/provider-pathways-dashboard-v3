import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

// ------------------------------------------------------------------------------
// REACT BITS — ORB COMPONENT
// Source: https://reactbits.dev/components/orb
// Interactive, fragment-shader WebGL Orb with soft atmospheric light & depth
// ------------------------------------------------------------------------------
const vert = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uHue;
  uniform float uHover;
  uniform float uOpacity;
  varying vec2 vUv;

  vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
  }

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 st = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
    float d = length(st);

    // Soft orb radius & rim lighting
    float radius = 0.38 + 0.03 * sin(uTime * 1.5);
    float alpha = smoothstep(radius + 0.05, radius - 0.15, d);
    if (alpha <= 0.001) discard;

    // Fluid liquid shader motion inside orb
    float angle = atan(st.y, st.x);
    float wave = sin(angle * 4.0 + uTime * 2.0) * 0.04 + cos(angle * 3.0 - uTime * 1.2) * 0.03;
    float core = smoothstep(radius + wave, 0.0, d);

    // Color gradient mapping with hue shift
    vec3 baseColor = vec3(0.18, 0.42, 0.98); // Mantra Indigo Base
    vec3 hsv = rgb2hsv(baseColor);
    hsv.x = fract(hsv.x + uHue);
    vec3 colorA = hsv2rgb(hsv);

    vec3 colorB = hsv2rgb(vec3(fract(hsv.x + 0.15), 0.7, 0.95));
    vec3 finalColor = mix(colorA, colorB, core + wave);

    // Soft spatial specular highlight
    float spec = pow(max(0.0, 1.0 - length(st - vec2(-0.1, 0.1))), 4.0);
    finalColor += vec3(spec * 0.35);

    gl_FragColor = vec4(finalColor, alpha * uOpacity);
  }
`;

export default function MantraGrowthVisual({
  hue = 0,
  hoverIntensity = 0.2,
  rotateOnHover = true,
  opacity = 0.8,
  style = {}
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer, program, mesh;
    let animationFrameId;

    try {
      renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio, 2) });
      const gl = renderer.gl;
      container.appendChild(gl.canvas);

      const geometry = new Triangle(gl);
      program = new Program(gl, {
        vertex: vert,
        fragment: frag,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: [container.clientWidth, container.clientHeight] },
          uHue: { value: hue },
          uHover: { value: hoverIntensity },
          uOpacity: { value: opacity }
        },
        transparent: true
      });

      mesh = new Mesh(gl, { geometry, program });

      const handleResize = () => {
        if (!container || !renderer) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        program.uniforms.uResolution.value = [width, height];
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      let startTime = performance.now();
      const update = (t) => {
        animationFrameId = requestAnimationFrame(update);
        const elapsed = (t - startTime) * 0.001;
        program.uniforms.uTime.value = elapsed;
        program.uniforms.uHue.value = hue;
        program.uniforms.uOpacity.value = opacity;
        renderer.render({ scene: mesh });
      };

      animationFrameId = requestAnimationFrame(update);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        if (container && gl.canvas && gl.canvas.parentNode === container) {
          container.removeChild(gl.canvas);
        }
      };
    } catch (err) {
      console.error('[ReactBits Orb] Initialization error:', err);
    }
  }, [hue, hoverIntensity, opacity]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        pointerEvents: 'none',
        ...style
      }}
    />
  );
}
