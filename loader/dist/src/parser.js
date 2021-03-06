import * as THREE from "three";
export function parse(data, onLoad) {
    const root = new THREE.Group();
    for (let i = 0; i < data.elements.length; i++) {
        try {
            const group = loadElement(data, data.elements[i]);
            if (group) {
                root.add(group);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    onLoad(root);
}
function loadElement(data, element) {
    const meshData = data.meshes.find((x) => x.mesh_id === element.mesh_id);
    if (meshData) {
        return loadMesh(meshData, element);
    }
    else {
        console.error("Failed to find reference for MeshId: " + meshData.mesh_id);
        return null;
    }
}
function loadMesh(mesh, element) {
    var _a, _b;
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(mesh.coordinates);
    const indices = new Uint32Array(mesh.indices);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#f4f4f4")
    });
    material.side = THREE.DoubleSide;
    if (element.color) {
        material.color = new THREE.Color(`rgb(${element.color.r}, ${(_a = element === null || element === void 0 ? void 0 : element.color) === null || _a === void 0 ? void 0 : _a.g}, ${(_b = element === null || element === void 0 ? void 0 : element.color) === null || _b === void 0 ? void 0 : _b.b})`);
        if (element.color.a !== 1) {
            material.transparent = true;
            material.opacity = (element.color.a / 255) || 1;
        }
    }
    const newMesh = new THREE.Mesh(geometry, material);
    newMesh.quaternion.set(element.rotation.qx, element.rotation.qy, element.rotation.qz, element.rotation.qw);
    newMesh.position.set(element.vector.x, element.vector.y, element.vector.z);
    newMesh.userData.Guid = element.guid;
    return newMesh;
}
//# sourceMappingURL=parser.js.map