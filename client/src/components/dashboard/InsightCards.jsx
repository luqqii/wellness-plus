import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Award, BarChart3 } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { SAMPLE_INSIGHTS } from '../../utils/constants';

const iconMap = {
  prediction: AlertTriangle,
  suggestion: TrendingUp,
  achievement: Award,
  forecast: BarChart3,
};

const variantMap = {
  prediction: 'warning',
  suggestion: 'primary',
  achievement: 'success',
  forecast: 'secondary',
};

export default function InsightCards() {
  return (
    <div className="space-y-3">
      {SAMPLE_INSIGHTS.map((insight, i) => {
        const Icon = iconMap[insight.type] || TrendingUp;
        const variant = variantMap[insight.type] || 'default';

        return (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <Card className="!p-4 cursor-pointer group" hover>
              <div className="flex items-start gap-3">
                <div className="text-xl flex-shrink-0 mt-0.5">{insight.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-text-primary">{insight.title}</span>
                    <Badge variant={variant} size="sm">{insight.type}</Badge>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{insight.content}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
