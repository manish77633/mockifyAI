# Graph Report - e:/mockify-saas  (2026-04-26)

## Corpus Check
- Corpus is ~19,716 words - fits in a single context window. You may not need a graph.

## Summary
- 117 nodes · 100 edges · 36 communities detected
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 12 edges
2. `generateMockData()` - 5 edges
3. `ManualModeForm()` - 4 edges
4. `SuccessCard()` - 4 edges
5. `buildBody()` - 3 edges
6. `Layout()` - 3 edges
7. `EndpointCard()` - 3 edges
8. `jsonByteSize()` - 2 edges
9. `checkPayloadSize()` - 2 edges
10. `checkModel()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `RecentEndpoints()` --calls--> `useAuth()`  [INFERRED]
  frontend\src\components\RecentEndpoints.jsx → frontend\src\hooks\useAuth.jsx
- `AIModeForm()` --calls--> `useAuth()`  [INFERRED]
  frontend\src\components\AIModeForm.jsx → frontend\src\hooks\useAuth.jsx
- `LoginForm()` --calls--> `useAuth()`  [INFERRED]
  frontend\src\components\AuthGateModal.jsx → frontend\src\hooks\useAuth.jsx
- `SignupForm()` --calls--> `useAuth()`  [INFERRED]
  frontend\src\components\AuthGateModal.jsx → frontend\src\hooks\useAuth.jsx
- `Layout()` --calls--> `useAuth()`  [INFERRED]
  frontend\src\components\Layout.jsx → frontend\src\hooks\useAuth.jsx

## Communities

### Community 0 - "Community 0"
Cohesion: 0.1
Nodes (9): AIModeForm(), LoginForm(), SignupForm(), CommunityTemplates(), LandingPage(), Login(), Pricing(), Signup() (+1 more)

### Community 1 - "Community 1"
Cohesion: 0.22
Nodes (0): 

### Community 2 - "Community 2"
Cohesion: 0.36
Nodes (4): buildAxiosSnippet(), buildCurlSnippet(), buildFetchSnippet(), SuccessCard()

### Community 3 - "Community 3"
Cohesion: 0.52
Nodes (6): buildBody(), buildPrompt(), extractText(), fetchWithTimeout(), generateMockData(), sleep()

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (0): 

### Community 5 - "Community 5"
Cohesion: 0.6
Nodes (3): formatBytes(), ManualModeForm(), validateJSON()

### Community 6 - "Community 6"
Cohesion: 0.6
Nodes (4): EndpointCard(), getLiveUrl(), RecentEndpoints(), timeAgo()

### Community 7 - "Community 7"
Cohesion: 0.67
Nodes (2): checkPayloadSize(), jsonByteSize()

### Community 8 - "Community 8"
Cohesion: 0.5
Nodes (2): Layout(), useTheme()

### Community 9 - "Community 9"
Cohesion: 0.5
Nodes (0): 

### Community 10 - "Community 10"
Cohesion: 0.67
Nodes (0): 

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (2): checkModel(), run()

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (2): run(), testModel()

### Community 13 - "Community 13"
Cohesion: 0.67
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 14`** (2 nodes): `generateToken()`, `authController.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (2 nodes): `list-models.js`, `listModels()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (2 nodes): `App()`, `App.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (2 nodes): `AnimatedBackground()`, `AnimatedBackground.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (2 nodes): `BackgroundParticles()`, `BackgroundParticles.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (2 nodes): `DocsModal()`, `DocsModal.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (2 nodes): `AnalyticsDashboard()`, `AnalyticsDashboard.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `APIPlayground()`, `APIPlayground.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (2 nodes): `Dashboard()`, `Dashboard.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `server.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `MockEndpoint.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `User.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `apiRoutes.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (1 nodes): `auth.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (1 nodes): `mockRoutes.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (1 nodes): `paymentRoutes.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (1 nodes): `users.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (1 nodes): `postcss.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (1 nodes): `tailwind.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (1 nodes): `vite.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (1 nodes): `main.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (1 nodes): `run_ast.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `Community 0` to `Community 8`, `Community 5`, `Community 6`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `ManualModeForm()` connect `Community 5` to `Community 0`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `RecentEndpoints()` connect `Community 6` to `Community 0`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Are the 11 inferred relationships involving `useAuth()` (e.g. with `AIModeForm()` and `LoginForm()`) actually correct?**
  _`useAuth()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._