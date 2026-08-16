import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ------------------------------------------------------------------------------
 * MANTRAPRACTICE SPATIAL PRODUCT OS VISUAL
 * NO GLOBES. NO EARTH. NO NEON CYBERPUNK.
 * A spatial 3D Practice OS environment consisting of 6 floating translucent
 * glass workflow windows (Calendar, Patient Record, Billing, Telehealth, AI, Analytics)
 * orbiting around a unified central MantraPractice core.
 *
 * Trajectory:
 * 0% - 20%: Disconnected floating windows separated in space
 * 20% - 40%: Smooth convergence into ONE unified MantraPractice workspace
 * 40% - 75%: Focused highlighting of the 6 core tools in sequence
 * 75% - 90%: MantraAI automation layer activation with flowing energy paths
 * 90% - 100%: Complete, serene, unified practice state
 * ------------------------------------------------------------------------------
 */
export default function MantraEhrVisual({ scrollProgress = 0, isMobile = false }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer, camera, scene, coreGroup, windowMeshes, connectionsGroup;
    let animationFrameId;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Perspective Camera & Scene Setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // 2. Spatial Ambient & Directional Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const mainLight = new THREE.DirectionalLight(0x006ff5, 2.2);
    mainLight.position.set(5, 7, 7);
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x7c6cff, 1.4);
    rimLight.position.set(-5, -5, -4);
    scene.add(rimLight);

    // 3. Central MantraPractice Core
    coreGroup = new THREE.Group();

    const coreGeo = new THREE.IcosahedronGeometry(isMobile ? 1.1 : 1.6, 4);

    const coreMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#006FF5'),
      transmission: 0.9,
      opacity: 0.88,
      transparent: true,
      roughness: 0.12,
      metalness: 0.05,
      ior: 1.33,
      thickness: 1.0,
      clearcoat: 1.0,
      emissive: new THREE.Color('#0B2F6B'),
      emissiveIntensity: 0.3
    });

    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);
    scene.add(coreGroup);

    // 4. Floating 6 Product Glass Windows (Scheduling, EHR, Telehealth, Billing, AI, Analytics)
    const windowData = [
      { name: 'Scheduling', basePos: new THREE.Vector3(-3.2, 1.8, 0.4), color: '#006FF5' },
      { name: 'EHR Records', basePos: new THREE.Vector3(3.2, 1.8, -0.4), color: '#059669' },
      { name: 'Telehealth', basePos: new THREE.Vector3(-3.4, -0.8, 0.6), color: '#7C6CFF' },
      { name: 'Billing', basePos: new THREE.Vector3(3.4, -0.8, -0.6), color: '#D97706' },
      { name: 'MantraAI', basePos: new THREE.Vector3(0, 2.8, 0.8), color: '#62D8FF' },
      { name: 'Analytics', basePos: new THREE.Vector3(0, -2.8, -0.8), color: '#0284C7' }
    ];

    windowMeshes = windowData.map((item) => {
      const planeGeo = new THREE.PlaneGeometry(isMobile ? 1.2 : 1.8, isMobile ? 0.8 : 1.2);
      const planeMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(item.color),
        transmission: 0.85,
        opacity: 0.6,
        transparent: true,
        roughness: 0.2,
        metalness: 0.1,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(planeGeo, planeMat);
      mesh.position.copy(item.basePos);
      scene.add(mesh);
      return { mesh, mat: planeMat, basePos: item.basePos, name: item.name };
    });

    // 5. Connecting Lines / Flowing Paths
    connectionsGroup = new THREE.Group();
    const connectionLines = windowData.map((item) => {
      const curve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), item.basePos);
      const tubeGeo = new THREE.TubeGeometry(curve, 16, isMobile ? 0.012 : 0.018, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(item.color),
        transparent: true,
        opacity: 0.2
      });
      const mesh = new THREE.Mesh(tubeGeo, tubeMat);
      connectionsGroup.add(mesh);
      return { mesh, mat: tubeMat };
    });
    scene.add(connectionsGroup);

    // Save refs for dynamic animation
    sceneRef.current = {
      coreGroup,
      coreMesh,
      windowMeshes,
      connectionLines,
      camera
    };

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Render Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Ambient floating rotation
      coreGroup.rotation.y = elapsed * 0.12;
      coreGroup.rotation.x = Math.sin(elapsed * 0.08) * 0.06;

      windowMeshes.forEach((wItem, idx) => {
        wItem.mesh.position.y = wItem.basePos.y + Math.sin(elapsed * 1.4 + idx) * 0.06;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isMobile]);

  // Dynamic Scroll Transformation Interpolation
  useEffect(() => {
    if (!sceneRef.current) return;
    const { coreGroup, coreMesh, windowMeshes, connectionLines, camera } = sceneRef.current;
    const p = scrollProgress;

    // 1. Camera Elevation & Zoom
    camera.position.z = 9.0 - p * 1.8;
    camera.position.y = (0.5 - p) * 1.6;

    // 2. Convergence from Disconnected (0–20%) into Unified MantraPractice Platform (20%+ )
    const convergenceFactor = Math.min(1.0, Math.max(0, (p - 0.15) * 2.5));
    const targetDistance = 0.55 + (1.0 - convergenceFactor) * 0.45;

    windowMeshes.forEach((item) => {
      item.mesh.position.x = item.basePos.x * targetDistance;
      item.mesh.position.z = item.basePos.z * targetDistance;
      item.mat.opacity = 0.45 + convergenceFactor * 0.45;
    });

    // 3. Core Luminous Expansion
    const coreScale = 1.0 + Math.sin(p * Math.PI) * 0.25;
    coreGroup.scale.setScalar(coreScale);
    if (coreMesh.material) {
      coreMesh.material.emissiveIntensity = 0.3 + p * 0.6;
    }

    // 4. Connection Energy Tube Highlights
    connectionLines.forEach((conn) => {
      conn.mat.opacity = 0.2 + p * 0.55;
    });
  }, [scrollProgress]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
}
