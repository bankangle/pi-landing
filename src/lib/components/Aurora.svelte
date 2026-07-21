<script>
	// Hand-written WebGL aurora: silky noise-driven light bands in brand blues,
	// flowing slowly and bending toward the pointer. Raw WebGL1, no libraries.
	// Degrades gracefully: no WebGL / reduced-motion -> component stays empty
	// and the existing blob background carries the hero alone.
	import { onMount } from 'svelte';

	let canvas = $state();

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const gl = canvas.getContext('webgl', { antialias: false, alpha: true });
		if (!gl) return;

		const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

		const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uT;
uniform vec2 uM; // pointer, -1..1

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
	vec2 i = floor(p), f = fract(p);
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
	           mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
	float v = 0.0, a = 0.5;
	for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 17.7; a *= 0.5; }
	return v;
}

void main() {
	vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y; // centered, aspect-safe
	float t = uT * 0.045;

	// pointer pulls the field gently
	vec2 m = uM * 0.35;

	// two layered silk bands
	float n1 = fbm(vec2(uv.x * 1.4 + t, uv.y * 2.6 - t * 0.7) + m);
	float n2 = fbm(vec2(uv.x * 2.2 - t * 0.8, uv.y * 3.4 + t * 0.5) - m * 0.6 + 40.0);

	float band1 = smoothstep(0.34, 0.0, abs(uv.y + 0.34 + (n1 - 0.5) * 0.55));
	float band2 = smoothstep(0.26, 0.0, abs(uv.y - 0.38 + (n2 - 0.5) * 0.45));

	vec3 cDeep  = vec3(0.05, 0.10, 0.35);
	vec3 cBlue  = vec3(0.11, 0.31, 0.85);
	vec3 cSky   = vec3(0.25, 0.55, 0.95);

	vec3 col = vec3(0.0);
	col += band1 * mix(cDeep, cBlue, n1) * 0.72;
	col += band2 * mix(cBlue, cSky, n2) * 0.38;

	// soft vignette so edges melt into the page background
	float vig = smoothstep(1.2, 0.3, length(uv));
	col *= vig;

	float alpha = clamp(max(band1, band2) * vig, 0.0, 1.0) * 0.62;
	gl_FragColor = vec4(col, alpha);
}`;

		const sh = (type, src) => {
			const s = gl.createShader(type);
			gl.shaderSource(s, src);
			gl.compileShader(s);
			if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
				console.error('[aurora]', gl.getShaderInfoLog(s));
				return null;
			}
			return s;
		};
		const vs = sh(gl.VERTEX_SHADER, VERT);
		const fs = sh(gl.FRAGMENT_SHADER, FRAG);
		if (!vs || !fs) return;
		const prog = gl.createProgram();
		gl.attachShader(prog, vs);
		gl.attachShader(prog, fs);
		gl.linkProgram(prog);
		gl.useProgram(prog);

		// fullscreen triangle
		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
		const loc = gl.getAttribLocation(prog, 'p');
		gl.enableVertexAttribArray(loc);
		gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

		const uRes = gl.getUniformLocation(prog, 'uRes');
		const uT = gl.getUniformLocation(prog, 'uT');
		const uM = gl.getUniformLocation(prog, 'uM');

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		// render at reduced density — it's a blurry glow, half-res is free speed
		const DPR = Math.min(1.25, window.devicePixelRatio || 1) * 0.66;
		const resize = () => {
			canvas.width = Math.max(2, Math.floor(canvas.clientWidth * DPR));
			canvas.height = Math.max(2, Math.floor(canvas.clientHeight * DPR));
			gl.viewport(0, 0, canvas.width, canvas.height);
		};
		resize();
		window.addEventListener('resize', resize);

		// pointer with inertia (same lazy feel as the rest of the site)
		let mx = 0, my = 0, tx = 0, ty = 0;
		const onMove = (e) => {
			tx = (e.clientX / window.innerWidth) * 2 - 1;
			ty = -((e.clientY / window.innerHeight) * 2 - 1);
		};
		window.addEventListener('pointermove', onMove, { passive: true });

		// only render while the hero is on screen
		let visible = true;
		const io = new IntersectionObserver((es) => (visible = es[0].isIntersecting), { threshold: 0 });
		io.observe(canvas);

		let raf = 0;
		const t0 = performance.now();
		const loop = (now) => {
			raf = requestAnimationFrame(loop);
			if (!visible) return;
			mx += (tx - mx) * 0.04;
			my += (ty - my) * 0.04;
			gl.uniform2f(uRes, canvas.width, canvas.height);
			gl.uniform1f(uT, (now - t0) / 1000);
			gl.uniform2f(uM, mx, my);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		};
		raf = requestAnimationFrame(loop);

		return () => {
			cancelAnimationFrame(raf);
			io.disconnect();
			window.removeEventListener('resize', resize);
			window.removeEventListener('pointermove', onMove);
			gl.getExtension('WEBGL_lose_context')?.loseContext();
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="pointer-events-none absolute inset-0 h-full w-full"
	aria-hidden="true"
></canvas>
