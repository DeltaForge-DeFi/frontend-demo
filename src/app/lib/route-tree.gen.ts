/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './../routes/__root'

// Create Virtual Routes

const ProLazyImport = createFileRoute('/pro')()
const LiteLazyImport = createFileRoute('/lite')()
const DebugLazyImport = createFileRoute('/debug')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const ProLazyRoute = ProLazyImport.update({
  id: '/pro',
  path: '/pro',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./../routes/pro.lazy').then((d) => d.Route))

const LiteLazyRoute = LiteLazyImport.update({
  id: '/lite',
  path: '/lite',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./../routes/lite.lazy').then((d) => d.Route))

const DebugLazyRoute = DebugLazyImport.update({
  id: '/debug',
  path: '/debug',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./../routes/debug.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./../routes/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/debug': {
      id: '/debug'
      path: '/debug'
      fullPath: '/debug'
      preLoaderRoute: typeof DebugLazyImport
      parentRoute: typeof rootRoute
    }
    '/lite': {
      id: '/lite'
      path: '/lite'
      fullPath: '/lite'
      preLoaderRoute: typeof LiteLazyImport
      parentRoute: typeof rootRoute
    }
    '/pro': {
      id: '/pro'
      path: '/pro'
      fullPath: '/pro'
      preLoaderRoute: typeof ProLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/debug': typeof DebugLazyRoute
  '/lite': typeof LiteLazyRoute
  '/pro': typeof ProLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/debug': typeof DebugLazyRoute
  '/lite': typeof LiteLazyRoute
  '/pro': typeof ProLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/debug': typeof DebugLazyRoute
  '/lite': typeof LiteLazyRoute
  '/pro': typeof ProLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/debug' | '/lite' | '/pro'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/debug' | '/lite' | '/pro'
  id: '__root__' | '/' | '/debug' | '/lite' | '/pro'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  DebugLazyRoute: typeof DebugLazyRoute
  LiteLazyRoute: typeof LiteLazyRoute
  ProLazyRoute: typeof ProLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  DebugLazyRoute: DebugLazyRoute,
  LiteLazyRoute: LiteLazyRoute,
  ProLazyRoute: ProLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/debug",
        "/lite",
        "/pro"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/debug": {
      "filePath": "debug.lazy.tsx"
    },
    "/lite": {
      "filePath": "lite.lazy.tsx"
    },
    "/pro": {
      "filePath": "pro.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
