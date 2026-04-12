import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Moon, Footprints, Brain, Dumbbell, Salad } from 'lucide-react';
import Card from '../ui/Card';

const actions = [
  { id: 1, icon: Droplets, label: 'Drink water', detail: '2 more glasses to go', color: '#3b82f6', progress: 75 },
  { id: 2, icon: Footprints, label: 'Walk 10k steps', detail: '7,842 / 10,000 steps', color: '#22c55e', progress: 78 },
  { id: 3, icon: Brain, label: 'Meditate', detail: '10-min mindfulness session', color: '#8b5cf6', progress: 100, done: true },
  { id: 4, icon: Dumbbell, label: 'Workout', detail: '30-min strength training', color: '#ef4444', progress: 0 },
  { id: 5, icon: Salad, label: 'Log lunch', detail: 'Track your meal & macros', color: '#22c55e', progress: 0 },
  { id: 6, icon: Moon, label: 'Sleep prep', detail: 'Wind down at 10:30 PM', color: '#6366f1', progress: 0 },
];

export default function DailyActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {actions.map((action, i) => (
        <motion.div
          key={action.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
        >
          <Card className="!p-3.5 cursor-pointer group" hover>
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${action.color}15`, color: action.color }}
              >
                <action.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${action.done ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                    {action.label}
                  </p>
                  {action.done && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-green-500/15 text-green-400 rounded-full font-medium">Done</span>
                  )}
                </div>
                <p className="text-xs text-text-muted mt-0.5">{action.detail}</p>
                {action.progress > 0 && !action.done && (
                  <div className="mt-2 h-1 bg-surface-active rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: action.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${action.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
