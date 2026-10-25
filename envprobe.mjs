export default {
  fetch(req, env) {
    return new Response(JSON.stringify({
      hasPassword: !!process.env.VIARA_ADMIN_PASSWORD,
      passwordLen: (process.env.VIARA_ADMIN_PASSWORD || '').length,
      fromEnvObj: !!env.VIARA_ADMIN_PASSWORD,
      legacy: !!env.__LEGACY,
    }));
  },
};