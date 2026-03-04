import type { ElementType } from "react";
import {
  Circle, Code, Code2, Terminal, Braces, Globe, Layout, Monitor, Smartphone,
  Database, Server, HardDrive, Cloud, CloudCog, Cpu, Brain, Bot, Shield,
  Lock, Key, Network, Wifi, Package, Layers, GitBranch, GitMerge, Star,
  Zap, Rocket, Target, Settings, Wrench, Pen, Palette, Image, Video,
  Mail, MessageSquare, Phone, Users, UserCheck, Award, Briefcase, BookOpen,
  BarChart, BarChart2, LineChart, PieChart, TrendingUp, ShoppingCart,
  CreditCard, Wallet, DollarSign, Search, Filter, Download, Upload,
  Link, ExternalLink, Eye, Lightbulb, Puzzle, Cog, Anchor,
  Activity, Aperture, Compass, Grid, Hash, Infinity, Laptop, Maximize2,
  Minimize2, MousePointer, Radio, Repeat, Share2, Shuffle, Sliders,
  ToggleLeft, Tv, Type, Watch, Workflow, Wand2, Sparkles, Bug, TestTube,
} from "lucide-react";

/**
 * Explicit registry of Lucide icons used for dynamically-named service icons.
 * Using a named import map instead of `import * as Icons` allows tree-shaking
 * to eliminate unused icons and keeps the bundle size under control.
 * Admin can use any key below as the icon field in the database.
 */
export const ICON_REGISTRY: Record<string, ElementType> = {
  Circle, Code, Code2, Terminal, Braces, Globe, Layout, Monitor, Smartphone,
  Database, Server, HardDrive, Cloud, CloudCog, Cpu, Brain, Bot, Shield,
  Lock, Key, Network, Wifi, Package, Layers, GitBranch, GitMerge, Star,
  Zap, Rocket, Target, Settings, Wrench, Pen, Palette, Image, Video,
  Mail, MessageSquare, Phone, Users, UserCheck, Award, Briefcase, BookOpen,
  BarChart, BarChart2, LineChart, PieChart, TrendingUp, ShoppingCart,
  CreditCard, Wallet, DollarSign, Search, Filter, Download, Upload,
  Link, ExternalLink, Eye, Lightbulb, Puzzle, Cog, Anchor,
  Activity, Aperture, Compass, Grid, Hash, Infinity, Laptop, Maximize2,
  Minimize2, MousePointer, Radio, Repeat, Share2, Shuffle, Sliders,
  ToggleLeft, Tv, Type, Watch, Workflow, Wand2, Sparkles, Bug, TestTube,
};
