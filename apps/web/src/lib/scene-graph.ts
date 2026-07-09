import * as THREE from 'three';
import type { AssetPart, ShapeType, Vec3 } from '@shape-craft/schema';
import { MESH_SHAPES } from '@shape-craft/schema';

export type RefResolver = (refId: string) => AssetPart | null;

export function geometryFor(shape: ShapeType, size: Vec3): THREE.BufferGeometry | null {
  // A `node` is a pure transform container and an `instance` is a reference to
  // another asset's subtree — neither carries geometry of its own, so the
  // scene graph skips building a mesh for them.
  if (shape === 'node' || shape === 'instance') return null;
  switch (shape) {
    case 'box':
      return new THREE.BoxGeometry(size.x, size.y, size.z);
    case 'sphere':
      return new THREE.SphereGeometry(size.x, 32, 16);
    case 'cylinder':
      return new THREE.CylinderGeometry(size.x, size.x, size.y, 24);
    case 'cone':
      return new THREE.ConeGeometry(size.x, size.y, 24);
    case 'plane':
      return new THREE.PlaneGeometry(size.x, size.y);
    case 'triangle': {
      const w = size.x;
      const h = size.y;
      const g = new THREE.BufferGeometry();
      // Two triangles facing opposite directions so the face is visible from
      // both sides (front +z, back -z).
      const verts = new Float32Array([
        -w / 2, 0, 0, w / 2, 0, 0, 0, h, 0,
        w / 2, 0, 0, -w / 2, 0, 0, 0, h, 0,
      ]);
      g.setAttribute('position', new THREE.BufferAttribute(verts, 3));
      g.computeVertexNormals();
      return g;
    }
  }
}

/**
 * Build the Three.js object graph for a part and its descendants.
 *
 * The part's own transform (position / rotation / scale) is applied to the
 * container `Group` (the `holder`), NOT to the mesh, so that child parts added
 * to the holder INHERIT the parent transform. This is the usual scene-graph
 * integration relationship: moving, rotating, or scaling a parent moves /
 * rotates / scales its whole subtree.
 *
 * `resolve` looks up the referenced asset root for `instance` parts. An
 * `instance` renders its referenced subtree as a single locked unit: every
 * descendant holder is tagged with the instance's own id (so picking any
 * internal mesh selects the whole instance) and marked `locked`, so the
 * internal parts behave exactly like an indivisible primitive.
 */
export function buildPartObject(
  part: AssetPart,
  resolve: RefResolver = () => null,
  instanceId?: string,
): THREE.Object3D {
  const holder = new THREE.Group();
  holder.userData.partId = instanceId ?? part.id;
  holder.userData.partName = part.name;
  holder.userData.locked = !!instanceId;
  // Apply the node transform to the container so children inherit it.
  holder.position.set(part.position.x, part.position.y, part.position.z);
  holder.rotation.set(part.rotation.x, part.rotation.y, part.rotation.z);
  holder.scale.set(part.scale.x, part.scale.y, part.scale.z);

  if (part.shape === 'instance' && part.refId) {
    const refRoot = resolve(part.refId);
    if (refRoot) {
      console.log('[build] instance', part.id, 'refId=', part.refId, 'resolved -> refRoot shape=', refRoot.shape, 'children=', refRoot.children.length);
      // Lock the whole referenced subtree to the instance id.
      holder.add(buildPartObject(refRoot, resolve, part.id));
    } else {
      console.log('[build] instance', part.id, 'refId=', part.refId, 'UNRESOLVED -> placeholder');
      // Referenced asset missing (deleted / offline): show a wireframe marker.
      const placeholder = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.4, 0.4),
        new THREE.MeshStandardMaterial({ color: '#ff5555', wireframe: true }),
      );
      placeholder.userData.partId = part.id;
      holder.add(placeholder);
    }
    return holder;
  }

  const geo = geometryFor(part.shape, part.size);
  if (geo) {
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(part.material.color),
      roughness: part.material.roughness,
      metalness: part.material.metalness,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    // Tag both the mesh and its container with the part id so selection (by id)
    // and picking work whether the ray hits the mesh or the group.
    mesh.name = part.name;
    mesh.userData.partId = holder.userData.partId;
    holder.add(mesh);
  }

  for (const child of part.children) {
    holder.add(buildPartObject(child, resolve, instanceId));
  }
  return holder;
}

/** Whether a shape produces a visible mesh (used by UI to skip empty parts). */
export function isMeshShape(shape: ShapeType): boolean {
  return MESH_SHAPES.includes(shape);
}
