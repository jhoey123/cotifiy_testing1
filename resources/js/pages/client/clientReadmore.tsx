import { Head, Link, router, useForm, usePage, Form } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import ClientNotificationDropdown from './ClientNotificationDropdown';
import ClientNavbar from './ClientNavbar';

interface Announcement {
    id: number;
    title: string;
    category: 'Academic' | 'Event' | 'General' | 'Service';
    posted_by: string;
    posted_by_name: string;
    posted_by_logo?: string | null;
    date: string;
    content: string;
    content_html: string;
    image: string | null;
    is_new?: boolean;
    is_pinned?: boolean;
    event_date: string | null;
    start_time: string | null;
    end_time: string | null;
    location: string | null;
    audience: string | null;
    reading_time?: string | null;
    has_rsvped?: boolean;
    attachments?: { name: string; url: string; size: string }[] | null;
}

interface DiscussionMessage {
    id: number;
    parent_message_id: number | null;
    author: string;
    role: 'Client' | 'Admin' | 'Staff';
    content: string;
    sent_at: string | null;
    is_mine: boolean;
    is_announcement_wide?: boolean;
}

interface ClientReadMoreProps {
    announcement: Announcement;
    messages: DiscussionMessage[];
    relatedAnnouncements?: Announcement[];
    user?: {
        name: string;
        course: string;
        year_level: string;
    };
}

