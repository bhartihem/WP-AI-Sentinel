import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { ActivityLog as ActivityLogType } from '../types';
import { format } from 'date-fns';
import { History, Shield, Zap, TrendingUp, Search, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ActivityLogProps {
  userId: string;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ userId }) => {
  const [logs, setLogs] = useState<ActivityLogType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !db) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'activity_logs'),
      where('uid', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newLogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ActivityLogType[];
      setLogs(newLogs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching logs:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case 'dev-agent': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'marketing-agent': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'seo-agent': return <Search className="w-4 h-4 text-purple-500" />;
      default: return <Zap className="w-4 h-4 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-800">Activity Log (Audit Trail)</h2>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          Last 50 actions
        </span>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No activity recorded yet.</p>
          <p className="text-sm text-gray-400 mt-1">Actions performed by AI agents will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            <AnimatePresence initial={false}>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getAgentIcon(log.agentId)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {log.action}
                        </p>
                        <time className="text-xs text-gray-400 whitespace-nowrap">
                          {format(log.timestamp, 'MMM d, h:mm a')}
                        </time>
                      </div>
                      {log.details && (
                        <div className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100 font-mono overflow-x-auto">
                          {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
        <Shield className="w-5 h-5 text-blue-600 shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold">Security Note</p>
          <p className="mt-1">
            Every action performed by AI agents is logged here for your safety. We never perform destructive actions without your explicit permission.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
