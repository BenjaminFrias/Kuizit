export default function BlurryShape() {
	return (
		<div
			className="w-full h-full rounded-full bg-gradient-to-br blur-sm opacity-80"
			data-testid="blurry-shape"
			style={{
				filter: 'blur(60px) contrast(1)',
				background: `
              radial-gradient(circle at 30% 30%, rgba(57,114,54, 1), transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(66,102,65, 1), transparent 50%),
              linear-gradient(135deg, #289722, #3d9238),
              url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`,
			}}
		></div>
	);
}
