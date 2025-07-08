import React, { useState,useRef,useEffect } from 'react';
import logo from "../assets/logo.png";
import { Globe, ArrowUp, Paperclip } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import Sidebar from './Sidebar';
import { oneDark as codeTheme } from 'react-syntax-highlighter/dist/esm/styles/prism';


function Prompt() {
  const [inputValue, setInputValue] = useState("");
  const [typeMessage, setTypeMessage] = useState("");
  const [prompt, setPrompt] = useState([]);
  const [loading, setLoading] = useState(false);
  const promptEndRef=useRef(null);
  


useEffect(()=>{
  const user=JSON.parse(localStorage.getItem('user'))
  const storedPrompt= localStorage.getItem(`promptHistory_${user.id}}`);
  if(storedPrompt){
    setPrompt(JSON.parse(storedPrompt));
  }
},[])

useEffect(()=>{
  const user=JSON.parse(localStorage.getItem('user'))
  localStorage.setItem(`promptHistroy_${user.id}`,JSON.stringify(prompt));
},[prompt])

useEffect(()=>{
 promptEndRef.current?.scrollIntoView({ behaviour: 'smooth'})
},[prompt,loading])

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setTypeMessage(trimmed);
    setInputValue("");
    setLoading(true);
   console.log(prompt);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:4002/api/v1/deepseekai/prompt",
        { content: trimmed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setPrompt((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      setPrompt((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        { role: "assistant", content: "Something went wrong with the AI response. Please try again later." },
      ]);
    } finally {
      setLoading(false);
      setTypeMessage(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className='flex flex-col h-screen items-center  justify-between flex-1 w-full px-4 pb-4'>
      {/* Greeting */}
      <div className="mt-16 text-center">
        <div className='flex items-center justify-center gap-2'>
          <img src={logo} alt="DeepSeek Logo" className='h-14' />
          <h1 className='text-3xl font-semibold text-white mb-2'>
            Hi, I'm DeepSeek
          </h1>
        </div>
        <p className='text-gray-400 text-base mt-2'>
          💬 How can I help you today?
        </p>
      </div>

      {/* Prompt List */}
      <div className='w-full max-w-4xl flex-1 overflow-y-auto mt-6 mb-4 space-y-4 max-h-[60vh] px-1'>
        {prompt.map((msg, index) => (
          <div
            key={index}
            className={`w-full flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" ? (
              <div className="w-full bg-[#232323] text-white rounded-xl px-4 py-3 text-sm whitespace-pre-wrap">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={codeTheme}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg mt-2"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className="bg-gray-800 px-1 py-0.5 rounded"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="w-[30%] bg-blue-600 text-white rounded-xl px-4 py-3 text-sm whitespace-pre-wrap self-start">
                {msg.content}
              </div>
            )}
          </div>
        ))}
        {loading && typeMessage &&(
          <div className='w-[50%] bg-blue-700 break-words self-end ml-auto text-white rounded-xl px-4 py-2 text-sm whitespace-pre-wrap'>
            {typeMessage}
          </div>
        )}
        {loading && (
          <div className='flex justify-start w-full'>
            {" "}
          <div className='bg-[#232323] text-white px-4 py-2 rounded-xl text-sm animate-pulse'>
            Loading...
          </div>
          </div>
        )}
        <div ref={promptEndRef}></div>
      </div>

      {/* Input Box */}
      <div className='w-full max-w-4xl  mt-auto'>
        <div className='bg-[#2f2f2f] rounded-[2rem] px-6 py-6 shadow-md'>
          <input
            type='text'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Message DeepSeek'
            className='bg-transparent w-full text-white placeholder:gray-400 text-sl outline-none h-10'
          />
          <div className='flex gap-2 mt-2'>
            <button className='flex items-center gap-2 border bg-transparent border-gray-500 text-white text-sm px-2 py-1.5 rounded-full hover:bg-gray-600 transition'>
              DeepThink(R1)
            </button>
            <button className='flex items-center gap-2 bg-transparent border border-gray-500 text-white text-base px-3 py-1.5 rounded-full hover:bg-gray-600 transition'>
              <Globe className='w-4 h-4' /> Search
            </button>
            <div className='flex flex-end items-center gap-2 justify-conetent-end ml-auto'>
              <button className='text-white bg-transparent hover:bg-gray-500 transition rounded-full border-gray-500'>
                <Paperclip className='w-6 h-6' />
              </button>
              <button onClick={handleSend} className='text-white bg-transparent hover:bg-gray-500 transition rounded-full border-gray-500'>
                <ArrowUp className='w-6 h-6 text-white' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Prompt;
