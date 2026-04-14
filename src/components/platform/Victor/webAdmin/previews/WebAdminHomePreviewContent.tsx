import HomeContent from "@/components/home/HomeContent";

const previewSteps = [
  { href: "/auth/register", title: "Paso dummy 1", icon: "register" as const },
  { href: "/auth/register", title: "Paso dummy 2", icon: "documents" as const },
  { href: "/offers", title: "Paso dummy 3", icon: "apply" as const },
];

export default function WebAdminHomePreviewContent() {
  return (
    <div className="mockup-browser w-full border border-base-300 bg-base-100 shadow-sm">
      <div className="mockup-browser-toolbar">
        <div className="input border border-base-300 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          Home dummy
        </div>
      </div>

      <div className="max-h-132 overflow-y-auto bg-white">
        <div className="pointer-events-none">
          <HomeContent
            className="flex min-h-screen w-full flex-col items-center justify-center"
            loginPromptText="Texto editable de acceso"
            loginLinkText="CTA dummy"
            forceShowSteps
            stepsItems={previewSteps}
            offersTrackingSource="web_admin_preview"
          />
        </div>
      </div>
    </div>
  );
}