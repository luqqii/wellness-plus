import { replyToConversation, generateCoachingInsight } from '../services/ai.service.js';
import DailyMetric from '../models/DailyMetric.js';
import Conversation from '../models/Conversation.js';

/**
 * @desc    Chat with AI Coach (persists to DB)
 * @route   POST /api/v1/coach/chat
 * @access  Private
 */
export const chatWithCoach = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    // Find or create conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, userId: req.user._id });
    }

    if (!conversation) {
      conversation = new Conversation({
        userId: req.user._id,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        messages: [],
      });
    }

    // Build context history from persisted messages (last 20 for token efficiency)
    const contextHistory = conversation.messages.slice(-20).map(m => ({
      role: m.role,
      content: m.content,
    }));

    // Call AI Service (now returns an object with content and sentiment)
    const aiResult = await replyToConversation(req.user, contextHistory, message);
    const aiResponseText = aiResult.content;
    const userSentiment = aiResult.sentiment || 'neutral';

    // Persist both user message (with sentiment) and AI response
    conversation.messages.push(
      { role: 'user', content: message, sentiment: userSentiment, timestamp: new Date() },
      { role: 'ai', content: aiResponseText, timestamp: new Date() }
    );
    conversation.metadata.totalMessages = conversation.messages.length;
    conversation.metadata.dominantSentiment = userSentiment; // update current dominant sentiment

    await conversation.save();

    res.status(200).json({
      success: true,
      data: {
        conversationId: conversation._id,
        role: 'ai',
        content: aiResponseText,
        sentiment: userSentiment,
        timestamp: new Date()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get conversation history
 * @route   GET /api/v1/coach/conversations
 * @access  Private
 */
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ userId: req.user._id, active: true })
      .select('title metadata createdAt updatedAt')
      .sort('-updatedAt')
      .limit(20);

    res.json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single conversation with all messages
 * @route   GET /api/v1/coach/conversations/:id
 * @access  Private
 */
export const getConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete (soft) a conversation
 * @route   DELETE /api/v1/coach/conversations/:id
 * @access  Private
 */
export const deleteConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { active: false },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get unsolicited insight/nudge
 * @route   GET /api/v1/coach/insight
 * @access  Private
 */
export const getCoachingInsight = async (req, res, next) => {
  try {
    // Get user's today metrics
    let metrics = await DailyMetric.findOne({ 
      userId: req.user._id, 
      date: new Date().setHours(0,0,0,0) 
    });

    if (!metrics) {
      // Mock basic empty metric profile
      metrics = { stressLevel: 5, sleep: { hours: 7 } };
    }

    const insight = await generateCoachingInsight(req.user, metrics, {});

    res.status(200).json({
      success: true,
      data: {
        insight: insight || `Hi ${req.user.name}, how can I help you with your wellness goals today?`
      }
    });
  } catch (error) {
    console.error("Insight Error:", error.message);
    res.status(200).json({
      success: true,
      data: { insight: `Hi ${req.user.name}, how can I help you today?` }
    });
  }
};

