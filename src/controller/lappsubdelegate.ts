import * as LAppDefine from "./lappdefine";
import { LAppGlManager } from './lappglmanager';
// import { LAppLive2DManager } from './lapplive2dmanager';
// import { LAppPal } from './lapppal';
import { LAppTextureManager } from './lapptexturemanager';
// import { LAppView } from './lappview';

export class LAppSubdelegate {
  private _canvas: HTMLCanvasElement;
  // private _view: LAppView;
  private _textureManager: LAppTextureManager;
  // private _frameBuffer: WebGLFramebuffer;
  private _glManager: LAppGlManager;
  // private _live2dManager: LAppLive2DManager;
  // private _resizeObserver: ResizeObserver;
  // private _captured: boolean;
  // private _needResize: boolean;
  public constructor() {
    this._canvas = null;
    this._glManager = new LAppGlManager();
    this._textureManager = new LAppTextureManager();
    // this._live2dManager = new LAppLive2DManager();
    // this._view = new LAppView();
    // this._frameBuffer = null;
    // this._captured = false;
  }

  public initialize(canvas: HTMLCanvasElement): boolean {
    if (!this._glManager.initialize(canvas)) {
      return false;
    }
    this._canvas = canvas;

    if (LAppDefine.CanvasSize === 'auto') {
      this.resizeCanvas();
    } else {
      canvas.width = LAppDefine.CanvasSize.width;
      canvas.height = LAppDefine.CanvasSize.height;
    }

    this._textureManager.setGlManager(this._glManager);

    const gl = this._glManager.getGl();

    // if (!this._frameBuffer) {
    //   this._frameBuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
    // }

    // // 透過設定
    // gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // // AppViewの初期化
    // this._view.initialize(this);
    // this._view.initializeSprite();

    // this._live2dManager.initialize(this);

    // this._resizeObserver = new ResizeObserver(
    //   (entries: ResizeObserverEntry[], observer: ResizeObserver) =>
    //     this.resizeObserverCallback.call(this, entries, observer)
    // );
    // this._resizeObserver.observe(this._canvas);

    return true;
  }

  public isContextLost(): boolean {
    return this._glManager.getGl().isContextLost();
  }

  private resizeCanvas(): void {
    this._canvas.width = this._canvas.clientWidth * window.devicePixelRatio;
    this._canvas.height = this._canvas.clientHeight * window.devicePixelRatio;
    const gl = this._glManager.getGl();
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  }
}
