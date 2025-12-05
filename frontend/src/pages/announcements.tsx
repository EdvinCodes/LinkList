interface Announcement {
  id: string;
  date: string;
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "error";
}

const announcements: Announcement[] = [
  {
    id: "1",
    date: "December 05, 2025",
    title: "LinkList Launch",
    content: `LinkList is now live! 🎉`,
    type: "success",
  },
  //   {
  //     id: "2",
  //     date: "December 28, 2024",
  //     title: "Server Improvements and Bug Fixes",
  //     content: `Several improvements to server stability:

  // • Extended timeout to 10 minutes (from previous shorter timeouts)
  // • Better error handling for empty search results
  // • Improved logging for debugging

  // Despite these improvements, self-hosting remains the best option for large playlists and guaranteed reliability.`,
  //     type: "info",
  //   },
  //   {
  //     id: "3",
  //     date: "January 4, 2025",
  //     title: "Timeout Extended to 15 Minutes",
  //     content: `The server timeout has been extended from 10 minutes to 15 minutes to accommodate larger playlists. However, timeout issues may still occur for very large playlists.

  //         • Improved error handling for clone errors, server errors and connection errors.
  //         • Extended timeout to 15 minutes (from previous shorter timeouts)

  // For the most reliable experience, especially with playlists over 100 songs, I recommend self-hosting LinkList.`,
  //     type: "warning",
  //   },
  //   {
  //     id: "4",
  //     date: "January 12, 2025",
  //     title: "New Feature: Missed Tracks Report",
  //     content: `Added a new feature that shows you which tracks couldn't be found on YouTube Music during the transfer process. This helps you identify:

  // • Songs that might have different names
  // • Tracks not available on YouTube Music
  // • Regional availability issues

  // You'll now get a detailed report after each playlist transfer.`,
  //     type: "success",
  //   },
  //   {
  //     id: "5",
  //     date: "January 13, 2025",
  //     title: "Self-Hosting Made Easier",
  //     content: `There have been significant improvements to make self-hosting LinkList much easier:

  // • Simplified installation process
  // • Better documentation
  // • Automated setup scripts
  // • Reduced configuration complexity

  // If you're experiencing timeout issues with the hosted version, self-hosting is now more accessible than ever!`,
  //     type: "success",
  //   },
  //   {
  //     id: "6",
  //     date: "July 9, 2025",
  //     title: "Improved Self-Hosting Guide",
  //     content: `We've significantly improved the self-hosting guide based on user feedback. The new guide includes:

  // • Step-by-step installation instructions
  // • Environment variable configuration
  // • Common troubleshooting solutions

  // Self-hosting remains the best way to avoid timeout issues and get reliable playlist transfers.`,
  //     type: "success",
  //   },
  //   {
  //     id: "7",
  //     date: "July 10, 2025",
  //     title: "Self-Hosting Guide Updated",
  //     content: `Updated README.md with enhanced self-hosting instructions to help users set up LinkList locally for better reliability and no timeout issues.

  // Recent improvements include:
  // • Clearer setup steps
  // • Better environment configuration
  // • Troubleshooting guide

  // Self-hosting provides unlimited transfers without server timeout restrictions.`,
  //     type: "info",
  //   },
];

function getTypeIcon(type: Announcement["type"]) {
  switch (type) {
    case "warning":
      return "⚠️";
    case "error":
      return "❌";
    case "success":
      return "✅";
    default:
      return "ℹ️";
  }
}

export default function Announcements() {
  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 flex flex-col items-center">
      <div className="text-center mb-16">
        {/* 🛠️ Título con efecto Neón */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-4 
                         bg-clip-text text-transparent 
                         bg-gradient-to-r from-cyan-300 to-lime-400 
                         drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]"
        >
          Announcements
        </h1>
        <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto">
          Latest updates and important information about LinkList
        </p>
      </div>

      <div className="w-full space-y-8">
        {announcements
          .slice()
          .reverse()
          .map((announcement, index) => (
            <div key={announcement.id} className="group">
              <section
                id={`announcement-${announcement.id}`}
                className="py-6 px-6 bg-card/50 border border-white/5 rounded-2xl hover:border-cyan-500/30 transition-colors duration-300"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl mt-1 flex-shrink-0 filter drop-shadow-md">
                    {getTypeIcon(announcement.type)}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <h2 className="text-xl font-bold text-foreground group-hover:text-cyan-400 transition-colors">
                        {announcement.title}
                      </h2>
                      <span className="text-xs font-mono text-cyan-500/80 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20 whitespace-nowrap">
                        {announcement.date}
                      </span>
                    </div>

                    <div className="text-base text-muted-foreground whitespace-pre-line leading-relaxed">
                      {announcement.content}
                    </div>

                    {announcement.id === "7" && (
                      <div className="mt-6">
                        <a
                          href="https://github.com/edvincodes/LinkList"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-lime-400 hover:text-black text-foreground text-sm font-medium rounded-lg transition-all duration-300 shadow-sm"
                        >
                          <span>📚</span>
                          View Self-Hosting Guide
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Separador sutil solo si no es el último elemento */}
              {index < announcements.length - 1 && (
                <div className="my-8 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
              )}
            </div>
          ))}
      </div>
    </main>
  );
}
