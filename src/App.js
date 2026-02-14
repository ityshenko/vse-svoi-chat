import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './lib/supabase';
import { Avatar } from './components/Avatar';
import { Modal } from './components/Modal';
import { AuthPage } from './components/AuthPage';
import { ANALYTICS_DATA } from './data/constants';
import { 
  SearchIcon, PaperclipIcon, SendIcon, SmileIcon, PlusIcon, SettingsIcon, 
  MessageSquareIcon, LogOutIcon, UserIcon, ChevronLeftIcon, UsersIcon, 
  MegaphoneIcon, CheckIcon, MoreVerticalIcon, Trash2Icon, UserPlusIcon, 
  MicIcon, XIcon, CameraIcon, InfoIcon, PhoneIcon, VideoIcon, PinIcon, 
  VolumeXIcon, CopyIcon, ReplyIcon, Edit3Icon, ArchiveIcon, CrownIcon, 
  FileIcon, SunIcon, ClockIcon, AnalyticsIcon, CalendarIcon, MenuIcon, 
  LockIcon, ShieldIcon, DatabaseIcon, MailIcon, EyeIcon, DownloadIcon,
  EraserIcon, BookOpenIcon, EyeOffIcon, GlobeIcon, TrendingUpIcon
} from './components/Icons';

