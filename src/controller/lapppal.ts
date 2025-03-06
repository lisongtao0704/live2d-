export class LAppPal {
  static lastUpdate = Date.now();
  static currentFrame = 0.0;
  static lastFrame = 0.0;
  static deltaTime = 0.0;
  /**
   *将文件作为字节数据读取
   *
   * @param filePath 导入对象文件的路径
   * @return
   * {
   *   buffer,   导入的字节数据
   *   size      文件大小
   * }
   */
  public static loadFileAsBytes(
    filePath: string,
    callback: (arrayBuffer: ArrayBuffer, size: number) => void
  ): void {
    fetch(filePath)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => callback(arrayBuffer, arrayBuffer.byteLength));
  }

  /**
   * 获取增量时间（与上一帧的差值）
   * @return 增量时间[ms]
   */
  public static getDeltaTime(): number {
    return this.deltaTime;
  }

  public static updateTime(): void {
    this.currentFrame = Date.now();
    this.deltaTime = (this.currentFrame - this.lastFrame) / 1000;
    this.lastFrame = this.currentFrame;
  }

  /**
   * 输出消息
   * @param 消息字符串
   */
  public static printMessage(message: string): void {
    console.log(message);
  }
}
