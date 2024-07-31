import { createLazyFileRoute } from "@tanstack/react-router";
import Index from "../components/Index";

export const Route = createLazyFileRoute("/")({
  component: Index,
});


