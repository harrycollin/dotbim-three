import * as THREE from "three";
export function parse(data, onLoad) {
    const parsed = JSON.parse(data);
    const root = new THREE.Group();
    for (let i = 0; i < parsed.elements.length; i++) {
        try {
            const group = loadElement(parsed, parsed.elements[i]);
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
    var _a, _b, _c;
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
        material.color = new THREE.Color((_a = element === null || element === void 0 ? void 0 : element.color) === null || _a === void 0 ? void 0 : _a.r, (_b = element === null || element === void 0 ? void 0 : element.color) === null || _b === void 0 ? void 0 : _b.g, (_c = element === null || element === void 0 ? void 0 : element.color) === null || _c === void 0 ? void 0 : _c.b);
        if (element.color.a !== 1) {
            material.transparent = true;
            material.opacity = (element.color.a / 255) || 1;
        }
    }
    const newMesh = new THREE.Mesh(geometry, material);
    newMesh.position.set(element.vector.x, element.vector.y, element.vector.z);
    newMesh.quaternion.set(element.rotation.qx, element.rotation.qy, element.rotation.qz, element.rotation.qw);
    newMesh.userData.Guid = element.guid;
    return newMesh;
}
//# sourceMappingURL=parser.js.map