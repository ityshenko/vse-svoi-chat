{\rtf1\ansi\ansicpg1251\cocoartf2639
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import React from 'react';\
import \{ XIcon \} from './Icons';\
\
export const Modal = (\{ isOpen, onClose, title, children, isLightTheme \}) => \{\
  if (!isOpen) return null;\
  return (\
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">\
      <div className=\{`$\{isLightTheme ? 'bg-white text-gray-900' : 'bg-[#1b1b1c] text-white'\} w-full max-w-sm rounded-[28px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`\}>\
        <div className=\{`p-4 border-b $\{isLightTheme ? 'border-gray-200' : 'border-gray-800'\} flex items-center justify-between`\}>\
          <h2 className="text-[11px] font-black uppercase tracking-widest">\{title\}</h2>\
          <button onClick=\{onClose\} className=\{`p-1 $\{isLightTheme ? 'text-gray-500 hover:text-gray-900' : 'text-gray-400 hover:text-white'\}`\}><XIcon /></button>\
        </div>\
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar flex flex-col">\{children\}</div>\
      </div>\
    </div>\
  );\
\};}