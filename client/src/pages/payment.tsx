import { useState } from "react";
import { SidebarLayout } from "@/components/layout";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, ShieldCheck, Zap, CheckCircle, Loader2, IndianRupee, Lock, Star, Building2, ArrowRight, RefreshCcw } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 999,
    period: "/ month",
    desc: "Perfect for small e-commerce businesses",
    color: "#60A5FA",
    barColor: "#3B82F6",
    features: ["Up to 500 AI resolutions/mo", "Voice + Text support", "Basic CRM sync", "Email escalations", "Standard analytics"],
    popular: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: 2999,
    period: "/ month",
    desc: "For scaling businesses with high ticket volume",
    color: "#A78BFA",
    barColor: "#7C3AED",
    features: ["Up to 5,000 AI resolutions/mo", "Priority voice model", "Full CRM integration", "Auto-refund processing", "Advanced analytics", "Webhook support"],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 9999,
    period: "/ month",
    desc: "White-label deployment for large enterprises",
    color: "#4ADE80",
    barColor: "#16A34A",
    features: ["Unlimited resolutions", "Dedicated AI instance", "Custom LLM tuning", "SLA guarantee (99.9%)", "On-premise option", "24/7 dedicated support", "Custom integrations"],
    popular: false,
  },
];

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("growth");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ paymentId: string; plan: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const plan = PLANS.find((p) => p.id === selectedPlan)!;

  const handleCheckout = async () => {
    setError(null);
    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Razorpay SDK load failed. Check your internet connection.");

      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: plan.price, currency: "INR", notes: { plan: plan.id } }),
      });
      if (!res.ok) throw new Error("Could not create payment order. Please try again.");
      const order = await res.json();

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Nexus AI",
        description: `${plan.name} Plan — Monthly Subscription`,
        order_id: order.orderId,
        theme: { color: plan.barColor },
        modal: {
          backdropclose: false,
          escape: true,
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setSuccess({ paymentId: response.razorpay_payment_id, plan: plan.name });
            } else {
              setError("Payment verification failed. Contact support.");
            }
          } catch {
            setError("Verification error. Please contact support with your payment ID.");
          } finally {
            setLoading(false);
          }
        },
        prefill: { name: "Your Name", email: "you@company.com" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SidebarLayout>
        <div className="h-full flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <CheckCircle className="w-10 h-10" style={{ color: "#4ADE80" }} />
            </div>
            <h1 className="font-bold text-white mb-2" style={{ fontSize: 24, letterSpacing: "-0.04em" }}>
              Payment Successful!
            </h1>
            <p className="mb-6" style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>
              {success.plan} plan activated. Welcome to Nexus AI.
            </p>
            <div className="p-4 rounded-xl mb-8 text-left"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="label mb-1.5">Payment Reference</p>
              <p className="font-mono text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>{success.paymentId}</p>
            </div>
            <button
              onClick={() => { setSuccess(null); setSelectedPlan("growth"); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-[13px] text-white transition-all hover:-translate-y-0.5"
              style={{ background: "#3B82F6", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 4px 16px rgba(59,130,246,0.3)" }}
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              Back to Plans
            </button>
          </motion.div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="px-8 pt-8 pb-12 max-w-[1200px] mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="badge badge-blue" style={{ fontSize: 11, padding: "3.5px 10px" }}>
              <Lock className="w-3 h-3" /> Secured by Razorpay
            </span>
            <span className="badge badge-green" style={{ fontSize: 11, padding: "3.5px 10px" }}>
              <ShieldCheck className="w-3 h-3" /> PCI DSS Compliant
            </span>
          </div>
          <h1 className="font-bold text-white mb-3" style={{ fontSize: 38, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
            Choose your plan
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", maxWidth: 480, margin: "0 auto" }}>
            Start automating customer support today. Cancel anytime.
          </p>
        </motion.div>

        {/* Plan Cards */}
        <div className="grid grid-cols-3 gap-5 mb-10">
          {PLANS.map((p, i) => {
            const isSelected = selectedPlan === p.id;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setSelectedPlan(p.id)}
                whileHover={{ y: -3 }}
                className="relative rounded-xl p-6 cursor-pointer transition-all duration-200 select-none"
                style={{
                  background: isSelected ? `rgba(${p.barColor === "#3B82F6" ? "59,130,246" : p.barColor === "#7C3AED" ? "124,58,237" : "22,163,74"},0.07)` : "hsl(240,6%,7%)",
                  border: isSelected ? `1.5px solid ${p.color}40` : "1.5px solid rgba(255,255,255,0.08)",
                  boxShadow: isSelected ? `0 0 0 1px ${p.color}20, 0 12px 32px rgba(0,0,0,0.25)` : "none",
                }}
              >
                {/* Popular badge */}
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge badge-purple px-3 py-1 text-[10px] font-semibold" style={{ boxShadow: "0 4px 12px rgba(139,92,246,0.3)" }}>
                      <Star className="w-2.5 h-2.5" /> Most Popular
                    </span>
                  </div>
                )}

                {/* Left accent bar */}
                <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full"
                  style={{ background: p.barColor, opacity: isSelected ? 1 : 0.35 }} />

                <div className="pl-2">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-white" style={{ fontSize: 16 }}>{p.name}</h3>
                      <p className="mt-0.5" style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)" }}>{p.desc}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${p.barColor}18`, border: `1px solid ${p.barColor}28` }}>
                      <CreditCard className="w-4 h-4" style={{ color: p.color }} />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1 mb-5">
                    <IndianRupee className="w-4 h-4 mb-1" style={{ color: p.color }} />
                    <span className="font-extrabold" style={{ fontSize: 34, letterSpacing: "-0.05em", color: p.color }}>
                      {p.price.toLocaleString("en-IN")}
                    </span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{p.period}</span>
                  </div>

                  <ul className="space-y-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: p.color, opacity: 0.8 }} />
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Select indicator */}
                  <div className="mt-5 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
                      style={{ borderColor: isSelected ? p.color : "rgba(255,255,255,0.2)" }}>
                      {isSelected && <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />}
                    </div>
                    <span style={{ fontSize: 12, color: isSelected ? p.color : "rgba(255,255,255,0.3)", fontWeight: 500 }}>
                      {isSelected ? "Selected" : "Select plan"}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Checkout Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="max-w-[500px] mx-auto"
        >
          <div className="rounded-xl p-6 mb-4"
            style={{ background: "hsl(240,6%,7%)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-white" style={{ fontSize: 14 }}>Order Summary</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{plan.name} Plan · Monthly</p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1">
                  <IndianRupee className="w-3.5 h-3.5" style={{ color: plan.color }} />
                  <span className="font-bold" style={{ fontSize: 22, color: plan.color, letterSpacing: "-0.04em" }}>
                    {plan.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 1 }}>+ GST applicable</p>
              </div>
            </div>

            <div className="h-px mb-4" style={{ background: "rgba(255,255,255,0.065)" }} />

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg mb-4"
                  style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)" }}>
                  <span style={{ fontSize: 12, color: "#FCA5A5", lineHeight: 1.5 }}>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={handleCheckout}
              disabled={loading}
              data-testid="button-pay-now"
              whileHover={{ y: -1.5, boxShadow: "0 10px 28px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.18)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-white transition-all"
              style={{
                fontSize: 14,
                background: loading ? "rgba(59,130,246,0.5)" : "linear-gradient(160deg, #3B82F6 0%, #1D4ED8 100%)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 4px 18px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
              ) : (
                <><CreditCard className="w-4 h-4" /> Pay ₹{plan.price.toLocaleString("en-IN")} via Razorpay <ArrowRight className="w-4 h-4 opacity-70" /></>
              )}
            </motion.button>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-6">
            {[
              { icon: Lock, label: "256-bit SSL" },
              { icon: ShieldCheck, label: "PCI DSS" },
              { icon: Building2, label: "RBI Compliant" },
              { icon: Zap, label: "Instant Activation" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-1.5">
                <t.icon className="w-3 h-3" style={{ color: "rgba(255,255,255,0.25)" }} />
                <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.28)", fontWeight: 500 }}>{t.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </SidebarLayout>
  );
}
