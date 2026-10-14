import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/team/")({
  component: () => <Navigate to="/our-workers" replace />,
});
