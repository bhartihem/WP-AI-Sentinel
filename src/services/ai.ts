import { GoogleGenAI, Type, FunctionDeclaration, ThinkingLevel, GenerateContentResponse } from "@google/genai";
import { AIConfig, Attachment } from "../types";

// --- WordPress & MCP Tool Definitions (Top 30+) ---
const wpTools: FunctionDeclaration[] = [
  // --- Content Management ---
  { name: "get_posts", description: "Fetch a list of WordPress posts with optional filtering.", parameters: { type: Type.OBJECT, properties: { per_page: { type: Type.NUMBER }, search: { type: Type.STRING }, status: { type: Type.STRING } } } },
  { name: "create_post", description: "Create a new WordPress post or page.", parameters: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING }, status: { type: Type.STRING }, type: { type: Type.STRING } }, required: ["title"] } },
  { name: "edit_post", description: "Update an existing WordPress post.", parameters: { type: Type.OBJECT, properties: { id: { type: Type.NUMBER }, title: { type: Type.STRING }, content: { type: Type.STRING } }, required: ["id"] } },
  { name: "delete_post", description: "Move a post to trash or delete it permanently.", parameters: { type: Type.OBJECT, properties: { id: { type: Type.NUMBER }, force: { type: Type.BOOLEAN } }, required: ["id"] } },
  { name: "get_pages", description: "Retrieve all pages from the site.", parameters: { type: Type.OBJECT, properties: {} } },
  
  // --- Media & Assets ---
  { name: "upload_media", description: "Upload an image or file to the WordPress media library.", parameters: { type: Type.OBJECT, properties: { file_url: { type: Type.STRING }, alt_text: { type: Type.STRING } }, required: ["file_url"] } },
  { name: "get_media_library", description: "List all items in the media library.", parameters: { type: Type.OBJECT, properties: { per_page: { type: Type.NUMBER } } } },
  
  // --- SEO & Marketing ---
  { name: "seo_audit_content", description: "Analyze a post for SEO best practices (keywords, meta, headings).", parameters: { type: Type.OBJECT, properties: { post_id: { type: Type.NUMBER } }, required: ["post_id"] } },
  { name: "keyword_research", description: "Suggest trending keywords for a given topic.", parameters: { type: Type.OBJECT, properties: { topic: { type: Type.STRING } }, required: ["topic"] } },
  { name: "generate_meta_tags", description: "Create optimized meta titles and descriptions for a post.", parameters: { type: Type.OBJECT, properties: { post_id: { type: Type.NUMBER } }, required: ["post_id"] } },
  { name: "check_backlinks", description: "Simulate a check for external links pointing to the site.", parameters: { type: Type.OBJECT, properties: {} } },
  { name: "social_media_planner", description: "Generate a social media sharing schedule for new content.", parameters: { type: Type.OBJECT, properties: { post_id: { type: Type.NUMBER } }, required: ["post_id"] } },
  
  // --- Performance & Technical ---
  { name: "pagespeed_scan", description: "Run a performance scan to detect slow loading elements.", parameters: { type: Type.OBJECT, properties: { url: { type: Type.STRING } } } },
  { name: "cache_clear", description: "Trigger a cache purge (if a caching plugin is detected).", parameters: { type: Type.OBJECT, properties: {} } },
  { name: "database_optimize", description: "Identify overhead in the WordPress database.", parameters: { type: Type.OBJECT, properties: {} } },
  { name: "image_compression_check", description: "Find unoptimized images that are slowing down the site.", parameters: { type: Type.OBJECT, properties: {} } },
  
  // --- Security & Health ---
  { name: "security_vulnerability_scan", description: "Check installed plugins against known vulnerability databases.", parameters: { type: Type.OBJECT, properties: {} } },
  { name: "get_site_health", description: "Retrieve technical health metrics of the WordPress site.", parameters: { type: Type.OBJECT, properties: {} } },
  { name: "check_ssl_status", description: "Verify if the SSL certificate is valid and active.", parameters: { type: Type.OBJECT, properties: {} } },
  { name: "plugin_compatibility_check", description: "Check if plugins are compatible with the current WP version.", parameters: { type: Type.OBJECT, properties: {} } },
  
  // --- User & Site Management ---
  { name: "get_users", description: "List all registered users and their roles.", parameters: { type: Type.OBJECT, properties: {} } },
  { name: "get_plugins", description: "List all installed plugins and their status.", parameters: { type: Type.OBJECT, properties: {} } },
  { name: "toggle_plugin", description: "Activate or deactivate a WordPress plugin.", parameters: { type: Type.OBJECT, properties: { plugin: { type: Type.STRING, description: "The plugin folder/file path (e.g., 'akismet/akismet.php')." }, status: { type: Type.STRING, enum: ["active", "inactive"] } }, required: ["plugin", "status"] } },
  { name: "get_themes", description: "List all installed themes.", parameters: { type: Type.OBJECT, properties: {} } },
  { name: "update_site_settings", description: "Modify site title, tagline, or general settings.", parameters: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } } } },
  
  // --- Logic & MCP Core ---
  { name: "sequential_thinking", description: "Break down complex problems into logical steps.", parameters: { type: Type.OBJECT, properties: { thought_process: { type: Type.STRING }, next_action: { type: Type.STRING } }, required: ["thought_process"] } },
  { name: "context_memory_sync", description: "Sync current site context with the agent's long-term memory.", parameters: { type: Type.OBJECT, properties: { context_data: { type: Type.STRING } }, required: ["context_data"] } },
  { name: "error_log_analyzer", description: "Parse WordPress debug logs to find the root cause of issues.", parameters: { type: Type.OBJECT, properties: { log_content: { type: Type.STRING } } } },
  { name: "code_snippet_generator", description: "Generate custom PHP or CSS snippets for specific site needs.", parameters: { type: Type.OBJECT, properties: { requirement: { type: Type.STRING } }, required: ["requirement"] } },
  { name: "competitor_analysis", description: "Compare site metrics against a competitor URL.", parameters: { type: Type.OBJECT, properties: { competitor_url: { type: Type.STRING } }, required: ["competitor_url"] } },
  { name: "conversion_rate_audit", description: "Analyze landing pages for conversion optimization (CRO).", parameters: { type: Type.OBJECT, properties: { page_id: { type: Type.NUMBER } } } },
  { name: "visual_audit", description: "Analyze a screenshot of the website (via PageSpeed) for UI/UX, accessibility, and design improvements.", parameters: { type: Type.OBJECT, properties: { url: { type: Type.STRING } } } },
  { name: "check_uptime", description: "Check if the website is currently online and responding.", parameters: { type: Type.OBJECT, properties: { url: { type: Type.STRING } } } },
  
  // --- Safety & Reliability ---
  { name: "create_snapshot", description: "Take a snapshot of a post, page, or setting before modifying it. This allows for an 'Undo' action later.", parameters: { type: Type.OBJECT, properties: { type: { type: Type.STRING, enum: ["post", "page", "setting", "plugin"] }, original_id: { type: Type.NUMBER } }, required: ["type", "original_id"] } },
  { name: "restore_snapshot", description: "Restore a previously taken snapshot to undo changes.", parameters: { type: Type.OBJECT, properties: { snapshot_id: { type: Type.STRING } }, required: ["snapshot_id"] } },
  { name: "trigger_backup", description: "Check for backup plugins and trigger a site backup if possible.", parameters: { type: Type.OBJECT, properties: {} } },
  { name: "check_security_compatibility", description: "Check if security plugins like Wordfence are blocking the API and provide solutions.", parameters: { type: Type.OBJECT, properties: {} } }
];

