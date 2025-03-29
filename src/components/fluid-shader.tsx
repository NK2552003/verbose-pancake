"use client"

import { useEffect, useRef, useCallback } from "react"

export default function FluidShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastRenderRef = useRef(0)
  const frameRate = 30
  const isMobile = typeof window !== 'undefined' ? /Mobi|Android/i.test(navigator.userAgent) : false

  const fragmentShaderSource = `#version 300 es
precision mediump float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
#define FC gl_FragCoord.xy
#define R resolution
#define T (time+660.)
#define S smoothstep
#define N normalize
float rnd(vec2 p) {
    p=fract(p*vec2(12.9898,78.233));
    p+=dot(p,p+34.56);
    return fract(p.x*p.y);
}
float noise(vec2 p) {
    vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f), k=vec2(1,0);
    float a=rnd(i), b=rnd(i+k), c=rnd(i+k.yx), d=rnd(i+1.);
    return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
    float t=.0, a=1., h=.0; mat2 m=mat2(1.,-1.2,.2,1.2);
    for (float i=.0; i<4.; i++) {
        t+=a*noise(p);
        p*=2.*m;
        a*=.5;
        h+=a;
    }
    return t/h;
}
void main() {
    vec2 uv=(FC-.5*R)/R.y, k=vec2(0,T*.015); 
    vec3 col=vec3(1);
    uv.x+=.25;
    uv*=vec2(2,1);
    float n=fbm(uv*.28+vec2(-T*.01,0));
    n=noise(uv*3.+n*2.);
    col.r-=fbm(uv+k+n);
    col.g-=fbm(uv*1.003+k+n+.003);
    col.b-=fbm(uv*1.006+k+n+.006);
    col=mix(col,vec3(1),dot(col,vec3(.21,.71,.07)));
    col=mix(vec3(.08),col,min(time*.1,1.));
    col=clamp(col,.08,1.);
    col.r *= 0.2;
    col.g *= 1.0;
    col.b *= 0.9;
    O=vec4(col,1);
}`

  const setupWebGL = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const dpr = isMobile ? 1 : Math.min(1.5, window.devicePixelRatio)
    const { innerWidth: width, innerHeight: height } = window
    canvas.width = width * dpr
    canvas.height = height * dpr

    try {
      return canvas.getContext('webgl2', { 
        antialias: false,
        powerPreference: isMobile ? 'low-power' : 'high-performance'
      })
    } catch (e) {
      return null
    }
  }, [isMobile])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = setupWebGL()
    if (!gl) return

    let renderer: Renderer | null = new Renderer(canvas, gl)
    let animationFrameId: number

    const handleResize = () => {
      const dpr = isMobile ? 1 : Math.min(1.5, window.devicePixelRatio)
      const { innerWidth: width, innerHeight: height } = window
      canvas.width = width * dpr
      canvas.height = height * dpr
      renderer?.updateScale(dpr)
    }

    const debouncedResize = debounce(handleResize, 100)
    window.addEventListener('resize', debouncedResize)

    const render = (now: number) => {
      if (now - lastRenderRef.current >= 1000 / frameRate) {
        renderer?.render(now)
        lastRenderRef.current = now
      }
      animationFrameId = requestAnimationFrame(render)
    }

    renderer.init(fragmentShaderSource)
    render(0)

    return () => {
      window.removeEventListener('resize', debouncedResize)
      cancelAnimationFrame(animationFrameId)
      renderer?.cleanup()
    }
  }, [fragmentShaderSource, isMobile, setupWebGL])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 w-full h-full block" />
  )
}

class Renderer {
  private gl: WebGL2RenderingContext
  private canvas: HTMLCanvasElement
  private program: WebGLProgram | null = null
  private buffer: WebGLBuffer | null = null
  private scale: number
  private timeUniform: WebGLUniformLocation | null = null
  private resolutionUniform: WebGLUniformLocation | null = null

  constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
    this.canvas = canvas
    this.gl = gl
    this.scale = 1
    this.gl.getExtension('EXT_color_buffer_float')
  }

  init(shaderSource: string) {
    const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, 
      `#version 300 es
precision lowp float;
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`
    )
    
    const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, shaderSource)

    if (!vertexShader || !fragmentShader) return

    this.program = this.gl.createProgram()
    if (!this.program) return

    this.gl.attachShader(this.program, vertexShader)
    this.gl.attachShader(this.program, fragmentShader)
    this.gl.linkProgram(this.program)

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error(this.gl.getProgramInfoLog(this.program))
      return
    }

    this.buffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), this.gl.STATIC_DRAW)

    const positionLocation = this.gl.getAttribLocation(this.program, 'position')
    this.timeUniform = this.gl.getUniformLocation(this.program, 'time')
    this.resolutionUniform = this.gl.getUniformLocation(this.program, 'resolution')

    this.gl.enableVertexAttribArray(positionLocation)
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0)
  }

  private compileShader(type: number, source: string): WebGLShader | null {
    const shader = this.gl.createShader(type)
    if (!shader) return null

    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(this.gl.getShaderInfoLog(shader))
      return null
    }
    return shader
  }

  updateScale(scale: number) {
    this.scale = scale
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
  }

  render(time: number) {
    if (!this.program || !this.resolutionUniform || !this.timeUniform) return

    this.gl.useProgram(this.program)
    this.gl.uniform1f(this.timeUniform, time * 0.001)
    this.gl.uniform2f(this.resolutionUniform, this.canvas.width, this.canvas.height)
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
  }

  cleanup() {
    this.gl.deleteProgram(this.program)
    this.gl.deleteBuffer(this.buffer)
  }
}

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}