import { Card, CardContent } from "@/components/ui/card";

export default function HowToUse() {
  const steps = [
    {
      title: "Step 1",
      description: (
        <>
          Log into YouTube Music at{" "}
          <a
            href="https://music.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            // 🛠️ Color Neón Cian para el enlace
            className="text-cyan-400 hover:underline transition-colors"
          >
            music.youtube.com
          </a>
        </>
      ),
    },
    {
      title: "Step 2",
      description:
        "Grab the Request Headers from the Network tab (explained later)",
    },
    {
      title: "Step 3",
      description: "Paste the playlist link and you're done!",
    },
  ];

  return (
    <div className="flex justify-center items-center w-full">
      {/* 🛠️ Contenedor responsivo sin ancho fijo */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8 mb-16 w-full max-w-5xl px-4">
        {steps.map((step, index) => (
          // 🛠️ Tarjeta con estilo Neón
          <Card
            key={index}
            className="w-full max-w-sm h-52 bg-card border border-cyan-500/30 
                                   shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-shadow duration-300"
          >
            {/* El color del texto interior ya es dark:text-white gracias al index.css */}
            <CardContent className="flex flex-col mt-10 p-6 text-center h-full">
              <h2
                // 🛠️ Título en color Neón Cian
                className="text-2xl font-bold text-cyan-400"
              >
                {step.title}
              </h2>
              <p
                // 🛠️ Texto gris sutil, usamos text-muted-foreground para el tema oscuro
                className="mt-4 text-base text-muted-foreground"
              >
                {step.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
