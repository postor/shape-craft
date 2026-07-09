/**
 * Record-session schema for ShapeCraft "扮演录制" (role-play video).
 *
 * A RecordSession is a persisted take: it binds to a Scene, stores the
 * per-object recorded tracks (each a list of time-stamped captures from t=0)
 * and an optional special camera track. The editor at `#/record/:id` loads one
 * of these, lets the user act inside the scene (record objects / camera), and
 * saves the result back. Sessions appear in the `#/record` history list.
 */
import type { AnimKf } from './index.ts';

export interface RecordTrack {
  objectId: string;
  name: string;
  keyframes: AnimKf[];
}

export interface RecordSession {
  id: string;
  name: string;
  sceneId: string | null;
  tracks: RecordTrack[];
  /** Special camera track (enables video export). Null when not recorded. */
  cameraTrack: AnimKf[] | null;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

/** Payload accepted when creating/updating a record session. */
export type RecordInput = Omit<RecordSession, 'id' | 'createdAt' | 'updatedAt'>;

let idCounter = 0;
function recordUid(): string {
  idCounter += 1;
  return `rec_${Date.now().toString(36)}_${idCounter.toString(36)}`;
}

export function createEmptyRecordSession(name = '未命名录制'): RecordSession {
  const now = new Date().toISOString();
  return {
    id: recordUid(),
    name,
    sceneId: null,
    tracks: [],
    cameraTrack: null,
    createdAt: now,
    updatedAt: now,
  };
}
