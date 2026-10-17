export const REPO = "https://github.com/uwaserver/uwas";
export const VERSION = "v0.11.28";
export const INSTALL =
  "curl -fsSL https://raw.githubusercontent.com/uwaserver/uwas/main/install.sh | sh";
export const SOURCE_REVISION = "5e4a93a3d8629d43950d1a9940e20e38c010ca4e";

export const configurations = {
  "Static site": `global:
  acme:
    email: hello@example.com

domains:
  - host: example.com
    type: static
    root: /var/www/example.com
    ssl:
      mode: auto`,
  WordPress: `domains:
  - host: blog.example.com
    type: php
    root: /var/www/wordpress
    ssl:
      mode: auto
    php:
      fpm_address: "unix:/var/run/php/php8.3-fpm.sock"
    htaccess:
      mode: import
    cache:
      enabled: true
      ttl: 1800`,
  "Reverse proxy": `domains:
  - host: api.example.com
    type: proxy
    ssl:
      mode: auto
    proxy:
      algorithm: least_conn
      websocket: true
      upstreams:
        - address: "http://127.0.0.1:3000"
        - address: "http://127.0.0.1:3001"
      health_check:
        path: /health
        interval: 10s`,
  Application: `# /etc/uwas/apps.d/my-api.yaml
name: my-api
runtime: node
work_dir: /var/lib/uwas/apps/my-api
port: 0
env:
  NODE_ENV: production

# Route in uwas.yaml
domains:
  - host: api.example.com
    type: proxy
    ssl:
      mode: auto
    proxy:
      upstreams:
        - address: "apps://my-api"`,
};

export const features = [
  {
    id: "https",
    icon: "lock",
    group: "Web server",
    title: "HTTPS, handled.",
    description:
      "Automatic Let’s Encrypt certificates and renewals. HTTP/2 and HTTP/3 over QUIC, with automatic HTTPS redirects.",
    tags: ["ACME", "HTTP/3", "SNI"],
    doc: "https",
  },
  {
    id: "cache",
    icon: "zap",
    group: "Web server",
    title: "A cache with depth.",
    description:
      "L1 memory and L2 disk caching, stale-while-revalidate, grace mode, tag-based purge and ESI fragment assembly.",
    tags: ["Memory + disk", "ESI", "Tag purge"],
    doc: "caching",
  },
  {
    id: "proxy",
    icon: "network",
    group: "Web server",
    title: "Traffic, intelligently routed.",
    description:
      "Six balancing algorithms, weighted upstreams, health checks, sticky sessions, canary routing and circuit breakers.",
    tags: ["Load balancing", "WebSocket", "gRPC"],
    doc: "reverse-proxy",
  },
  {
    id: "php",
    icon: "code",
    group: "Web server",
    title: "Your PHP has a home.",
    description:
      "FastCGI connection pooling, per-domain PHP versions and an Apache-compatible rewrite engine for .htaccess imports.",
    tags: ["PHP-FPM", "WordPress", ".htaccess"],
    doc: "wordpress",
  },
  {
    id: "apps",
    icon: "box",
    group: "Platform",
    title: "From commit to running app.",
    description:
      "Deploy Node.js, Python, Ruby, Go, custom and Docker apps. Build, restart and health-check from one workflow.",
    tags: ["Git deploy", "Health checks", "Docker"],
    doc: "applications",
  },
  {
    id: "panel",
    icon: "layout",
    group: "Platform",
    title: "See the whole picture.",
    description:
      "An integrated dashboard for domains, apps, files, databases, DNS, backups and terminal access. No separate panel to install.",
    tags: ["42 pages", "REST API", "Dark + light"],
    doc: "dashboard",
  },
  {
    id: "security",
    icon: "shield",
    group: "Security",
    title: "Protection in the request path.",
    description:
      "Per-domain WAF, rate limits, IP access rules and bandwidth caps, plus connection-level auto-block configuration.",
    tags: ["WAF", "IP ACL", "Rate limits"],
    doc: "security",
  },
  {
    id: "users",
    icon: "users",
    group: "Security",
    title: "The right level of access.",
    description:
      "Admin, reseller and user roles, TOTP two-factor authentication, audit logs and per-domain SFTP confinement.",
    tags: ["RBAC", "2FA", "SFTP"],
    doc: "security",
  },
  {
    id: "mcp",
    icon: "sparkles",
    group: "Operations",
    title: "An interface for your AI.",
    description:
      "A built-in Model Context Protocol server lets compatible AI clients inspect and manage your server through structured tools.",
    tags: ["MCP", "Structured tools", "AI-native"],
    doc: "mcp",
  },
  {
    id: "monitoring",
    icon: "activity",
    group: "Operations",
    title: "Know what’s happening.",
    description:
      "Prometheus metrics, latency percentiles, domain analytics, uptime checks, signed webhooks and operator-facing alerts.",
    tags: ["Prometheus", "Analytics", "Alerts"],
    doc: "observability",
  },
  {
    id: "backups",
    icon: "database",
    group: "Operations",
    title: "Have a way back.",
    description:
      "Schedule backups to local storage, S3 or SFTP. Clone a site for staging or migrate files and databases over SSH.",
    tags: ["S3 + SFTP", "Staging", "Migration"],
    doc: "backups",
  },
  {
    id: "config",
    icon: "terminal",
    group: "Platform",
    title: "Configuration you can read.",
    description:
      "One YAML entry point, optional per-domain files, CLI validation and SIGHUP configuration reloads.",
    tags: ["YAML", "CLI", "Hot reload"],
    doc: "configuration",
  },
];

