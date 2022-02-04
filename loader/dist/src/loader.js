import { FileLoader, Loader } from 'three';
import { parse } from "./parser";
class BIMLoader extends Loader {
    constructor(manager) {
        super(manager);
    }
    load(url, onLoad, onProgress, onError) {
        const loader = new FileLoader(this.manager);
        this.onProgress = onProgress;
        loader.setPath(this.path);
        loader.setResponseType('json');
        loader.setRequestHeader(this.requestHeader);
        loader.setWithCredentials(this.withCredentials);
        loader.load(url, async function (buffer) {
            try {
                console.log(buffer);
                parse(buffer, (root) => onLoad(root, buffer));
            }
            catch (e) {
                if (onError) {
                    onError(e);
                }
                else {
                    console.error(e);
                }
                this.manager.itemError(url);
            }
        }, onProgress, onError);
    }
}
export { BIMLoader };
//# sourceMappingURL=loader.js.map