// ===== ОСНОВНОЙ КОМПОНЕНТ APP =====
const App = () => {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // --- UI State ---
  const [sidebarView, setSidebarView] = useState('chats'); 
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showEmoji, setShowEmoji] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [activeModal, setActiveModal] = useState(null); 
  const [createType, setCreateType] = useState('group'); 
  const [selectedToInvite, setSelectedToInvite] = useState([]);
  const [newEntity, setNewEntity] = useState({ name: '', isPrivate: false, adminId: 'me', avatar: null });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showChatSidebar, setShowChatSidebar] = useState(true);

  // --- Real Data State (Supabase) ---
  const [realUsers, setRealUsers] = useState([]);
  const [realChats, setRealChats] = useState([]);
  const [realMessages, setRealMessages] = useState([]);
  const [selectedRealChatId, setSelectedRealChatId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // --- Mock Data State (Design) ---
  const [mockChats, setMockChats] = useState([
    { 
      id: 'chat_1', name: "Bessie Cooper", avatar: "https://i.pravatar.cc/150?u=1", unread: 2, type: 'personal', 
      favorite: false, pinned: false, archived: false, muted: false, online: true, members: ['me', 'user1'], 
      admins: ['me'], isPrivate: true, description: 'Личный чат с дизайнером интерфейсов',
      userInfo: { phone: '+7 (999) 111-22-33', email: 'bessie@example.com', bio: 'Дизайнер интерфейсов', lastSeen: '2 часа назад' },
      messages: [{ id: 1, sender: 'user1', senderName: 'Bessie Cooper', text: "Привет! Как дела?", time: "10:00", type: 'text', read: true }]
    },
    { 
      id: 'chat_2', name: "Джон Доу", avatar: "https://i.pravatar.cc/150?u=2", unread: 0, type: 'personal', 
      favorite: true, pinned: true, archived: false, muted: false, online: false, members: ['me', 'user2'], 
      admins: ['me'], isPrivate: true, description: 'Личный чат с backend разработчиком',
      userInfo: { phone: '+7 (999) 222-33-44', email: 'john@example.com', bio: 'Backend разработчик', lastSeen: '5 минут назад' },
      messages: [{ id: 1, sender: 'me', senderName: 'Вы', text: "Привет!", time: "09:30", type: 'text', read: true }]
    },
    { 
      id: 'chat_3', name: "Дизайнеры", avatar: null, unread: 5, type: 'group', 
      favorite: true, pinned: false, archived: false, muted: false, members: ['me', 'user1', 'user2', 'user3', 'user4'], 
      admins: ['me'], isPrivate: false, description: 'Обсуждение рабочих вопросов и совместных проектов',
      messages: [
        { id: 1, sender: 'user3', senderName: 'Мария', text: "Кто видел новый бриф?", time: "13:00", type: 'text', read: true },
        { id: 2, sender: 'user1', senderName: 'Bessie Cooper', text: "Да, посмотрел. Крутой!", time: "13:05", type: 'text', read: true }
      ]
    }
  ]);
  
  const [mockContacts, setMockContacts] = useState([
     { id: 'contact_1', name: "Bessie Cooper", phone: "+7 (999) 111-22-33", avatar: "https://i.pravatar.cc/150?u=1", inApp: true, lastSeen: '2 часа назад' },
     { id: 'contact_2', name: "Джон Доу", phone: "+7 (999) 222-33-44", avatar: "https://i.pravatar.cc/150?u=2", inApp: true, lastSeen: '5 минут назад' },
  ]);

  const [selectedMockChatId, setSelectedMockChatId] = useState('chat_1');
  const selectedMockChat = mockChats.find(c => c.id === selectedMockChatId);

  const [profileData, setProfileData] = useState({
    name: 'Александр', username: 'swift_user', bio: 'Frontend Developer',
    avatar: null, phone: '+7 (999) 123-45-67', email: 'alex@example.com', hidePhoneNumber: false,
    lastSeen: '5 минут назад'
  });

  // --- Refs ---
  const fileInputRef = useRef(null);
  const searchTimeout = useRef(null);
  const chatEndRef = useRef(null);
  const timerRef = useRef(null);

  // ===== EFFECTS =====
  
  // 1. Проверка авторизации
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        
        setProfileData(prev => ({
          ...prev,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Пользователь',
          email: session.user.email || prev.email,
        }));
        
        // Проверка админа
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .maybeSingle(); 

        setIsAdmin(profile?.is_admin || false);
        
        await loadRealChats(session.user.id);
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        await loadRealChats(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setRealChats([]);
        setSelectedRealChatId(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // 2. Адаптивность
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      if (width < 768 && (selectedMockChatId || selectedRealChatId)) setShowSidebar(false);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, [selectedMockChatId, selectedRealChatId]);

  // 3. Загрузка сообщений
  useEffect(() => {
    if (!selectedRealChatId) return;

    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', selectedRealChatId)
        .order('created_at', { ascending: true });
      setRealMessages(data || []);
    };

    loadMessages();

    const channel = supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${selectedRealChatId}` },
        (payload) => setRealMessages(prev => [...prev, payload.new])
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [selectedRealChatId]);

  // ===== FUNCTIONS =====
  
  const loadRealChats = async (userId) => {
    if (!userId) return;
    
    const { data: memberData } = await supabase
      .from('chat_members')
      .select('chat_id')
      .eq('user_id', userId);

    if (!memberData?.length) {
      setRealChats([]);
      return;
    }

    const chatIds = memberData.map(m => m.chat_id);
    
    const { data: chatsData } = await supabase
      .from('chats')
      .select('*')
      .in('id', chatIds)
      .order('last_message_at', { ascending: false });

    const chatsWithDetails = await Promise.all((chatsData || []).map(async (chat) => {
      if (!chat.is_group) {
        const { data: members } = await supabase
          .from('chat_members')
          .select('user_id')
          .eq('chat_id', chat.id)
          .neq('user_id', userId);

        if (members?.length) {
          const { data: otherUser } = await supabase
            .from('profiles')
            .select('id, full_name, username, avatar_url')
            .eq('id', members[0].user_id)
            .single();
          return { ...chat, otherUser };
        }
      }
      return chat;
    }));
    setRealChats(chatsWithDetails);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(true);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      if (!query.trim() || !user) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url, email')
          .or(`full_name.ilike.%${query}%,username.ilike.%${query}%,email.ilike.%${query}%`)
          .neq('id', user.id)
          .limit(20);

        if (error) throw error;
        setSearchResults(data || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  const createPrivateChat = async (otherUserId) => {
    try {
      console.log("Creating chat with:", otherUserId);
      alert('Функция создания чата требует настройки RPC функции в Supabase');
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleSendRealMessage = async () => {
    if (!messageText.trim() || !selectedRealChatId || !user) return;
    await supabase.from('messages').insert([{ chat_id: selectedRealChatId, user_id: user.id, text: messageText }]);
    await supabase.from('chats').update({ last_message_at: new Date().toISOString() }).eq('id', selectedRealChatId);
    setMessageText('');
  };

  const handleSendMockMessage = (content = null, type = 'text', metadata = null) => {
    if (!selectedMockChatId) return;
    let text = content || messageText;
    if (!text && type === 'text') return;
    
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMessage = { id: Date.now(), sender: 'me', senderName: 'Вы', text, time: timeStr, type, metadata, read: true };
    
    setMockChats(prev => prev.map(c => c.id === selectedMockChatId ? { ...c, messages: [...c.messages, newMessage] } : c));
    setMessageText('');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setProfileData(prev => ({
      ...prev,
      name: userData.user_metadata?.name || userData.email?.split('@')[0] || 'Пользователь',
      email: userData.email || prev.email,
    }));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const toggleTheme = () => {
    const newTheme = !isLightTheme;
    setIsLightTheme(newTheme);
    document.documentElement.classList.toggle('dark', !newTheme);
    localStorage.setItem('theme', newTheme ? 'light' : 'dark');
  };

  // ===== RENDER =====
  if (loading) {
    return (
      <div className="flex h-screen w-full bg-[#1b1b1c] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-black text-blue-500 mb-2">Все Свои</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <AuthPage onLogin={handleLogin} />;

  return (
    <div className={`flex h-screen w-full ${isLightTheme ? 'bg-gray-50 text-gray-900' : 'bg-[#1b1b1c]'} font-sans overflow-hidden`}>
      {/* STYLES */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isLightTheme ? '#cbd5e0' : '#4a5568'}; border-radius: 3px; }
        .logo-text { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>

      {/* SIDEBAR MENU */}
      <div className={`${isMobile ? (showSidebar ? 'fixed inset-0 z-40' : 'hidden') : 'flex'} w-14 flex-col items-center py-5 justify-between shrink-0 z-30 ${isLightTheme ? 'bg-white border-r border-gray-200' : 'bg-[#2d2d2e]'}`}>
        <div className="flex flex-col items-center gap-6 w-full">
           <div className="font-bold text-lg italic select-none mb-2 logo-text">ВС</div>
           <nav className="flex flex-col gap-6 items-center">
             <button onClick={() => setActiveModal('create_type')} title="Создать"><PlusIcon className={`w-5 h-5 ${isLightTheme ? 'text-gray-700' : 'text-gray-400'}`} /></button>
             <button onClick={() => setSidebarView('chats')} className={sidebarView === 'chats' ? 'text-blue-500' : ''}><MessageSquareIcon className="w-5 h-5" /></button>
             <button onClick={() => setSidebarView('contacts')} className={sidebarView === 'contacts' ? 'text-blue-500' : ''}><BookOpenIcon className="w-5 h-5" /></button>
             <button onClick={() => setSidebarView('profile')} className={sidebarView === 'profile' ? 'text-blue-500' : ''}><UserIcon className="w-5 h-5" /></button>
             <button onClick={() => setSidebarView('settings')} className={sidebarView === 'settings' ? 'text-blue-500' : ''}><SettingsIcon className="w-5 h-5" /></button>
             <button onClick={() => setSidebarView('search')} className={sidebarView === 'search' ? 'text-blue-500' : ''}><SearchIcon className="w-5 h-5" /></button>
             {isAdmin && <button onClick={() => setSidebarView('analytics')} className={sidebarView === 'analytics' ? 'text-blue-500' : ''}><AnalyticsIcon className="w-5 h-5" /></button>}
           </nav>
        </div>
        <button onClick={handleLogout} title="Выйти"><LogOutIcon className="w-5 h-5 text-gray-400 hover:text-red-400" /></button>
      </div>

      {/* CONTENT PANEL */}
      <div className={`flex-1 flex flex-col ${isLightTheme ? 'bg-gray-50' : 'bg-[#1b1b1c]'} relative`}>
        
        {selectedRealChatId ? (
          // REAL CHAT VIEW
          <>
             <div className="h-14 px-4 flex items-center justify-between border-b border-gray-800 bg-[#2d2d2e]">
                <div className="flex items-center gap-2">
                   {realChats.find(c => c.id === selectedRealChatId)?.otherUser?.full_name || 'Чат'}
                </div>
             </div>
             <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {realMessages.map((msg) => (
                   <div key={msg.id} className={`flex ${msg.user_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-2xl ${msg.user_id === user?.id ? 'bg-blue-500 text-white' : 'bg-[#2d2d2e] text-white'}`}>
                         {msg.text}
                      </div>
                   </div>
                ))}
             </div>
             <div className="p-3 bg-[#2d2d2e]">
                <div className="flex items-center gap-2">
                   <input 
                     type="text" 
                     placeholder="Сообщение..." 
                     value={messageText} 
                     onChange={(e) => setMessageText(e.target.value)} 
                     onKeyDown={(e) => e.key === 'Enter' && handleSendRealMessage()} 
                     className="flex-1 bg-[#1b1b1c] text-white rounded-xl py-2.5 px-4 text-[11px] outline-none"
                   />
                   <button onClick={handleSendRealMessage} className="p-3 bg-blue-500 rounded-xl"><SendIcon /></button>
                </div>
             </div>
          </>
        ) : selectedMockChat ? (
           // MOCK CHAT VIEW (Design)
           <>
             <div className="h-14 px-4 flex items-center justify-between border-b border-gray-800 bg-[#2d2d2e]">
               <div className="flex items-center gap-3">
                 <Avatar src={selectedMockChat.avatar} name={selectedMockChat.name} online={selectedMockChat.online} />
                 <div>
                   <h2 className="font-bold text-xs text-white">{selectedMockChat.name}</h2>
                   <span className="block text-[8px] font-black uppercase text-gray-400">
                     {selectedMockChat.online ? 'в сети' : 'не в сети'}
                   </span>
                 </div>
               </div>
             </div>
             <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
               {selectedMockChat.messages.map((msg) => (
                 <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                   <div className={`max-w-[75%] p-3 rounded-2xl ${msg.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-[#2d2d2e] text-white'}`}>
                     <p className="text-[11px]">{msg.text}</p>
                     <span className="text-[8px] opacity-70 block text-right mt-1">{msg.time}</span>
                   </div>
                 </div>
               ))}
               <div ref={chatEndRef} />
             </div>
             <div className="p-3 bg-[#2d2d2e]">
               <div className="flex items-center gap-2">
                 <input 
                   type="text" 
                   placeholder="Сообщение..." 
                   value={messageText} 
                   onChange={(e) => setMessageText(e.target.value)} 
                   onKeyDown={(e) => e.key === 'Enter' && handleSendMockMessage()} 
                   className="flex-1 bg-[#1b1b1c] text-white rounded-xl py-2.5 px-4 text-[11px] outline-none font-bold" 
                 />
                 <button onClick={() => handleSendMockMessage()} className="p-3 bg-blue-500 rounded-xl"><SendIcon /></button>
               </div>
             </div>
           </>
        ) : (
          // DEFAULT VIEW (Chat List)
          <div className="flex-1 flex flex-col items-center justify-center">
             <h1 className="text-2xl font-black logo-text mb-2">Все Свои</h1>
             <p className="text-sm text-gray-400">Выберите чат или создайте новый</p>
          </div>
        )}
      </div>
    </div>
  );
}
