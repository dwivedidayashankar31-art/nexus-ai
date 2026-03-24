import { useState } from "react";
import { SidebarLayout } from "@/components/layout";
import { useAuth } from "@/hooks/use-auth";
import { useSettings } from "@/hooks/use-settings";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Moon, Bell, Shield, User, Info,
  ChevronRight, Check, Bot, Database, Zap,
  Phone, Mail, MessageSquare, Eye, EyeOff,
  Loader2, RotateCcw, X,
} from "lucide-react";
import type { Settings } from "@/hooks/use-settings";

type SectionId = "account" | "appearance" | "language" | "notifications" | "ai" | "about" | "contact";

const SECTIONS: { id: SectionId; label: string; icon: any; desc: string }[] = [
  { id: "account",       label: "Account",        icon: User,          desc: "Profile & security" },
  { id: "appearance",    label: "Appearance",     icon: Moon,          desc: "Theme & display" },
  { id: "language",      label: "Language",       icon: Globe,         desc: "Interface language" },
  { id: "notifications", label: "Notifications",  icon: Bell,          desc: "Alerts & updates" },
  { id: "ai",            label: "AI Preferences", icon: Bot,           desc: "Agent behaviour" },
  { id: "about",         label: "About",          icon: Info,          desc: "System information" },
  { id: "contact",       label: "Contact Us",     icon: MessageSquare, desc: "Get in touch" },
];

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.055)" }}>
      <div>
        <p className="font-medium" style={{ fontSize: 13, color: "var(--row-text, rgba(255,255,255,0.9))" }}>{label}</p>
        {desc && <p className="mt-0.5" style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)" }}>{desc}</p>}
      </div>
      <div className="shrink-0 ml-6">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange, testId }: { value: boolean; onChange: (v: boolean) => void; testId?: string }) {
  return (
    <button
      data-testid={testId}
      onClick={() => onChange(!value)}
      className="relative rounded-full transition-colors duration-200 focus:outline-none"
      style={{ background: value ? "#3B82F6" : "rgba(255,255,255,0.12)", width: 40, height: 22 }}
    >
      <span
        className="absolute top-0.5 left-0.5 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ width: 18, height: 18, transform: value ? "translateX(18px)" : "translateX(0)" }}
      />
    </button>
  );
}

