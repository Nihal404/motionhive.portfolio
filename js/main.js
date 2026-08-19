// ======================================
// MotionHive Main Controller
// Full Page Load System
// ======================================

(() => {
    "use strict";

    const waitForAsset = (asset) => {
        return new Promise((resolve) => {
            const finish = () => {
                asset.removeEventListener("load", finish);
                asset.removeEventListener("loadeddata", finish);
                asset.removeEventListener("canplay", finish);
                asset.removeEventListener("error", finish);
                resolve();
            };

            if (asset.tagName === "IMG") {
                if (asset.complete && asset.naturalWidth > 0) {
                    resolve();
                    return;
                }
            } else if (asset.tagName === "VIDEO") {
                if (asset.readyState >= 2 || asset.networkState === 3) {
                    resolve();
                    return;
                }
            }

            asset.addEventListener("load", finish, { once: true });
            asset.addEventListener("loadeddata", finish, { once: true });
            asset.addEventListener("canplay", finish, { once: true });
            asset.addEventListener("error", finish, { once: true });
        });
    };

    const waitForAssets = async () => {
        const images = [...document.images];
        const fontReady = typeof document.fonts !== "undefined" ? document.fonts.ready : Promise.resolve();

        await Promise.all([
            ...images.map(waitForAsset),
            fontReady,
        ]);
    };

    document.addEventListener("DOMContentLoaded", async () => {
        console.log("?? MotionHive Booting...");

        document.documentElement.style.scrollBehavior = "smooth";

        try {
            await waitForAssets();
        } catch (error) {
            console.warn("Some assets did not finish loading cleanly:", error);
        }

        window.dispatchEvent(new Event("motionhive-ready"));
        console.log("?? MotionHive Fully Ready");
    });
})();
