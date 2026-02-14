import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './lib/supabase';
import { Avatar } from './components/Avatar';
import { Modal } from './components/Modal';
import { AuthPage } from './components/AuthPage';
import { ANALYTICS_DATA } from './data/constants';
import { 
  SearchIcon, SendIcon, PlusIcon, UserIcon, SettingsIcon, 
  MessageSquareIcon, LogOutIcon, MenuIcon, SmileIcon, MicIcon, 
  PaperclipIcon, UsersIcon, BookOpenIcon, AnalyticsIcon, MailIcon
} from './components/Icons';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [messageText, setMessageText] = useState('');
  const [sidebarView, setSidebarView] = useState('chats');
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Mock data для примера
  const [chats] = useState([
    { id: 1, name: 'Общий чат', avatar: null, messages: [{id:1, text: 'Привет!', sender: 'other'}] }
  ]);
  
  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [realMessages, setRealMessages] = useState([]);

  // Проверка авторизации
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
        
        // --- ИСПРАВЛЕННАЯ ЧАСТЬ ---
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .maybeSingle(); // Безопасный запрос
        
        setIsAdmin(profile?.is_admin || false);
        
        await loadRealChats(session.user.id);
        // -------------------------
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

  // Адаптивность
  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 768);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSendMessage = () => {
    if(!messageText.trim()) return;
    // Здесь будет логика отправки (пока просто добавляем в state)
    console.log("Send:", messageText);
    setMessageText('');
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#1b1b1c] text-white">Загрузка...</div>;
  if (!isAuthenticated) return <AuthPage onLogin={handleLogin} />;

  return (
    <div className={`flex h-screen w-full ${isLightTheme ? 'bg-gray-50 text-gray-900' : 'bg-[#1b1b1c] text-white'} font-sans overflow-hidden`}>
      
      {/* Left Menu */}
      <div className={`${isMobile ? 'hidden' : 'flex'} w-14 flex-col items-center py-5 justify-between bg-[#2d2d2e]`}>
         <div className="flex flex-col items-center gap-6">
            <div className="font-bold text-lg logo-text">ВС</div>
            <nav className="flex flex-col gap-6 items-center">
               <button onClick={() => setSidebarView('chats')} className={sidebarView === 'chats' ? 'text-blue-500' : 'text-gray-400'}><MessageSquareIcon /></button>
               <button onClick={() => setSidebarView('contacts')} className={sidebarView === 'contacts' ? 'text-blue-500' : 'text-gray-400'}><BookOpenIcon /></button>
               <button onClick={() => setSidebarView('profile')} className={sidebarView === 'profile' ? 'text-blue-500' : 'text-gray-400'}><UserIcon /></button>
               <button onClick={() => setSidebarView('settings')} className={sidebarView === 'settings' ? 'text-blue-500' : 'text-gray-400'}><SettingsIcon /></button>
               {isAdmin && <button onClick={() => setSidebarView('analytics')} className={sidebarView === 'analytics' ? 'text-blue-500' : 'text-gray-400'}><AnalyticsIcon /></button>}
            </nav>
         </div>
         <button onClick={handleLogout} className="text-gray-400 hover:text-red-500"><LogOutIcon /></button>
      </div>

      {/* Sidebar */}
      <div className={`w-72 flex flex-col bg-[#1b1b1c] border-r border-gray-800`}>
        <div className="p-4">
          <h1 className="text-lg font-bold mb-4">Чаты</h1>
          <div className="relative">
             <div className="absolute left-2 top-2 text-gray-500"><SearchIcon /></div>
             <input type="text" placeholder="Поиск..." className="w-full bg-[#2d2d2e] rounded-xl py-2 pl-8 pr-3 text-xs outline-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div key={chat.id} onClick={() => setSelectedChat(chat)} className="flex items-center gap-3 p-3 cursor-pointer hover:bg-[#2d2d2e]">
              <Avatar name={chat.name} src={chat.avatar} />
              <div>
                <h3 className="font-bold text-sm">{chat.name}</h3>
                <p className="text-xs text-gray-400 truncate w-40">{chat.messages[chat.messages.length-1]?.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
         {selectedChat ? (
           <>
              <div className="h-14 px-4 flex items-center justify-between border-b border-gray-800 bg-[#2d2d2e]">
                 <div className="flex items-center gap-3">
                    <Avatar name={selectedChat.name} />
                    <h2 className="font-bold">{selectedChat.name}</h2>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
                 {selectedChat.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                       <div className={`p-3 rounded-2xl ${msg.sender === 'me' ? 'bg-blue-500' : 'bg-[#2d2d2e]'}`}>
                          {msg.text}
                       </div>
                    </div>
                 ))}
              </div>

              <div className="p-3 bg-[#2d2d2e]">
                 <div className="flex items-center gap-2">
                    <button className="text-gray-400"><PaperclipIcon /></button>
                    <input 
                       type="text" 
                       placeholder="Сообщение..." 
                       value={messageText} 
                       onChange={(e) => setMessageText(e.target.value)} 
                       onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
                       className="flex-1 bg-[#1b1b1c] rounded-xl py-2 px-4 text-sm outline-none" 
                    />
                    <button className="text-gray-400"><SmileIcon /></button>
                    <button onClick={handleSendMessage} className="bg-blue-500 p-2 rounded-xl"><SendIcon /></button>
                 </div>
              </div>
           </>
         ) : (
           <div className="flex-1 flex items-center justify-center">
              <h1 className="logo-text text-2xl">Выберите чат</h1>
           </div>
         )}
      </div>
    </div>
  );
};

export default App;