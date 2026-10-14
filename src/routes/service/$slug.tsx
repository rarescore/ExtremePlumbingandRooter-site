import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/service/$slug")({
  component: LegacyService,
});

function LegacyService() {
  const { slug } = Route.useParams();
  return <Navigate to="/services/$slug" params={{ slug }} replace />;
}
