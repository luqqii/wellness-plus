import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { syncProviderMetrics, syncGoogleFitMetrics } from '../services/wearable.service.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @desc    Sync all connected integrations
 * NOTE: MUST be before /:provider routes to avoid Express matching "sync-all" as a provider param.
 * @route   POST /api/v1/integrations/sync-all
 * @access  Private
 */
router.post('/sync-all', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('integrations');
    if (!user?.integrations?.length) {
      return res.status(400).json({
        success: false,
        message: 'No integrations connected. Please connect at least one source first.'
      });
    }

    // Sync all providers in parallel
    const syncResults = await Promise.allSettled(
      user.integrations.map(i => syncProviderMetrics(req.user._id, i.provider))
    );

    // Atomically update all lastSync timestamps
    const now = new Date();
    await User.updateOne(
      { _id: req.user._id },
      { $set: { 'integrations.$[].lastSync': now } }
    );

    const updatedUser = await User.findById(req.user._id).select('integrations');
    const successCount = syncResults.filter(r => r.status === 'fulfilled').length;

    res.json({
      success: true,
      message: `Synced ${successCount} of ${user.integrations.length} source(s) successfully`,
      integrations: updatedUser.integrations,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Toggle an integration on/off (connect or disconnect)
 * @route   POST /api/v1/integrations/:provider/toggle
 * @access  Private
 */
router.post('/:provider/toggle', protect, async (req, res, next) => {
  try {
    const { provider } = req.params;
    const user = await User.findById(req.user._id).select('integrations');

    const existingIntegration = user.integrations?.find(i => i.provider === provider);

    let updatedUser;
    if (existingIntegration) {
      // Disconnect — use $pull to avoid triggering pre-save hooks on password
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { integrations: { provider } } },
        { new: true, select: 'integrations' }
      );
    } else {
      // Connect — use $push to avoid triggering pre-save hooks on password
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $push: { integrations: { provider, connectedAt: new Date(), lastSync: new Date() } } },
        { new: true, select: 'integrations' }
      );
      // Background initial sync after connecting
      syncProviderMetrics(req.user._id, provider).catch(err =>
        console.error(`[Integrations] Initial sync failed for ${provider}:`, err)
      );
    }

    res.json({
      success: true,
      integrations: updatedUser.integrations,
      action: existingIntegration ? 'disconnected' : 'connected',
      provider,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Sync a specific connected integration
 * @route   POST /api/v1/integrations/:provider/sync
 * @access  Private
 */
router.post('/:provider/sync', protect, async (req, res, next) => {
  try {
    const { provider } = req.params;
    const user = await User.findById(req.user._id).select('integrations');

    const integration = user.integrations?.find(i => i.provider === provider);
    if (!integration) {
      return res.status(400).json({
        success: false,
        message: `${provider} is not connected. Toggle it on first.`
      });
    }

    // Perform sync
    const syncedData = await syncProviderMetrics(req.user._id, provider);

    // Atomically update lastSync
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id, 'integrations.provider': provider },
      { $set: { 'integrations.$.lastSync': new Date() } },
      { new: true, select: 'integrations' }
    );

    res.json({
      success: true,
      message: `${provider} synced successfully`,
      data: syncedData,
      integrations: updatedUser.integrations,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Initialize real OAuth 2.0 flow for a provider
 * @route   GET /api/v1/integrations/auth/:provider
 * @access  Private (uses token in query or cookie for popup auth)
 */
router.get('/auth/:provider', async (req, res, next) => {
  try {
    const { provider } = req.params;
    const token = req.query.token || req.cookies?.token;
    
    if (!token) {
      return res.status(401).send('Unauthorized: Missing token for OAuth popup');
    }

    // In a production environment, you would redirect to the provider's real OAuth URL.
    // Example for Google Fit:
    // const clientId = process.env.GOOGLE_FIT_CLIENT_ID;
    // const redirectUri = `${process.env.BACKEND_URL}/api/v1/integrations/auth/google/callback`;
    // const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/fitness.activity.read`;
    // return res.redirect(authUrl);

    // Development Mode Fallback:
    // Simulate redirecting to provider, then the provider instantly redirects back to our callback
    const simulatedCallbackUrl = `${req.protocol}://${req.get('host')}/api/v1/integrations/auth/${provider}/callback?token=${token}&code=mock_auth_code_123`;
    res.redirect(simulatedCallbackUrl);

  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Handle real OAuth 2.0 callback from provider
 * @route   GET /api/v1/integrations/auth/:provider/callback
 * @access  Public (Callback from Google/Apple/Oura)
 */
router.get('/auth/:provider/callback', async (req, res, next) => {
  try {
    const { provider } = req.params;
    const { code, token } = req.query; // Real OAuth gives 'code', we pass 'token' for identifying the user in dev mode

    // 1. Verify User
    const { default: jwt } = await import('jsonwebtoken');
    const { default: env } = await import('../config/env.js');
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (e) {
      return res.status(401).send('OAuth Failed: Invalid session token');
    }

    // 2. Exchange code for Access Token (Production)
    // const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', { ... });
    // const { access_token, refresh_token } = tokenResponse.data;

    // 3. Save connection to DB
    await User.findByIdAndUpdate(
      decoded.id,
      { $push: { integrations: { provider, connectedAt: new Date(), lastSync: new Date() } } },
      { new: true, select: 'integrations' }
    );

    // Initial background sync
    syncProviderMetrics(decoded.id, provider).catch(err =>
      console.error(`[Integrations] Initial sync failed for ${provider}:`, err)
    );

    // 4. Return HTML that sends postMessage to close popup and update React UI
    res.send(`
      <html>
        <head><title>OAuth Successful</title></head>
        <body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; color: #fff;">
          <div style="text-align: center;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <h2>Successfully connected ${provider}!</h2>
            <p>You can close this window.</p>
          </div>
          <script>
            // Securely notify the parent React app
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_SUCCESS', provider: '${provider}' }, '*');
              // Close popup automatically
              setTimeout(() => window.close(), 1000);
            }
          </script>
        </body>
      </html>
    `);

  } catch (error) {
    res.status(500).send(`OAuth Error: ${error.message}`);
  }
});

export default router;
