import React from 'react';
import {
  Code, User, Cpu, FolderGit2, Briefcase, Star, Mail, Newspaper, Terminal, Settings, Shield,
  FileCode, Globe, Palette, Sparkles, Smartphone, Sliders, Server, Database, Flame, Box, Cloud,
  RefreshCw, GitBranch, Figma, CheckCircle, Github, Linkedin, Twitter, Facebook, Folder, Gamepad2
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  User, Cpu, FolderGit2, Briefcase, Star, Mail, Newspaper, Terminal, Settings, Shield,
  Code, FileCode, Globe, Palette, Sparkles, Smartphone, Sliders, Server, Database, Flame,
  Box, Cloud, RefreshCw, GitBranch, Figma, CheckCircle, Github, Linkedin, Twitter, Facebook, Folder,
  Gamepad2,
};

interface IconHelperProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconHelper: React.FC<IconHelperProps> = ({ name, className = 'w-5 h-5', size }) => {
  const IconComponent = ICON_MAP[name] || Code;
  return <IconComponent className={className} size={size} />;
};
