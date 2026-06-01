'use client';
import React, { useEffect, useRef } from 'react';

interface GrainientProps {
  timeSpeed?: number;
  colorBalance?: number;
  warpStrength?: number;
  warpFrequency?: number;
  warpSpeed?: number;
  warpAmplitude?: number;
  blendAngle?: number;
  blendSoftness?: number;
  rotationAmount?: number;
  noiseScale?: number;
  grainAmount?: number;
  grainScale?: number;
  grainAnimated?: boolean;
  contrast?: number;
  gamma?: number;
  saturation?: number;
  centerX?: number;
  centerY?: number;
  zoom?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  className?: string;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

const VERT_SRC = `#version 300 es
in vec2 aPos;
void main(){gl_Position=vec4(aPos,0.0,1.0);}
`;

const FRAG_SRC = `#version 300 es
precision highp float;
uniform vec2  uRes;
uniform float uTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2  uCenter;
uniform float uZoom;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
out vec4 fragColor;

mat2 rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec2 hash2(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
  return 0.5+0.5*mix(
    mix(dot(-1.0+2.0*hash2(i),f),dot(-1.0+2.0*hash2(i+vec2(1,0)),f-vec2(1,0)),u.x),
    mix(dot(-1.0+2.0*hash2(i+vec2(0,1)),f-vec2(0,1)),dot(-1.0+2.0*hash2(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);
}

void main(){
  float t=uTime*uTimeSpeed;
  vec2 uv=gl_FragCoord.xy/uRes;
  float ratio=uRes.x/uRes.y;

  vec2 tuv=uv-0.5+uCenter;
  tuv/=max(uZoom,0.001);
  float deg=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y/=ratio;
  tuv*=rot(radians((deg-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;

  float amp=uWarpAmplitude/max(uWarpStrength,0.001);
  float wt=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*uWarpFrequency+wt)/amp;
  tuv.y+=sin(tuv.x*(uWarpFrequency*1.5)+wt)/(amp*0.5);

  float b=uColorBalance;
  float s=max(uBlendSoftness,0.0);
  float bx=(tuv*rot(radians(uBlendAngle))).x;
  vec3 l1=mix(uColor3,uColor2,smoothstep(-0.3-b-s,0.2-b+s,bx));
  vec3 l2=mix(uColor2,uColor1,smoothstep(-0.3-b-s,0.2-b+s,bx));
  vec3 col=mix(l1,l2,smoothstep(0.5-b+s,-0.3-b-s,tuv.y));

  vec2 gUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5)gUv+=vec2(uTime*0.05);
  float grain=fract(sin(dot(gUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;

  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,vec3(0.0)),vec3(1.0/max(uGamma,0.001)));
  fragColor=vec4(clamp(col,0.0,1.0),1.0);
}
`;

function compileShader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('[Grainient] shader error:', gl.getShaderInfoLog(s));
  }
  return s;
}

function createProgram(gl: WebGL2RenderingContext): WebGLProgram {
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VERT_SRC));
  gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC));
  gl.linkProgram(prog);
  return prog;
}

