# XalabiaServer | Private Infrastructure Hub & Portfolio

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Active-green.svg)](https://github.com/Rattop/xalabiaserver)
[![Arch Linux](https://img.shields.io/badge/os-ArchLinux-1793D1.svg)](https://archlinux.org/)
[![BTRFS](https://img.shields.io/badge/filesystem-BTRFS-lightgrey.svg)](https://btrfs.readthedocs.io/)
[![Frontend](https://img.shields.io/badge/frontend-VanillaJS-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

This repository contains the architecture, configuration, and frontend interface for **XalabiaServer**, a private operations control panel and homelab environment.

The project demonstrates practical implementation of deployment automation, secure network routing, filesystem integrity protection, and decoupled telemetry pipelines while maintaining a lightweight and dependency-free frontend architecture.

The interface utilizes a terminal-inspired layout optimized for:

- Data density
- Explicit structural semantics
- Zero runtime dependencies
- Minimal overhead rendering
- Native browser compatibility

---

# Table of Contents

- [1. Core Services & Workloads](#1-core-services--workloads)
- [2. Infrastructure & System Topography](#2-infrastructure--system-topography)
- [3. Decoupled Telemetry Pipeline](#3-decoupled-telemetry-pipeline-fastfetch-integration)
  - [Telemetry Script Configuration](#telemetry-script-configuration-update_fetchsh)
  - [System Crontab Rule](#system-crontab-rule)
- [4. Repository Structure](#4-repository-structure)
- [5. Development & Local Deployment](#5-development--local-deployment)
- [6. Security Model](#6-security-model)
- [7. Design Philosophy](#7-design-philosophy)
- [8. Maintainer & Focus Areas](#8-maintainer--focus-areas)

---

# 1. Core Services & Workloads

The infrastructure architecture provisions multiple isolated services under a zero-trust operational perspective, relying on cryptographic authentication and restricted access control policies.

## Active Services

### Jellyfin Media Server
Self-hosted media streaming platform configured with native hardware transcoding for efficient resource utilization across:

- Smart TVs
- Mobile applications
- Browser instances
- Remote streaming clients

### FileBrowser Application
Secure web-based filesystem gateway managing:

- Multi-user remote synchronization
- Permission segmentation
- Directory isolation
- Remote uploads and downloads

### Secure FTP (sFTP)
High-throughput ingestion layer operating over encrypted SSH tunnels on port `26609`, optimized for:

- Automation pipelines
- Large asset transfers
- Remote backups
- Scripted deployments

### Dedicated Game Server Instance
Isolated deployment environment utilizing whitelist ACLs for:

- User authentication
- Resource isolation
- Dedicated workload management

### SSH Remote Access Engine
Secure remote gateway restricted to:

- ED25519 key authentication
- Explicit access lists
- Disabled password authentication
- Hardened daemon configuration

---

# 2. Infrastructure & System Topography

## Operating System

- Arch Linux x86_64
- LTS kernel branch
- Rolling-release maintenance strategy
- Lightweight UNIX-oriented environment

## Filesystem Engine

BTRFS architecture optimized for:

- Metadata integrity
- Inline copy-on-write (CoW)
- Snapshot-based rollback
- Atomic system recovery
- Incremental backups

## Network Boundary

- Symmetric Fiber Connection
  - 1000 Mbps Downlink
  - 1000 Mbps Uplink

- Reverse Proxy ingress layer
- Automated SSL/TLS 1.3 certificate management
- Domain routing segmentation
- Service boundary isolation

---

# 3. Decoupled Telemetry Pipeline (Fastfetch Integration)

To expose live telemetry data to the frontend while maintaining process isolation and avoiding dangerous runtime execution patterns such as Remote Code Execution (RCE), the project employs a decoupled telemetry pipeline.

## Pipeline Flow

### 1. Automation Script (`update_fetch.sh`)

A local Bash script queries host system specifications using `fastfetch`.

The script uses:

- `--pipe`
- `--logo none`

These flags strip ANSI formatting and generate clean plain-text output suitable for frontend parsing.

### 2. Scheduling Layer (Cron)

A cron scheduler executes the script every 5 minutes.

The generated payload is atomically written into a static file located inside the public assets directory.

### 3. Asynchronous Consumption

The frontend interface asynchronously retrieves the telemetry payload using the native JavaScript `Fetch API`.

The client-side parser:

- Matches semantic keys using RegEx
- Applies syntax highlighting
- Renders the content inside semantic `<pre>` blocks

This architecture prevents:

- Arbitrary shell execution
- Runtime backend exposure
- Unsafe command injection
- Direct system process access from the frontend

---

## Telemetry Script Configuration (`update_fetch.sh`)

```bash
#!/bin/bash

# Absolute destination path within the web server layout
OUTPUT_FILE="/var/www/xalabiaserver/public/assets/sysinfo.txt"

# Execute system query and override target file atomically
fastfetch --logo none --pipe > "$OUTPUT_FILE"
```

---

## System Crontab Rule

```cron
# Triggers the telemetry generation script every 5 minutes
*/5 * * * * /var/www/xalabiaserver/update_fetch.sh
```

---

# 4. Repository Structure

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
├── update_fetch.sh
└── README.md
```

---

# 5. Development & Local Deployment

The application runtime environment relies exclusively on native web standards.

No frameworks, package managers, transpilers, bundlers, or external runtime dependencies are required.

## Requirements

- Python 3.x
- Modern web browser
- Local HTTP server support

---

## Clone Repository

```bash
git clone https://github.com/Rattop/xalabiaserver.git
```

---

## Navigate to Public Directory

```bash
cd xalabiaserver/public
```

---

## Start Lightweight Development Server

```bash
python3 -m http.server 8000
```

---

## Access Local Instance

Open your browser and navigate to:

```text
http://localhost:8000
```

---

# 6. Security Model

The infrastructure follows several hardening principles:

- Zero-trust service exposure
- Key-based authentication
- Minimal attack surface
- Isolated service boundaries
- No direct frontend shell execution
- Decoupled telemetry ingestion
- Reverse proxy ingress protection
- TLS-only external communication

---

# 7. Design Philosophy

The project intentionally avoids unnecessary abstraction layers.

Core principles include:

- Minimalism
- Transparency
- Native tooling
- Infrastructure readability
- Predictable runtime behavior
- UNIX-oriented design
- Long-term maintainability

The frontend is intentionally dependency-free to guarantee:

- Fast loading
- Maximum compatibility
- Reduced attack surface
- Operational simplicity

---

# 8. Maintainer & Focus Areas

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

See the `LICENSE` file for additional information.
