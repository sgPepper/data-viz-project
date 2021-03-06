
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else { // `DOMContentLoaded` already fired
		action();
	}
}

function logger(prefix="") {
    return function() {
        let args = Array.prototype.slice.call(arguments);
        args.unshift(prefix);
        console.log.apply(console, args);
    }
}
const log = logger("");
const info = logger("[INFO]");
const warn = logger("[WARN]");
const err = logger("[ERR]");

export {
    whenDocumentLoaded,
    log, info, warn, err
}
