# XalabiaServer | Private Infrastructure Hub & Portfolio

This repository contains the architecture, configuration, and frontend interface for XalabiaServer, a private operations control panel and homelab environment. The project is designed to demonstrate practical implementation of deployment automation, secure network routing, filesystem integrity protection, and decoupled data pipelining.

The interface utilizes a functional terminal-inspired layout optimized for data density, explicit structural semantics, and zero runtime dependencies.

## 1. Core Services & Workloads

The infrastructure architecture provisions several isolated services under a zero-trust perspective, relying on key-based authentication and restricted application access lists.

* **Jellyfin Media Server:** Self-hosted streaming platform configured with native hardware transcoding for efficient resource utilization across client smart TVs, mobile applications, and browser instances.
* **FileBrowser Application:** Secure web-based filesystem gateway managing multi-user remote directory synchronization, access levels, and file uploads.
* **Secure FTP (sFTP):** High-throughput data ingestion layer operating over an encrypted SSH tunnel on port 26609, optimized for bulk automation scripts and large asset transfers.
* **Dedicated Game Server Instance:** Isolated deployment configuration utilizing whitelist access control lists (ACLs) for user authentication and resource allocation.
* **SSH Remote Access Engine:** Secure remote gateway restricted to cryptographic key pairs (ED25519) with standard interactive password authentication explicitly disabled at the daemon level.

## 2. Infrastructure & System Topography

* **Operating System:** Arch Linux x86_64 utilizing the LTS kernel branch to guarantee environment stability and long-term compliance.
* **Filesystem Engine:** BTRFS architecture optimized for metadata integrity, inline copy-on-write (CoW) data protection, and automated execution of atomic system snapshots.
* **Network Boundary:** Symmetric residential fiber uplink (1000 Mbps Downlink / 1000 Mbps Uplink) mapped through an ingress Reverse Proxy layer with automated SSL/TLS 1.3 certificate management.

## 3. Decoupled Telemetry Pipeline (Fastfetch Integration)

To deliver live server telemetry to the frontend while maintaining system isolation—eliminating common web security vulnerabilities such as arbitrary remote code execution (RCE)—the architecture employs a decoupled pipeline pattern:

1.  **Automation Script (`update_fetch.sh`):** A local bash script queries system specifications using `fastfetch`. It incorporates `--pipe` and `--logo none` flags to strip ANSI escape formatting and format data into plain text.
2.  **Scheduling Layer (Cron):** The system crontab triggers the script on a strict 5-minute recurrence block, writing the payload atomically to a static text file within the public assets directory.
3.  **Asynchronous Consumption:** The client interface uses the native JavaScript `Fetch API` to read the resource from the absolute path `/assets/sysinfo.txt`. Client-side regular expressions match specific keys to handle dynamic syntax highlighting within a semantic HTML `<pre>` block.

### Telemetry Script Configuration (`update_fetch.sh`)

```

```text
File generated successfully.

```bash
#!/bin/bash
# Absolute destination path within the web server layout
OUTPUT_FILE="/var/www/xalabiaserver/public/assets/sysinfo.txt"

# Execute system query and override target file atomically
fastfetch --logo none --pipe > "$OUTPUT_FILE"

```

### System Crontab Rule

```text
# Triggers the telemetry generation script every 5 minutes
*/5 * * * * /var/www/xalabiaserver/update_fetch.sh

```

## 4. Repository Structure

```text
/xalabiaserver
├── public/                 # Web server deployment root
│   ├── index.html          # Semantic frontend skeleton
│   └── assets/             # Application static resources
│       ├── css/
│       │   └── style.css   # Main layout definitions and styling variables
│       ├── images/
│       │   └── favicon.ico # Site branding identity asset
│       └── js/
│           └── main.js     # Clipboard handlers and asynchronous fetch logic
└── update_fetch.sh         # Core automation shell script

```

## 5. Development & Local Deployment

The application runtime environment relies strictly on vanilla web standards. There are no build steps, external runtime frameworks, or package dependencies required to initialize the local server interface.

### Steps to Run Locally

1. Clone the project repository to your local directory:
```bash
git clone [https://github.com/Rattop/xalabiaserver.git](https://github.com/Rattop/xalabiaserver.git)

```


2. Navigate to the public deployment root directory:
```bash
cd xalabiaserver/public

```


3. Instantiate a local lightweight web server instance using Python:
```bash
python3 -m http.server 8000

```


4. Open your browser and navigate to `http://localhost:8000`.

---

**Maintainer:** Rafael Padilha

**Focus Areas:** Systems Analysis, UNIX Infrastructure, Network Topographies, and DevOps Engineering.

