import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel({ serviceName: "coworkers-next-app" });
}
