import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  color?: string;
  opacity?: number;
  borderColor?: string;
  borderWidth?: number;
};

export default function WebGLMask({
  color = "#000000",
  opacity = 0.85,
  borderColor = "#000000",
  borderWidth = 0.03,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const uniforms = {
      u_color: { value: new THREE.Color(color) },
      u_opacity: { value: opacity },
      u_borderColor: { value: new THREE.Color(borderColor) },
      u_borderWidth: { value: borderWidth },
      u_hover: { value: 0.0 },
      u_time: { value: 0.0 },
    };

    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 u_color;
        uniform float u_opacity;
        uniform float u_borderWidth;
        uniform vec3 u_borderColor;
        uniform float u_hover;
        uniform float u_time;

        float shapeRoundedBox(vec2 uv, vec2 size, float radius) {
          uv = uv * 2.0 - 1.0; // center

          vec2 d = abs(uv) - size + radius;
          return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - radius;
        }

        void main() {
          float d = shapeRoundedBox(vUv, vec2(0.65, 0.90), 0.65);

          float wiggle = sin(u_time * 6.0 + vUv.y * 10.0) * 0.01 * u_hover;
          float borderRegion = smoothstep(u_borderWidth + wiggle, u_borderWidth - 0.01, abs(d));

          if (abs(d) < u_borderWidth) {
            gl_FragColor = vec4(u_borderColor, 1.0);
            return;
          }

          if (d < 0.0) {
            discard;
          }

          gl_FragColor = vec4(u_color, u_opacity);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      uniforms.u_time.value += 0.02;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onHover = () => uniforms.u_hover.value = 1.0;
    const onLeave = () => uniforms.u_hover.value = 0.0;

    mount.addEventListener("mouseenter", onHover);
    mount.addEventListener("mouseleave", onLeave);

    return () => {
      mount.removeEventListener("mouseenter", onHover);
      mount.removeEventListener("mouseleave", onLeave);
      mount.removeChild(renderer.domElement);
    };
  }, [color, opacity, borderColor, borderWidth]);

  return (
    <div
      ref={mountRef}
      className="pointer-events-auto fixed inset-0 z-50"
    />
  );
}
