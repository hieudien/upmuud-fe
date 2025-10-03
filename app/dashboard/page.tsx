'use client'

import React, { useState, useMemo, FC, FormEvent, useRef, useEffect } from 'react';
import {
	SignedIn,
	UserButton,
} from '@clerk/nextjs'
import axios from "axios";
import IconEdit from '@/components/IconEdit';
import IconChart from '@/components/IconChart';
import Image from 'next/image';
import { useUser } from "@clerk/clerk-react";


//* Set Axios Base URL
const apiEndPoint = process.env.NEXT_PUBLIC_BASE_URL || 'localhost:5000';
axios.defaults.baseURL = apiEndPoint;

interface JournalEntry {
	createdAt: string;
	note: string;
	mood: 'Tích cực' | 'Tiêu cực' | 'Trung lập';
	encouragement: string;
}

interface WeekSummary {
	summary: string;
	strategicGuidance: string;
}


interface ShareEmotionTabProps {
	aiResponse: JournalEntry | null;
	setAiResponse: (value: JournalEntry | null) => void;
}

interface EmotionalWellnessTabProps {
	entries: JournalEntry[];
	weekSummary: WeekSummary;
}

// --- COMPONENTS & HELPER FUNCTIONS ---

// --- TAB ShareEmotionTab
const ShareEmotionTab: FC<ShareEmotionTabProps> = ({ aiResponse, setAiResponse }) => {
	const [note, setNote] = useState<string>('');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [message, setMessage] = useState<string>('');
	const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
	const { user } = useUser()

	const responseRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (aiResponse) {
			setTimeout(() => {
				responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}, 100);
			// Trigger highlight and ensure the component is rendered
			const highlightTimer = setTimeout(() => {
				setIsHighlighted(true);
				// Timer to reset the highlight state after the animation finishes (2000ms)
				const resetTimer = setTimeout(() => {
					setIsHighlighted(false);
				}, 2000);
				return () => clearTimeout(resetTimer);
			}, 100);

			return () => clearTimeout(highlightTimer);
		}
	}, [aiResponse]); // Dependency on aiResponse

	const handleSubmit = async (e: FormEvent) => {
		setAiResponse(null)
		if (!user) return
		e.preventDefault();
		if (note.trim().length < 5) {
			setMessage('Vui lòng viết dài hơn một chút để AI có thể phân tích.');
			return;
		}
		setIsSubmitting(true);
		setMessage('');
		const { data } = await axios.post(`/journal/add`, { note, userId: user.id })
		const { mood, encouragement } = data

		const newEntry: JournalEntry = {
			createdAt: new Date().toLocaleDateString('vi-VN'),
			note: note.trim(),
			mood,
			encouragement
		};
		setAiResponse(newEntry);
		setNote('');
		setIsSubmitting(false);
	};

	return (
		<div className="max-w-3xl mx-auto">
			<h2 className="text-3xl font-bold text-gray-900 mb-6">Chia Sẻ Cảm Xúc Hôm Nay</h2>
			<p className="text-text-soft mb-6">Viết ra những suy nghĩ của bạn (sẽ được AI phân tích và phản hồi). Chỉ có bạn và AI biết điều này.</p>

			{/* Input Form */}
			<form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
				<textarea
					id="note-input"
					rows={6}
					placeholder="Bạn đang cảm thấy thế nào hôm nay? Hãy viết ra một cách chân thật..."
					className="w-full p-4 border border-gray-200 rounded-xl focus:ring-primary-calm focus:border-primary-calm outline-none resize-none"
					value={note}
					onChange={(e) => setNote(e.target.value)}
					disabled={isSubmitting}
				/>

				<div className="flex justify-between items-center mt-4">
					{message && <p className="text-safe-alert text-sm">{message}</p>}
					<button
						type="submit"
						disabled={isSubmitting}
						className={`font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 transform ${isSubmitting
							? 'bg-gray-400 cursor-not-allowed'
							: 'bg-primary-calm hover:bg-indigo-100 hover:scale-[1.02] cursor-pointer'
							} ml-auto`}
					>
						{isSubmitting ? (
							<span className="flex items-center">
								<svg className="animate-spin h-5 w-5 mr-3 inline text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
								Đang phân tích...
							</span>
						) : 'Chia sẻ'}
					</button>
				</div>
			</form>

			{/* AI Response Area */}
			<div className="mt-8" ref={responseRef}>
				{aiResponse ? (
					<div className={`bg-indigo-50 p-6 rounded-2xl shadow-xl border-l-4 border-primary-calm animate-fadeIn ${isHighlighted ? 'animate-highlight' : ''}`}>
						<h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
							<svg className="w-6 h-6 mr-2 text-primary-calm" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
							Lời Chia Sẻ Từ Người Bạn Đồng Hành AI
						</h3>
						<p className="text-sm text-gray-600 italic mb-3">Phân loại cảm xúc:
							<span className={`font-bold p-1 rounded-md ${aiResponse.mood === 'Tích cực' ? 'bg-mint-green text-green-800' : aiResponse.mood === 'Tiêu cực' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-600'}`}>
								{aiResponse.mood}
							</span>
						</p>
						<p className="text-lg text-gray-700 leading-relaxed">"{aiResponse.encouragement}"</p>
						<p className="text-xs text-right text-gray-500 mt-2">Đã lưu vào {aiResponse.createdAt}</p>
					</div>
				) : (
					<div className="text-center p-8 bg-white rounded-xl text-text-soft border border-gray-200">
						<p>Hãy bắt đầu viết ra cảm xúc của mình!</p>
					</div>
				)}
			</div>
		</div>
	);
};

