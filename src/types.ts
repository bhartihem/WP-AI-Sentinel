export interface WordPressConfig {
  url: string;
  username: string;
  applicationPassword: string;
}

export interface SiteHealth {
  status: 'healthy' | 'warning' | 'critical';
  issues: string[];
  score: number;
}

export interface Agent {
  id: string;
  name: string;
  role: 'developer' | 'marketer' | 'seo';
  description: string;
  avatar: string;
  color: string;
}

export interface Attachment {
  name: string;
  type: string;
  data: string; // base64
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentId?: string;
  timestamp: number;
  attachments?: Attachment[];
  pendingAction?: {
    tool: string;
    args: any;
    status: 'pending' | 'approved' | 'rejected';
  };
}

export interface AIConfig {
  provider: 'gemini' | 'openai' | 'anthropic' | 'deepseek' | 'qwen';
  model: string;
  apiKey?: string; // Optional override
  keys?: {
    gemini?: string;
    openai?: string;
    anthropic?: string;
    deepseek?: string;
  };
}

export interface MCPServer {
  id: string;
  uid: string;
  name: string;
  url: string;
  description?: string;
  status: 'active' | 'inactive' | 'error';
  createdAt: number;
}

export interface UserFeedback {
  id?: string;
  uid: string;
  email: string;
  content: string;
  category: 'bug' | 'feature' | 'improvement' | 'other';
  createdAt: number;
}

export interface ActivityLog {
  id?: string;
  uid: string;
  agentId: string;
  action: string;
  details?: any;
  timestamp: number;
}

export interface Snapshot {
  id?: string;
  uid: string;
  type: 'post' | 'page' | 'setting' | 'plugin';
  originalId: string | number;
  data: any;
  timestamp: number;
}