const Grainient: React.FC<GrainientProps> = ({
  timeSpeed = 0.25,
  colorBalance = 0.0,
  warpStrength = 1.0,
  warpFrequency = 5.0,
  warpSpeed = 2.0,
  warpAmplitude = 50.0,
  blendAngle = 0.0,
  blendSoftness = 0.05,
  rotationAmount = 500.0,
  noiseScale = 2.0,
  grainAmount = 0.1,
  grainScale = 2.0,
  grainAnimated = false,
  contrast = 1.5,
  gamma = 1.0,
  saturation = 1.0,
  centerX = 0.0,
  centerY = 0.0,
  zoom = 0.9,
  color1 = '#FF9FFC',
  color2 = '#5227FF',
  color3 = '#B497CF',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Store uniforms ref so the render loop always reads latest values
  const uniforms = useRef({
    timeSpeed, colorBalance, warpStrength, warpFrequency, warpSpeed,
    warpAmplitude, blendAngle, blendSoftness, rotationAmount, noiseScale,
    grainAmount, grainScale, grainAnimated, contrast, gamma, saturation,
    centerX, centerY, zoom, color1, color2, color3,
  });
  uniforms.current = {
    timeSpeed, colorBalance, warpStrength, warpFrequency, warpSpeed,
    warpAmplitude, blendAngle, blendSoftness, rotationAmount, noiseScale,
    grainAmount, grainScale, grainAnimated, contrast, gamma, saturation,
    centerX, centerY, zoom, color1, color2, color3,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false });
    if (!gl) {
      console.error('[Grainient] WebGL2 not supported');
      return;
    }

    const prog = createProgram(gl);
    gl.useProgram(prog);

    // Full-screen quad
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Collect uniform locations
    const loc = (n: string) => gl.getUniformLocation(prog, n);
    const U = {
      uRes:            loc('uRes'),
      uTime:           loc('uTime'),
      uTimeSpeed:      loc('uTimeSpeed'),
      uColorBalance:   loc('uColorBalance'),
      uWarpStrength:   loc('uWarpStrength'),
      uWarpFrequency:  loc('uWarpFrequency'),
      uWarpSpeed:      loc('uWarpSpeed'),
      uWarpAmplitude:  loc('uWarpAmplitude'),
      uBlendAngle:     loc('uBlendAngle'),
      uBlendSoftness:  loc('uBlendSoftness'),
      uRotationAmount: loc('uRotationAmount'),
      uNoiseScale:     loc('uNoiseScale'),
      uGrainAmount:    loc('uGrainAmount'),
      uGrainScale:     loc('uGrainScale'),
      uGrainAnimated:  loc('uGrainAnimated'),
      uContrast:       loc('uContrast'),
      uGamma:          loc('uGamma'),
      uSaturation:     loc('uSaturation'),
      uCenter:         loc('uCenter'),
      uZoom:           loc('uZoom'),
      uColor1:         loc('uColor1'),
      uColor2:         loc('uColor2'),
      uColor3:         loc('uColor3'),
    };

    // Resize
    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width  = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const t0 = performance.now();
    let raf = 0;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const u = uniforms.current;
      const t = (now - t0) * 0.001;

      gl.uniform2f(U.uRes, canvas.width, canvas.height);
      gl.uniform1f(U.uTime, t);
      gl.uniform1f(U.uTimeSpeed,      u.timeSpeed);
      gl.uniform1f(U.uColorBalance,   u.colorBalance);
      gl.uniform1f(U.uWarpStrength,   u.warpStrength);
      gl.uniform1f(U.uWarpFrequency,  u.warpFrequency);
      gl.uniform1f(U.uWarpSpeed,      u.warpSpeed);
      gl.uniform1f(U.uWarpAmplitude,  u.warpAmplitude);
      gl.uniform1f(U.uBlendAngle,     u.blendAngle);
      gl.uniform1f(U.uBlendSoftness,  u.blendSoftness);
      gl.uniform1f(U.uRotationAmount, u.rotationAmount);
      gl.uniform1f(U.uNoiseScale,     u.noiseScale);
      gl.uniform1f(U.uGrainAmount,    u.grainAmount);
      gl.uniform1f(U.uGrainScale,     u.grainScale);
      gl.uniform1f(U.uGrainAnimated,  u.grainAnimated ? 1.0 : 0.0);
      gl.uniform1f(U.uContrast,       u.contrast);
      gl.uniform1f(U.uGamma,          u.gamma);
      gl.uniform1f(U.uSaturation,     u.saturation);
      gl.uniform2f(U.uCenter,         u.centerX, u.centerY);
      gl.uniform1f(U.uZoom,           u.zoom);
      const c1 = hexToRgb(u.color1);
      const c2 = hexToRgb(u.color2);
      const c3 = hexToRgb(u.color3);
      gl.uniform3f(U.uColor1, c1[0], c1[1], c1[2]);
      gl.uniform3f(U.uColor2, c2[0], c2[1], c2[2]);
      gl.uniform3f(U.uColor3, c3[0], c3[1], c3[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
      gl.deleteVertexArray(vao);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
      className={className}
    />
  );
};

export default Grainient;
