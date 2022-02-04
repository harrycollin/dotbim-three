import {FileLoader, Group, Loader, LoadingManager} from 'three';
import {parse} from "./parser";
import {DotBim} from "./definitions";

class BIMLoader extends Loader {
    private onProgress?: (event: ProgressEvent) => void;

    constructor(manager?: LoadingManager) {
        super(manager);
    }

    load(
        url: any,
        onLoad: (root: Group, parsed: DotBim) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (event: ErrorEvent) => void
    ) {
        const loader = new FileLoader(this.manager);
        this.onProgress = onProgress;
        loader.setPath(this.path);
        loader.setResponseType('json');
        loader.setRequestHeader(this.requestHeader);
        loader.setWithCredentials(this.withCredentials);
        loader.load(
            url,
            async function (buffer: any) {
                try {
                    console.log(buffer)
                    parse(buffer, (root) => onLoad(root, buffer));
                } catch (e: any) {
                    if (onError) {
                        onError(e);
                    } else {
                        console.error(e);
                    }
                    this.manager.itemError(url);
                }
            },
            onProgress,
            onError
        );
    }
}

export { BIMLoader };