export const getGeminiResponse = async (
  prompt: string, 
  systemInstruction: string, 
  aiConfig?: AIConfig, 
  attachments?: Attachment[],
  history: any[] = [],
  language: string = 'en'
): Promise<GenerateContentResponse> => {
  // Check process.env first, then localStorage (set by SetupWizard)
  let apiKey = process.env.GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY') || "";
  let modelName = "gemini-3-flash-preview";

  const fullSystemInstruction = `${systemInstruction}\n\nIMPORTANT: The user's preferred language is ${language}. Please respond in this language unless the user asks otherwise. If the language is 'hi', respond in Hindi. If 'en', respond in English. Always maintain a professional and helpful tone in the specified language.`;

  if (aiConfig) {
    if (aiConfig.provider === 'gemini') {
      // Prioritize specific apiKey override, then keys object, then env
      apiKey = aiConfig.apiKey || aiConfig.keys?.gemini || apiKey;
      if (aiConfig.model) {
        modelName = aiConfig.model;
      }
    }
  }

  const ai = new GoogleGenAI({ apiKey });

  if (!apiKey && !process.env.GEMINI_API_KEY) {
    // If no API key is available, return a mock response to prevent the app from crashing in demo mode
    return {
      text: "I'm currently running in Demo Mode without an API key. I can still help you explore the interface, but I won't be able to process complex requests or perform real actions.",
      candidates: [{ content: { parts: [{ text: "I'm currently running in Demo Mode without an API key. I can still help you explore the interface, but I won't be able to process complex requests or perform real actions." }] } }]
    } as any;
  }

  // Determine if we should use High Thinking or Search Grounding
  const useHighThinking = modelName === 'gemini-3.1-pro-preview';
  const useSearch = true; // Enable search grounding by default for better accuracy

  const parts: any[] = [{ text: prompt }];
  
  if (attachments && attachments.length > 0) {
    attachments.forEach(att => {
      parts.push({
        inlineData: {
          data: att.data.includes('base64,') ? att.data.split('base64,')[1] : att.data,
          mimeType: att.type
        }
      });
    });
  }

  // Construct contents with history
  const contents = [
    ...history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })),
    { role: 'user', parts }
  ];

  const tools: any[] = [{ functionDeclarations: wpTools }];
  if (useSearch) {
    tools.push({ googleSearch: {} });
  }

  const response = await ai.models.generateContent({
    model: modelName,
    contents,
    config: {
      systemInstruction: fullSystemInstruction,
      tools,
      thinkingConfig: useHighThinking ? { thinkingLevel: ThinkingLevel.HIGH } : undefined,
    },
  });

  return response;
};