export type DocSection = {
  title: string;
  body: string;
  code?: string;
  note?: string;
};
export type Doc = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  source: string;
  sections: DocSection[];
};
export const docs: Doc[] = [
  {
    slug: "getting-started",
    title: "Getting started",
    category: "Start here",
    summary: "Go from a fresh server to your first domain with UWAS.",
    source: "README.md",
    sections: [
      {
        title: "Install UWAS",
        body: "The upstream installer supports Linux and macOS and downloads a release binary. Read the script before executing it, or download a matching asset from GitHub Releases. PHP and Docker are optional dependencies for their respective workloads.",
        code: INSTALL,
      },
      {
        title: "Start the server",
        body: "Running UWAS without a configuration starts the first-run setup. To use an existing file, pass it explicitly. Production hosting with the systemd installer is a Linux workflow.",
        code: "uwas\n\n# Use an existing configuration\nuwas serve -c uwas.yaml",
      },
      {
        title: "Add your first domain",
        body: "Point the domain’s DNS to your server, make ports 80 and 443 reachable, and set a real ACME email. Replace the sample domain and web root with your own values.",
        code: configurations["Static site"],
        note: "Port 443/UDP must also be reachable to use HTTP/3. Certificate issuance depends on valid DNS and reachable ACME challenges.",
      },
      {
        title: "Validate and run",
        body: "Check the configuration, then start with that file. After subsequent edits, reload the running server.",
        code: "uwas config validate\nuwas serve -c uwas.yaml\n\n# After changing the running configuration\nuwas reload",
      },
      {
        title: "Open the dashboard",
        body: "The admin listener defaults to loopback at 127.0.0.1:9443. Use an SSH tunnel to access it from your workstation, then open the dashboard URL locally.",
        code: "ssh -L 9443:127.0.0.1:9443 user@your-server\n\n# Open in your browser:\n# http://127.0.0.1:9443/_uwas/dashboard/",
      },
    ],
  },
  {
    slug: "installation",
    title: "Installation & updates",
    category: "Start here",
    summary: "Choose a release binary, the installer, or a source build.",
    source: "README.md",
    sections: [
      {
        title: "Install a release",
        body: "Use the upstream Linux/macOS installer or select the platform and architecture from GitHub Releases. The web server itself is one Go binary; serving PHP requires PHP-FPM, and container workloads require Docker.",
        code: INSTALL,
      },
      {
        title: "Build from source",
        body: "The current upstream README requires Go 1.26.5 or newer. Build with the project Makefile.",
        code: "git clone https://github.com/uwaserver/uwas.git\ncd uwas\nmake build\n\n# Binary: bin/uwas",
      },
      {
        title: "Run as a Linux service",
        body: "Install the systemd service and start it. Review the generated unit and the configuration paths for your environment.",
        code: "sudo uwas install\nsudo systemctl start uwas\nuwas status\nuwas doctor",
      },
      {
        title: "Update intentionally",
        body: "Read UPGRADING.md and the release notes before updating, particularly on multi-user servers. Back up your configuration first. The update script downloads the latest binary and restarts the service.",
        code: "uwas backup\ncurl -fsSL https://raw.githubusercontent.com/uwaserver/uwas/main/update.sh | sh",
      },
    ],
  },
  {
    slug: "configuration",
    title: "Configuration",
    category: "Core concepts",
    summary:
      "A readable YAML entry point for domains and global server settings.",
    source: "uwas.example.yaml",
    sections: [
      {
        title: "One entry point",
        body: "Global settings control listeners, ACME, logging and shared caches. Domain entries describe how individual hosts are served. The complete upstream example is the authoritative field reference.",
        code: configurations["Static site"],
      },
      {
        title: "Split domains into files",
        body: "Use domains_dir to load domain YAML files from a directory. Each per-domain file contains a domain object directly, without a domains wrapper.",
        code: "# uwas.yaml\ndomains_dir: domains.d\n\n# domains.d/example.com.yaml\nhost: example.com\ntype: static\nroot: /var/www/example.com\nssl:\n  mode: auto",
      },
      {
        title: "Environment values and validation",
        body: "The upstream example uses environment substitutions for sensitive values. Supply those variables in the server environment, avoid committing secrets, and validate before reloading.",
        code: 'global:\n  admin:\n    enabled: true\n    listen: "127.0.0.1:9443"\n    api_key: "${UWAS_ADMIN_KEY}"',
      },
      {
        title: "Apply changes",
        body: "The CLI can validate and reload configuration. A SIGHUP rebuilds per-domain request handling chains. Back up the working configuration before substantial changes.",
        code: "uwas config validate\nuwas reload",
      },
    ],
  },
  {
    slug: "https",
    title: "Automatic HTTPS & HTTP/3",
    category: "Core concepts",
    summary: "Certificate automation and modern transports in the server.",
    source: "uwas.example.yaml",
    sections: [
      {
        title: "Let the server manage certificates",
        body: "Set ssl.mode to auto on the domain and configure your ACME contact address. UWAS handles certificate acquisition, renewal and the HTTP-to-HTTPS redirect. DNS and network reachability remain prerequisites.",
        code: configurations["Static site"],
      },
      {
        title: "Enable HTTP/3",
        body: "QUIC uses UDP on the HTTPS port. UWAS advertises HTTP/3 with Alt-Svc. Open UDP 443 alongside the standard TCP HTTP and HTTPS listeners.",
        code: 'global:\n  http_listen: ":80"\n  https_listen: ":443"\n  http3: true',
      },
      {
        title: "Inspect certificates",
        body: "Use the CLI certificate list and dashboard to inspect certificate state. For advanced ACME and DNS provider configuration, consult the full upstream configuration.",
        code: "uwas cert list\nuwas doctor",
      },
    ],
  },
  {
    slug: "caching",
    title: "Caching",
    category: "Core concepts",
    summary: "Memory, disk, stale responses and precise invalidation.",
    source: "uwas.example.yaml",
    sections: [
      {
        title: "Two cache layers",
        body: "UWAS combines an in-memory L1 response cache with an L2 disk cache. Enable caching globally, then choose per-domain behavior. Static file byte caching is a separate global setting.",
        code: "global:\n  cache:\n    enabled: true\n    memory_limit: 512MB\n    disk_path: /var/cache/uwas\n    disk_limit: 10GB\n    default_ttl: 3600\n    grace_ttl: 86400\n    stale_while_revalidate: true",
      },
      {
        title: "Control cacheability per domain",
        body: "Set a time-to-live appropriate to your content. Dynamic and authenticated routes need deliberate bypass rules; review the full upstream configuration before enabling a cache for an application.",
        code: "domains:\n  - host: example.com\n    type: static\n    root: /var/www/html\n    cache:\n      enabled: true\n      ttl: 1800",
      },
      {
        title: "Freshness and invalidation",
        body: "Grace mode and stale-while-revalidate can serve an existing response during refresh. Tag-based purge invalidates related content, and ESI assembles fragments. Inspect stats and purge with the CLI or dashboard.",
        code: "uwas cache stats\nuwas cache purge",
      },
    ],
  },
  {
    slug: "reverse-proxy",
    title: "Reverse proxy & balancing",
    category: "Deploy workloads",
    summary: "Route to upstream apps with health-aware load balancing.",
    source: "README.md",
    sections: [
      {
        title: "Route to an upstream pool",
        body: "A proxy domain forwards traffic to one or more upstreams. This example enables WebSocket forwarding and periodic health checks.",
        code: configurations["Reverse proxy"],
      },
      {
        title: "Choose a balancing strategy",
        body: "UWAS supports round-robin, least connections, IP hash, URI hash, random and sticky routing. The documented YAML spelling for least connections is least_conn. Weights, circuit breakers and canary routing let you tune distribution and failures.",
      },
      {
        title: "Proxy a managed app",
        body: "Applications managed by UWAS can be addressed through apps:// names. Keep the application definition in apps.d and the public host route in the domain configuration.",
        code: configurations["Application"],
      },
    ],
  },
  {
    slug: "wordpress",
    title: "WordPress & PHP",
    category: "Deploy workloads",
    summary: "Serve PHP-FPM and import familiar rewrite rules.",
    source: "README.md",
    sections: [
      {
        title: "Connect PHP-FPM",
        body: "UWAS provides the FastCGI client and connection pooling; PHP-FPM still executes PHP. Install a supported PHP runtime and point fpm_address at its actual socket or TCP listener.",
        code: configurations["WordPress"],
      },
      {
        title: "Bring your rewrite rules",
        body: "Set htaccess.mode to import to use the Apache-compatible rewrite engine. Review application-specific directives during migration: rewrite compatibility does not imply support for every Apache module.",
      },
      {
        title: "Manage from the dashboard",
        body: "The WordPress page includes install and management workflows, plugin updates, debug mode and error logs. Per-domain PHP settings let sites use different installed PHP versions. Verify each site’s extensions and database connectivity.",
      },
    ],
  },
  {
    slug: "applications",
    title: "Applications & Git deploy",
    category: "Deploy workloads",
    summary: "Run native or container apps, and deploy from a Git repository.",
    source: "README.md",
    sections: [
      {
        title: "Describe the app",
        body: "Create apps from the Applications page or as files under /etc/uwas/apps.d. Native runtimes include Node.js, Python, Ruby and Go; Docker and custom processes are supported too.",
        code: configurations["Application"],
      },
      {
        title: "Connect Git",
        body: "Persist deploy settings in the app definition or use the dashboard. When build_cmd is empty, UWAS attempts build detection. A configured health_path checks for an HTTP 2xx/3xx response after startup.",
        code: "deploy:\n  git_url: https://github.com/your-org/your-app.git\n  git_branch: main\n  health_path: /health\n  branch_filter: main",
      },
      {
        title: "Private repos and deploy events",
        body: "Private repositories support HTTPS tokens or SSH deploy keys. Configure a webhook secret and use the app webhook endpoint from the upstream guide. Live deploy logs stream to the dashboard. Failed deployments can reset an existing repository to its previous commit; this does not roll back external databases.",
      },
    ],
  },
  {
    slug: "dashboard",
    title: "Dashboard & administration",
    category: "Operate",
    summary: "A hosting control panel included in the binary.",
    source: "README.md",
    sections: [
      {
        title: "Reach the admin listener",
        body: "Keep the default admin bind address on loopback and use an SSH tunnel or a properly protected access layer. The public website is independent of this administration interface.",
        code: "ssh -L 9443:127.0.0.1:9443 user@your-server\n\n# http://127.0.0.1:9443/_uwas/dashboard/",
      },
      {
        title: "Work across the platform",
        body: "The dashboard contains 42 pages covering domains, applications, PHP, DNS, files, database management, backups, metrics, logs, terminal access and settings. Its own dark and light themes are built in.",
      },
      {
        title: "Choose an interface",
        body: "Use the dashboard for visual workflows, the CLI for routine commands, the REST admin API for integrations, or MCP for compatible AI clients. They expose the same server platform through different interfaces.",
        code: "uwas status\nuwas domain list\nuwas php list\nuwas user list\nuwas doctor",
      },
    ],
  },
  {
    slug: "security",
    title: "Security & access",
    category: "Operate",
    summary:
      "Configure request protections and administrative access for your deployment.",
    source: "uwas.example.yaml",
    sections: [
      {
        title: "Protect each domain",
        body: "The request path supports WAF rules, IP access controls, rate limiting and bandwidth caps. Configure these for the traffic you expect. Request-level WAF and connection-level auto-block address different layers of traffic.",
        code: "domains:\n  - host: example.com\n    type: static\n    root: /var/www/html\n    security:\n      rate_limit:\n        requests: 100\n        window: 1m",
      },
      {
        title: "Administrative access",
        body: "UWAS includes admin, reseller and user roles, TOTP two-factor authentication and audit logging. The admin API and MCP listeners should stay private. Use the current hashed-credential workflow; legacy plaintext API-key fallback is opt-in.",
      },
      {
        title: "Auto-block and the firewall",
        body: "Connection-level thresholds can identify aborted handshakes and excessive connections. Upstream recommends observing dry-run behavior before enforcing thresholds. Behind a proxy, configure trusted proxies and allowlists carefully to avoid blocking an entire edge network.",
      },
      {
        title: "Report a vulnerability",
        body: "Use the repository’s Security tab and security policy for disclosure guidance. Read UPGRADING.md for changes to authentication and multi-user defaults. Validate the server against your own deployment and security requirements.",
      },
    ],
  },
  {
    slug: "mcp",
    title: "AI management with MCP",
    category: "Operate",
    summary:
      "Connect a compatible AI client to structured UWAS management tools.",
    source: "internal/mcp/server.go",
    sections: [
      {
        title: "A built-in management interface",
        body: "UWAS includes a Model Context Protocol server. It exposes structured operations for compatible AI clients rather than requiring those clients to edit server files or parse shell output.",
      },
      {
        title: "Enable the listener",
        body: "The upstream sample uses a loopback MCP listener on port 9444. Review the current server implementation and your client’s supported transport before connecting. Do not expose a management listener directly to the public Internet.",
        code: 'global:\n  mcp:\n    enabled: true\n    listen: "127.0.0.1:9444"',
      },
      {
        title: "Keep a human in the loop",
        body: "Give an AI client access appropriate to its task. Start with server inspection, review proposed management actions and verify the result in the CLI or dashboard. Available operations and authentication are defined by the current upstream implementation.",
      },
    ],
  },
  {
    slug: "observability",
    title: "Metrics, logs & webhooks",
    category: "Operate",
    summary: "Understand request behavior and respond to operational events.",
    source: "README.md",
    sections: [
      {
        title: "Metrics and traffic",
        body: "UWAS provides Prometheus metrics, p50/p95/p99 latency percentiles, per-domain traffic analytics and uptime checks. Use the dashboard to inspect trends and validate that your monitoring sees the right domains.",
      },
      {
        title: "Logs for operations",
        body: "Configure JSON, text or common-log output globally. The dashboard exposes application and server views; audit logging records administrative actions with timestamps and IPs.",
        code: "global:\n  log_level: info\n  log_format: json",
      },
      {
        title: "Connect operational events",
        body: "Webhooks support signed HMAC-SHA256 event delivery and retries. Configure receivers to verify signatures and handle duplicate deliveries. The platform also includes alert integrations; consult upstream settings for supported providers and current event names.",
      },
    ],
  },
  {
    slug: "backups",
    title: "Backups & migration",
    category: "Operate",
    summary: "Plan recovery, stage changes and bring existing sites across.",
    source: "README.md",
    sections: [
      {
        title: "Back up before changing",
        body: "The platform supports scheduled local, S3 and SFTP backups. Configure destinations, retain copies outside the host, and test restoration. The CLI backup command creates a configuration backup; use dashboard site backup workflows for site data.",
        code: "uwas backup\nuwas restore",
      },
      {
        title: "Clone and migrate sites",
        body: "Dashboard workflows can clone domains for staging and migrate site files over SSH with database dump/import. Review credentials, storage requirements and DNS cutover before moving a live site.",
      },
      {
        title: "Convert existing configurations",
        body: "CLI migration helpers translate Nginx or Apache configurations. Treat conversion output as a starting point: inspect it, validate it, and test redirects, rewrites, headers and dynamic routes before switching traffic.",
        code: "uwas migrate nginx /etc/nginx/sites-available/example\nuwas migrate apache /etc/apache2/sites-available/example.conf\nuwas config validate",
      },
    ],
  },
  {
    slug: "cli",
    title: "CLI reference",
    category: "Reference",
    summary:
      "The everyday commands for serving, inspecting and maintaining UWAS.",
    source: "cmd/uwas/main.go",
    sections: [
      {
        title: "Serve and inspect",
        body: "Start with an explicit configuration or let the first-run flow create one. Use version and status to inspect the installed binary and running server. Run help for the complete command list and current options.",
        code: "uwas version\nuwas serve -c uwas.yaml\nuwas status\nuwas help",
      },
      {
        title: "Validate and reload",
        body: "Validate a specific configuration before applying changes. The config test command also lists loaded domains. Reload asks the running server to apply configuration changes.",
        code: "uwas config validate -c uwas.yaml\nuwas config test -c uwas.yaml\nuwas reload",
      },
      {
        title: "Inspect the platform",
        body: "These commands expose domain, certificate, cache, PHP and user information through the administration interface. The CLI can load its API key from ~/.uwas/.env.",
        code: "uwas domain list\nuwas cert list\nuwas cache stats\nuwas php list\nuwas user list\nuwas doctor",
      },
      {
        title: "Manage the lifecycle",
        body: "Use stop and restart for the running instance. Installing and uninstalling the systemd service is a Linux administration workflow. Review the command help before operations that change service state.",
        code: "uwas restart\nuwas stop\n\n# Linux systemd setup\nsudo uwas install\nsudo systemctl start uwas",
      },
    ],
  },
  {
    slug: "api",
    title: "Admin API",
    category: "Reference",
    summary:
      "Build integrations against the server’s REST management interface.",
    source: "internal/admin/routes.go",
    sections: [
      {
        title: "A private management API",
        body: "The dashboard is backed by REST routes under /api/v1. Keep the management listener private and use the authentication mechanism configured for your instance. The current route registrations are the authoritative endpoint inventory.",
      },
      {
        title: "Useful read endpoints",
        body: "The route table includes health, system information, server statistics, domain listings and cache statistics. These paths are shown as a reference, without embedding any real credential.",
        code: "GET /api/v1/health\nGET /api/v1/system\nGET /api/v1/stats\nGET /api/v1/domains\nGET /api/v1/cache/stats\nGET /api/v1/metrics",
      },
      {
        title: "Changes are privileged operations",
        body: "Domain creation and deletion, reloads, cache purges and application deployment change the server. Use narrowly scoped credentials where supported, check response status codes, and avoid exposing the admin API to a public frontend. Never put management credentials into browser-delivered code.",
      },
      {
        title: "Verify against the running version",
        body: "Endpoint details and payloads evolve. Use internal/admin/routes.go and the corresponding handlers for your exact version, rather than assuming this introductory guide is a generated API schema.",
      },
    ],
  },
  {
    slug: "docker",
    title: "Docker deployment",
    category: "Deploy workloads",
    summary:
      "Run UWAS with containers using the upstream Docker configuration.",
    source: "docker-compose.yml",
    sections: [
      {
        title: "Start with the upstream stack",
        body: "The repository includes a Dockerfile, a Compose file, a PHP service and a MariaDB service. Clone the repository and inspect docker-compose.yml and docker/uwas.yaml before starting.",
        code: "git clone https://github.com/uwaserver/uwas.git\ncd uwas",
      },
      {
        title: "Provide your secrets",
        body: "The Compose stack requires UWAS_ADMIN_KEY, DB_ROOT_PASSWORD and DB_PASSWORD. Generate separate strong values, put them in a local .env file and keep the file outside version control. The Compose configuration intentionally has no default passwords.",
        code: "# Generate each secret separately\nopenssl rand -hex 24\n\n# Required .env keys:\n# UWAS_ADMIN_KEY\n# DB_ROOT_PASSWORD\n# DB_PASSWORD",
      },
      {
        title: "Build and launch",
        body: "Once the required variables are present, validate the resolved Compose configuration and start the stack. Named volumes persist the configuration, certificates, cache and database.",
        code: "docker compose config --quiet\ndocker compose up -d --build\ndocker compose logs -f uwas",
        note: "The current upstream Compose mapping publishes TCP 80/443 and loopback admin 9443. Add an explicit 443:443/udp mapping if you enable HTTP/3.",
      },
      {
        title: "Reach the dashboard privately",
        body: "The Compose stack binds the admin publication to 127.0.0.1. Access it locally or forward it over SSH. Mount and back up persistent data deliberately; container removal and data recovery are separate operations.",
        code: "ssh -L 9443:127.0.0.1:9443 user@your-server\n\n# http://127.0.0.1:9443/_uwas/dashboard/",
      },
    ],
  },
];

