import { LAppSubdelegate } from "./lappsubdelegate";

export class Rect {
  public left: number; // 左边
  public right: number; // 右边
  public up: number; // 上边
  public down: number; // 下边
}

export class LAppSprite {
  private _texture: WebGLTexture; // 纹理
  private _vertexBuffer: WebGLBuffer; // 顶点缓冲区
  private _uvBuffer: WebGLBuffer; // uv顶点缓冲区
  private _indexBuffer: WebGLBuffer; // 顶点索引缓冲区
  private _rect: Rect; // 矩形

  private _positionLocation: number;
  private _uvLocation: number;
  private _textureLocation: WebGLUniformLocation;

  private _positionArray: Float32Array;
  private _uvArray: Float32Array;
  private _indexArray: Uint16Array;

  private _firstDraw: boolean;

  private _subdelegate: LAppSubdelegate;

  public constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    textureId: WebGLTexture
  ) {
    this._rect = new Rect();
    this._rect.left = x - width * 0.5;
    this._rect.right = x + width * 0.5;
    this._rect.up = y + height * 0.5;
    this._rect.down = y - height * 0.5;
    this._texture = textureId;
    this._vertexBuffer = null;
    this._uvBuffer = null;
    this._indexBuffer = null;
    this._positionLocation = null;
    this._uvLocation = null;
    this._textureLocation = null;
    this._positionArray = null;
    this._uvArray = null;
    this._indexArray = null;
    this._firstDraw = true;
  }

  /**
   * 绘制。
   * @param programId着色器程序
   * @param canvas要绘制的信息
   */
  public render(programId: WebGLProgram): void {
    if (this._texture == null) {
      // 加载未完成
      return;
    }

    const gl = this._subdelegate.getGlManager().getGl();

    // 首次绘制时
    if (this._firstDraw) {
      // 获取的attribute变量
      this._positionLocation = gl.getAttribLocation(programId, "position");
      gl.enableVertexAttribArray(this._positionLocation);

      this._uvLocation = gl.getAttribLocation(programId, "uv");
      gl.enableVertexAttribArray(this._uvLocation);

      // 获取的uniform变量
      this._textureLocation = gl.getUniformLocation(programId, "texture");

      // uniform属性の登録
      gl.uniform1i(this._textureLocation, 0);

      //注册uniform属性
      {
        this._uvArray = new Float32Array([
          1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
        ]);

        // 创建uv缓冲区
        this._uvBuffer = gl.createBuffer();
      }

      // 顶点缓冲区，坐标初始化
      {
        const maxWidth = this._subdelegate.getCanvas().width;
        const maxHeight = this._subdelegate.getCanvas().height;

        // 顶点数据
        this._positionArray = new Float32Array([
          (this._rect.right - maxWidth * 0.5) / (maxWidth * 0.5),
          (this._rect.up - maxHeight * 0.5) / (maxHeight * 0.5),
          (this._rect.left - maxWidth * 0.5) / (maxWidth * 0.5),
          (this._rect.up - maxHeight * 0.5) / (maxHeight * 0.5),
          (this._rect.left - maxWidth * 0.5) / (maxWidth * 0.5),
          (this._rect.down - maxHeight * 0.5) / (maxHeight * 0.5),
          (this._rect.right - maxWidth * 0.5) / (maxWidth * 0.5),
          (this._rect.down - maxHeight * 0.5) / (maxHeight * 0.5),
        ]);

        // 创建顶点缓冲区
        this._vertexBuffer = gl.createBuffer();
      }

      // 顶点索引缓冲区，初始化
      {
        // 索引数据
        this._indexArray = new Uint16Array([0, 1, 2, 3, 2, 0]);

        // 创建索引缓冲区
        this._indexBuffer = gl.createBuffer();
      }

      this._firstDraw = false;
    }

    // UV座標登録
    gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._uvArray, gl.STATIC_DRAW);

    // 注册属性
    gl.vertexAttribPointer(this._uvLocation, 2, gl.FLOAT, false, 0, 0);

    // 注册顶点坐标
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._positionArray, gl.STATIC_DRAW);

    // 注册属性
    gl.vertexAttribPointer(this._positionLocation, 2, gl.FLOAT, false, 0, 0);

    // 创建顶点索引
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indexArray, gl.DYNAMIC_DRAW);

    // 绘制模型
    gl.bindTexture(gl.TEXTURE_2D, this._texture);
    gl.drawElements(
      gl.TRIANGLES,
      this._indexArray.length,
      gl.UNSIGNED_SHORT,
      0
    );
  }

  /**
   * 释放
   */
  public release(): void {
    this._rect = null;

    const gl = this._subdelegate.getGlManager().getGl();

    gl.deleteTexture(this._texture);
    this._texture = null;

    gl.deleteBuffer(this._uvBuffer);
    this._uvBuffer = null;

    gl.deleteBuffer(this._vertexBuffer);
    this._vertexBuffer = null;

    gl.deleteBuffer(this._indexBuffer);
    this._indexBuffer = null;
  }

  public setSubdelegate(subdelegate: LAppSubdelegate): void {
    this._subdelegate = subdelegate;
  }
}
