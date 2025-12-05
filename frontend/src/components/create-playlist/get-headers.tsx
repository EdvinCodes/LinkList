import { Card, CardContent } from "@/components/ui/card";
import HeaderImg from "@/assets/headers.png";

type StepProps = {
  title: string;
  description: string | JSX.Element;
};

export default function GetHeaders() {
  const steps: StepProps[] = [
    {
      title: "Open Developer Tools and go to the Network tab",
      description:
        "Open the developer tools in your browser and go to the network tab. You can do this by right-clicking anywhere on the page and selecting 'Inspect' or by pressing 'Ctrl + Shift + I'.",
    },
    {
      title: "Sign into YouTube Music",
      description: (
        <>
          Go to{" "}
          <a
            href="https://music.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
          >
            music.youtube.com
          </a>{" "}
          and make sure you are signed in with your Google account.
        </>
      ),
    },
    {
      title: "Find an authenticated POST request",
      description: (
        <>
          <p>
            Filter by <code>/browse</code> in the search bar of the Network tab.
            Find a POST request with a status of 200.
          </p>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground/90">
            <div>
              <p className="font-semibold text-foreground">
                Firefox (recommended):
              </p>
              <ul className="list-disc list-inside ml-2">
                <li>Verify Method is POST and Domain is music.youtube.com</li>
                <li>Right click request &gt; Copy &gt; Copy Request Headers</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground">Chrome / Edge:</p>
              <ul className="list-disc list-inside ml-2">
                <li>
                  Click the request name &gt; Headers tab &gt; Request Headers
                </li>
                <li>Copy everything starting from "accept: */*" to the end</li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Paste the headers below",
      description:
        "We will be using these headers to authenticate the requests to create the playlist on your account.",
    },
  ];

  return (
    <div className="flex justify-center items-center w-full">
      <Card className="overflow-hidden w-full max-w-5xl bg-card border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
        <div className="flex flex-col lg:flex-row">
          <CardContent className="flex-1 p-6 lg:p-10">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-primary">
                  How to get auth headers
                </h2>
              </div>
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <Step
                    key={index}
                    index={index}
                    title={step.title}
                    description={step.description}
                  />
                ))}
              </div>
            </div>
          </CardContent>

          {/* Panel de imagen derecho */}
          <div className="flex-1 bg-background/50 min-h-[300px] lg:min-h-0 hidden lg:block border-l border-cyan-500/30 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent z-10 lg:hidden" />
            <img
              src={HeaderImg}
              alt="Network tab developer tools example"
              className="h-full w-full object-cover object-left-top opacity-80"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

function Step({ title, description, index }: StepProps & { index: number }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 mt-1">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary/50 text-lg font-bold border border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
          {index + 1}
        </span>
      </div>
      <div>
        <h3 className="font-semibold text-lg text-foreground">{title}</h3>
        <div className="text-sm text-muted-foreground mt-1 leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
}
