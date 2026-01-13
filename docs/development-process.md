# Development Process

This document outlines the AI-assisted BDD development workflow using the PM plugins.

## Process Overview

```mermaid
flowchart TB
    subgraph Strategy["1. Strategy"]
        Vision["/vision<br/>Product Vision"]
        Arch["/architecture<br/>Tech Stack & ADRs"]
        Vision --> Arch
    end

    subgraph Domain["2. Domain Knowledge"]
        DomainChoice{Storage?}
        DomainMD["/domain<br/>Markdown Files"]
        DomainAT["/domain-airtable<br/>Airtable Tables"]
        DomainChoice -->|Markdown| DomainMD
        DomainChoice -->|Airtable| DomainAT
    end

    subgraph Requirements["3. Requirements"]
        ReqChoice{Storage?}
        ReqMD["/requirements<br/>Feature Files"]
        ReqAT["/requirements-airtable<br/>Airtable Tables"]
        ReqChoice -->|Markdown| ReqMD
        ReqChoice -->|Airtable| ReqAT
    end

    subgraph Backlog["4. Backlog"]
        BacklogChoice{Storage?}
        BacklogMD["/backlog<br/>Markdown File"]
        BacklogAT["/backlog-airtable<br/>Airtable Table"]
        BacklogChoice -->|Markdown| BacklogMD
        BacklogChoice -->|Airtable| BacklogAT
    end

    subgraph Planning["5. Planning"]
        PlanChoice{Source?}
        PlanMD["/plan<br/>From Description"]
        PlanAT["/plan-airtable<br/>From Backlog Item"]
        PlanChoice -->|Description| PlanMD
        PlanChoice -->|Airtable| PlanAT
        PlanMD --> PlanDoc["docs/plans/*.md"]
        PlanAT --> PlanDoc
    end

    subgraph Implementation["6. Implementation"]
        Execute["/execute plan-name<br/>Step-by-step Implementation"]
        Review["Code Review<br/>(code-reviewer agent)"]
        Tests["Run Tests<br/>npm test"]
        Execute --> Review
        Review --> Tests
    end

    Strategy --> Domain
    Domain --> Requirements
    Requirements --> Backlog
    Backlog --> Planning
    Planning --> Implementation
```

## Detailed Phase Diagram

```mermaid
flowchart LR
    subgraph Phase1["Phase 1: Strategy"]
        V[Vision] --> T[Tech Stack]
        T --> ADR[Architecture Decisions]
    end

    subgraph Phase2["Phase 2: Domain"]
        E[Entities] --> P[Processes]
        P --> G[Glossary]
    end

    subgraph Phase3["Phase 3: Requirements"]
        F[Features] --> R[Rules]
        R --> Ex[Examples]
        Ex --> Q[Open Questions]
    end

    subgraph Phase4["Phase 4: Backlog"]
        Add[Add Items] --> Pri[Prioritize]
        Pri --> Link[Link Requirements]
    end

    subgraph Phase5["Phase 5: Planning"]
        Disc[Discovery] --> Req[Load Requirements]
        Req --> Exp[Explore Codebase]
        Exp --> Clar[Clarify Questions]
        Clar --> Des[Design Approach]
        Des --> Doc[Document Plan]
    end

    subgraph Phase6["Phase 6: Execute"]
        Load[Load Plan] --> Check[Pre-check]
        Check --> Impl[Implement]
        Impl --> Rev[Review]
        Rev --> Ver[Verify]
    end

    Phase1 --> Phase2
    Phase2 --> Phase3
    Phase3 --> Phase4
    Phase4 --> Phase5
    Phase5 --> Phase6
```

## Storage Options

Each phase offers a choice between **Markdown** (local files) and **Airtable** (cloud database):

```mermaid
flowchart TB
    subgraph Markdown["Markdown Storage"]
        direction TB
        M1["docs/strategy/vision.md"]
        M2["docs/domains/*/entities/*.md"]
        M3["docs/requirements/**/*.feature"]
        M4["docs/strategy/backlog.md"]
        M5["docs/plans/*.md"]
    end

    subgraph Airtable["Airtable Storage"]
        direction TB
        A1["Domain Table"]
        A2["Subdomain Table"]
        A3["Entity Table"]
        A4["Requirement Table"]
        A5["Rule / Example Tables"]
        A6["BacklogItem Table"]
    end

    Choice{Choose One}
    Choice -->|Simple, Git-tracked| Markdown
    Choice -->|Collaborative, Queryable| Airtable
```

### When to Use Each

| Aspect | Markdown | Airtable |
|--------|----------|----------|
| Version Control | Git-tracked | Airtable history |
| Collaboration | Via Git PRs | Real-time |
| Querying | Manual search | Filters & views |
| Setup | None | MCP server required |
| Offline | Yes | No |

## Commands Reference

| Phase | Markdown Command | Airtable Command |
|-------|-----------------|------------------|
| Vision | `/vision` | - |
| Architecture | `/architecture` | - |
| Domain Knowledge | `/domain` | `/domain-airtable` |
| Requirements | `/requirements` | `/requirements-airtable` |
| Backlog | `/backlog` | `/backlog-airtable` |
| Planning | `/plan` | `/plan-airtable` |
| Execution | `/execute` | `/execute` |

## Agents

The planning plugin includes specialized agents:

```mermaid
flowchart LR
    subgraph Agents
        Explorer["code-explorer<br/>Traces execution paths<br/>Maps architecture"]
        Architect["code-architect<br/>Designs approaches<br/>Evaluates trade-offs"]
        Reviewer["code-reviewer<br/>Finds bugs<br/>Checks conventions"]
    end

    Plan["/plan"] --> Explorer
    Plan --> Architect
    Execute["/execute"] --> Reviewer
```

## Example Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Claude
    participant F as Files/Airtable

    Note over U,F: 1. Define Vision & Architecture
    U->>C: /vision
    C->>F: Create docs/strategy/vision.md
    U->>C: /architecture
    C->>F: Create docs/strategy/tech-stack.md

    Note over U,F: 2. Document Domain
    U->>C: /domain (or /domain-airtable)
    C->>U: What entity to document?
    U->>C: Organization with levels and categories
    C->>F: Create entity documentation

    Note over U,F: 3. Write Requirements
    U->>C: /requirements (or /requirements-airtable)
    C->>U: Questions about rules and examples
    U->>C: Answers
    C->>F: Create feature files with @REQ-IDs

    Note over U,F: 4. Manage Backlog
    U->>C: /backlog (or /backlog-airtable)
    C->>F: Add/prioritize items

    Note over U,F: 5. Plan Implementation
    U->>C: /plan Organization CRUD
    C->>C: Launch code-explorer agents
    C->>U: Clarifying questions
    U->>C: Answers
    C->>C: Launch code-architect agents
    C->>F: Create docs/plans/organization-crud.md

    Note over U,F: 6. Execute Plan
    U->>C: /execute organization-crud
    C->>F: Implement step by step
    C->>C: Launch code-reviewer agent
    C->>U: Ready to commit?
```

## Key Principles

1. **No Assumptions** - Always ask questions, never invent domain details
2. **Traceable** - Every feature has a unique requirement ID (SUB-CAP-NNN)
3. **Test-Driven** - Requirements are executable BDD scenarios
4. **Iterative** - Plan → Execute → Review → Refine
5. **Collaborative** - Human-in-the-loop at every decision point
