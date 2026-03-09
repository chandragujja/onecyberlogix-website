# OneCyberLogix - CI/CD Architecture (Mermaid Diagrams)

## System Architecture

```mermaid
flowchart TB
    subgraph User["User Devices"]
        Desktop["Desktop<br/>192.168.x.x"]
        Mobile["Mobile<br/>192.168.x.x"]
        iPhone["iPhone<br/>192.168.x.x"]
    end
    
    subgraph Internet["Internet"]
        DNS["DNS + SSL<br/>onecyberlogix.com"]
    end
    
    subgraph Vercel["Vercel Platform"]
        CDN["CDN (Edge)"]
        Build["Build Pipeline"]
    end
    
    subgraph GitHub["GitHub"]
        Repo["Repo<br/>onecyberlogix-website"]
        Actions["GitHub Actions<br/>(Future)"]
    end
    
    User -->|HTTPS| Internet
    Internet -->|Request| DNS
    DNS -->|Forward| Vercel
    Vercel -->|Serve| User
    
    Developer["Developer"] -->|git push| GitHub
    GitHub -->|Auto-trigger| Vercel
```

## CI/CD Pipeline

```mermaid
flowchart LR
    A[Developer<br/>git push] --> B[GitHub<br/>Receive]
    B --> C{Vercel<br/>Auto-Deploy}
    C -->|Install| D[npm install]
    D -->|Build| E[astro build]
    E -->|Optimize| F[Static Files]
    F -->|Deploy| G[CDN Edge]
    G --> H[✅ Live Site]
```

## Development Workflow

```mermaid
flowchart TB
    subgraph Local["Local Development"]
        A[Edit Code<br/>VS Code]
        B[npm run dev<br/>localhost:4321]
        C[Test & Verify]
    end
    
    subgraph Git["GitHub"]
        D[git push origin main]
        E[Pull Request]
        F[Merge to main]
    end
    
    subgraph Deploy["Deployment"]
        G[Vercel<br/>Auto Detect]
        H[Build<br/>Astro]
        I[Deploy to<br/>Edge CDN]
        J[✅ Production<br/>Live]
    end
    
    A --> B --> C
    C --> D --> E
    E -->|Approved| F
    F --> G --> H --> I --> J
```

## Future: Enhanced Pipeline

```mermaid
flowchart TB
    subgraph Developer["Developer"]
        A[Feature Branch]
    end
    
    subgraph CI["CI Pipeline"]
        B[GitHub Actions]
        C[Lint]
        D[Type Check]
        E[Build Test]
        F{All Pass?}
    end
    
    subgraph CD["CD Pipeline"]
        G[Merge to Main]
        H[Vercel Deploy]
        I[Preview URL]
        J[Production]
    end
    
    A --> B
    B --> C --> D --> E --> F
    F -->|No| A
    F -->|Yes| G
    G --> H --> I --> J
```

## Infrastructure Components

```mermaid
flowchart TB
    subgraph Components["Infrastructure"]
        Code["📝 Source Code<br/>GitHub"]
        Hosting["🚀 Hosting<br/>Vercel"]
        CDN["🌐 CDN<br/>Vercel Edge"]
        SSL["🔒 SSL<br/>Let's Encrypt"]
        Domain["🌍 Domain<br/>TBD"]
        DNS["📡 DNS<br/>Cloudflare"]
    end
    
    Code -->|push| Hosting
    Hosting -->|serve via| CDN
    CDN -->|HTTPS| SSL
    SSL -->|resolve| Domain
    Domain -->|lookup| DNS
```

---

## Quick Reference

| Component | Technology | Purpose |
|-----------|------------|---------|
| Source Control | GitHub | Code storage & version |
| Hosting | Vercel | Static site hosting |
| CDN | Vercel Edge | Global content delivery |
| SSL | Vercel (free) | HTTPS encryption |
| Domain | TBD | Custom domain |
| CI/CD | Vercel Auto | Automatic deployments |
| Future: Lint | ESLint | Code quality |
| Future: Test | Vitest | Unit testing |
