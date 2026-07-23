import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Terminal as TerminalIcon, CornerDownLeft } from 'lucide-react';

interface CommandOutput {
  command: string;
  output: React.ReactNode;
}

export const TerminalApp: React.FC = () => {
  const { personalInfo, skills, projects, openWindow } = usePortfolio();
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: 'welcome',
      output: (
        <div className="space-y-1 text-emerald-400">
          <p className="font-bold">Aether Terminal CLI [Version 2.4.0-release]</p>
          <p className="text-slate-400">(c) Alex Rivera Portfolio Operating System. All rights reserved.</p>
          <p className="text-amber-300 mt-2">Type <span className="underline font-bold">help</span> to list available interactive commands.</p>
        </div>
      )
    }
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    let outputNode: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        outputNode = (
          <div className="space-y-1 text-xs">
            <p className="text-emerald-400 font-bold">Available Commands:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 py-1 text-slate-300">
              <div><span className="text-amber-300 font-bold">about</span> - Print developer bio</div>
              <div><span className="text-amber-300 font-bold">skills</span> - List technical stack</div>
              <div><span className="text-amber-300 font-bold">projects</span> - Display top projects</div>
              <div><span className="text-amber-300 font-bold">contact</span> - Show contact coordinates</div>
              <div><span className="text-amber-300 font-bold">gui &lt;app&gt;</span> - Open GUI app window</div>
              <div><span className="text-amber-300 font-bold">admin</span> - Access admin portal</div>
              <div><span className="text-amber-300 font-bold">whoami</span> - Print current user session</div>
              <div><span className="text-amber-300 font-bold">date</span> - Print current OS timestamp</div>
              <div><span className="text-amber-300 font-bold">clear</span> - Clear terminal buffer</div>
            </div>
          </div>
        );
        break;

      case 'about':
        outputNode = (
          <div className="space-y-1 text-xs text-slate-200">
            <p className="text-blue-400 font-bold">{personalInfo.name} - {personalInfo.title}</p>
            <p>{personalInfo.bio}</p>
            <p className="text-slate-400">Location: {personalInfo.location}</p>
          </div>
        );
        break;

      case 'skills':
        outputNode = (
          <div className="space-y-1 text-xs">
            <p className="text-emerald-400 font-bold">Core Stack:</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {skills.slice(0, 10).map((s) => (
                <span key={s.id} className="px-2 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-800 rounded">
                  {s.name} ({s.proficiency}%)
                </span>
              ))}
            </div>
          </div>
        );
        break;

      case 'projects':
        outputNode = (
          <div className="space-y-2 text-xs">
            <p className="text-purple-400 font-bold">Shipped Projects:</p>
            {projects.slice(0, 4).map((p) => (
              <div key={p.id} className="border-l-2 border-purple-500 pl-2">
                <div className="font-bold text-white">{p.title}</div>
                <div className="text-slate-400 text-[11px]">{p.shortDesc}</div>
              </div>
            ))}
          </div>
        );
        break;

      case 'contact':
        outputNode = (
          <div className="space-y-1 text-xs text-cyan-300">
            <p>Email: {personalInfo.email}</p>
            <p>Phone: {personalInfo.phone}</p>
            <p>Location: {personalInfo.location}</p>
          </div>
        );
        break;

      case 'admin':
        openWindow('admin');
        outputNode = <p className="text-rose-400">Opening Admin Portal Window...</p>;
        break;

      case 'whoami':
        outputNode = <p className="text-slate-300">guest@aether-os-terminal ~ (Visitor)</p>;
        break;

      case 'date':
        outputNode = <p className="text-slate-300">{new Date().toString()}</p>;
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        if (cmd.startsWith('gui ')) {
          const appName = cmd.replace('gui ', '').trim().toLowerCase();
          if (['about', 'skills', 'projects', 'experience', 'contact', 'blog', 'settings', 'admin'].includes(appName)) {
            openWindow(appName as any);
            outputNode = <p className="text-emerald-400">Opened GUI Window for '{appName}'.</p>;
          } else {
            outputNode = <p className="text-rose-400">Unknown GUI app '{appName}'. Try 'gui about' or 'gui projects'.</p>;
          }
        } else {
          outputNode = (
            <p className="text-rose-400">
              Command not recognized: '{cmd}'. Type <span className="underline font-bold">help</span> for commands.
            </p>
          );
        }
        break;
    }

    setHistory((prev) => [...prev, { command: inputVal, output: outputNode }]);
    setInputVal('');
  };

  return (
    <div className="h-full bg-slate-950 text-slate-100 font-mono p-4 flex flex-col justify-between text-xs md:text-sm select-text min-h-[400px]">
      <div className="space-y-4 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="flex items-center gap-2 text-slate-500 pb-2 border-b border-slate-800">
          <TerminalIcon className="w-4 h-4 text-emerald-500" />
          <span>Aether OS Interactive Bash Shell</span>
        </div>

        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-emerald-500 font-bold">visitor@alex-os</span>
              <span className="text-slate-600">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-slate-300">$ {item.command}</span>
            </div>
            <div className="pl-4">{item.output}</div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleCommand} className="flex items-center gap-2 pt-3 border-t border-slate-900 mt-2">
        <span className="text-emerald-500 font-bold shrink-0">visitor@alex-os:~$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type 'help'..."
          className="w-full bg-transparent border-none text-emerald-400 font-mono text-xs md:text-sm focus:outline-none focus:ring-0"
          autoFocus
        />
        <button type="submit" className="text-slate-600 hover:text-emerald-400">
          <CornerDownLeft className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
