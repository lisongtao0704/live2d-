export class LAppGlManager {
  private _gl: WebGLRenderingContext | WebGL2RenderingContext = null;
  public constructor() {
    this._gl = null;
  }

  public initialize(canvas: HTMLCanvasElement): boolean {
    this._gl = canvas.getContext("webgl2");
    if (!this._gl) {
      // gl初期化失敗
      alert("Cannot initialize WebGL. This browser does not support.");
      this._gl = null;
      return false;
    }
    return true;
  }

  public getGl(): WebGLRenderingContext | WebGL2RenderingContext {
    return this._gl;
  }
}