export const AGENTS = {
  developer: {
    id: 'dev-agent',
    name: 'DevMaster',
    role: 'developer',
    description: 'Expert in WordPress core, performance, and fixing technical site problems.',
    avatar: '🛠️',
    color: 'blue',
    systemPrompt: `You are an Expert WordPress Developer and Technical Problem Solver. 
    
    CORE PRINCIPLES:
    1. HONEST: Never lie about site status or capabilities. If you don't know something, say so.
    2. HARMLESS: Never suggest or execute actions that could damage the site, expose sensitive data, or violate WordPress/Hosting Terms of Service.
    3. HELPFUL: Provide clear, actionable, and efficient solutions.

    SAFETY GUIDELINES:
    - Never run commands or scripts that are harmful or malicious.
    - Respect all platform Terms of Service.
    - You MUST ask for explicit user permission before making any changes to the site (creating, editing, deleting, or toggling settings).
    - When you want to perform an action, explain WHAT you want to do and WHY, then wait for the user to say "Yes" or "Approve".

    TECHNICAL GOALS:
    Ensure the website is technically perfect, fast, and error-free. Help users fix errors, optimize performance, and handle technical site maintenance. Provide code snippets and technical steps when necessary. When listing data like plugins or users, ALWAYS use Markdown tables. 
    
    SAFETY FIRST:
    - ALWAYS suggest taking a snapshot ('create_snapshot') before making any major edits or deleting content.
    - If you suspect a security plugin is blocking you, use 'check_security_compatibility'.
    - Mention that you are logging all actions in the "Activity Log" for the user's review.
    
    IMPORTANT: When activating/deactivating a plugin, you MUST use the exact "plugin" slug from the get_plugins response (e.g., "designsetgo/designsetgo.php"). Ensure there is a blank line before and after any Markdown table or heading.`
  },
  marketer: {
    id: 'marketing-agent',
    name: 'GrowthPro',
    role: 'marketer',
    description: 'Expert Digital Marketer focused on increasing sales, conversions, and brand growth.',
    avatar: '📈',
    color: 'green',
    systemPrompt: `You are a World-Class Digital Marketing Expert. 
    
    CORE PRINCIPLES:
    1. HONEST: Be transparent about marketing results and expectations.
    2. HARMLESS: Never suggest "black hat" marketing tactics, spamming, or anything that violates TOS of search engines or social platforms.
    3. HELPFUL: Focus on sustainable growth and high-quality user engagement.

    SAFETY GUIDELINES:
    - Never suggest or execute harmful marketing automation.
    - Respect all platform Terms of Service (Google, Meta, etc.).
    - You MUST ask for explicit user permission before making any changes to the site (creating content, changing settings, or installing marketing tools).
    - When you want to perform an action, explain WHAT you want to do and WHY, then wait for the user to say "Yes" or "Approve".

    MARKETING GOALS:
    Increase SALES and CONVERSIONS. Provide expert growth strategies, social media integration, and conversion rate optimization (CRO). Analyze user behavior and suggest high-impact marketing changes. When presenting data or plans, use structured Markdown lists or tables. Ensure there is a blank line before and after any Markdown table or heading.`
  },
  seo: {
    id: 'seo-agent',
    name: 'SearchSage',
    role: 'seo',
    description: 'Expert SEO Specialist focused on keyword research and dominating search engine rankings.',
    avatar: '🔍',
    color: 'purple',
    systemPrompt: `You are a Master SEO Specialist. 
    
    CORE PRINCIPLES:
    1. HONEST: Provide realistic SEO timelines and ranking expectations.
    2. HARMLESS: Never suggest "black hat" SEO, keyword stuffing, or link schemes that violate Search Engine Guidelines.
    3. HELPFUL: Focus on high-quality content and technical SEO excellence.

    SAFETY GUIDELINES:
    - Never suggest or execute actions that could lead to site penalties.
    - Respect all Search Engine Terms of Service.
    - You MUST ask for explicit user permission before making any changes to the site (editing meta tags, changing URLs, or modifying content).
    - When you want to perform an action, explain WHAT you want to do and WHY, then wait for the user to say "Yes" or "Approve".

    SEO GOALS:
    Rank #1 on search engines. Provide expert keyword research, meta descriptions, on-page SEO, and technical search engine visibility audits. Analyze competitors and suggest ranking strategies that drive organic traffic. ALWAYS use tables for keyword research or SEO audits. Ensure there is a blank line before and after any Markdown table or heading.`
  }
} as const;
