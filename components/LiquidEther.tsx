'use client';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface LiquidEtherProps {
  mouseForce?: number; cursorSize?: number; isViscous?: boolean; viscous?: number;
  iterationsViscous?: number; iterationsPoisson?: number; dt?: number; BFECC?: boolean;
  resolution?: number; isBounce?: boolean; colors?: string[]; style?: React.CSSProperties;
  className?: string; autoDemo?: boolean; autoSpeed?: number; autoIntensity?: number;
  takeoverDuration?: number; autoResumeDelay?: number; autoRampDuration?: number;
}

const defaultColors = ['#ff9ffc', '#f9a8d4', '#fecdd3'];

export default function LiquidEther({
  mouseForce = 20, cursorSize = 100, isViscous = false, viscous = 30,
  iterationsViscous = 32, iterationsPoisson = 32, dt = 0.014, BFECC = true,
  resolution = 0.5, isBounce = false, colors = defaultColors, style = {},
  className = '', autoDemo = true, autoSpeed = 0.4, autoIntensity = 2.2,
  takeoverDuration = 0.25, autoResumeDelay = 1000, autoRampDuration = 0.6
}: LiquidEtherProps): React.ReactElement {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const webglRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const rafRef = useRef<number | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const resizeRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    function makePaletteTexture(stops: string[]): THREE.DataTexture {
      const arr = stops.length === 1 ? [stops[0], stops[0]] : stops;
      const w = arr.length;
      const data = new Uint8Array(w * 4);
      for (let i = 0; i < w; i++) {
        const c = new THREE.Color(arr[i]);
        data[i*4]=Math.round(c.r*255); data[i*4+1]=Math.round(c.g*255);
        data[i*4+2]=Math.round(c.b*255); data[i*4+3]=255;
      }
      const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
      tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping; tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = false; tex.needsUpdate = true;
      return tex;
    }

    const paletteTex = makePaletteTexture(colors);
    const bgVec4 = new THREE.Vector4(0, 0, 0, 0);

    // Shaders
    const face_vert = `attribute vec3 position;uniform vec2 px;uniform vec2 boundarySpace;varying vec2 uv;precision highp float;void main(){vec3 pos=position;vec2 scale=1.0-boundarySpace*2.0;pos.xy=pos.xy*scale;uv=vec2(0.5)+(pos.xy)*0.5;gl_Position=vec4(pos,1.0);}`;
    const line_vert = `attribute vec3 position;uniform vec2 px;precision highp float;varying vec2 uv;void main(){vec3 pos=position;uv=0.5+pos.xy*0.5;vec2 n=sign(pos.xy);pos.xy=abs(pos.xy)-px*1.0;pos.xy*=n;gl_Position=vec4(pos,1.0);}`;
    const mouse_vert = `precision highp float;attribute vec3 position;attribute vec2 uv;uniform vec2 center;uniform vec2 scale;uniform vec2 px;varying vec2 vUv;void main(){vec2 pos=position.xy*scale*2.0*px+center;vUv=uv;gl_Position=vec4(pos,0.0,1.0);}`;
    const advection_frag = `precision highp float;uniform sampler2D velocity;uniform float dt;uniform bool isBFECC;uniform vec2 fboSize;uniform vec2 px;varying vec2 uv;void main(){vec2 ratio=max(fboSize.x,fboSize.y)/fboSize;if(!isBFECC){vec2 vel=texture2D(velocity,uv).xy;vec2 uv2=uv-vel*dt*ratio;gl_FragColor=vec4(texture2D(velocity,uv2).xy,0.0,0.0);}else{vec2 vel_old=texture2D(velocity,uv).xy;vec2 spot_old=uv-vel_old*dt*ratio;vec2 vel_new1=texture2D(velocity,spot_old).xy;vec2 error=(spot_old+vel_new1*dt*ratio)-uv;vec2 spot_new3=uv-error/2.0;vec2 vel_2=texture2D(velocity,spot_new3).xy;gl_FragColor=vec4(texture2D(velocity,spot_new3-vel_2*dt*ratio).xy,0.0,0.0);}}`;
    const color_frag = `precision highp float;uniform sampler2D velocity;uniform sampler2D palette;uniform vec4 bgColor;varying vec2 uv;void main(){vec2 vel=texture2D(velocity,uv).xy;float lenv=clamp(length(vel),0.0,1.0);vec3 c=texture2D(palette,vec2(lenv,0.5)).rgb;gl_FragColor=vec4(mix(bgColor.rgb,c,lenv),mix(bgColor.a,1.0,lenv));}`;
    const divergence_frag = `precision highp float;uniform sampler2D velocity;uniform float dt;uniform vec2 px;varying vec2 uv;void main(){float x0=texture2D(velocity,uv-vec2(px.x,0.0)).x;float x1=texture2D(velocity,uv+vec2(px.x,0.0)).x;float y0=texture2D(velocity,uv-vec2(0.0,px.y)).y;float y1=texture2D(velocity,uv+vec2(0.0,px.y)).y;gl_FragColor=vec4((x1-x0+y1-y0)/2.0/dt);}`;
    const externalForce_frag = `precision highp float;uniform vec2 force;uniform vec2 center;uniform vec2 scale;uniform vec2 px;varying vec2 vUv;void main(){vec2 circle=(vUv-0.5)*2.0;float d=1.0-min(length(circle),1.0);d*=d;gl_FragColor=vec4(force*d,0.0,1.0);}`;
    const poisson_frag = `precision highp float;uniform sampler2D pressure;uniform sampler2D divergence;uniform vec2 px;varying vec2 uv;void main(){float p0=texture2D(pressure,uv+vec2(px.x*2.0,0.0)).r;float p1=texture2D(pressure,uv-vec2(px.x*2.0,0.0)).r;float p2=texture2D(pressure,uv+vec2(0.0,px.y*2.0)).r;float p3=texture2D(pressure,uv-vec2(0.0,px.y*2.0)).r;float div=texture2D(divergence,uv).r;gl_FragColor=vec4((p0+p1+p2+p3)/4.0-div);}`;
    const pressure_frag = `precision highp float;uniform sampler2D pressure;uniform sampler2D velocity;uniform vec2 px;uniform float dt;varying vec2 uv;void main(){float p0=texture2D(pressure,uv+vec2(px.x,0.0)).r;float p1=texture2D(pressure,uv-vec2(px.x,0.0)).r;float p2=texture2D(pressure,uv+vec2(0.0,px.y)).r;float p3=texture2D(pressure,uv-vec2(0.0,px.y)).r;vec2 v=texture2D(velocity,uv).xy;gl_FragColor=vec4(v-vec2(p0-p1,p2-p3)*0.5*dt,0.0,1.0);}`;
    const viscous_frag = `precision highp float;uniform sampler2D velocity;uniform sampler2D velocity_new;uniform float v;uniform vec2 px;uniform float dt;varying vec2 uv;void main(){vec2 old=texture2D(velocity,uv).xy;vec2 n0=texture2D(velocity_new,uv+vec2(px.x*2.0,0.0)).xy;vec2 n1=texture2D(velocity_new,uv-vec2(px.x*2.0,0.0)).xy;vec2 n2=texture2D(velocity_new,uv+vec2(0.0,px.y*2.0)).xy;vec2 n3=texture2D(velocity_new,uv-vec2(0.0,px.y*2.0)).xy;vec2 newv=4.0*old+v*dt*(n0+n1+n2+n3);gl_FragColor=vec4(newv/(4.0*(1.0+v*dt)),0.0,0.0);}`;

    let width=0,height=0,renderer:THREE.WebGLRenderer|null=null;
    const clock=new THREE.Clock();
    let time=0;

    const container=mountRef.current!;
    container.style.position=container.style.position||'relative';
    container.style.overflow=container.style.overflow||'hidden';

    const pixelRatio=Math.min(window.devicePixelRatio||1,2);
    const getSize=()=>{const r=container.getBoundingClientRect();return{w:Math.max(1,Math.floor(r.width)),h:Math.max(1,Math.floor(r.height))};};
    {const s=getSize();width=s.w;height=s.h;}

    renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
    renderer.autoClear=false;
    renderer.setClearColor(new THREE.Color(0),0);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width,height);
    renderer.domElement.style.cssText='width:100%;height:100%;display:block;position:absolute;top:0;left:0;pointer-events:none;';
    container.prepend(renderer.domElement);

    const fboOpts=()=>({type:(/(iPad|iPhone|iPod)/i.test(navigator.userAgent)?THREE.HalfFloatType:THREE.FloatType),depthBuffer:false,stencilBuffer:false,minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,wrapS:THREE.ClampToEdgeWrapping,wrapT:THREE.ClampToEdgeWrapping} as const);

    let fboW=Math.max(1,Math.round(resolution*width));
    let fboH=Math.max(1,Math.round(resolution*height));
    const cellScale=new THREE.Vector2(1/fboW,1/fboH);
    const fboSize=new THREE.Vector2(fboW,fboH);

    const mkFBO=()=>new THREE.WebGLRenderTarget(fboW,fboH,fboOpts());
    let vel0=mkFBO(),vel1=mkFBO(),vis0=mkFBO(),vis1=mkFBO(),div=mkFBO(),p0=mkFBO(),p1=mkFBO();

    const mkMat=(vs:string,fs:string,uniforms:any,blending?:THREE.Blending)=>new THREE.RawShaderMaterial({vertexShader:vs,fragmentShader:fs,uniforms,blending,depthWrite:false});
    const fullQ=new THREE.PlaneGeometry(2,2);
    const mkMesh=(mat:THREE.Material,geo:THREE.BufferGeometry=fullQ)=>new THREE.Mesh(geo,mat);
    const cam=new THREE.Camera();

    const render=(mat:THREE.RawShaderMaterial,target:THREE.WebGLRenderTarget|null,scene?:THREE.Scene)=>{
      if(!renderer)return;
      const s=scene||new THREE.Scene();
      if(!scene){const m=mkMesh(mat);s.add(m);}
      renderer.setRenderTarget(target);
      renderer.render(s,cam);
      renderer.setRenderTarget(null);
    };

    // Mouse
    const mouse=new THREE.Vector2(),mouseOld=new THREE.Vector2(),mouseDiff=new THREE.Vector2();
    let mouseTimer:any=null;
    let mouseMoved=false;
    const autoPos=new THREE.Vector2(),autoTarget=new THREE.Vector2();
    let autoActive=false,lastInteract=performance.now(),autoActivated=0;
    const pickAutoTarget=()=>autoTarget.set((Math.random()*2-1)*0.8,(Math.random()*2-1)*0.8);
    pickAutoTarget();

    const setMouse=(cx:number,cy:number)=>{
      const rect=container.getBoundingClientRect();
      if(rect.width===0||rect.height===0)return;
      const nx=(cx-rect.left)/rect.width*2-1;
      const ny=-((cy-rect.top)/rect.height*2-1);
      mouse.set(nx,ny);
      mouseMoved=true;
      clearTimeout(mouseTimer);
      mouseTimer=setTimeout(()=>{mouseMoved=false;},100);
    };
    const onMove=(e:MouseEvent)=>{lastInteract=performance.now();autoActive=false;setMouse(e.clientX,e.clientY);};
    const onTouch=(e:TouchEvent)=>{if(e.touches.length!==1)return;lastInteract=performance.now();autoActive=false;setMouse(e.touches[0].clientX,e.touches[0].clientY);};
    window.addEventListener('mousemove',onMove);
    window.addEventListener('touchmove',onTouch,{passive:true});

    // Shader materials
    const advMat=mkMat(face_vert,advection_frag,{boundarySpace:{value:cellScale},px:{value:cellScale},fboSize:{value:fboSize},velocity:{value:vel0.texture},dt:{value:dt},isBFECC:{value:BFECC}});
    const extMat=mkMat(mouse_vert,externalForce_frag,{px:{value:cellScale},force:{value:new THREE.Vector2()},center:{value:new THREE.Vector2()},scale:{value:new THREE.Vector2(cursorSize,cursorSize)}},THREE.AdditiveBlending);
    const visMat=mkMat(face_vert,viscous_frag,{boundarySpace:{value:cellScale},velocity:{value:vel1.texture},velocity_new:{value:vis0.texture},v:{value:viscous},px:{value:cellScale},dt:{value:dt}});
    const divMat=mkMat(face_vert,divergence_frag,{boundarySpace:{value:cellScale},velocity:{value:vis0.texture},px:{value:cellScale},dt:{value:dt}});
    const poisMat=mkMat(face_vert,poisson_frag,{boundarySpace:{value:cellScale},pressure:{value:p0.texture},divergence:{value:div.texture},px:{value:cellScale}});
    const preMat=mkMat(face_vert,pressure_frag,{boundarySpace:{value:cellScale},pressure:{value:p0.texture},velocity:{value:vis0.texture},px:{value:cellScale},dt:{value:dt}});
    const colMat=mkMat(face_vert,color_frag,{velocity:{value:vel0.texture},boundarySpace:{value:new THREE.Vector2()},palette:{value:paletteTex},bgColor:{value:bgVec4}});

    // mouse force geometry
    const mouseGeo=new THREE.PlaneGeometry(1,1);
    const extScene=new THREE.Scene();
    const extMesh=mkMesh(extMat,mouseGeo);
    extScene.add(extMesh);

    let running=true;
    const loop=()=>{
      if(!running||!renderer)return;
      const delta=clock.getDelta();
      time+=delta;

      // Auto demo
      if(autoDemo){
        const idle=performance.now()-lastInteract;
        if(idle>autoResumeDelay&&!autoActive){autoActive=true;autoPos.copy(mouse);autoActivated=performance.now();}
        if(autoActive){
          const dtS=Math.min(delta,0.05);
          const ramp=Math.min(1,(performance.now()-autoActivated)/(autoRampDuration*1000));
          const dir=new THREE.Vector2().subVectors(autoTarget,autoPos);
          if(dir.length()<0.02)pickAutoTarget();
          autoPos.addScaledVector(dir.normalize(),autoSpeed*dtS*ramp);
          mouse.copy(autoPos);
          mouseMoved=true;
        }
      }

      // update mouse diff
      mouseDiff.subVectors(mouse,mouseOld);
      mouseOld.copy(mouse);

      // advection
      advMat.uniforms.velocity.value=vel0.texture;
      advMat.uniforms.dt.value=dt;
      advMat.uniforms.isBFECC.value=BFECC;
      render(advMat,vel1);

      // external force
      if(mouseMoved||autoActive){
        const fx=mouseDiff.x/2*mouseForce*(autoActive?autoIntensity:1);
        const fy=mouseDiff.y/2*mouseForce*(autoActive?autoIntensity:1);
        const csx=cursorSize*cellScale.x,csy=cursorSize*cellScale.y;
        const cx=Math.min(Math.max(mouse.x,-1+csx+cellScale.x*2),1-csx-cellScale.x*2);
        const cy=Math.min(Math.max(mouse.y,-1+csy+cellScale.y*2),1-csy-cellScale.y*2);
        extMat.uniforms.force.value.set(fx,fy);
        extMat.uniforms.center.value.set(cx,cy);
        extMat.uniforms.scale.value.set(cursorSize,cursorSize);
        render(extMat,vel1,extScene);
      }

      // viscous
      let velOut=vel1;
      if(isViscous){
        visMat.uniforms.v.value=viscous;
        visMat.uniforms.dt.value=dt;
        for(let i=0;i<iterationsViscous;i++){
          const fi=i%2===0;
          visMat.uniforms.velocity.value=(fi?vel1:vis1).texture;
          visMat.uniforms.velocity_new.value=(fi?vis0:vis0).texture;
          render(visMat,fi?vis1:vis0);
        }
        velOut=vis0;
      }

      // divergence
      divMat.uniforms.velocity.value=velOut.texture;
      render(divMat,div);

      // poisson
      for(let i=0;i<iterationsPoisson;i++){
        const fi=i%2===0;
        poisMat.uniforms.pressure.value=(fi?p0:p1).texture;
        render(poisMat,fi?p1:p0);
      }

      // pressure
      preMat.uniforms.velocity.value=velOut.texture;
      preMat.uniforms.pressure.value=p0.texture;
      render(preMat,vel0);

      // output
      colMat.uniforms.velocity.value=vel0.texture;
      render(colMat,null);

      rafRef.current=requestAnimationFrame(loop);
    };
    rafRef.current=requestAnimationFrame(loop);

    const handleResize=()=>{
      if(resizeRafRef.current)cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current=requestAnimationFrame(()=>{
        if(!renderer||!mountRef.current)return;
        const s=getSize();width=s.w;height=s.h;
        renderer.setSize(width,height,false);
        fboW=Math.max(1,Math.round(resolution*width));
        fboH=Math.max(1,Math.round(resolution*height));
        cellScale.set(1/fboW,1/fboH);
        fboSize.set(fboW,fboH);
        [vel0,vel1,vis0,vis1,div,p0,p1].forEach(f=>{f.setSize(fboW,fboH);});
      });
    };

    const ro=new ResizeObserver(handleResize);
    ro.observe(container);
    resizeObserverRef.current=ro;

    const io=new IntersectionObserver(entries=>{
      const v=entries[0].isIntersecting;
      isVisibleRef.current=v;
      if(v&&!document.hidden)running=true;
      else running=false;
    },{threshold:[0,0.01]});
    io.observe(container);
    intersectionObserverRef.current=io;

    return ()=>{
      running=false;
      if(rafRef.current)cancelAnimationFrame(rafRef.current);
      if(resizeRafRef.current)cancelAnimationFrame(resizeRafRef.current);
      window.removeEventListener('mousemove',onMove);
      window.removeEventListener('touchmove',onTouch);
      ro.disconnect();
      io.disconnect();
      if(renderer){
        if(renderer.domElement.parentNode)renderer.domElement.parentNode.removeChild(renderer.domElement);
        renderer.dispose();
      }
      [vel0,vel1,vis0,vis1,div,p0,p1].forEach(f=>f.dispose());
      paletteTex.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full relative overflow-hidden ${className}`}
      style={style}
    />
  );
}
