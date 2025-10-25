import GradientGlow from '../GradientGlow';

export default function GradientGlowExample() {
  return (
    <div className="relative w-full h-96 bg-background overflow-hidden flex items-center justify-center">
      <GradientGlow color="blue" position="top" size="lg" />
      <GradientGlow color="green" position="center" size="md" />
      <GradientGlow color="orange" position="bottom" size="lg" />
      <div className="relative z-10">
        <h2 className="text-4xl font-bold">Gradient Glows</h2>
        <p className="text-muted-foreground mt-2">Decorative background elements</p>
      </div>
    </div>
  );
}
