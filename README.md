# React Native Firestore Project & Task Manager

![React Native](https://img.shields.io/badge/React_Native-Expo-20232A?logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-Managed_Workflow-000020?logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black)
![React Navigation](https://img.shields.io/badge/React_Navigation-Bottom_Tabs_%2F_Stack-6b52ae)
![License](https://img.shields.io/badge/license-MIT-green)

> Originally built for a university practical ("Graded Lab 8"). Renamed to describe the actual system: a realtime project/task tracker backed by Cloud Firestore.

## Executive Summary

Solves the classic "trello-lite" problem: teams need to group work into **projects**, and track **tasks** within each project, with changes reflected instantly across every connected client — no manual refresh, no polling. This is a mobile front-end over Cloud Firestore demonstrating realtime listeners, nested subcollections, and shared state across screens via React Context.

## Key Architectural Features

- **Nested Firestore data model** — `projects/{projectId}/tasks/{taskId}` subcollections keep tasks scoped to their parent project, mirroring how multi-tenant task trackers structure data in production.
- **Realtime listeners (`onSnapshot`)** — both the Projects list and a project's Tasks list update live as documents change in Firestore, with no manual refresh logic.
- **Cross-screen shared state via Context** — `ProjectContext` carries the "currently selected project" across the tab/stack navigation boundary instead of prop-drilling or re-fetching.
- **Denormalized counters** — `taskCount` is maintained on the parent project document on every add/delete, a common denormalization pattern to avoid expensive aggregate queries on read.
- **Environment-based secrets** — Firebase config now reads from `EXPO_PUBLIC_*` env vars instead of being committed to source (see Security Notes).

## Tech Stack

| Layer | Technology |
|---|---|
| Language | JavaScript (ES6+) |
| UI Framework | React Native (Expo managed workflow) |
| Navigation | React Navigation (bottom-tabs + stack) |
| Database | Firebase Cloud Firestore (realtime listeners) |
| State Management | React Context API |
| Tooling | Expo CLI, Metro bundler |

## System / Data Flow

```mermaid
flowchart TD
    A[ProjectsScreen] -- onSnapshot: projects collection --> B[(Firestore\nprojects/*)]
    A -- select project --> C[ProjectContext]
    C --> D[TasksScreen]
    D -- onSnapshot: tasks subcollection --> E[(Firestore\nprojects/{id}/tasks/*)]
    D -- addTask / deleteTask --> E
    D -- updateDoc taskCount --> B
```

## Getting Started & Local Setup

**Prerequisites:** Node.js 18+, npm, [Expo Go](https://expo.dev/go) or a simulator, and a Firebase project with Cloud Firestore enabled.

1. Install dependencies:
   ```bash
   git clone https://github.com/MzooNgubane/react-native-firestore-project-task-manager.git
   cd react-native-firestore-project-task-manager
   npm install
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env
   # fill in .env with your Firebase project's SDK config values
   ```
3. Run the app:
   ```bash
   npx expo start
   ```

## Testing & Validation

No automated test suite is included. To validate:

```bash
npx expo start        # confirms the bundle compiles with no syntax/import errors
```

Manual QA: create a project document in Firestore → confirm it appears in ProjectsScreen in realtime → tap into it → add/delete tasks → confirm `taskCount` on the parent document updates accordingly.

## Security Notes

Firebase Web SDK config was previously hardcoded in `firebase.js`. It now reads from environment variables (`.env`, gitignored) with `.env.example` as the template. Enforce actual data access control via [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started), not key secrecy.
