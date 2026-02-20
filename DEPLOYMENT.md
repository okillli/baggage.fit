# Deployment Instructions

## ⚠️ CRITICAL: Use `build:prerender` for Production

**DO NOT use `npm run build` for deployment.**

### Correct Build Command

```bash
npm run build:prerender
```

This command:
1. Compiles TypeScript (`tsc -b`)
2. Builds the React app (`vite build`)
3. **Prerenders all 45 routes** (including 41 airline pages)
4. **Generates sitemap.xml** with proper priorities

### Why This Matters

**Without prerendering:**
- Search engines see empty React shells
- No SEO meta tags in source
- No JSON-LD structured data
- Sitemap missing
- **Result:** Zero SEO value

**With prerendering:**
- ✅ Full HTML with content
- ✅ SEO meta tags (title, description, og:tags)
- ✅ JSON-LD structured data
- ✅ Sitemap.xml (45 routes, proper priorities)
- ✅ Search engines index actual content

### Verification

After build, check:

```bash
# Verify airline pages exist
ls dist/airlines/  # Should show 41 airline folders

# Verify sitemap exists
ls dist/sitemap.xml  # Should exist (7.8KB)

# Verify SEO meta tags in prerendered HTML
head -40 dist/airlines/ryanair/index.html | grep "<title>"
# Should show: <title>Ryanair Baggage Size & Weight Limits 2026 | baggage.fit</title>
```

### Build Output

Expected output:
```
dist/assets/index-CMVqYHXz.js   186.20 kB │ gzip: 59.01 kB
✓ built in 1.67s
[prerender] Starting — 45 routes
  ✓ / ✓ /about ✓ /data-sources ✓ /airlines
  ✓ /airlines/ryanair ✓ /airlines/easyjet ... (41 airlines)
  ✓ sitemap.xml
[prerender] Done — 45 routes prerendered + sitemap
```

### Deployment Checklist

- [ ] Run `npm run build:prerender` (NOT `npm run build`)
- [ ] Verify `dist/airlines/` contains 41 folders
- [ ] Verify `dist/sitemap.xml` exists
- [ ] Check one airline HTML has SEO meta tags
- [ ] Deploy `dist/` folder to hosting

---

**Last updated:** 2026-02-20  
**Issue:** BF-002 deployment gap discovered via IV&V review