export default function ClientReadMore({
    announcement,
    messages,
    relatedAnnouncements = [],
    user = { name: 'Juan', course: 'BSIT', year_level: '3rd Year' },
}: ClientReadMoreProps) {
    const { auth } = usePage<any>().props;
    const currentUser = auth?.user?.name || user.name;
    const isLoggedIn = auth?.user !== undefined;

    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
    });
    const replyForm = useForm({
        content: '',
        parent_message_id: null as number | null,
    });
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const commentsRef = useRef<HTMLDivElement>(null);

    // Polling for new answers
    useEffect(() => {
        let timeout: number;
        let isMounted = true;
        const reloadMessages = () => {
            router.reload({
                only: ['messages'],
                showProgress: false,
                onFinish: () => {
                    if (isMounted)
                        timeout = window.setTimeout(reloadMessages, 5000);
                },
            });
        };
        timeout = window.setTimeout(reloadMessages, 5000);
        return () => {
            isMounted = false;
            window.clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 400);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleSubmitQuestion = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data.content.trim() || processing) return;
        post(`/client/announcements/${announcement.id}/messages`, {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const handleSubmitReply = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (
            !replyForm.data.content.trim() ||
            replyForm.data.parent_message_id === null ||
            replyForm.processing
        )
            return;

        replyForm.post(`/client/announcements/${announcement.id}/messages`, {
            preserveScroll: true,
            onSuccess: () => {
                replyForm.reset();
                setReplyingTo(null);
            },
        });
    };

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'Academic':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Event':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Service':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const categoryLabel = (cat: string) =>
        cat === 'Event'
            ? 'Events'
            : cat === 'Academic'
              ? 'Academic'
              : cat === 'Service'
                ? 'Services'
                : 'General';

    const formatDate = (date: string) =>
        new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

    const formatTime = (time: string | null) =>
        time
            ? new Date(`1970-01-01T${time}`).toLocaleTimeString(undefined, {
                  hour: 'numeric',
                  minute: '2-digit',
              })
            : '';

    const readingTime = announcement.reading_time || '1 min read';
    const isEvent =
        announcement.category === 'Event' && announcement.event_date;


    return (
        <>
            <Head title={`${announcement.title} | COTIFY`} />

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUpText { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes popIn { 0% { transform: scale(0); } 80% { transform: scale(1.2); } 100% { transform: scale(1); } }
                
                @keyframes move-around-1 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(-35vw, 25vh) rotate(25deg); } 50% { transform: translate(-15vw, 50vh) rotate(-15deg); } 75% { transform: translate(25vw, 30vh) rotate(15deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
                @keyframes move-around-2 { 0% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(30vw, -30vh) rotate(-25deg); } 50% { transform: translate(-40vw, -20vh) rotate(15deg); } 75% { transform: translate(-25vw, 30vh) rotate(-15deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
                @keyframes move-around-3 { 0% { transform: translate(0, 0) rotate(0deg) scale(1); } 33% { transform: translate(35vw, -40vh) rotate(55deg) scale(1.3); } 66% { transform: translate(-30vw, 25vh) rotate(110deg) scale(0.9); } 100% { transform: translate(0, 0) rotate(0deg) scale(1); } }
                @keyframes move-around-4 { 0% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-20vw, 30vh) scale(1.2); } 100% { transform: translate(0, 0) scale(1); } }

                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                .animate-slide-up { animation: slideUpText 0.5s ease-out forwards; }
                .animate-spin-slow { animation: spin-slow 25s linear infinite; }
                .animate-pop-in { animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
                .shape-move-1 { animation: move-around-1 35s ease-in-out infinite; }
                .shape-move-2 { animation: move-around-2 45s ease-in-out infinite; }
                .shape-move-3 { animation: move-around-3 40s ease-in-out infinite; }
                .shape-move-4 { animation: move-around-4 30s ease-in-out infinite; }

                .clip-hexagon { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
                .clip-diamond { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
            `}</style>

            <div className="font-sans text-slate-800 bg-slate-50 antialiased h-screen flex overflow-hidden relative">
                
                {/* MOVING SHAPES BACKGROUND */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute top-[5%] left-[5%] w-[30rem] h-[30rem] bg-blue-500/15 rounded-full blur-3xl shape-move-1"></div>
                    <div className="absolute bottom-[5%] right-[5%] w-[35rem] h-[35rem] bg-purple-500/15 rounded-full blur-3xl shape-move-2"></div>
                    <div className="absolute top-[40%] left-[30%] w-[25rem] h-[25rem] bg-indigo-500/10 rounded-full blur-3xl shape-move-3"></div>
                    <div className="absolute top-[10%] right-[15%] w-64 h-64 bg-blue-600/20 clip-hexagon shape-move-3"></div>
                    <div className="absolute bottom-[15%] left-[10%] w-48 h-48 border-[6px] border-purple-500/30 clip-diamond animate-spin-slow"></div>
                    <div className="absolute top-[45%] right-[10%] w-40 h-40 border-[5px] border-blue-500/25 rotate-12 shape-move-1"></div>
                    <div className="absolute bottom-[20%] right-[40%] w-56 h-56 border-[8px] border-indigo-500/20 clip-hexagon shape-move-2 bg-transparent">
                        <div className="w-full h-full bg-blue-500/10 clip-hexagon scale-[0.95]"></div>
                    </div>
                </div>

                <ClientNavbar activePage="announcements" />

                {/* MAIN CONTENT */}
                <div className="flex-1 flex flex-col bg-transparent overflow-hidden relative w-full z-10">
                    
                    {/* TOP BAR */}
                    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
                        <div className="flex items-center gap-4">

                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">Announcement</h2>
                        </div>
                        
                        <div className="flex items-center gap-3 sm:gap-4">
                            <ClientNotificationDropdown variant="light" />
                        </div>
                    </header>

                    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                        <div className="max-w-[1400px] mx-auto animate-slide-up">
                            
                            {/* BREADCRUMB */}
                            <nav className="mb-6 flex items-center gap-2 text-xs font-bold text-slate-500">
                                <Link href="/client" className="hover:text-ctu-lightblue transition-colors rounded">
                                    Home
                                </Link>
                                <i className="fa-solid fa-chevron-right text-[8px] text-slate-400"></i>
                                <Link href="/client/announcements" className="hover:text-ctu-lightblue transition-colors rounded">
                                    Announcements
                                </Link>
                                <i className="fa-solid fa-chevron-right text-[8px] text-slate-400"></i>
                                <span className="max-w-[200px] truncate text-slate-700">
                                    {announcement.title}
                                </span>
                            </nav>

                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                                {/* LEFT COLUMN: MAIN CONTENT */}
                                <div className="space-y-6 lg:col-span-8">
                                    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
                                        
                                        <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                                            <div>
                                                <div className="mb-3 flex items-center gap-2">
                                                    <span className={`rounded border px-2.5 py-1 text-[12px] font-bold tracking-wider uppercase ${getCategoryColor(announcement.category)}`}>
                                                        {categoryLabel(announcement.category)}
                                                    </span>
                                                    {announcement.is_new && (
                                                        <span className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-white uppercase">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <h1 className="text-3xl leading-tight font-extrabold text-slate-900">
                                                    {announcement.title}
                                                </h1>

                                                <div className="mt-6 flex items-center gap-4">
                                                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 font-bold text-slate-500">
                                                        {announcement.posted_by_logo ? (
                                                            <img src={announcement.posted_by_logo} alt={announcement.posted_by} className="h-full w-full object-cover" />
                                                        ) : (
                                                            announcement.posted_by.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-extrabold text-slate-900">
                                                            {announcement.posted_by}
                                                        </p>
                                                        <p className="mt-0.5 text-sm font-medium text-slate-500">
                                                            {formatDate(announcement.date)} · {readingTime}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 gap-2 sm:flex-col">
                                                <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 sm:flex-none">
                                                    <i className="fa-regular fa-bookmark"></i> Save
                                                </button>
                                                <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 sm:flex-none">
                                                    <i className="fa-solid fa-link"></i> Copy link
                                                </button>
                                            </div>
                                        </div>

                                        <div className="relative mb-8 flex h-64 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 sm:h-80">
                                            {announcement.image ? (
                                                <img src={announcement.image} alt={announcement.title} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center text-slate-400">
                                                    <i className={`mb-3 text-5xl ${
                                                            announcement.category === 'Academic' ? 'fa-solid fa-graduation-cap'
                                                            : announcement.category === 'Event' ? 'fa-regular fa-calendar'
                                                            : announcement.category === 'Service' ? 'fa-solid fa-hand-holding-heart'
                                                            : 'fa-regular fa-newspaper'
                                                        }`}
                                                    ></i>
                                                    <span className="text-sm font-bold tracking-widest uppercase">
                                                        {categoryLabel(announcement.category)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            dangerouslySetInnerHTML={{ __html: announcement.content_html }}
                                            className="mb-10 break-words text-base leading-relaxed text-slate-700 [&_a]:text-blue-600 [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-100 [&_pre]:p-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
                                        />

                                        {announcement.attachments && announcement.attachments.length > 0 && (
                                            <div className="mb-10 rounded-xl border border-slate-200 bg-slate-50 p-5">
                                                <h4 className="mb-4 text-xs font-extrabold tracking-widest text-slate-500 uppercase">
                                                    Attachments
                                                </h4>
                                                <div className="flex flex-wrap gap-3">
                                                    {announcement.attachments.map((file, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={file.url}
                                                            download={file.name}
                                                            className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 transition-all hover:border-blue-400 hover:shadow-sm"
                                                        >
                                                            <i className="fa-solid fa-file-pdf text-rose-500"></i>
                                                            <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600">
                                                                {file.name}
                                                            </span>
                                                            <span className="text-xs text-slate-400">
                                                                {file.size}
                                                            </span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* ANNOUNCEMENT DISCUSSION */}
                                        <div ref={commentsRef} className="mt-10 border-t border-slate-200 pt-8">
                                            <div className="mb-6">
                                                <h3 className="text-xl font-extrabold text-slate-900">
                                                    Comments & discussion
                                                </h3>
                                                <p className="mt-1 text-sm font-medium text-slate-500">
                                                    Ask a question or join the discussion about this announcement.
                                                </p>
                                            </div>

                                            {isLoggedIn ? (
                                                <form onSubmit={handleSubmitQuestion} className="mb-8">
                                                    <textarea
                                                        value={data.content}
                                                        onChange={(e) => setData('content', e.target.value)}
                                                        placeholder="Write a comment..."
                                                        rows={3}
                                                        maxLength={5000}
                                                        className="w-full resize-none rounded-xl border border-slate-300 bg-white p-4 text-base font-medium shadow-sm transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                                    />
                                                    {errors.content && (
                                                        <p className="mt-1.5 text-sm font-bold text-red-600">{errors.content}</p>
                                                    )}
                                                    
                                                    <div className="mt-3 flex items-center justify-between">
                                                        <span className="text-xs font-semibold text-slate-400">
                                                            {data.content.length} / 5000
                                                        </span>
                                                        <div className="flex items-center gap-4">
                                                            {!data.content.trim() && (
                                                                <span className="text-xs font-semibold text-slate-400">
                                                                    Write something first
                                                                </span>
                                                            )}
                                                            <button
                                                                type="submit"
                                                                disabled={!data.content.trim() || processing}
                                                                className={`rounded-lg px-6 py-2.5 text-sm font-bold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                                    !data.content.trim() || processing
                                                                        ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                                                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                                                }`}
                                                            >
                                                                {processing ? 'Posting...' : 'Post comment'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                                                    <p className="mb-3 text-base font-bold text-slate-700">
                                                        Log in to join the discussion.
                                                    </p>
                                                    <Link
                                                        href="/auth/login"
                                                        className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
                                                    >
                                                        Log In
                                                    </Link>
                                                </div>
                                            )}

                                            <div className="space-y-4" aria-live="polite">
                                                {messages.length === 0 ? (
                                                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
                                                        <i className="fa-regular fa-comments mb-3 text-3xl text-slate-400" aria-hidden="true"></i>
                                                        <p className="text-base font-semibold text-slate-600">No comments yet</p>
                                                        <p className="mt-1 text-sm text-slate-500">Be the first to start the discussion.</p>
                                                    </div>
                                                ) : (
                                                    messages.map((message) => {
                                                        const parentMessage = message.parent_message_id
                                                            ? messages.find((candidate) => candidate.id === message.parent_message_id)
                                                            : null;
                                                        let messageDepth = 0;
                                                        let ancestorId = message.parent_message_id;
                                                        const visitedIds = new Set([message.id]);

                                                        while (ancestorId !== null && !visitedIds.has(ancestorId)) {
                                                            const ancestor = messages.find((candidate) => candidate.id === ancestorId);
                                                            if (!ancestor) break;

                                                            visitedIds.add(ancestor.id);
                                                            messageDepth += 1;
                                                            ancestorId = ancestor.parent_message_id;
                                                        }

                                                        return (
                                                        <div
                                                            key={message.id}
                                                            style={parentMessage ? { marginLeft: `${messageDepth * 16}px` } : undefined}
                                                        >
                                                            {parentMessage && (
                                                                <a
                                                                    href={`#comment-${parentMessage.id}`}
                                                                    className="relative mb-1 flex min-h-6 items-center gap-2 pl-4 text-xs text-slate-500 before:absolute before:top-0 before:bottom-0 before:left-0 before:border-l-2 before:border-blue-200 after:absolute after:bottom-1 after:left-0 after:w-3 after:border-t-2 after:border-blue-200 hover:text-blue-700"
                                                                >
                                                                    <i className="fa-solid fa-reply text-blue-400" aria-hidden="true"></i>
                                                                    <span className="shrink-0">Replying to <strong className="font-bold text-slate-700">{parentMessage.author}</strong>:</span>
                                                                    <span className="min-w-0 truncate">{parentMessage.content}</span>
                                                                </a>
                                                            )}
                                                            <article
                                                            id={`comment-${message.id}`}
                                                            className={`scroll-mt-24 rounded-xl border p-5 ${
                                                                message.role !== 'Client'
                                                                    ? 'border-blue-200 bg-blue-50/50'
                                                                    : 'border-slate-200 bg-white'
                                                            }`}
                                                            >
                                                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                                                <span className="text-sm font-bold text-slate-900">
                                                                    {message.author}
                                                                </span>
                                                                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                                                        message.role !== 'Client'
                                                                            ? 'bg-blue-100 text-blue-700'
                                                                            : 'bg-slate-100 text-slate-600'
                                                                    }`}
                                                                >
                                                                    {message.role === 'Admin' ? announcement.posted_by : message.role}
                                                                </span>
                                                                {message.is_announcement_wide && (
                                                                    <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                                                                        All clients
                                                                    </span>
                                                                )}
                                                                {message.is_mine && (
                                                                    <span className="text-xs font-semibold text-slate-400">You</span>
                                                                )}
                                                                {message.sent_at && (
                                                                    <time className="ml-auto text-xs font-medium text-slate-400" dateTime={message.sent_at}>
                                                                        {new Date(message.sent_at).toLocaleString()}
                                                                    </time>
                                                                )}
                                                            </div>
                                                            <p className="text-base leading-relaxed break-words whitespace-pre-wrap text-slate-700">
                                                                {message.content}
                                                            </p>
                                                            
                                                            {isLoggedIn && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        if (replyingTo === message.id) {
                                                                            setReplyingTo(null);
                                                                            replyForm.reset();
                                                                            replyForm.clearErrors();
                                                                            return;
                                                                        }
                                                                        setReplyingTo(message.id);
                                                                        replyForm.setData({
                                                                            content: '',
                                                                            parent_message_id: message.id,
                                                                        });
                                                                        replyForm.clearErrors();
                                                                    }}
                                                                    className="mt-3 rounded text-sm font-bold text-blue-600 transition hover:text-blue-800"
                                                                >
                                                                    {replyingTo === message.id ? 'Cancel reply' : 'Reply'}
                                                                </button>
                                                            )}
                                                            
                                                            {replyingTo === message.id && (
                                                                <form onSubmit={handleSubmitReply} className="mt-4 border-t border-slate-200/60 pt-4">
                                                                    <label className="sr-only" htmlFor={`reply-${message.id}`}>
                                                                        Reply to {message.author}
                                                                    </label>
                                                                    <textarea
                                                                        id={`reply-${message.id}`}
                                                                        value={replyForm.data.content}
                                                                        onChange={(event) => replyForm.setData('content', event.target.value)}
                                                                        placeholder={`Reply to ${message.author}...`}
                                                                        rows={2}
                                                                        maxLength={5000}
                                                                        className="w-full resize-none rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                                                    />
                                                                    {replyForm.errors.content && (
                                                                        <p className="mt-1.5 text-xs font-bold text-red-600">{replyForm.errors.content}</p>
                                                                    )}
                                                                    <div className="mt-3 flex justify-end">
                                                                        <button
                                                                            type="submit"
                                                                            disabled={!replyForm.data.content.trim() || replyForm.processing}
                                                                            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                                                                        >
                                                                            {replyForm.processing ? 'Posting...' : 'Post reply'}
                                                                        </button>
                                                                    </div>
                                                                </form>
                                                            )}
                                                            </article>
                                                        </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                </div>

                                {/* RIGHT COLUMN: SIDEBAR */}
                                <aside className="space-y-6 lg:col-span-4">
                                    
                                    {/* AUDIENCE */}
                                    <div className="animate-slide-up rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                        <h3 className="mb-2 text-xs font-extrabold tracking-widest text-slate-400 uppercase">
                                            For
                                        </h3>
                                        <p className="text-base font-bold text-slate-900">
                                            {announcement.audience || 'All Students'}
                                        </p>
                                    </div>

                                    {/* EVENT BOX */}
                                    {isEvent && (
                                        <div className="animate-slide-up rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                            <h3 className="mb-4 text-xs font-extrabold tracking-widest text-slate-400 uppercase">
                                                Event details
                                            </h3>

                                            <div className="mb-5 flex gap-4">
                                                <div className="h-fit min-w-[56px] shrink-0 rounded-lg border border-slate-200 bg-slate-100 p-2.5 text-center">
                                                    <p className="text-[10px] font-extrabold text-slate-500 uppercase">
                                                        {new Date(`${announcement.event_date}T00:00:00`).toLocaleDateString(undefined, { month: 'short' })}
                                                    </p>
                                                    <p className="mt-0.5 text-xl leading-none font-black text-slate-800">
                                                        {new Date(`${announcement.event_date}T00:00:00`).getDate()}
                                                    </p>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-base font-bold text-slate-900">
                                                        {formatDate(announcement.event_date!)}
                                                    </p>
                                                    <p className="mt-1 text-sm font-medium text-slate-500">
                                                        {formatTime(announcement.start_time)}
                                                        {announcement.end_time && ` – ${formatTime(announcement.end_time)}`}
                                                    </p>
                                                    {announcement.location && (
                                                        <p className="mt-1 text-sm font-medium text-slate-500">
                                                            <i className="fa-solid fa-location-dot mr-1.5"></i>
                                                            {announcement.location}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                disabled
                                                className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-500"
                                            >
                                                RSVP coming soon
                                            </button>
                                        </div>
                                    )}

                                    {/* RELATED ANNOUNCEMENTS */}
                                    <div className="animate-slide-up rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                        <h3 className="mb-4 text-xs font-extrabold tracking-widest text-slate-400 uppercase">
                                            Related
                                        </h3>
                                        {relatedAnnouncements.length === 0 ? (
                                            <p className="text-sm text-slate-500">
                                                No related posts found.
                                            </p>
                                        ) : (
                                            <div className="space-y-3">
                                                {relatedAnnouncements.map((related) => (
                                                    <Link
                                                        key={related.id}
                                                        href={`/client/announcements/${related.id}`}
                                                        className="group block rounded"
                                                    >
                                                        <p className="line-clamp-2 text-sm font-bold text-slate-700 transition-colors group-hover:text-blue-600">
                                                            {related.title}
                                                        </p>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </main>
                </div>

                {/* Back-to-top with aria-label (accessibility) */}
                {showScrollTop && (
                    <button
                        type="button"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="bg-ctu-dark hover:bg-ctu-lightblue animate-fade-in fixed right-6 bottom-6 z-40 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-2xl transition-all hover:-translate-y-1"
                        aria-label="Scroll back to top"
                    >
                        <i className="fa-solid fa-arrow-up"></i>
                    </button>
                )}
            </div>
        </>
    );
}