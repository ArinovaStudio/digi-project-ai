import { Home, CreditCard, FileText, Menu, Settings } from 'lucide-react';

export default function Sidebar() {
    const menuItems = [
        { name: "Analytics", icon: Home, active: true },
        { name: "Configuration", icon: CreditCard, active: false },
        { name: "API KEY", icon: FileText, active: false },
        { name: "Docs", icon: Settings, active: false },
    ];

    return (
        <aside className="w-72 h-screen px-4 py-8 flex flex-col text-white relative overflow-hidden bg-gradient-to-br from-[#2a2a2a] via-[#1e1e1e] to-[#151515]">
            {/* Multiple layered background effects for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.08)_0%,transparent_40%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.04)_0%,transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />

            {/* Subtle noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-10 px-2 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border-[3px] border-white flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full border-[2.5px] border-white"></div>
                    </div>
                    <span className="text-2xl font-bold tracking-tight">payflow</span>
                </div>
                <button className="text-white/40 hover:text-white transition-colors">
                    <Menu className="w-7 h-7 stroke-[1.5]" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 flex-1 relative z-10">
                {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                        <div
                            key={item.name}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 ${item.active
                                ? "bg-gradient-to-b from-[#404040] via-[#353535] to-[#2a2a2a] border border-white/[0.15] shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.2)]"
                                : "text-[#8a8988] hover:text-white hover:bg-white/[0.03]"
                                }`}
                        >
                            <IconComponent
                                className={`w-5 h-5 stroke-[1.8] ${item.active ? "text-white" : "text-[#8a8988]"}`}
                            />
                            <span className={`text-[16px] font-semibold ${item.active ? "text-white" : ""}`}>
                                {item.name}
                            </span>
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
}