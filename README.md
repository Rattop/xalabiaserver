# XalabiaServer | Homelab Operations Dashboard & Portfolio Interface

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Active-green.svg)](https://github.com/Rattop/xalabiaserver)
[![Arch Linux](https://img.shields.io/badge/os-ArchLinux-1793D1.svg)](https://archlinux.org/)
[![BTRFS](https://img.shields.io/badge/filesystem-BTRFS-lightgrey.svg)](https://btrfs.readthedocs.io/)
[![Frontend](https://img.shields.io/badge/frontend-VanillaJS-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Companion Repo](https://img.shields.io/badge/companion-XalabiasHub-EE0000.svg)](https://github.com/Rattop/xalabiashub)

This repository contains the frontend interface for **XalabiaServer**, the public-facing operations dashboard for a personal homelab environment.

It is the presentation layer for the infrastructure provisioned and managed in the companion repository, **[XalabiasHub](https://github.com/Rattop/xalabiashub)**. While XalabiasHub handles provisioning and service orchestration via Ansible, this repository is the dependency-free, terminal-inspired interface that exposes live status, access points, and system telemetry to visitors — including recruiters checking out the homelab in action.

> **Part of a two-repository ecosystem:** this repo is the *presentation layer*. The companion repo, **[XalabiasHub](https://github.com/Rattop/xalabiashub)**, is the *infrastructure layer* that provisions everything shown here. See [Project Ecosystem](#9-project-ecosystem) below.

---

# Table of Contents

- [1. Project Objective](#1-project-objective)
- [2. Core Services & Workloads](#2-core-services--workloads)
- [3. Infrastructure & System Topography](#3-infrastructure--system-topography)
- [4. Decoupled Telemetry Pipeline (Fastfetch Integration)](#4-decoupled-telemetry-pipeline-fastfetch-integration)
- [5. Repository Structure](#5-repository-structure)
- [6. Development & Local Deployment](#6-development--local-deployment)
- [7. Security Model](#7-security-model)
- [8. Skills Demonstrated](#8-skills-demonstrated)
- [9. Project Ecosystem](#9-project-ecosystem)
- [10. Maintainer & Focus Areas](#10-maintainer--focus-areas)

---

# 1. Project Objective

XalabiasHub (the infrastructure repo) provisions and runs a working homelab — but provisioning alone is invisible. XalabiaServer was built to close that loop: a lightweight, dependency-free dashboard that surfaces what's actually running, gives controlled access points to each service, and pulls live system telemetry straight from the host, without ever exposing shell access to the browser.

The build constraint was deliberate: no frameworks, no build step, no backend application code — just semantic HTML, CSS Grid/Flexbox, and vanilla ES6 — to keep the attack surface and the dependency footprint as close to zero as possible while still feeling like a real ops console.

---

# 2. Core Services & Workloads

The infrastructure architecture provisions multiple isolated services under a zero-trust operational perspective, relying on cryptographic authentication and restricted access control policies.

## Active Services

### Jellyfin Media Server
Self-hosted media streaming platform configured with native hardware transcoding for efficient resource utilization across Smart TVs, mobile applications, browser instances, and remote streaming clients.

### FileBrowser Application
Secure web-based filesystem gateway managing multi-user remote synchronization, permission segmentation, directory isolation, and remote uploads/downloads.

### Secure FTP (sFTP)
High-throughput ingestion layer tunneled through Playit.gg, isolated from any service holding sensitive data — used purely for bulk asset transfer and scripted backups, not as an administrative entry point.

### Dedicated Game Server Instance
Isolated deployment environment utilizing whitelist ACLs for user authentication, resource isolation, and dedicated workload management.

### SSH Remote Access Engine
Administrative gateway protected by two independent layers: Cloudflare Access enforces identity-based login at the edge before a connection is even attempted, and the SSH daemon itself is restricted to ED25519 key authentication with password auth disabled.

---

# 3. Infrastructure & System Topography

## Operating System
- Arch Linux x86_64, LTS kernel branch, rolling-release maintenance strategy.

## Filesystem Engine
BTRFS architecture optimized for metadata integrity, inline copy-on-write (CoW), snapshot-based rollback, atomic system recovery, and incremental backups.

## Network Boundary
- Symmetric fiber connection (1000 Mbps down / 1000 Mbps up).
- Reverse proxy ingress layer with automated SSL/TLS 1.3 certificate management.
- Domain routing segmentation and service boundary isolation, both provisioned by [XalabiasHub](https://github.com/Rattop/xalabiashub).

---

# 4. Decoupled Telemetry Pipeline (Fastfetch Integration)

To expose live telemetry data to the frontend while maintaining process isolation and avoiding dangerous runtime execution patterns such as Remote Code Execution (RCE), the project employs a decoupled telemetry pipeline.

## Pipeline Flow

### 1. Automation Script (`update_fetch.sh`)
A local Bash script queries host system specifications using `fastfetch --pipe --logo none`, generating clean plain-text output suitable for frontend parsing.

### 2. Scheduling Layer (Cron)
A cron scheduler executes the script every 5 minutes; the payload is atomically written into a static file inside the public assets directory.

### 3. Asynchronous Consumption
The frontend retrieves the payload via the native `Fetch API`, matches semantic keys with RegEx, applies syntax highlighting, and renders the content inside semantic `<pre>` blocks.

This architecture avoids arbitrary shell execution, runtime backend exposure, command injection, and direct process access from the frontend — at the cost of intentionally publishing host telemetry (kernel version, uptime, local network details) to any visitor. This trade-off is documented openly rather than hidden, and is treated as a known, accepted exposure rather than an oversight (see [Security Model](#7-security-model)).

```bash
#!/bin/bash
OUTPUT_FILE="/var/www/xalabiaserver/public/assets/sysinfo.txt"
fastfetch --logo none --pipe > "$OUTPUT_FILE"
```

```cron
*/5 * * * * /var/www/xalabiaserver/update_fetch.sh
```

---

# 5. Repository Structure

```text
/xalabiaserver
├── public/
│   ├── index.html
│   └── assets/
│       ├── css/
│       │   └── style.css
│       ├── images/
│       │   └── favicon.ico
│       └── js/
│           └── main.js
├── old/
│   └── index.html       # Earlier design iteration, kept for reference
├── update_fetch.sh
└── README.md
```

---

# 6. Development & Local Deployment

The application runtime environment relies exclusively on native web standards — no frameworks, package managers, transpilers, bundlers, or external runtime dependencies are required.

## Requirements
- Python 3.x
- Modern web browser
- Local HTTP server support

## Clone Repository
```bash
git clone https://github.com/Rattop/xalabiaserver.git
```

## Navigate to Public Directory
```bash
cd xalabiaserver/public
```

## Start Lightweight Development Server
```bash
python3 -m http.server 8000
```

## Access Local Instance
```text
http://localhost:8000
```

---

# 7. Security Model

The interface follows several hardening principles:

- **Zero-trust service exposure:** every administrative endpoint sits behind Cloudflare Access or key-based authentication — this dashboard only ever links out to them, it never proxies credentials itself.
- **Minimal attack surface:** zero runtime dependencies, zero backend application code, zero server-side execution triggered by the frontend.
- **No direct frontend shell execution:** telemetry is pre-rendered server-side on a schedule and served as a static file, never executed on demand from a browser request.
- **TLS-only external communication**, terminated at the reverse proxy provisioned by XalabiasHub.

**Known, accepted trade-off:** the Fastfetch telemetry panel intentionally exposes OS/kernel version, uptime, and local network details to any visitor, in exchange for a zero-backend architecture. This was a deliberate design decision, not an oversight — narrowing the published telemetry fields (e.g. excluding `Local IP`) is a planned follow-up.

---

# 8. Skills Demonstrated

This project was used as a practical vehicle to build and apply the following skills:

- **Frontend engineering without frameworks:** semantic HTML5, CSS Grid/Flexbox, vanilla ES6 — DOM manipulation, the Clipboard API, the Fetch API, event delegation.
- **Decoupled architecture design:** separating telemetry generation (cron + shell) from telemetry consumption (frontend fetch), avoiding any form of server-side request execution triggered by the client.
- **Linux automation:** cron scheduling, atomic file writes, shell scripting for system reporting.
- **Security-conscious frontend design:** consciously evaluating what data is safe to expose publicly versus what must stay behind authentication, and documenting that trade-off instead of hiding it.
- **Static site deployment** behind a reverse proxy and CDN-backed tunnel, integrated with the infrastructure provisioned in [XalabiasHub](https://github.com/Rattop/xalabiashub).

---

# 9. Project Ecosystem

This repository is the presentation layer for a two-part personal infrastructure project:

| Repository | Role | Stack |
|---|---|---|
| **[XalabiasHub](https://github.com/Rattop/xalabiashub)** | Provisioning, service orchestration, and lifecycle automation | Ansible, Docker, Nginx, Systemd |
| **[XalabiaServer](https://github.com/Rattop/xalabiaserver)** (this repo) | Public-facing operations dashboard exposing live status and access points for the services provisioned by XalabiasHub | Vanilla HTML/CSS/JS, Fastfetch telemetry pipeline |

XalabiasHub provisions and runs the services; XalabiaServer is the front door visitors and collaborators see. Together they demonstrate the full loop from infrastructure provisioning to a user-facing interface.

---

# 10. Maintainer & Focus Areas

## Maintainer

**Rafael Padilha**

## Focus Areas

- Systems Analysis
- UNIX Infrastructure
- Network Topographies
- DevOps Engineering
- Linux Administration
- Infrastructure Automation
- Homelab Architecture
- Secure Self-Hosting

---

# License

This repository is distributed under the MIT License.
