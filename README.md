# 🍯 HoneyChain

### Blockchain-Based Honey Traceability & Smart Beekeeping Management System

> **SIH 2026 — Problem Statement: SIH26021**

HoneyChain is an integrated digital platform designed to improve **honey traceability, beekeeper management, hive monitoring, and consumer trust**.

The system connects **beekeepers, FPO/KVIC officers, and consumers** through a transparent traceability workflow supported by a blockchain-inspired integrity layer, AI-assisted data extraction, QR-based batch verification, and simulated IoT hive monitoring.

---

## 🌱 Problem

Honey production in rural communities faces several challenges:

- Difficulty verifying the origin of honey
- Counterfeit and adulterated honey in the market
- Limited traceability from hive to final product
- Poor digital record keeping by beekeepers
- Weak connectivity between beekeepers and institutional authorities
- Limited access to intelligent hive monitoring
- Lack of consumer-facing provenance information

Traditional records can be modified, lost, or difficult to verify.

HoneyChain addresses these challenges by creating a digital chain of events connecting:

**Apiary → Hive → Inspection → Harvest → Honey Batch → Consumer**

---

## 💡 Solution

HoneyChain provides a unified ecosystem where:

### 👨‍🌾 Beekeepers

Beekeepers can interact with the system through a conversational interface to:

- Record harvests
- Record hive inspections
- Report hive issues
- Select registered hives
- Submit observations using simple conversational inputs
- Receive AI-assisted extraction of relevant information

The interface is designed around a **WhatsApp-style conversational workflow**, making it easier for users who may not be comfortable with complex dashboards.

---

### 🏛️ FPO / KVIC Officers

Authorized officers can:

- Verify beekeeper registrations
- Manage beekeeper verification status
- Register and assign hives
- Monitor registered apiaries
- Review hive information
- Maintain institutional oversight of the traceability process

The system follows a controlled onboarding model rather than allowing arbitrary users to claim ownership of hives.

---

### 🛒 Consumers

Consumers can scan a **QR code attached to a honey batch** and view its provenance.

The public verification page can display information such as:

- Honey batch ID
- Source hive
- Apiary information
- Harvest information
- Traceability events
- Verification status
- Blockchain integrity status

No beekeeper's private credentials or sensitive information are exposed.

---

## 🔗 Traceability Model

HoneyChain maintains a chronological chain of events:

```text
Beekeeper
    │
    ▼
FPO/KVIC Verification
    │
    ▼
Apiary Registration
    │
    ▼
Hive Registration
    │
    ├── Hive Inspection
    │
    ├── Hive Issue Report
    │
    ▼
Honey Harvest
    │
    ▼
Honey Batch
    │
    ▼
Blockchain Integrity Record
    │
    ▼
QR Code
    │
    ▼
Consumer Verification
