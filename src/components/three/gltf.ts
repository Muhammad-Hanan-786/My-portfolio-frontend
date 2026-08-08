/**
 * Shared GLTF loader helpers for the 3D hero and future scenes.
 *
 * - `useOptimizedGLTF(url)` — drei's `useGLTF` wired to Draco + KTX2 + Meshopt
 *   so compressed .glb assets (Draco geometry, KTX2/Basis textures, Meshopt
 *   buffers) load without extra setup at each call site.
 * - `preloadGLTF(url)` — call at module scope or route boundary to warm the
 *   cache before the component renders.
 * - `clearGLTFCache(url?)` — free GPU memory for a specific model or all of
 *   them (useful on route unmount for very large scenes).
 *
 * drei's `useGLTF` already deduplicates and caches per URL, so multiple
 * components requesting the same asset share one parsed scene.
 */
import { useGLTF } from "@react-three/drei";
import { DRACOLoader, KTX2Loader } from "three-stdlib";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import type { WebGLRenderer } from "three";
import type { GLTFLoader } from "three-stdlib";

const DRACO_CDN = "https://www.gstatic.com/draco/versioned/decoders/1.5.7/";
const KTX2_CDN = "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/jsm/libs/basis/";

let dracoLoader: DRACOLoader | null = null;
let ktx2Loader: KTX2Loader | null = null;

function getDraco() {
  if (!dracoLoader) {
    dracoLoader = new DRACOLoader().setDecoderPath(DRACO_CDN);
  }
  return dracoLoader;
}

function getKtx2(gl: WebGLRenderer) {
  if (!ktx2Loader) {
    ktx2Loader = new KTX2Loader().setTranscoderPath(KTX2_CDN);
  }
  ktx2Loader.detectSupport(gl);
  return ktx2Loader;
}

function extendLoader(loader: GLTFLoader, gl?: WebGLRenderer) {
  loader.setDRACOLoader(getDraco());
  if (gl) loader.setKTX2Loader(getKtx2(gl));
  loader.setMeshoptDecoder(MeshoptDecoder as unknown as Parameters<GLTFLoader["setMeshoptDecoder"]>[0]);
}

/** Cached, Draco+KTX2+Meshopt-aware GLTF hook. */
export function useOptimizedGLTF(url: string) {
  return useGLTF(url, true, true, (loader) => extendLoader(loader as GLTFLoader));
}

/** Warm the cache before render. Safe to call multiple times. */
export function preloadGLTF(url: string) {
  useGLTF.preload(url);
}

/** Release GPU/CPU memory when a scene is truly done. */
export function clearGLTFCache(url?: string) {
  useGLTF.clear(url as string);
}
