"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabasePublic = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("./env");
exports.supabase = (0, supabase_js_1.createClient)(env_1.env.SUPABASE_URL, env_1.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
    global: { fetch: (...args) => fetch(...args) }
});
exports.supabasePublic = (0, supabase_js_1.createClient)(env_1.env.SUPABASE_URL, env_1.env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
    global: { fetch: (...args) => fetch(...args) }
});
//# sourceMappingURL=supabase.js.map