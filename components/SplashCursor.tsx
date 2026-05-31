'use client';
import React, { useEffect, useRef } from 'react';

interface SplashCursorProps {
  TRANSPARENT?: boolean;
  RAINBOW_MODE?: boolean;
  COLOR?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255]
    : [0.75, 0.38, 0.5];
}

export default function SplashCursor({
  TRANSPARENT = false,
  RAINBOW_MODE = false,
  COLOR = '#c06080',
}: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1024,
      DENSITY_DISSIPATION: 1,
      VELOCITY_DISSIPATION: 0.2,
      PRESSURE: 0.8,
      PRESSURE_ITERATIONS: 20,
      CURL: 30,
      SPLAT_RADIUS: 0.25,
      SPLAT_FORCE: 6000,
      TRANSPARENT,
      RAINBOW_MODE,
      COLOR: hexToRgb(COLOR),
    };

    let gl: WebGL2RenderingContext | WebGLRenderingContext | null = null;
    const glContext = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!glContext) return;
    gl = glContext;

    const isWebGL2 = gl instanceof WebGL2RenderingContext;

    function compileShader(type: number, source: string, keywords?: string[]): WebGLShader {
      let src = source;
      if (keywords) {
        src = keywords.map(k => `#define ${k}`).join('\n') + '\n' + src;
      }
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      return shader;
    }

    function createProgram(vertSrc: string, fragSrc: string, keywords?: string[]): WebGLProgram {
      const vert = compileShader(gl!.VERTEX_SHADER, vertSrc);
      const frag = compileShader(gl!.FRAGMENT_SHADER, fragSrc, keywords);
      const program = gl!.createProgram()!;
      gl!.attachShader(program, vert);
      gl!.attachShader(program, frag);
      gl!.linkProgram(program);
      return program;
    }

    const baseVertexShader = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const copyShader = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      void main () { gl_FragColor = texture2D(uTexture, vUv); }
    `;

    const clearShader = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
    `;

    const splatShader = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `;

    const advectionShader = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;
        vec2 iuv = floor(st);
        vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      void main () {
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        vec4 result = bilerp(uSource, coord, dyeTexelSize);
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
      }
    `;

    const divergenceShader = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    const curlShader = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `;

    const vorticityShader = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
      }
    `;

    const pressureShader = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `;

    const gradientSubtractShader = `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `;

    const displayShader = config.TRANSPARENT
      ? `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTexture;
        void main () {
          vec4 c = texture2D(uTexture, vUv);
          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c.rgb, a);
        }
      `
      : `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTexture;
        void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          gl_FragColor = vec4(c, 1.0);
        }
      `;

    // Setup
    gl.clearColor(0, 0, 0, 1);

    const ext = {
      formatRGBA: isWebGL2
        ? { internalFormat: (gl as WebGL2RenderingContext).RGBA16F, format: gl.RGBA }
        : { internalFormat: gl.RGBA, format: gl.RGBA },
      formatRG: isWebGL2
        ? { internalFormat: (gl as WebGL2RenderingContext).RG16F, format: (gl as WebGL2RenderingContext).RG }
        : { internalFormat: gl.RGBA, format: gl.RGBA },
      formatR: isWebGL2
        ? { internalFormat: (gl as WebGL2RenderingContext).R16F, format: (gl as WebGL2RenderingContext).RED }
        : { internalFormat: gl.RGBA, format: gl.RGBA },
      halfFloatTexType: isWebGL2
        ? (gl as WebGL2RenderingContext).HALF_FLOAT
        : (gl.getExtension('OES_texture_half_float')?.HALF_FLOAT_OES ?? gl.UNSIGNED_BYTE),
      supportLinearFiltering: isWebGL2
        ? !!gl.getExtension('OES_texture_float_linear')
        : !!(gl.getExtension('OES_texture_half_float_linear') || gl.getExtension('OES_texture_float_linear')),
    };

    function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
      gl!.activeTexture(gl!.TEXTURE0);
      const texture = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, param);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, param);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
      const fbo = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0);
      gl!.viewport(0, 0, w, h);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      return { texture, fbo, width: w, height: h, attach(id: number) { gl!.activeTexture(gl!.TEXTURE0 + id); gl!.bindTexture(gl!.TEXTURE_2D, texture); return id; } };
    }

    function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w, height: h,
        texelSizeX: 1 / w, texelSizeY: 1 / h,
        get read() { return fbo1; },
        set read(v) { fbo1 = v; },
        get write() { return fbo2; },
        set write(v) { fbo2 = v; },
        swap() { const t = fbo1; fbo1 = fbo2; fbo2 = t; },
      };
    }

    // Quad buffer
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const indexBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

    const programs = {
      copy: createProgram(baseVertexShader, copyShader),
      clear: createProgram(baseVertexShader, clearShader),
      splat: createProgram(baseVertexShader, splatShader),
      advection: createProgram(baseVertexShader, advectionShader),
      divergence: createProgram(baseVertexShader, divergenceShader),
      curl: createProgram(baseVertexShader, curlShader),
      vorticity: createProgram(baseVertexShader, vorticityShader),
      pressure: createProgram(baseVertexShader, pressureShader),
      gradientSubtract: createProgram(baseVertexShader, gradientSubtractShader),
      display: createProgram(baseVertexShader, displayShader),
    };

    function getUniforms(prog: WebGLProgram) {
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const n = gl!.getProgramParameter(prog, gl!.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) {
        const info = gl!.getActiveUniform(prog, i)!;
        uniforms[info.name] = gl!.getUniformLocation(prog, info.name);
      }
      return uniforms;
    }

    const u = {
      copy: getUniforms(programs.copy),
      clear: getUniforms(programs.clear),
      splat: getUniforms(programs.splat),
      advection: getUniforms(programs.advection),
      divergence: getUniforms(programs.divergence),
      curl: getUniforms(programs.curl),
      vorticity: getUniforms(programs.vorticity),
      pressure: getUniforms(programs.pressure),
      gradientSubtract: getUniforms(programs.gradientSubtract),
      display: getUniforms(programs.display),
    };

    function getResolution(res: number) {
      let w = Math.round(res * (canvas!.width / canvas!.height));
      let h = res;
      if (canvas!.width < canvas!.height) { w = res; h = Math.round(res * (canvas!.height / canvas!.width)); }
      return { width: w, height: h };
    }

    const simRes = getResolution(config.SIM_RESOLUTION);
    const dyeRes = getResolution(config.DYE_RESOLUTION);
    const texType = ext.halfFloatTexType;
    const linearFilter = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    let velocity = createDoubleFBO(simRes.width, simRes.height, ext.formatRG.internalFormat, ext.formatRG.format, texType, linearFilter);
    let dye = createDoubleFBO(dyeRes.width, dyeRes.height, ext.formatRGBA.internalFormat, ext.formatRGBA.format, texType, linearFilter);
    let divergence = createFBO(simRes.width, simRes.height, ext.formatR.internalFormat, ext.formatR.format, texType, gl.NEAREST);
    let curl = createFBO(simRes.width, simRes.height, ext.formatR.internalFormat, ext.formatR.format, texType, gl.NEAREST);
    let pressure = createDoubleFBO(simRes.width, simRes.height, ext.formatR.internalFormat, ext.formatR.format, texType, gl.NEAREST);

    function blit(target: { fbo: WebGLFramebuffer | null; width: number; height: number } | null) {
      gl!.bindBuffer(gl!.ARRAY_BUFFER, buf);
      gl!.vertexAttribPointer(0, 2, gl!.FLOAT, false, 0, 0);
      gl!.enableVertexAttribArray(0);
      gl!.bindBuffer(gl!.ELEMENT_ARRAY_BUFFER, indexBuf);
      if (target) {
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo);
        gl!.viewport(0, 0, target.width, target.height);
      } else {
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
        gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight);
      }
      gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0);
    }

    function splat(x: number, y: number, dx: number, dy: number, color: [number, number, number]) {
      gl!.useProgram(programs.splat);
      gl!.uniform1i(u.splat['uTarget'], velocity.read.attach(0));
      gl!.uniform1f(u.splat['aspectRatio'], canvas!.width / canvas!.height);
      gl!.uniform2f(u.splat['point'], x / canvas!.width, 1.0 - y / canvas!.height);
      gl!.uniform3f(u.splat['color'], dx, -dy, 0);
      gl!.uniform1f(u.splat['radius'], config.SPLAT_RADIUS / 100);
      blit(velocity.write);
      velocity.swap();

      gl!.uniform1i(u.splat['uTarget'], dye.read.attach(0));
      const c = config.RAINBOW_MODE
        ? [Math.random(), Math.random(), Math.random()] as [number, number, number]
        : color;
      gl!.uniform3f(u.splat['color'], c[0] * 0.3, c[1] * 0.3, c[2] * 0.3);
      blit(dye.write);
      dye.swap();
    }

    let lastTime = Date.now();
    let animId: number;

    function step(dt: number) {
      gl!.disable(gl!.BLEND);

      gl!.useProgram(programs.curl);
      gl!.uniform2f(u.curl['texelSize'], velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(u.curl['uVelocity'], velocity.read.attach(0));
      blit(curl);

      gl!.useProgram(programs.vorticity);
      gl!.uniform2f(u.vorticity['texelSize'], velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(u.vorticity['uVelocity'], velocity.read.attach(0));
      gl!.uniform1i(u.vorticity['uCurl'], curl.attach(1));
      gl!.uniform1f(u.vorticity['curl'], config.CURL);
      gl!.uniform1f(u.vorticity['dt'], dt);
      blit(velocity.write);
      velocity.swap();

      gl!.useProgram(programs.divergence);
      gl!.uniform2f(u.divergence['texelSize'], velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(u.divergence['uVelocity'], velocity.read.attach(0));
      blit(divergence);

      gl!.useProgram(programs.clear);
      gl!.uniform1i(u.clear['uTexture'], pressure.read.attach(0));
      gl!.uniform1f(u.clear['value'], config.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      gl!.useProgram(programs.pressure);
      gl!.uniform2f(u.pressure['texelSize'], velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(u.pressure['uDivergence'], divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl!.uniform1i(u.pressure['uPressure'], pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gl!.useProgram(programs.gradientSubtract);
      gl!.uniform2f(u.gradientSubtract['texelSize'], velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(u.gradientSubtract['uPressure'], pressure.read.attach(0));
      gl!.uniform1i(u.gradientSubtract['uVelocity'], velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      gl!.useProgram(programs.advection);
      gl!.uniform2f(u.advection['texelSize'], velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform2f(u.advection['dyeTexelSize'], velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(u.advection['uVelocity'], velocity.read.attach(0));
      gl!.uniform1i(u.advection['uSource'], velocity.read.attach(0));
      gl!.uniform1f(u.advection['dt'], dt);
      gl!.uniform1f(u.advection['dissipation'], config.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      gl!.uniform2f(u.advection['dyeTexelSize'], dye.texelSizeX, dye.texelSizeY);
      gl!.uniform1i(u.advection['uVelocity'], velocity.read.attach(0));
      gl!.uniform1i(u.advection['uSource'], dye.read.attach(1));
      gl!.uniform1f(u.advection['dissipation'], config.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    }

    function render() {
      if (config.TRANSPARENT) {
        gl!.enable(gl!.BLEND);
        gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA);
      } else {
        gl!.disable(gl!.BLEND);
      }
      gl!.useProgram(programs.display);
      gl!.uniform1i(u.display['uTexture'], dye.read.attach(0));
      blit(null);
    }

    function loop() {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.016);
      lastTime = now;
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
      step(dt);
      render();
      animId = requestAnimationFrame(loop);
    }

    const pointers: { id: number; x: number; y: number; dx: number; dy: number; down: boolean; moved: boolean; color: [number, number, number] }[] = [];

    function onMove(x: number, y: number, id: number, force: number) {
      let p = pointers.find(p => p.id === id);
      if (!p) {
        p = { id, x, y, dx: 0, dy: 0, down: true, moved: false, color: config.COLOR };
        pointers.push(p);
      }
      p.dx = (x - p.x) * force;
      p.dy = (y - p.y) * force;
      p.x = x;
      p.y = y;
      p.moved = Math.abs(p.dx) > 0 || Math.abs(p.dy) > 0;
      if (p.moved) splat(p.x, p.y, p.dx, p.dy, p.color);
    }

    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY, -1, 10);
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      Array.from(e.changedTouches).forEach(t => onMove(t.clientX, t.clientY, t.identifier, 10));
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [TRANSPARENT, RAINBOW_MODE, COLOR]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