export const releases = [
  {
    version: "v0.11.28",
    date: "October 6, 2026",
    type: "Latest release",
    title: "More dependable, down to the details.",
    items: [
      "Image conversions are published atomically so concurrent requests cannot read partially written files.",
      "Domain backups fail when a database dump fails, instead of appearing complete.",
      "WAF file_probe protection ships for scanner requests to backup and secret filenames.",
      "Alert titles explain operational events, including HTTP 5xx spikes.",
    ],
  },
  {
    version: "v0.11.26",
    date: "October 2, 2026",
    type: "Reliability & security",
    title: "Routing and operator safeguards.",
    items: [
      "Weighted round-robin honors configured backend weights; failed half-open probes re-open circuit breakers.",
      "The SQL explorer rejects EXPLAIN ANALYZE and Docker arguments reject short-flag bypasses.",
      "DNS record identifiers are escaped and nested zones use the longest matching name.",
      "WebSocket forwarding derives protocol and host from the actual connection.",
    ],
  },
  {
    version: "v0.11.25",
    date: "September 30, 2026",
    type: "Maintenance",
    title: "A fresh release, with dependency fixes.",
    items: [
      "Publishes the v0.11.24 changes with updated dashboard dependencies.",
      "File Manager pagination reaches every entry in a directory; new uploads and saves use mode 0600.",
      "Cache key components are length-prefixed to avoid collisions.",
    ],
  },
];

export const faqs = [
  {
    q: "What does “one binary” actually include?",
    a: "The HTTP server, TLS automation, cache, reverse proxy, rewrite engine, admin API, MCP server and dashboard ship together. PHP-FPM, application runtimes, databases and Docker remain separate dependencies when your workload needs them.",
  },
  {
    q: "Can I bring an existing WordPress site?",
    a: "Yes. UWAS connects to PHP-FPM, imports .htaccess rewrite rules and includes WordPress management workflows. Check PHP extensions, database connectivity and application-specific Apache directives before cutting over.",
  },
  {
    q: "Is UWAS open source?",
    a: "UWAS is available under AGPL-3.0, with a separate commercial licensing option. The current upstream LICENSE file defines the terms. There are no invented pricing tiers here; commercial terms are discussed directly with the project.",
  },
  {
    q: "Do I need to use the dashboard?",
    a: "No. Use YAML and the CLI, the REST admin API, or the built-in MCP interface. The dashboard is included when you want a visual way to manage the same platform.",
  },
  {
    q: "Where should I start for production?",
    a: "Start with the installation guide, configure a real domain and HTTPS, keep management listeners private, and test backup restoration. Read the release notes and UPGRADING.md, then validate with your own traffic and deployment requirements.",
  },
];
