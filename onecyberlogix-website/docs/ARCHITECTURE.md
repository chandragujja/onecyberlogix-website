# OneCyberLogix Website Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            USER                                              │
│                                                                             │
│    ┌──────────────┐     ┌──────────────┐     ┌──────────────┐            │
│    │   Desktop    │     │   Mobile     │     │   iPhone     │            │
│    │  192.168.x.x │     │192.168.x.x   │     │192.168.x.x   │            │
│    └──────┬───────┘     └──────┬───────┘     └──────┬───────┘            │
│           │                     │                     │                      │
└──────────┼─────────────────────┼─────────────────────┼──────────────────────┘
           │                     │                     │
           └─────────────────────┼─────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INTERNET                                             │
│                                                                             │
│    ┌──────────────────────────────────────────────────────────────────┐     │
│    │                     DNS / SSL (Cloudflare)                      │     │
│    │                  onecyberlogix.com → Vercel                     │     │
│    │                      HTTPS (auto)                                │     │
│    └──────────────────────────────────────────────────────────────────┘     │
│                                    │                                        │
│                                    ▼                                        │
│    ┌──────────────────────────────────────────────────────────────────┐     │
│    │                         VERCEL                                   │     │
│    │  ┌─────────────────────────────────────────────────────────┐    │     │
│    │  │                   CDN (Edge Network)                     │    │     │
│    │  │  • Static files served globally                          │    │     │
│    │  │  • SSL termination                                      │    │     │
│    │  │  • DDoS protection                                      │    │     │
│    │  └─────────────────────────────────────────────────────────┘    │     │
│    │                                                                 │     │
│    │  ┌─────────────────────────────────────────────────────────┐    │     │
│    │  │              Build Pipeline (Auto)                      │    │     │
│    │  │  1. Detect push to main                                │    │     │
│    │  │  2. Install dependencies                               │    │     │
│    │  │  3. Run build (Astro)                                 │    │     │
│    │  │  4. Deploy to edge                                     │    │     │
│    │  └─────────────────────────────────────────────────────────┘    │     │
│    └──────────────────────────────────────────────────────────────────┘     │
│                                    ▲                                        │
│                                    │                                        │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
                                     │ Git Push
                                     │
