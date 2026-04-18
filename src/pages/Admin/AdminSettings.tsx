import React from "react";
import { Bell, Shield, Globe, Database, Save } from "lucide-react";

type ToggleField = { label: string; type: "toggle"; defaultChecked: boolean };
type TextField = { label: string; type: "text" | "email"; placeholder: string };
type SettingField = ToggleField | TextField;

const settingSections: { icon: React.ElementType; title: string; description: string; fields: SettingField[] }[] = [
  {
    icon: Bell,
    title: "Notifications",
    description: "Manage email and in-app notification preferences.",
    fields: [
      { label: "Email Notifications", type: "toggle", defaultChecked: true },
      { label: "SMS Alerts", type: "toggle", defaultChecked: false },
      { label: "Push Notifications", type: "toggle", defaultChecked: true },
    ],
  },
  {
    icon: Shield,
    title: "Security",
    description: "Configure authentication and access settings.",
    fields: [
      { label: "Two-Factor Authentication", type: "toggle", defaultChecked: false },
      { label: "Enforce Strong Passwords", type: "toggle", defaultChecked: true },
    ],
  },
  {
    icon: Globe,
    title: "General",
    description: "App-wide configuration settings.",
    fields: [
      { label: "App Name", type: "text", placeholder: "MyApp" },
      { label: "Support Email", type: "email", placeholder: "support@example.com" },
    ],
  },
  {
    icon: Database,
    title: "System",
    description: "Database and caching options.",
    fields: [
      { label: "Cache Enabled", type: "toggle", defaultChecked: true },
      { label: "Maintenance Mode", type: "toggle", defaultChecked: false },
    ],
  },
];

const AdminSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage global application settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {settingSections.map(({ icon: Icon, title, description, fields }) => (
          <div key={title} className="bg-[#1a1d27] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#124e66] to-[#748d92] flex items-center justify-center">
                <Icon size={18} className="text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-white text-sm">{title}</h2>
                <p className="text-xs text-gray-400">{description}</p>
              </div>
            </div>
            <div className="space-y-4">
              {fields.map((field) =>
                field.type === "toggle" ? (
                  <label key={field.label} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-300">{field.label}</span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only peer" defaultChecked={field.defaultChecked} />
                      <div className="w-10 h-5 bg-gray-600 peer-checked:bg-[#124e66] rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-[#748d92]" />
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
                    </div>
                  </label>
                ) : (
                  <div key={field.label}>
                    <label className="block text-sm text-gray-300 mb-1.5">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#748d92] focus:ring-1 focus:ring-[#748d92] transition-all"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#124e66] to-[#2e3944] text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-lg">
          <Save size={16} />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
