import React from 'react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#bdc9c6]/40 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#eff4ff] sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-display text-[18px] sm:text-[20px] font-bold text-[#0b1c30]">
              Digi Track — Architecture Specification
            </h2>
            <p className="font-sans text-[12px] text-[#6e7977]">
              Production-Grade Multi-Tenant SaaS &amp; Offline-First Architecture
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-[#0b1c30]">
          {/* Layer 1: Users / Clients */}
          <div className="border border-[#0165d8]/40 bg-[#eff4ff]/40 rounded-2xl p-4">
            <div className="text-[12px] font-bold text-[#004eaa] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">devices</span>
              Users / Clients Layer
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-xl border border-[#bdc9c6]/40 text-center shadow-xs">
                <div className="font-bold text-[13px] text-[#005c55]">Mobile App (iOS/Android)</div>
                <div className="text-[11px] text-[#6e7977] mt-0.5">SQLite | Sync Manager | Offline First</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#bdc9c6]/40 text-center shadow-xs">
                <div className="font-bold text-[13px] text-[#0165d8]">SaaS Marketing Web</div>
                <div className="text-[11px] text-[#6e7977] mt-0.5">React / Next.js Landing</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#bdc9c6]/40 text-center shadow-xs">
                <div className="font-bold text-[13px] text-[#9d4300]">Admin Portal</div>
                <div className="text-[11px] text-[#6e7977] mt-0.5">Staff / Super Admin Dashboard</div>
              </div>
            </div>
          </div>

          {/* Layer 2: Edge / Security Layer */}
          <div className="border border-dashed border-[#6e7977] bg-[#f8f9ff] rounded-2xl p-4">
            <div className="text-[12px] font-bold text-[#3e4947] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">shield</span>
              Edge / Security Layer (Cloudflare WAF / CDN / DNS → API Gateway)
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-[#bdc9c6]/40 text-[12px] text-center text-[#3e4947] font-medium">
              Cloudflare (WAF/CDN/DNS) ── Load Balancer ── API Gateway (Auth / Rate-Limit / Tenant Isolation)
            </div>
          </div>

          {/* Layer 3: Application Tier (Modular Monolith) */}
          <div className="border border-[#005c55] bg-[#005c55]/5 rounded-2xl p-4">
            <div className="text-[12px] font-bold text-[#005c55] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">hub</span>
              Application Tier (Modular Monolith)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-3">
              <div className="bg-white p-2.5 rounded-xl border border-[#bdc9c6]/40 text-[12px]">
                <strong className="text-[#005c55] block mb-1">IAM &amp; Auth</strong>
                <ul className="text-[11px] text-[#6e7977] space-y-0.5 list-disc list-inside">
                  <li>JWT Management</li>
                  <li>Tenant Isolation</li>
                  <li>RBAC / Claims</li>
                </ul>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#bdc9c6]/40 text-[12px]">
                <strong className="text-[#005c55] block mb-1">Expense Domain</strong>
                <ul className="text-[11px] text-[#6e7977] space-y-0.5 list-disc list-inside">
                  <li>CRUD / Search</li>
                  <li>Category Rules</li>
                  <li>Sync Conflict Resolver</li>
                </ul>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#bdc9c6]/40 text-[12px]">
                <strong className="text-[#005c55] block mb-1">Budgeting &amp; Insights</strong>
                <ul className="text-[11px] text-[#6e7977] space-y-0.5 list-disc list-inside">
                  <li>Threshold Alerts</li>
                  <li>Chart Aggregation</li>
                  <li>Daily Safe Spend</li>
                </ul>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#bdc9c6]/40 text-[12px]">
                <strong className="text-[#005c55] block mb-1">Billing &amp; Subs</strong>
                <ul className="text-[11px] text-[#6e7977] space-y-0.5 list-disc list-inside">
                  <li>Plan Entitlements</li>
                  <li>Razorpay Webhooks</li>
                  <li>Invoicing Engine</li>
                </ul>
              </div>
            </div>
            <div className="bg-white p-2 rounded-xl border border-dashed border-[#0165d8] text-center text-[11px] text-[#0165d8] font-semibold">
              Asynchronous Workers (Push Notifications, Daily Summaries, Analytics, Audit Logging)
            </div>
          </div>

          {/* Layer 4: Persistence & Caching */}
          <div className="border border-[#fd761a] bg-[#fd761a]/5 rounded-2xl p-4">
            <div className="text-[12px] font-bold text-[#9d4300] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">database</span>
              Persistence &amp; Caching Tier
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-xl border border-[#bdc9c6]/40 text-center shadow-xs">
                <div className="font-bold text-[13px] text-[#0b1c30]">PostgreSQL</div>
                <div className="text-[11px] text-[#6e7977] mt-0.5">Tenant Isolation via RLS (Primary + Read Replicas)</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#bdc9c6]/40 text-center shadow-xs">
                <div className="font-bold text-[13px] text-[#0b1c30]">Redis Cache</div>
                <div className="text-[11px] text-[#6e7977] mt-0.5">Sessions, Rate Limits, Tenant Hot Config</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#bdc9c6]/40 text-center shadow-xs">
                <div className="font-bold text-[13px] text-[#0b1c30]">S3 Object Storage</div>
                <div className="text-[11px] text-[#6e7977] mt-0.5">Encrypted Receipt Images &amp; CSV Exports</div>
              </div>
            </div>
          </div>

          {/* Layer 5: External Services & Observability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#f8f9ff] border border-[#bdc9c6]/40 p-3 rounded-xl">
              <span className="font-bold text-[12px] text-[#3e4947] block mb-1">
                External Integrations
              </span>
              <p className="text-[11px] text-[#6e7977]">
                Auth0 (IAM) • Razorpay (Billing) • Firebase Cloud Messaging • Segment (Analytics)
              </p>
            </div>
            <div className="bg-[#f8f9ff] border border-[#bdc9c6]/40 p-3 rounded-xl">
              <span className="font-bold text-[12px] text-[#3e4947] block mb-1">
                Observability &amp; CI/CD
              </span>
              <p className="text-[11px] text-[#6e7977]">
                Datadog (Metrics/Tracing) • GitHub Actions • Kubernetes (AWS EKS) • Terraform (IaC)
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#eff4ff] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#005c55] text-white rounded-xl font-semibold text-[14px]"
          >
            Close Architecture
          </button>
        </div>
      </div>
    </div>
  );
};
