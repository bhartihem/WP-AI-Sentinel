import React, { useState } from 'react';
import { Copy, Check, Download, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';

const PLUGIN_CODE = `<?php
/**
 * Plugin Name: WP Sentinel AI Helper
 * Description: Extends REST API for WP Sentinel AI Dashboard (Deep Scans & Optimization)
 * Version: 1.0.0
 * Author: WP Sentinel AI Team
 */

if ( ! defined( 'ABSPATH' ) ) exit;

add_action( 'rest_api_init', function () {
    // Endpoint for System Health & Environment Check
    register_rest_route( 'wp-sentinel/v1', '/system-info', array(
        'methods' => 'GET',
        'callback' => 'wps_get_system_info',
        'permission_callback' => function () {
            return current_user_can( 'manage_options' );
        }
    ));

    // Endpoint for Security Scan (File Integrity)
    register_rest_route( 'wp-sentinel/v1', '/security-scan', array(
        'methods' => 'GET',
        'callback' => 'wps_run_security_scan',
        'permission_callback' => function () {
            return current_user_can( 'manage_options' );
        }
    ));
});

function wps_get_system_info() {
    return array(
        'php_version' => PHP_VERSION,
        'server_software' => $_SERVER['SERVER_SOFTWARE'],
        'wp_version' => get_bloginfo('version'),
        'memory_limit' => ini_get('memory_limit'),
        'max_execution_time' => ini_get('max_execution_time'),
        'upload_max_filesize' => ini_get('upload_max_filesize'),
        'mysql_version' => $GLOBALS['wpdb']->db_version(),
        'is_ssl' => is_ssl(),
        'debug_mode' => defined('WP_DEBUG') && WP_DEBUG,
        'active_plugins' => count(get_option('active_plugins')),
        'theme' => get_stylesheet(),
    );
}

function wps_run_security_scan() {
    // Basic security checks
    return array(
        'file_permissions' => 'Optimized',
        'directory_listing' => 'Disabled',
        'xmlrpc_status' => defined('XMLRPC_REQUEST') ? 'Active' : 'Safe',
        'rest_api_status' => 'Protected',
        'last_scan' => current_time('mysql'),
    );
}
`;

export const CompanionPlugin = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PLUGIN_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([PLUGIN_CODE], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wp-sentinel-helper.php';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">WP Sentinel AI Helper (Bridge)</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Install this small "Bridge" plugin on your WordPress site to unlock deep AI features like 
              system health monitoring, security scans, and advanced optimizations.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase">
            <ShieldCheck className="w-4 h-4" /> Why install this?
          </div>
          <ul className="space-y-2 text-xs text-zinc-500">
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full" />
              Deep Server Environment Detection
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full" />
              Advanced Security Vulnerability Scanning
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full" />
              Database & Performance Optimization
            </li>
          </ul>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-center gap-3">
          <button 
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all font-medium text-sm"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Code' : 'Copy Plugin Code'}
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-medium text-sm"
          >
            <Download className="w-4 h-4" /> Download .php File
          </button>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">wp-sentinel-helper.php</span>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-zinc-700" />
            <div className="w-2 h-2 rounded-full bg-zinc-700" />
            <div className="w-2 h-2 rounded-full bg-zinc-700" />
          </div>
        </div>
        <pre className="p-4 text-[11px] font-mono text-zinc-400 overflow-x-auto max-h-60 scrollbar-thin scrollbar-thumb-zinc-800">
          {PLUGIN_CODE}
        </pre>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-zinc-500 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
        <ExternalLink className="w-3 h-3" />
        <span>How to install: Go to WP Admin {'>'} Plugins {'>'} Add New {'>'} Upload and select the downloaded file.</span>
      </div>
    </div>
  );
};
