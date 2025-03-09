"use client"

import { useEffect, useRef} from "react"
import HeroSection from "./heroSection"
export default function FluidShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer: Renderer | null = null
    const dpr = Math.max(1, window.devicePixelRatio)

    const resize = () => {
      if (!canvas) return
      const { innerWidth: width, innerHeight: height } = window
      canvas.width = width * dpr
      canvas.height = height * dpr
      if (renderer) {
        renderer.updateScale(dpr)
      }
    }

    const fragmentShaderSource = `#version 300 es
    precision highp float;
    out vec4 O;
    uniform float time;
    uniform vec2 resolution;
    #define FC gl_FragCoord.xy
    #define R resolution
    #define T (time+660.)
    #define S smoothstep
    #define N normalize
    #define rot(a) mat2(cos((a)-vec4(0,11,33,0)))
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
        for (float i=.0; i<5.; i++) {
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
        // Vibrant color adjustments
        col.r *= 0.2;
        col.g *= 1.0;
        col.b *= 0.9;
        O=vec4(col,1);
    }`

    renderer = new Renderer(canvas, dpr)
    renderer.setup()
    renderer.init()
    resize()

    if (renderer.test(fragmentShaderSource) === null) {
      renderer.updateShader(fragmentShaderSource)
    }

    window.addEventListener("resize", resize)

    let animationFrameId: number
    const loop = (now: number) => {
      if (renderer) {
        renderer.render(now)
      }
      animationFrameId = requestAnimationFrame(loop)
    }

    loop(0)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
      if (renderer) {
        renderer.reset()
      }
    }
  }, [])

  return (
    <div className="relative w-screen h-screen overflow-x-hidden">
      {/* WebGL Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full block" />
      <HeroSection/>
    </div>
  )
}

class Renderer {
  private vertexSrc = "#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}"
  private fragmtSrc =
    "#version 300 es\nprecision highp float;\nout vec4 O;\nuniform float time;\nuniform vec2 resolution;\nvoid main() {\n\tvec2 uv=gl_FragCoord.xy/resolution;\n\tO=vec4(uv,sin(time)*.5+.5,1);\n}"
  private vertices = [-1, 1, -1, -1, 1, 1, 1, -1]
  private gl: WebGL2RenderingContext
  private canvas: HTMLCanvasElement
  private scale: number
  private shaderSource: string
  private program: WebGLProgram | null = null
  private vs: WebGLShader | null = null
  private fs: WebGLShader | null = null
  private buffer: WebGLBuffer | null = null

  constructor(canvas: HTMLCanvasElement, scale: number) {
    this.canvas = canvas
    this.scale = scale
    const gl = canvas.getContext("webgl2")
    if (!gl) {
      throw new Error("WebGL2 not supported")
    }
    this.gl = gl
    this.gl.viewport(0, 0, canvas.width, canvas.height)
    this.shaderSource = this.fragmtSrc
  }

  get defaultSource() {
    return this.fragmtSrc
  }

  updateShader(source: string) {
    this.reset()
    this.shaderSource = source
    this.setup()
    this.init()
  }

  updateScale(scale: number) {
    this.scale = scale
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
  }

  compile(shader: WebGLShader, source: string) {
    const gl = this.gl
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader))
    }
  }

  test(source: string) {
    let result = null
    const gl = this.gl
    const shader = gl.createShader(gl.FRAGMENT_SHADER)
    if (!shader) return "Could not create shader"

    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      result = gl.getShaderInfoLog(shader)
    }
    gl.deleteShader(shader)
    return result
  }

  reset() {
    const gl = this.gl
    if (!this.program) return

    if (this.vs) {
      gl.detachShader(this.program, this.vs)
      gl.deleteShader(this.vs)
      this.vs = null
    }

    if (this.fs) {
      gl.detachShader(this.program, this.fs)
      gl.deleteShader(this.fs)
      this.fs = null
    }

    gl.deleteProgram(this.program)
    this.program = null

    if (this.buffer) {
      gl.deleteBuffer(this.buffer)
      this.buffer = null
    }
  }

  setup() {
    const gl = this.gl

    this.vs = gl.createShader(gl.VERTEX_SHADER)
    this.fs = gl.createShader(gl.FRAGMENT_SHADER)

    if (!this.vs || !this.fs) {
      throw new Error("Could not create shaders")
    }

    this.compile(this.vs, this.vertexSrc)
    this.compile(this.fs, this.shaderSource)

    this.program = gl.createProgram()
    if (!this.program) {
      throw new Error("Could not create program")
    }

    gl.attachShader(this.program, this.vs)
    gl.attachShader(this.program, this.fs)
    gl.linkProgram(this.program)

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(this.program))
    }
  }

  init() {
    const gl = this.gl
    if (!this.program) return

    this.buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW)

    const position = gl.getAttribLocation(this.program, "position")
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const resolutionLocation = gl.getUniformLocation(this.program, "resolution")
    const timeLocation = gl.getUniformLocation(this.program, "time")

    // Store uniform locations
    if (this.program) {
      // @ts-ignore - We're adding custom properties to the program object
      this.program.resolution = resolutionLocation
      // @ts-ignore
      this.program.time = timeLocation
    }
  }

  render(now = 0) {
    const gl = this.gl
    if (!this.program) return

    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Ensure gl.useProgram is always called
    gl.useProgram(this.program)

    if (this.buffer) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
    }

    // @ts-ignore - We added these custom properties in init()
    gl.uniform2f(this.program.resolution, this.canvas.width, this.canvas.height)
    // @ts-ignore
    gl.uniform1f(this.program.time, now * 1e-3)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }
}

