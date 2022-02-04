export interface DotBim {
    schema_version: string,
    meshes: Mesh[],
    elements: Element[],
    info?: Info
}

export interface Mesh {
    mesh_id: number | string,
    coordinates: number[],
    indices: number[]
}

export interface Element {
    mesh_id: number | string,
    vector: Vector3,
    rotation: Quaternion,
    guid: string,
    type?: string,
    color?: Color,
    info?: Info
}

export interface Vector3 {
    x: number,
    y: number,
    z: number
}

export interface Quaternion {
    qx: number,
    qy: number,
    qz: number,
    qw: number
}

export interface Color {
    r: number,
    g: number,
    b: number,
    a: number
}

export type Info = {
    [key: string]: string
}