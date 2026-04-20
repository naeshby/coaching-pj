const supabase = require('../config/supabase');

const getDashboardStats = async (req, res, next) => {
  try {
    const [customersRes, leadsRes, wonRes, totalLeadsRes] = await Promise.all([
      supabase.from('customers').select('id', { count: 'exact' }),
      supabase.from('leads').select('id', { count: 'exact' }).not('stage', 'in', '("closed_won","closed_lost")'),
      supabase.from('leads').select('estimated_value').eq('stage', 'closed_won'),
      supabase.from('leads').select('id', { count: 'exact' }),
    ]);

    const pipeline_value = (wonRes.data || []).reduce((s, l) => s + (l.estimated_value || 0), 0);
    const total = totalLeadsRes.count || 0;
    const won = wonRes.data?.length || 0;
    const conversion_rate = total > 0 ? Math.round((won / total) * 100) : 0;

    res.json({
      total_customers: customersRes.count || 0,
      active_leads: leadsRes.count || 0,
      pipeline_value,
      conversion_rate,
    });
  } catch (err) { next(err); }
};

const getPipelineStats = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('leads').select('stage, estimated_value');
    if (error) throw error;
    const stages = ['new','discovery','qualified','proposal','closed_won','closed_lost'];
    const total = (data || []).reduce((s, l) => s + (l.estimated_value || 0), 0);
    const pipeline = stages.map(stage => {
      const leads = data.filter(l => l.stage === stage);
      const value = leads.reduce((s, l) => s + (l.estimated_value || 0), 0);
      return { stage, count: leads.length, value, pct: total > 0 ? Math.round((value / total) * 100) : 0 };
    });
    res.json({ data: pipeline });
  } catch (err) { next(err); }
};

const trackClientEvent = async (req, res, next) => {
  try {
    const { event_name, event_data, session_id } = req.body;
    await supabase.from('analytics_events').insert({ event_name, event_data, session_id, user_agent: req.headers['user-agent'], ip_address: req.ip });
    res.status(202).json({ message: 'Event tracked' });
  } catch (err) { next(err); }
};

const sitemap = (req, res) => {
  const baseUrl = process.env.APP_URL || 'https://coaching-pj.vercel.app';
  const pages = ['', '/features', '/pricing', '/about', '/contact'];
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p => `<url><loc>${baseUrl}${p}</loc><changefreq>weekly</changefreq><priority>${p === '' ? '1.0' : '0.8'}</priority></url>`).join('')}</urlset>`;
  res.type('application/xml').send(xml);
};

module.exports = { getDashboardStats, getPipelineStats, trackClientEvent, sitemap };
