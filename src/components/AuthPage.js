{\rtf1\ansi\ansicpg1251\cocoartf2639
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import React, \{ useState \} from 'react';\
import \{ supabase \} from '../lib/supabase';\
import \{ MailIcon, UserPlusIcon, ChevronLeftIcon \} from './Icons';\
\
export const AuthPage = (\{ onLogin \}) => \{\
  const [authStep, setAuthStep] = useState('method');\
  const [email, setEmail] = useState('');\
  const [password, setPassword] = useState('');\
  const [name, setName] = useState('');\
  const [loading, setLoading] = useState(false);\
  const [error, setError] = useState('');\
\
  const handleSignUp = async () => \{\
    if (!email || !password || !name) \{ setError('\uc0\u1047 \u1072 \u1087 \u1086 \u1083 \u1085 \u1080 \u1090 \u1077  \u1074 \u1089 \u1077  \u1087 \u1086 \u1083 \u1103 '); return; \}\
    setLoading(true); setError('');\
    try \{\
      const \{ data, error \} = await supabase.auth.signUp(\{\
        email, password,\
        options: \{ data: \{ name, username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') \} \}\
      \});\
      if (error) throw error;\
      if (data.user) \{\
        alert('\uc0\u1056 \u1077 \u1075 \u1080 \u1089 \u1090 \u1088 \u1072 \u1094 \u1080 \u1103  \u1091 \u1089 \u1087 \u1077 \u1096 \u1085 \u1072 ! \u1058 \u1077 \u1087 \u1077 \u1088 \u1100  \u1074 \u1099  \u1084 \u1086 \u1078 \u1077 \u1090 \u1077  \u1074 \u1086 \u1081 \u1090 \u1080 .');\
        setAuthStep('method');\
      \}\
    \} catch (error) \{ setError(error.message); \} \
    finally \{ setLoading(false); \}\
  \};\
\
  const handleSignIn = async () => \{\
    if (!email || !password) \{ setError('\uc0\u1042 \u1074 \u1077 \u1076 \u1080 \u1090 \u1077  email \u1080  \u1087 \u1072 \u1088 \u1086 \u1083 \u1100 '); return; \}\
    setLoading(true); setError('');\
    try \{\
      const \{ data, error \} = await supabase.auth.signInWithPassword(\{ email, password \});\
      if (error) throw error;\
      if (data.user) onLogin(data.user);\
    \} catch (error) \{ setError(error.message); \} \
    finally \{ setLoading(false); \}\
  \};\
\
  return (\
    <div className="flex h-screen w-full bg-[#1b1b1c]">\
      <style>\{`.logo-text \{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; \}`\}</style>\
      <div className="m-auto w-full max-w-sm p-6">\
        <div className="text-center mb-8">\
          <h1 className="text-3xl font-black logo-text mb-2">\uc0\u1042 \u1089 \u1077  \u1057 \u1074 \u1086 \u1080 </h1>\
          <p className="text-gray-400 text-sm">\uc0\u1054 \u1073 \u1097 \u1072 \u1081 \u1090 \u1077 \u1089 \u1100  \u1089  \u1090 \u1077 \u1084 \u1080 , \u1082 \u1090 \u1086  \u1076 \u1077 \u1081 \u1089 \u1090 \u1074 \u1080 \u1090 \u1077 \u1083 \u1100 \u1085 \u1086  \u1074 \u1072 \u1078 \u1077 \u1085 </p>\
        </div>\
\
        <div className="bg-[#2d2d2e] rounded-[28px] shadow-xl p-8">\
          \{authStep === 'method' && (\
            <>\
              <h2 className="text-lg font-bold mb-6 text-center text-white">\uc0\u1042 \u1093 \u1086 \u1076  \u1074  \u1072 \u1082 \u1082 \u1072 \u1091 \u1085 \u1090 </h2>\
              <div className="space-y-4">\
                <button onClick=\{() => \{ setAuthStep('login'); \}\} className="w-full p-4 bg-[#363637] rounded-xl flex items-center gap-3 hover:bg-[#404041] transition-colors">\
                  <MailIcon className="text-purple-500" />\
                  <div className="text-left"><p className="font-bold text-white">\uc0\u1055 \u1086  \u1101 \u1083 \u1077 \u1082 \u1090 \u1088 \u1086 \u1085 \u1085 \u1086 \u1081  \u1087 \u1086 \u1095 \u1090 \u1077 </p><p className="text-xs text-gray-500">\u1042 \u1086 \u1081 \u1090 \u1080  \u1089  \u1087 \u1072 \u1088 \u1086 \u1083 \u1077 \u1084 </p></div>\
                </button>\
                <button onClick=\{() => \{ setAuthStep('register'); \}\} className="w-full p-4 bg-[#363637] rounded-xl flex items-center gap-3 hover:bg-[#404041] transition-colors">\
                  <UserPlusIcon className="text-blue-500" />\
                  <div className="text-left"><p className="font-bold text-white">\uc0\u1056 \u1077 \u1075 \u1080 \u1089 \u1090 \u1088 \u1072 \u1094 \u1080 \u1103 </p><p className="text-xs text-gray-500">\u1057 \u1086 \u1079 \u1076 \u1072 \u1090 \u1100  \u1085 \u1086 \u1074 \u1099 \u1081  \u1072 \u1082 \u1082 \u1072 \u1091 \u1085 \u1090 </p></div>\
                </button>\
              </div>\
            </>\
          )\}\
\
          \{authStep === 'login' && (\
            <>\
              <button onClick=\{() => \{ setAuthStep('method'); setError(''); \}\} className="mb-6 text-blue-500 flex items-center gap-1"><ChevronLeftIcon /> \uc0\u1053 \u1072 \u1079 \u1072 \u1076 </button>\
              <h2 className="text-lg font-bold mb-6 text-white">\uc0\u1042 \u1093 \u1086 \u1076 </h2>\
              \{error && <div className="mb-4 p-3 bg-red-500/20 rounded-xl"><p className="text-sm text-red-400">\{error\}</p></div>\}\
              <input type="email" placeholder="Email" value=\{email\} onChange=\{(e) => setEmail(e.target.value)\} className="w-full p-4 bg-[#363637] rounded-xl text-lg font-bold text-white outline-none mb-3" />\
              <input type="password" placeholder="\uc0\u1055 \u1072 \u1088 \u1086 \u1083 \u1100 " value=\{password\} onChange=\{(e) => setPassword(e.target.value)\} className="w-full p-4 bg-[#363637] rounded-xl text-lg font-bold text-white outline-none" />\
              <button onClick=\{handleSignIn\} disabled=\{loading\} className="w-full mt-6 bg-blue-500 text-white p-4 rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50">\
                \{loading ? '\uc0\u1042 \u1093 \u1086 \u1076 ...' : '\u1042 \u1086 \u1081 \u1090 \u1080 '\}\
              </button>\
            </>\
          )\}\
\
          \{authStep === 'register' && (\
            <>\
              <button onClick=\{() => \{ setAuthStep('method'); setError(''); \}\} className="mb-6 text-blue-500 flex items-center gap-1"><ChevronLeftIcon /> \uc0\u1053 \u1072 \u1079 \u1072 \u1076 </button>\
              <h2 className="text-lg font-bold mb-6 text-white">\uc0\u1056 \u1077 \u1075 \u1080 \u1089 \u1090 \u1088 \u1072 \u1094 \u1080 \u1103 </h2>\
              \{error && <div className="mb-4 p-3 bg-red-500/20 rounded-xl"><p className="text-sm text-red-400">\{error\}</p></div>\}\
              <input type="text" placeholder="\uc0\u1042 \u1072 \u1096 \u1077  \u1080 \u1084 \u1103 " value=\{name\} onChange=\{(e) => setName(e.target.value)\} className="w-full p-4 bg-[#363637] rounded-xl text-lg font-bold text-white outline-none mb-3" />\
              <input type="email" placeholder="Email" value=\{email\} onChange=\{(e) => setEmail(e.target.value)\} className="w-full p-4 bg-[#363637] rounded-xl text-lg font-bold text-white outline-none mb-3" />\
              <input type="password" placeholder="\uc0\u1055 \u1072 \u1088 \u1086 \u1083 \u1100 " value=\{password\} onChange=\{(e) => setPassword(e.target.value)\} className="w-full p-4 bg-[#363637] rounded-xl text-lg font-bold text-white outline-none" />\
              <button onClick=\{handleSignUp\} disabled=\{loading\} className="w-full mt-6 bg-green-500 text-white p-4 rounded-xl font-bold hover:bg-green-600 disabled:opacity-50">\
                \{loading ? '\uc0\u1056 \u1077 \u1075 \u1080 \u1089 \u1090 \u1088 \u1072 \u1094 \u1080 \u1103 ...' : '\u1057 \u1086 \u1079 \u1076 \u1072 \u1090 \u1100  \u1072 \u1082 \u1082 \u1072 \u1091 \u1085 \u1090 '\}\
              </button>\
            </>\
          )\}\
        </div>\
      </div>\
    </div>\
  );\
\};}