import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Target, Clock, Calendar, Check, X } from 'lucide-react';
import { validateHabit } from '../../utils/validators';

const ICONS = ['💧', '🏃', '🧘', '📖', '🥗', '💊', '🛌', '💻', '☀️', '🌙'];
const COLORS = [
  'var(--c-blue)', 'var(--c-purple)', 'var(--c-teal)', 'var(--c-green)',
  'var(--c-orange)', 'var(--c-yellow)', 'var(--c-red)'
];

export default function HabitForm({ isOpen, onClose, habit, onSave }) {
  const [form, setForm] = useState({
    title: '', description: '',
    icon: '💧', color: 'var(--c-blue)',
    frequency: { type: 'daily', timesPerDay: 1 },
    timeTemplate: 'morning'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (habit && isOpen) {
      setForm(habit);
    } else if (isOpen) {
      setForm({
        title: '', description: '',
        icon: '💧', color: 'var(--c-blue)',
        frequency: { type: 'daily', timesPerDay: 1 },
        timeTemplate: 'morning'
      });
    }
  }, [habit, isOpen]);

  function updateField(field, value) {
    setForm(p => ({ ...p, [field]: value }));
    setErrors(p => ({ ...p, [field]: '' }));
  }

  function handleSubmit() {
    const errs = validateHabit(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSave({
      ...form,
      id: habit?.id || Date.now().toString(),
    });
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={habit ? 'Edit Habit' : 'New Habit'}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>
            {habit ? 'Save Changes' : 'Create Habit'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Preset Selector Placeholder (in a real app we might have smart suggestions) */}

        {/* Basic Info */}
        <Input
          label="Habit Name"
          value={form.title}
          onChange={e => updateField('title', e.target.value)}
          placeholder="e.g. Drink Water"
          icon={Target}
          error={errors.title}
          required
        />

        <Input
          label="Description (optional)"
          value={form.description}
          onChange={e => updateField('description', e.target.value)}
          placeholder="e.g. 2 glasses after waking up"
        />

        {/* Icon & Color */}
        <div style={{ border: '1px solid var(--c-border)', padding: 16, borderRadius: 'var(--r-xl)', background: 'var(--c-bg-surface)' }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text-primary)', marginBottom: 12 }}>Appearance</h4>
          
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, marginBottom: 12 }}>
            {ICONS.map(i => (
              <button
                key={i}
                type="button"
                onClick={() => updateField('icon', i)}
                style={{
                  width: 40, height: 40, borderRadius: 'var(--r-md)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                  background: form.icon === i ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: `1px solid ${form.icon === i ? form.color : 'var(--c-border)'}`,
                  cursor: 'pointer', transition: 'all var(--t-fast)'
                }}
              >
                {i}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => updateField('color', c)}
                style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: c, flexShrink: 0,
                  border: `2px solid ${form.color === c ? 'white' : 'transparent'}`,
                  cursor: 'pointer', transition: 'all var(--t-fast)',
                  boxShadow: form.color === c ? `0 0 10px ${c}` : 'none'
                }}
              />
            ))}
          </div>
        </div>

        {/* Frequency & Time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ border: '1px solid var(--c-border)', padding: 16, borderRadius: 'var(--r-xl)', background: 'var(--c-bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Calendar size={16} color="var(--c-text-secondary)" />
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text-primary)' }}>Frequency</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['daily', 'weekly', 'some_days'].map(f => (
                <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--c-text-secondary)', cursor: 'pointer' }}>
                  <input
                    type="radio" name="freq" checked={form.frequency.type === f}
                    onChange={() => updateField('frequency', { ...form.frequency, type: f })}
                    style={{ accentColor: 'var(--c-blue)' }}
                  />
                  {f === 'daily' ? 'Every day' : f === 'weekly' ? 'Once a week' : 'Specific days'}
                </label>
              ))}
            </div>
          </div>

          <div style={{ border: '1px solid var(--c-border)', padding: 16, borderRadius: 'var(--r-xl)', background: 'var(--c-bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Clock size={16} color="var(--c-text-secondary)" />
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text-primary)' }}>Time of Day</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['any', 'morning', 'afternoon', 'evening'].map(t => (
                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--c-text-secondary)', cursor: 'pointer' }}>
                  <input
                    type="radio" name="time" checked={form.timeTemplate === t}
                    onChange={() => updateField('timeTemplate', t)}
                    style={{ accentColor: 'var(--c-blue)' }}
                  />
                  <span style={{ textTransform: 'capitalize' }}>{t}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Modal>
  );
}
