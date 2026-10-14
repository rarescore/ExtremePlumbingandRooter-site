import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/book")({
  component: () => <Navigate to="/contact" replace />,
});
