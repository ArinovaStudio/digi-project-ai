import { Search, RefreshCw, ArrowUpRight, ArrowDownLeft, Plus, Edit, ChevronRight, Bell, MessageSquare, Download } from 'lucide-react';

export default function DashboardPage() {
    const transactions = [
        { company: "Segment LLC", date: "22 July 2024, 10:43", type: "Received", amount: "+$300.00", bgColor: "bg-blue-100", iconBg: "bg-blue-500" },
        { company: "Karl Rasmussen", date: "21 July 2024, 12:32", type: "Sent", amount: "-$120.00", bgColor: "bg-orange-100", iconBg: "bg-orange-500" },
        { company: "FocusPoint", date: "21 July 2024, 11:30", type: "Payment", amount: "-$25.00", bgColor: "bg-purple-100", iconBg: "bg-purple-500" },
        { company: "Nataly Craig", date: "21 July 2024, 10:22", type: "Received", amount: "+$300.00", bgColor: "bg-orange-100", iconBg: "bg-orange-500" },
        { company: "Lucy Jones", date: "20 July 2024, 16:15", type: "Received", amount: "+$100.00", bgColor: "bg-orange-100", iconBg: "bg-orange-500" },
        { company: "Alex Dawson", date: "20 July 2024, 18:45", type: "Sent", amount: "-$64.00", bgColor: "bg-orange-100", iconBg: "bg-orange-500" },
        { company: "Kelly Williams", date: "19 July 2024, 20:22", type: "Sent", amount: "-$120.00", bgColor: "bg-orange-100", iconBg: "bg-orange-500" },
        { company: "BioSynthesis", date: "18 July 2024, 17:43", type: "Payment", amount: "-$32.00", bgColor: "bg-blue-100", iconBg: "bg-blue-500" },
        { company: "Gurfoo", date: "17 July 2024, 15:24", type: "Payment", amount: "-$9.00", bgColor: "bg-blue-100", iconBg: "bg-blue-500" }
    ];

    const contacts = [
        { image: "https://i.pravatar.cc/100?img=1" },
        { image: "https://i.pravatar.cc/100?img=2" },
        { image: "https://i.pravatar.cc/100?img=3" },
        { image: "https://i.pravatar.cc/100?img=4" },
        { image: "https://i.pravatar.cc/100?img=5" }
    ];

    return (
        <div className="min-h-screen bg-white p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 flex-1 max-w-md border border-gray-100">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="flex-1 text-black outline-none text-sm bg-transparent"
                    />
                    <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">⌘F</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 border border-gray-100">
                        <Bell className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 border border-gray-100">
                        <MessageSquare className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-5">
                {/* Left Column */}
                <div className="col-span-12 lg:col-span-4 space-y-5">
                    {/* Balance Card */}
                    <div className="bg-gradient-to-b  from-[#2f2b27]  via-[#23211f]  to-[#1a1918] relative rounded-2xl p-5 text-white">
                        <div className="  absolute inset-0   bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.08),transparent_55%)]  pointer-events-none" />
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xs text-white/60 mb-1">Total Balance</h2>
                                <p className="text-[10px] text-white/40">Available for use</p>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur rounded-full px-3 py-1.5">
                                <span className="text-sm">🇺🇸</span>
                                <span className="text-xs font-medium">USD</span>
                                <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-5">
                            <p className="text-[11px] text-gray-500 mb-2">Available Funds</p>
                            <h1 className="text-[32px] font-bold text-black mb-5">
                                $18,248<span className="text-gray-400">.44</span>
                            </h1>
                            <div className="flex gap-3">
                                <button className="flex-1 bg-black text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                                    <ArrowUpRight className="w-4 h-4" />
                                    Send
                                </button>
                                <button className="flex-1 border-2 border-gray-200 py-2.5 rounded-xl text-gray-700 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                                    <ArrowDownLeft className="w-4 h-4" />
                                    Request
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Contacts */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-1">Recent Contacts</h3>
                                <p className="text-xs text-gray-500">Send or Request from your contact list</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 mt-0.5" />
                        </div>

                        <div className="flex gap-3 mb-5">
                            {contacts.map((contact, i) => (
                                <div key={i} className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                    <img src={contact.image} alt="Contact" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 mb-4">
                            <button className="bg-black text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors">
                                <Plus className="w-4 h-4" />
                                Add new
                            </button>
                            <button className="border-2 border-gray-200 px-4 py-2.5 rounded-xl text-gray-700 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
                                <Edit className="w-4 h-4" />
                                Manage
                            </button>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-2">
                                <Plus className="w-3.5 h-3.5" />
                                Add or Manage widget
                            </button>
                        </div>
                    </div>
                </div>

                {/* Middle Column - Transactions */}
                <div className="col-span-12 lg:col-span-5">
                    <div className="bg-white border border-gray-100 rounded-2xl p-5">
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-1">Transactions</h3>
                                <p className="text-xs text-gray-500">You can view your transaction history</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 rounded-xl transition-colors border border-gray-100">
                                    <RefreshCw className="w-4 h-4 text-gray-500" />
                                </button>
                                <button className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 rounded-xl transition-colors border border-gray-100">
                                    <Download className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {transactions.map((tx, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                    <div className={`w-10 h-10 rounded-full ${tx.bgColor} flex items-center justify-center flex-shrink-0`}>
                                        <div className={`w-2.5 h-2.5 rounded-full ${tx.iconBg}`}></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">{tx.company}</p>
                                        <p className="text-xs text-gray-500">{tx.date.split(',')[0]}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-semibold ${tx.type === 'Received' ? 'text-green-600' : 'text-gray-900'}`}>
                                            {tx.amount}
                                        </p>
                                        <p className="text-xs text-gray-500">{tx.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center pt-4 mt-2">
                            <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                                View all transactions
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-span-12 lg:col-span-3 space-y-5">
                    {/* Total Expenses */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Total Expenses</h3>
                        <div className="mb-4">
                            <div className="text-2xl font-bold text-gray-900 mb-1">$72,421.84</div>
                            <div className="text-xs text-red-600 font-medium">-8% vs Prev year</div>
                        </div>
                        <div className="h-32 flex items-end justify-between gap-2">
                            {[45, 65, 50, 75, 85, 55].map((height, i) => (
                                <div key={i} className="flex-1 bg-orange-200 rounded-t-lg transition-all hover:bg-orange-300" style={{ height: `${height}%` }}></div>
                            ))}
                        </div>
                    </div>

                    {/* Total Income */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Total Income</h3>
                        <div className="mb-4">
                            <div className="text-2xl font-bold text-gray-900 mb-1">$98,248.44</div>
                            <div className="text-xs text-green-600 font-medium">+15% vs Prev year</div>
                        </div>
                        <div className="h-32 flex items-end justify-between gap-2">
                            {[50, 60, 55, 90, 70, 65].map((height, i) => (
                                <div key={i} className={`flex-1 rounded-t-lg transition-all hover:bg-gray-400 ${i === 3 ? 'bg-gray-800' : 'bg-gray-300'}`} style={{ height: `${height}%` }}></div>
                            ))}
                        </div>
                    </div>

                    {/* Exchange */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Exchange</h3>
                        <div className="space-y-3 mb-3">
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <span className="text-base">🇺🇸</span>
                                    <span className="text-sm font-medium text-gray-900">USD</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">300</span>
                            </div>
                            <div className="flex justify-center -my-1">
                                <div className="w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <span className="text-base">🇪🇺</span>
                                    <span className="text-sm font-medium text-gray-900">EUR</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">276.68</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-500 mb-4 text-center">1 USD = 0.922 Euro · Exchange Rate $12.84</p>
                        <button className="w-full bg-black text-white py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
                            Exchange
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}