// --- TAB EmotionalWellnessTab ---
const EmotionalWellnessTab: FC<EmotionalWellnessTabProps> = ({ entries, weekSummary }) => {
	const stats = useMemo(() => {
		const totalEntries: number = entries.length;
		const positiveCount: number = entries.filter(e => e.mood === 'Tích cực').length;
		const negativeCount: number = entries.filter(e => e.mood === 'Tiêu cực').length;
		const neutralCount: number = entries.filter(e => e.mood === 'Trung lập').length;

		let summary: string = 'Bạn chưa có đủ dữ liệu để tạo báo cáo chi tiết. Hãy ghi lại cảm xúc của mình thêm nhé!';
		let strategicGuidance: string = 'Tiếp tục ghi chép hàng ngày để AI có thể phân tích xu hướng cảm xúc của bạn. Điều này rất quan trọng để hiểu rõ bản thân.';

		if (totalEntries > 0) {
			summary = weekSummary.summary
			strategicGuidance = weekSummary.strategicGuidance
		}

		return { totalEntries, positiveCount, negativeCount, neutralCount, summary, strategicGuidance };
	}, [entries]);

	return (
		<div className="max-w-4xl mx-auto">
			<h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
				Sức Khỏe Tinh Thần
			</h2>

			{/* Summary*/}
			<div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-mint-green mb-8">
				<h3 className="text-xl font-bold text-gray-900 mb-3">Phân Tích Xu Hướng Cảm Xúc</h3>
				<p className="text-lg text-gray-700 mb-4">{stats.summary}</p>
				<p className="text-md text-text-soft italic">Thông điệp chia sẻ: {stats.strategicGuidance}</p>
			</div>

			{/* Detail */}
			<div className="grid grid-cols-3 gap-6 text-center mb-10">
				<div className="bg-white p-5 rounded-xl shadow-lg border border-mint-green">
					<p className="text-4xl font-extrabold text-mint-green">{stats.positiveCount}</p>
					<p className="text-sm font-semibold mt-1">Lần Tích Cực</p>
				</div>
				<div className="bg-white p-5 rounded-xl shadow-lg border border-yellow-300">
					<p className="text-4xl font-extrabold text-yellow-600">{stats.negativeCount}</p>
					<p className="text-sm font-semibold mt-1">Lần Tiêu Cực</p>
				</div>
				<div className="bg-white p-5 rounded-xl shadow-lg border border-gray-300">
					<p className="text-4xl font-extrabold text-gray-600">{stats.neutralCount}</p>
					<p className="text-sm font-semibold mt-1">Lần Trung Lập</p>
				</div>
			</div>

			{/* List */}
			<h3 className="text-2xl font-bold text-gray-900 mb-4">Lịch Sử Ghi Chép Gần Nhất ({stats.totalEntries} mục)</h3>
			{stats.totalEntries > 0 ? (
				<div className="bg-white rounded-xl shadow-lg overflow-hidden">
					{entries.slice().reverse().map((entry: JournalEntry, index: number) => (
						<div key={index} className="p-4 border-b last:border-b-0">
							<div className="flex justify-between items-start">
								<p className="text-sm font-semibold text-gray-700">{new Date(entry.createdAt).toLocaleDateString('vi-VN')}</p>
								<span className={`text-xs font-medium p-1 rounded-full ${entry.mood === 'Tích cực' ? 'bg-mint-green/50 text-green-800' : entry.mood === 'Tiêu cực' ? 'bg-yellow-200/50 text-yellow-800' : 'bg-gray-200 text-gray-600'}`}>
									{entry.mood}
								</span>
							</div>
							<p className="text-sm text-text-soft mt-1 line-clamp-2">"{entry.note}"</p>
						</div>
					))}
				</div>
			) : (
				<div className="text-center p-8 bg-white rounded-xl text-text-soft border border-gray-200">
					<p>Hãy bắt đầu ghi lại cảm xúc của mình ở tab "Chia sẻ cảm xúc" để xem báo cáo.</p>
				</div>
			)}
		</div>
	);
};