"""

with open("README.md", "w", encoding="utf-8") as f:
f.write(readme_content)
print("File generated successfully.")

```
Seu arquivo README.md está pronto
[file-tag: code-generated-file-0-1778954077300764958]

A versão gerada não possui emojis, mantém o tom objetivo e técnico e destaca com profundidade a sua solução para os recursos de automação usando _fastfetch_, *bash*, *cron* e *API Fetch*. Se preferir, também copio o texto abaixo para facilitar:

```markdown
# XalabiaServer | Private Infrastructure Hub & Portfolio

This repository contains the architecture, configuration, and frontend interface for XalabiaServer, a private operations control panel and homelab environment. The project is designed to demonstrate practical implementation of deployment automation, secure network routing, filesystem integrity protection, and decoupled data pipelining.

The interface utilizes a functional terminal-inspired layout optimized for data density, explicit structural semantics, and zero runtime dependencies.

## 1. Core Services & Workloads

The infrastructure architecture provisions several isolated services under a zero-trust perspective, relying on key-based authentication and restricted application access lists.

* **Jellyfin Media Server:** Self-hosted streaming platform configured with native hardware transcoding for efficient resource utilization across client smart TVs, mobile applications, and browser instances.
* **FileBrowser Application:** Secure web-based filesystem gateway managing multi-user remote directory synchronization, access levels, and file uploads.
* **Secure FTP (sFTP):** High-throughput data ingestion layer operating over an encrypted SSH tunnel on port 26609, optimized for bulk automation scripts and large asset transfers.
* **Dedicated Game Server Instance:** Isolated deployment configuration utilizing whitelist access control lists (ACLs) for user authentication and resource allocation.
* **SSH Remote Access Engine:** Secure remote gateway restricted to cryptographic key pairs (ED25519) with standard interactive password authentication explicitly disabled at the daemon level.

## 2. Infrastructure & System Topography

* **Operating System:** Arch Linux x86_64 utilizing the LTS kernel branch to guarantee environment stability and long-term compliance.
* **Filesystem Engine:** BTRFS architecture optimized for metadata integrity, inline copy-on-write (CoW) data protection, and automated execution of atomic system snapshots.
* **Network Boundary:** Symmetric residential fiber uplink (1000 Mbps Downlink / 1000 Mbps Uplink) mapped through an ingress Reverse Proxy layer with automated SSL/TLS 1.3 certificate management.

## 3. Decoupled Telemetry Pipeline (Fastfetch Integration)

To deliver live server telemetry to the frontend while maintaining system isolation—eliminating common web security vulnerabilities such as arbitrary remote code execution (RCE)—the architecture employs a decoupled pipeline pattern:

1.  **Automation Script (`update_fetch.sh`):** A local bash script queries system specifications using `fastfetch`. It incorporates `--pipe` and `--logo none` flags to strip ANSI escape formatting and format data into plain text.
2.  **Scheduling Layer (Cron):** The system crontab triggers the script on a strict 5-minute recurrence block, writing the payload atomically to a static text file within the public assets directory.
3.  **Asynchronous Consumption:** The client interface uses the native JavaScript `Fetch API` to read the resource from the absolute path `/assets/sysinfo.txt`. Client-side regular expressions match specific keys to handle dynamic syntax highlighting within a semantic HTML `<pre>` block.

### Telemetry Script Configuration (`update_fetch.sh`)
```bash
#!/bin/bash
# Absolute destination path within the web server layout
OUTPUT_FILE="/var/www/xalabiaserver/public/assets/sysinfo.txt"

# Execute system query and override target file atomically
fastfetch --logo none --pipe > "$OUTPUT_FILE"

```

### System Crontab Rule

```text
# Triggers the telemetry generation script every 5 minutes
*/5 * * * * /var/www/xalabiaserver/update_fetch.sh

```

## 4. Repository Structure

```text
/xalabiaserver
├── public/                 # Web server deployment root
│   ├── index.html          # Semantic frontend skeleton
│   └── assets/             # Application static resources
│       ├── css/
│       │   └── style.css   # Main layout definitions and styling variables
│       ├── images/
│       │   └── favicon.ico # Site branding identity asset
│       └── js/
│           └── main.js     # Clipboard handlers and asynchronous fetch logic
└── update_fetch.sh         # Core automation shell script

```

## 5. Development & Local Deployment

The application runtime environment relies strictly on vanilla web standards. There are no build steps, external runtime frameworks, or package dependencies required to initialize the local server interface.

### Steps to Run Locally

1. Clone the project repository to your local directory:
```bash
git clone [https://github.com/Rattop/xalabiaserver.git](https://github.com/Rattop/xalabiaserver.git)

```


2. Navigate to the public deployment root directory:
```bash
cd xalabiaserver/public

```


3. Instantiate a local lightweight web server instance using Python:
```bash
python3 -m http.server 8000

```


4. Open your browser and navigate to `http://localhost:8000`.

---

**Maintainer:** Rafael Padilha

**Focus Areas:** Systems Analysis, UNIX Infrastructure, Network Topographies, and DevOps Engineering.

```

```
