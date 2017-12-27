import config from "~/config";

(function(doc, win) {
	let docEl = doc.documentElement,
		resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
		recalc = function() {
			let clientWidth = docEl.clientWidth;
			if (!clientWidth) return;
			// 默认设计图为640的情况下1rem=100px；根据自己需求修改
			if (clientWidth >= 640) {
				docEl.style.fontSize = `${config.rootBaseOnFontSize}px`;
			} else {
				docEl.style.fontSize = config.rootBaseOnFontSize * (clientWidth / 640) + "px";
			}
		};

	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener("DOMContentLoaded", recalc, false);
})(document, window);