function SelectPill({ options, value, onChange }: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-1.5 flex-wrap justify-end">
      {options.map((opt) => (
        <button
          key={opt.value}
          data-testid={`option-${opt.value}`}
          onClick={() => onChange(opt.value)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all"
          style={{
            fontSize: 12,
            background: value === opt.value ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.05)",
            border: value === opt.value ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(255,255,255,0.1)",
            color: value === opt.value ? "#60A5FA" : "rgba(255,255,255,0.45)",
          }}
        >
          {value === opt.value && <Check className="w-3 h-3" />}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function SectionLabel({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="pt-4 pb-1 mb-2">
      <p className="font-semibold text-white" style={{ fontSize: 14 }}>{title}</p>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{desc}</p>
    </div>
  );
}

function PasswordModal({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/change-password", { currentPassword: current, newPassword: next }),
    onSuccess: () => {
      toast({ title: "Password changed", description: "Your password has been updated successfully." });
      onClose();
    },
    onError: async (err: any) => {
      let msg = "Something went wrong";
      try {
        const colonIdx = err?.message?.indexOf(": ");
        if (colonIdx !== -1) {
          const parsed = JSON.parse(err.message.slice(colonIdx + 2));
          if (parsed?.message) msg = parsed.message;
        }
      } catch {}
      setError(msg);
    },
  });

  const passwordRules = [
    { met: next.length >= 6, text: "At least 6 characters" },
    { met: /[a-zA-Z]/.test(next), text: "At least one letter" },
    { met: /[0-9]/.test(next), text: "At least one number" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.1)" }}>

        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-bold text-white" style={{ fontSize: 15 }}>Change Password</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Enter your current and new password</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <X className="w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block mb-1.5 font-medium" style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
              Current password
            </label>
            <div className="relative">
              <input
                data-testid="input-current-password"
                type={showCurrent ? "text" : "password"}
                value={current}
                onChange={(e) => { setCurrent(e.target.value); setError(""); }}
                placeholder="Your current password"
                className="w-full px-3 py-2.5 pr-10 rounded-lg bg-transparent focus:outline-none"
                style={{ fontSize: 13, color: "white", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}
              />
              <button type="button" onClick={() => setShowCurrent(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }}>
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1.5 font-medium" style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
              New password
            </label>
            <div className="relative">
              <input
                data-testid="input-new-password"
                type={showNext ? "text" : "password"}
                value={next}
                onChange={(e) => { setNext(e.target.value); setError(""); }}
                placeholder="e.g. john@123"
                className="w-full px-3 py-2.5 pr-10 rounded-lg focus:outline-none"
                style={{ fontSize: 13, color: "white", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}
              />
              <button type="button" onClick={() => setShowNext(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }}>
                {showNext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {next.length > 0 && (
              <div className="mt-2 space-y-1">
                {passwordRules.map((r) => (
                  <div key={r.text} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: r.met ? "#22C55E" : "rgba(255,255,255,0.15)" }} />
                    <span style={{ fontSize: 11, color: r.met ? "#4ADE80" : "rgba(255,255,255,0.35)" }}>{r.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p style={{ fontSize: 12, color: "#FCA5A5" }}>{error}</p>
          )}

          <button
            data-testid="button-confirm-password"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !current || !next}
            className="w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-40"
            style={{ fontSize: 13, background: "linear-gradient(135deg, #3B82F6, #7C3AED)", color: "white" }}
          >
            {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Update password
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { settings, update, resetAll } = useSettings();
  const { toast } = useToast();
  const [active, setActive] = useState<SectionId>("account");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleUpdate = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    update(key, value);
    toast({ title: "Setting saved", description: "Your preference has been updated.", duration: 1800 });
  };

  return (
    <SidebarLayout>
      <AnimatePresence>
        {showPasswordModal && <PasswordModal onClose={() => setShowPasswordModal(false)} />}
      </AnimatePresence>

      <div className="px-7 pt-6 pb-10 max-w-[1100px] mx-auto">
        <div className="mb-6">
          <h1 className="font-bold text-white mb-1" style={{ fontSize: 22, letterSpacing: "-0.03em" }}>Settings</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            Manage your account, preferences, and system configuration
          </p>
        </div>

        <div className="flex gap-5">

          {/* Sidebar nav */}
          <div className="w-[200px] shrink-0 space-y-0.5">
            {SECTIONS.map((s) => {
              const isActive = active === s.id;
              return (
                <motion.button
                  key={s.id}
                  data-testid={`settings-nav-${s.id}`}
                  onClick={() => setActive(s.id)}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] text-left transition-all"
                  style={{
                    background: isActive ? "rgba(59,130,246,0.1)" : "transparent",
                    border: isActive ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
                  }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <s.icon className="w-4 h-4 shrink-0" style={{ color: isActive ? "#60A5FA" : "rgba(255,255,255,0.35)" }} />
                  <p style={{ fontSize: 12.5, fontWeight: isActive ? 600 : 500, color: isActive ? "white" : "rgba(255,255,255,0.5)", lineHeight: 1 }}>
                    {s.label}
                  </p>
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto" style={{ color: "#60A5FA" }} />}
                </motion.button>
              );
            })}

            <div className="pt-4">
              <button
                data-testid="button-reset-settings"
                onClick={() => { resetAll(); toast({ title: "Settings reset", description: "All preferences restored to defaults.", duration: 2000 }); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                style={{ fontSize: 12, color: "rgba(255,100,100,0.7)", border: "1px solid rgba(255,100,100,0.15)" }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "rgba(255,100,100,0.06)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset all settings
              </button>
            </div>
          </div>

          {/* Content */}
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18 }}
            className="flex-1 rounded-xl px-6 py-2"
            style={{ background: "hsl(240,6%,7%)", border: "1px solid rgba(255,255,255,0.07)" }}
          >

            {/* ── Account ── */}
            {active === "account" && (
              <>
                <SectionLabel title="Account" desc="Your profile and login details" />
                <Row label="Username" desc="Your unique login identifier">
                  <span className="font-mono px-2.5 py-1 rounded-md text-white"
                    style={{ fontSize: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {user?.username ?? "—"}
                  </span>
                </Row>
                <Row label="Role" desc="Your access level in the system">
                  <span className="badge badge-blue" style={{ fontSize: 11 }}>Admin</span>
                </Row>
                <Row label="Session" desc="Your current login session">
                  <span className="badge badge-green" style={{ fontSize: 11 }}>Active</span>
                </Row>
                <Row label="Password" desc="Change your account password">
                  <button
                    data-testid="button-change-password"
                    onClick={() => setShowPasswordModal(true)}
                    className="px-3 py-1.5 rounded-lg font-medium transition-colors"
                    style={{ fontSize: 12, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#60A5FA" }}
                  >
                    Change password
                  </button>
                </Row>
                <Row label="Two-factor authentication" desc="Add an extra layer of security">
                  <span className="badge badge-neutral" style={{ fontSize: 11 }}>Coming soon</span>
                </Row>
              </>
            )}

            {/* ── Appearance ── */}
            {active === "appearance" && (
              <>
                <SectionLabel title="Appearance" desc="Customize how Nexus AI looks" />
                <Row label="Theme" desc="Choose your preferred color theme">
                  <SelectPill
                    value={settings.theme}
                    onChange={(v) => handleUpdate("theme", v as any)}
                    options={[
                      { value: "dark", label: "Dark" },
                      { value: "light", label: "Light" },
                      { value: "system", label: "System" },
                    ]}
                  />
                </Row>
                <Row label="Interface density" desc="Control spacing and layout density">
                  <SelectPill
                    value={settings.density}
                    onChange={(v) => handleUpdate("density", v as any)}
                    options={[
                      { value: "compact", label: "Compact" },
                      { value: "comfortable", label: "Comfortable" },
                    ]}
                  />
                </Row>
                <Row label="Current theme" desc="Actively applied theme">
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textTransform: "capitalize" }}>
                    {settings.theme}
                  </span>
                </Row>
              </>
            )}

            {/* ── Language ── */}
            {active === "language" && (
              <>
                <SectionLabel title="Language" desc="Set the interface language" />
                <Row label="Interface language" desc="All menus and messages will use this language">
                  <SelectPill
                    value={settings.language}
                    onChange={(v) => handleUpdate("language", v as any)}
                    options={[
                      { value: "en", label: "English" },
                      { value: "hi", label: "Hindi" },
                      { value: "es", label: "Spanish" },
                      { value: "fr", label: "French" },
                    ]}
                  />
                </Row>
                <Row label="Date format" desc="How dates are displayed across the platform">
                  <SelectPill
                    value={settings.dateFormat}
                    onChange={(v) => handleUpdate("dateFormat", v as any)}
                    options={[
                      { value: "dmy", label: "DD/MM/YYYY" },
                      { value: "mdy", label: "MM/DD/YYYY" },
                    ]}
                  />
                </Row>
                <Row label="Timezone" desc="Auto-detected from your browser">
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: "monospace" }}>
                    {Intl.DateTimeFormat().resolvedOptions().timeZone}
                  </span>
                </Row>
              </>
            )}

            {/* ── Notifications ── */}
            {active === "notifications" && (
              <>
                <SectionLabel title="Notifications" desc="Control which alerts and updates you receive" />
                <Row label="Email notifications" desc="Receive important updates via email">
                  <Toggle testId="toggle-email-notif" value={settings.emailNotif} onChange={(v) => handleUpdate("emailNotif", v)} />
                </Row>
                <Row label="AI action alerts" desc="Notify when AI completes an action (refund, reset, etc.)">
                  <Toggle testId="toggle-action-alerts" value={settings.actionAlerts} onChange={(v) => handleUpdate("actionAlerts", v)} />
                </Row>
                <Row label="Escalation alerts" desc="Notify when a ticket is escalated to a human agent">
                  <Toggle testId="toggle-escalation-alerts" value={settings.escalationAlerts} onChange={(v) => handleUpdate("escalationAlerts", v)} />
                </Row>
                <Row label="Browser notifications" desc="Desktop push notifications">
                  <span className="badge badge-neutral" style={{ fontSize: 11 }}>Coming soon</span>
                </Row>
              </>
            )}

            {/* ── AI Preferences ── */}
            {active === "ai" && (
              <>
                <SectionLabel title="AI Preferences" desc="Configure how the Nexus AI agent behaves" />
                <Row label="Voice mode" desc="Enable AI voice responses (GPT-4o Audio)">
                  <Toggle testId="toggle-ai-voice" value={settings.aiVoice} onChange={(v) => handleUpdate("aiVoice", v)} />
                </Row>
                <Row label="Auto-log actions" desc="Automatically log AI actions to CRM">
                  <Toggle testId="toggle-ai-autolog" value={settings.aiAutoLog} onChange={(v) => handleUpdate("aiAutoLog", v)} />
                </Row>
                <Row label="Streaming responses" desc="Show AI reply word-by-word as it generates">
                  <Toggle testId="toggle-ai-streaming" value={settings.aiStreaming} onChange={(v) => handleUpdate("aiStreaming", v)} />
                </Row>
                <Row label="Response style" desc="Balance between speed and thoroughness">
                  <SelectPill
                    value={settings.aiConfidence}
                    onChange={(v) => handleUpdate("aiConfidence", v as any)}
                    options={[
                      { value: "fast", label: "Fast" },
                      { value: "balanced", label: "Balanced" },
                      { value: "thorough", label: "Thorough" },
                    ]}
                  />
                </Row>
                <Row label="AI model" desc="The language model powering Nexus">
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: "monospace" }}>GPT-4o Audio</span>
                </Row>
              </>
            )}

            {/* ── About ── */}
            {active === "about" && (
              <>
                <SectionLabel title="About Nexus AI" desc="System and platform information" />
                <Row label="Platform" desc="Product name">
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Nexus AI</span>
                </Row>
                <Row label="Version" desc="Current release">
                  <span className="font-mono badge badge-neutral" style={{ fontSize: 11 }}>v1.0.0</span>
                </Row>
                <Row label="AI Engine" desc="Underlying language model">
                  <div className="flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-blue-400" />
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>OpenAI GPT-4o Audio</span>
                  </div>
                </Row>
                <Row label="Database" desc="Data storage">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-green-400" />
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>PostgreSQL (Drizzle ORM)</span>
                  </div>
                </Row>
                <Row label="Authentication" desc="Login & session management">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-violet-400" />
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Passport.js + bcrypt</span>
                  </div>
                </Row>
                <Row label="Streaming" desc="Real-time AI responses">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Server-Sent Events (SSE)</span>
                  </div>
                </Row>
              </>
            )}

            {/* ── Contact Us ── */}
            {active === "contact" && (
              <>
                <SectionLabel title="Contact Us" desc="Reach out to the Nexus AI team for support" />

                <div className="space-y-3 mt-2">
                  {/* Phone */}
                  <div className="flex items-center gap-4 px-4 py-4 rounded-xl"
                    style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "rgba(59,130,246,0.15)" }}>
                      <Phone className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white" style={{ fontSize: 13 }}>Phone / WhatsApp</p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                        Available Mon–Sat, 10 AM – 7 PM IST
                      </p>
                    </div>
                    <a
                      href="tel:+917489655562"
                      data-testid="link-phone"
                      className="px-3 py-1.5 rounded-lg font-semibold transition-colors"
                      style={{ fontSize: 13, color: "#60A5FA", background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", fontFamily: "monospace" }}
                    >
                      +91 74896 55562
                    </a>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-4 px-4 py-4 rounded-xl"
                    style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "rgba(139,92,246,0.15)" }}>
                      <Mail className="w-5 h-5 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white" style={{ fontSize: 13 }}>Email Support</p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                        We respond within 24 hours
                      </p>
                    </div>
                    <a
                      href="mailto:dwivedidayashankar31@gmail.com"
                      data-testid="link-email"
                      className="px-3 py-1.5 rounded-lg font-semibold transition-colors"
                      style={{ fontSize: 12, color: "#A78BFA", background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", fontFamily: "monospace" }}
                    >
                      dwivedidayashankar31@gmail.com
                    </a>
                  </div>

                  {/* Info note */}
                  <div className="flex items-start gap-3 px-4 py-3 rounded-xl mt-4"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <MessageSquare className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
                      For urgent technical issues, please call or WhatsApp directly. For billing, plan upgrades, or feature requests, email is preferred.
                    </p>
                  </div>
                </div>
              </>
            )}

          </motion.div>
        </div>
      </div>
    </SidebarLayout>
  );
}
