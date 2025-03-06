import { LAppDelegate } from "./lappdelegate.ts";

window.addEventListener(
  "load",
  (): void => {
    if (!LAppDelegate.getInstance().initialize()) {
      return;
    }
    console.log('绘制');
    LAppDelegate.getInstance().run();
    // window.LAppDelegate = LAppDelegate.getInstance();
    // window.LAppDelegate.run();
    // window.dispatchEvent(myEvent);
  },
  { passive: true }
);

// /**
//  * 終了時の処理
//  */
// window.addEventListener(
//   'beforeunload',
//   (): void => LAppDelegate.releaseInstance(),
//   { passive: true }
// );