┌────────────────────────────────────┼────────────────────────────────────────┐
│                         GITHUB    │                                         │
│                                    │                                         │
│    ┌──────────────────────────────────────────────────────────────────┐     │
│    │                 onecyberlogix-website (GitHub Repo)               │     │
│    │                                                                   │     │
│    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │     │
│    │  │   main      │  │  develop   │  │ feature/*   │              │     │
│    │  │  (prod)     │  │  (staging) │  │  (working)  │              │     │
│    │  └─────────────┘  └─────────────┘  └─────────────┘              │     │
│    │                                                                   │     │
│    │  ┌─────────────────────────────────────────────────────────┐    │     │
│    │  │                   GitHub Actions (Future)                │    │     │
│    │  │  • Lint / Code quality                                 │    │     │
│    │  │  • Run tests                                           │    │     │
│    │  │  • Security scans                                      │    │     │
│    │  └─────────────────────────────────────────────────────────┘    │     │
│    │                                                                   │     │
│    └──────────────────────────────────────────────────────────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## CI/CD Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CI/CD PIPELINE                                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  Developer       │
│  (You)           │
│                  │
│  Code changes    │
└────────┬─────────┘
         │
         │ git push
         ▼
┌──────────────────┐
│  GitHub          │
│                  │
│  Receive push    │
│  to main branch │
└────────┬─────────┘
         │
         │ Webhook trigger
         ▼
┌──────────────────┐     ┌──────────────────┐
│  Vercel         │     │  GitHub Actions  │
│  (Build & Deploy)    │  (Future)        │
│                  │     │                  │
│  1. Install     │     │  • Lint         │
│  2. Build       │     │  • Test         │
│  3. Optimize    │     │  • Scan         │
│  4. Deploy      │     │                  │
└────────┬─────────┘     └──────────────────┘
         │
         ▼
┌──────────────────┐
│  Vercel Edge    │
│  Network        │
│                 │
│  • CDN cache    │
│  • SSL cert     │
│  • Global avail │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Users          │
│                 │
│  Live site!     │
│  ✅             │
└──────────────────┘
```

## Development Flow (Current)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     DEVELOPMENT WORKFLOW                                     │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
    │   Local     │      │   GitHub    │      │   Vercel    │
    │  Development│      │   Push      │      │   Deploy    │
    └──────┬──────┘      └──────┬──────┘      └──────┬──────┘
           │                    │                    │
           │ 1. Edit code      │                    │
           │    (VS Code)      │                    │
           │                    │                    │
           │ 2. Test locally    │                    │
           │    npm run dev    │                    │
           │    localhost:4321 │                    │
           │                    │                    │
           │                    │ 3. git push       │
           │                    │    origin main     │
           │                    │                    │
           │                    │                    │ 4. Vercel auto
           │                    │                    │    detects & builds
           │                    │                    │
           │                    │                    │ 5. Deploys to
           │                    │                    │    production
           │                    │                    │
           │                    │                    │    ✅ Live!
           │                    │                    │    https://
           │                    │                    │    onecyberlogix.com
           │                    │                    │
```

## Future: Enhanced CI/CD (With GitHub Actions)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ENHANCED CI/CD (RECOMMENDED)                             │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │   Push to   │
    │  feature/*  │
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │  GitHub     │
    │  Actions    │
    │             │
    │  ○ Lint     │
    │  ○ Type     │
    │  ○ Test     │
    │  ○ Build    │
    └──────┬──────┘
           │
           ├───────────────────┐
           │                   │
           ▼                   ▼
    ┌─────────────┐     ┌─────────────┐
    │   Failed    │     │   Passed    │
    │             │     │             │
    │  Fix code   │     │  PR Review │
    └──────┬──────┘     └──────┬──────┘
           │                   │
           │                   ▼
           │           ┌─────────────┐
           │           │   Merge to  │
           │           │    main     │
           │           └──────┬──────┘
           │                  │
           │                  ▼
           │          ┌─────────────┐
           │          │   Vercel    │
           │          │   Deploy    │
           │          └──────┬──────┘
           │                  │
           │                  ▼
           │          ┌─────────────┐
           │          │  ✅ Live!   │
           │          └─────────────┘
           │
           └─ No deploy ─┘
```

## Infrastructure Summary

| Component | Service | Status |
|-----------|---------|--------|
| Source Code | GitHub | ✅ |
| Hosting | Vercel | ✅ (pending) |
| CDN | Vercel Edge | ✅ (pending) |
| SSL | Vercel (Let's Encrypt) | ✅ (pending) |
| Domain | onecyberlogix.com | ✅ Cloudflare |
| CI/CD | Vercel Auto-Deploy | ✅ |
| Linting | GitHub Actions | 🔲 (optional) |
| Testing | GitHub Actions | 🔲 (optional) |

## Next Steps

### 1. Connect Domain to Vercel (with Cloudflare)

**In Vercel:**
1. Go to Project → Settings → Domains
2. Enter `onecyberlogix.com`
3. Vercel will give you a verification token

**In Cloudflare:**
1. Go to DNS settings for onecyberlogix.com
2. Add a CNAME record:
   - Type: CNAME
   - Name: @ (or your domain)
   - Value: `cname.vercel-dns.com`
3. Or add A record for apex:
   - Type: A
   - Name: @
   - Value: `76.76.21.21`

**For HTTPS:**
- Option A (Vercel handles): Keep Cloudflare DNS only, let Vercel handle SSL
- Option B (Cloudflare full): Set Cloudflare SSL to "Full" mode

### 2. Test
