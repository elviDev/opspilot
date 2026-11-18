import { z } from "zod";

export const alertProviderSchema = z.enum(["slack", "discord"]);

export const alertRouteSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  provider: alertProviderSchema,
  is_active: z.boolean(),
});

export const createAlertRouteSchema = z
  .object({
    name: z.string().trim().min(1, "Enter a destination name").max(80),
    provider: alertProviderSchema,
    webhook_url: z.url("Enter a valid webhook URL"),
  })
  .superRefine(({ provider, webhook_url }, context) => {
    if (!z.url().safeParse(webhook_url).success) return;
    const url = new URL(webhook_url);
    const valid =
      url.protocol === "https:" &&
      (provider === "slack"
        ? url.hostname === "hooks.slack.com" && url.pathname.startsWith("/services/")
        : ["discord.com", "discordapp.com"].includes(url.hostname) &&
          url.pathname.startsWith("/api/webhooks/"));
    if (!valid) {
      context.addIssue({
        code: "custom",
        path: ["webhook_url"],
        message: "Enter a valid HTTPS webhook URL for the selected provider",
      });
    }
  });

export const alertRouteIdSchema = z.number().int().positive();

export type AlertRoute = z.infer<typeof alertRouteSchema>;
export type CreateAlertRouteInput = z.input<typeof createAlertRouteSchema>;
