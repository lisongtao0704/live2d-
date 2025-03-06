import { LAppDelegate } from "./lappdelegate.ts";

window.addEventListener(
  "load",
  (): void => {
  const instance = LAppDelegate.getInstance()
    if (!instance.initialize()) {
      return;
    }
    console.log("绘制", instance);
    instance.run();
    // window.LAppDelegate = LAppDelegate.getInstance();
    // window.LAppDelegate.run();
    // window.dispatchEvent(myEvent);
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
