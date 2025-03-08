import { LAppDelegate } from "./lappdelegate.ts";
import { setDefineOption, IOpt } from "./lappdefine.ts";

const initOptions: IOpt = {
  CanvasId: "live2d",
};

setDefineOption(initOptions);

window.addEventListener(
  "load",
  (): void => {
    const instance = LAppDelegate.getInstance();
    if (!instance.initialize()) {
      return;
    }
    console.log("绘制", instance);
    instance.run();
    const myEvent = new CustomEvent("ok", {
      detail: instance,
    });
    window.dispatchEvent(myEvent);
  },
  { passive: true }
);

/**
 * 结束时的处理
 */
window.addEventListener(
  "beforeunload",
  (): void => LAppDelegate.releaseInstance(),
  { passive: true }
);