const Dashboard: FC = () => {
	const { user } = useUser()
	const [activeTab, setActiveTab] = useState<'share' | 'wellness'>('share');
	const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
	const [weekSummary, setLastWeekSummary] = useState<WeekSummary>({ summary: '', strategicGuidance: '' });
	// aiResponse is JournalEntry or null
	const [aiResponse, setAiResponse] = useState<JournalEntry | null>(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const _setAiResponse = (value: JournalEntry | null) => {
		setAiResponse(value);
	};
	function getJournals() {
		setIsLoading(true)
		axios.get(`/journal/getLastWeekSummary/` + user?.id).then(({ data }) => {
			const { journals, lastWeekSummary } = data
			setJournalEntries(journals)
			setLastWeekSummary(lastWeekSummary)
			setIsLoading(false)
		})
	}
	// Toggle sidebar visibility on mobile
	const toggleSidebar = (): void => {
		setIsSidebarOpen(prev => !prev);
	};

	// Close sidebar and switch tab
	const handleNavigation = (tab: 'share' | 'wellness') => {
		if (tab !== activeTab && tab === 'wellness') {
			setAiResponse(null)
			getJournals()
		}
		setActiveTab(tab);
		if (isSidebarOpen) {
			setIsSidebarOpen(false); // Close sidebar after clicking on mobile
		}
	}

	// Tab content rendering
	const renderContent = () => {
		switch (activeTab) {
			case 'share':
				return <ShareEmotionTab aiResponse={aiResponse} setAiResponse={_setAiResponse} />;
			case 'wellness':
				return <EmotionalWellnessTab entries={journalEntries} weekSummary={weekSummary} />;
			default:
				return <ShareEmotionTab aiResponse={aiResponse} setAiResponse={_setAiResponse} />;
		}
	};

	const renderLoading = () => {
		return (
			<div className="relative items-center block max-w-sm p-6 bg-white border border-gray-100 rounded-lg shadow-md">
				<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-90 opacity-20">AI đang phân tích ...</h5>
				<p className="font-normal text-gray-700 opacity-20">Vui lòng đợi trong giây lát bạn tôi nhé.</p>
				<div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
					<svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-yellow-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
					<span className="sr-only">Loading...</span>
				</div>
			</div>

		)
	}
	return (
		<div className="antialiased text-gray-800 h-screen overflow-hidden">
			{/* Global Styles for Tailwind configuration and custom classes */}
			<style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #f9fafb; /* Off-White */
                }
                .tab-active {
                    background-color: #f3f4f6; /* Gray-100 */
                    border-left: 4px solid #7c3aed; /* primary-calm */
                    font-weight: 600;
                    color: #1f2937; /* Darker text */
                }
                
                /* Simple fade in animation for AI response */
                // @keyframes fadeIn {
                //     from { opacity: 0; transform: translateY(10px); }
                //     to { opacity: 1; transform: translateY(0); }
                // }
                // .animate-fadeIn {
                //     animation: fadeIn 0.5s ease-out forwards;
                // }
                
                /* New: Highlight pulse for new content (Mint Green) */
                @keyframes highlight-pulse {
                    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); border-color: #4ade80; } /* Mint Green/Lime 400 */
                    50% { box-shadow: 0 0 15px 5px rgba(16, 185, 129, 0.9); border-color: #10b981; } /* Mint Green/Emerald 500 */
                    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); border-color: #7c3aed; } /* Return to primary-calm border color */
                }
                .animate-highlight {
                    animation: highlight-pulse 2s ease-out 1;
                }
            `}</style>

			{/* Main Dashboard Container */}
			<div className="flex h-full">

				{/* Mobile Overlay */}
				{isSidebarOpen && (
					<div
						className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
						onClick={toggleSidebar}
					></div>
				)}

				{/* Sidebar / Menu (Responsive: fixed & hidden on mobile, relative on desktop) */}
				<div
					id="sidebar-menu"
					className={`
                        bg-white shadow-2xl flex flex-col z-40 
                        w-64 fixed md:relative h-full transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                        md:translate-x-0 md:shadow-none
                    `}
				>
					<div className="p-6 border-b border-gray-100">
						<Image src="/logo.png" alt='' width="150" height="50" />

						<h1 className="text-2xl font-extrabold text-primary-calm">Mindful Journal</h1>
					</div>

					{/* Navigation Tabs */}
					<nav className="flex-1 p-4 space-y-2">
						<a
							href="#"
							onClick={() => handleNavigation('share')}
							className={`block p-3 rounded-lg text-text-soft hover:bg-gray-50 transition duration-150 ${activeTab === 'share' ? 'tab-active' : ''}`}
						>
							<IconEdit />
							Chia sẻ cảm xúc
						</a>
						<a
							href="#"
							onClick={() => handleNavigation('wellness')}
							className={`block p-3 rounded-lg text-text-soft hover:bg-gray-50 transition duration-150 ${activeTab === 'wellness' ? 'tab-active' : ''}`}
						>
							<IconChart />
							Sức khỏe tinh thần
						</a>
					</nav>
					<div className='pl-2 text-gray font-light text-xs'>
						Sức khỏe thể chất và tinh thần đều quan trọng<br />
						Hãy tìm sự trợ giúp từ chuyên gia khi gặp khó khăn
						<p className="text-red-600 font-medium">LƯU Ý: Ứng dụng này chỉ là công cụ hỗ trợ và không thay thế được sự can thiệp y tế chuyên nghiệp.</p>
					</div>
					{/* Logout Button */}
					<div className="p-4 border-t border-gray-100 text-xs text-center mt-auto">
						<SignedIn>
							<UserButton />
						</SignedIn>
						<p className="mt-4 text-gray-400">&copy; 2025 upmuud - Mindful Journal</p>
					</div>
				</div>

				{/* Main Content Area */}
				<div id="main-content" className="flex-1 overflow-y-auto p-4 md:p-10 bg-secondary-calm/30">

					{/* Mobile Header/Toggle Button (Visible only on screens smaller than md) */}
					<div className="md:hidden flex justify-between items-center mb-6 bg-white p-3 shadow-md rounded-xl sticky top-0 z-20">
						<Image src="/logo.png" alt='' width="100" height="50" />
						<h2 className="text-xl font-bold text-primary-calm">Mindful Journal</h2>
						<button
							onClick={toggleSidebar}
							className="p-2 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition duration-150"
							aria-label="Toggle navigation menu"
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
						</button>
					</div>

					{isLoading ? renderLoading() : renderContent()}
				</div>

			</div>
		</div>
	);
};

export default Dashboard;
