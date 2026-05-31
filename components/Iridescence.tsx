'use client';
import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

interface IridescenceProps {
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
}

const vertexShader = `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uAmplitude;
  varying vec2 vUv;

  vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    vec2 uv = vUv;
    vec2 mouse = uMouse / uResolution;
    float dist = length(uv - mouse);

    float wave = sin(uv.x * 8.0 + uTime * 0.8) * uAmplitude
               + sin(uv.y * 6.0 + uTime * 0.6) * uAmplitude
               + sin((uv.x + uv.y) * 5.0 + uTime * 1.0) * uAmplitude * 0.5;

    float t = uv.x + uv.y + wave + uTime * 0.15;

    vec3 col = palette(
      t,
      uColor * 0.5 + 0.5,
      vec3(0.5),
      vec3(1.0),
      vec3(0.0, 0.33, 0.67)
    );

    col += 0.08 * exp(-dist * 3.0);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Iridescence({
  color = [0.8, 0.3, 0.5],
  speed = 0.5,
  amplitude = 0.1,
  mouseReact = true,
}: IridescenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(...color) },
        uResolution: { value: [container.offsetWidth, container.offsetHeight] },
        uMouse: { value: [container.offsetWidth / 2, container.offsetHeight / 2] },
        uAmplitude: { value: amplitude },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      program.uniforms.uResolution.value = [container.offsetWidth, container.offsetHeight];
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const onMouseMove = (e: MouseEvent) => {
      if (!mouseReact) return;
      const rect = container.getBoundingClientRect();
      program.uniforms.uMouse.value = [e.clientX - rect.left, e.clientY - rect.top];
    };
    if (mouseReact) container.addEventListener('mousemove', onMouseMove);

    let startTime = performance.now();
    let animId: number;

    const loop = () => {
      animId = requestAnimationFrame(loop);
      program.uniforms.uTime.value = ((performance.now() - startTime) / 1000) * speed;
      renderer.render({ scene: mesh });
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      if (mouseReact) container.removeEventListener('mousemove', onMouseMove);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [color, speed, amplitude, mouseReact]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
    />
  );
}
