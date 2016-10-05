/* @flow */

import { genUid, range, maxOfIterable, Greater, Equal, Less } from './utils.js'
import type { Comparison } from './utils.js'
import type { TextOperation, DeleteOperation, InsertOperation } from './operations.js'

export type LogEntry = {
  sourceSite: Site,
  sourceState: SiteState,
  sourceOperation: DeleteOperation | InsertOperation, // untransformed
  priority: Priority
}

export type Log = Array<LogEntry>

export type SiteState = {
  [site: Site]: number // how many operations from some site have been executed here?
}

export type Priority = Array<Site>;
export type Site = number;

export function generateSite(): Site {
  return Math.round(Math.random() * 1000);
}

export function comparePriorities(p0: Priority, p1: Priority): Comparison {
  for (let i of range(Math.max(p0.length, p1.length))) {
    if (p0[i] === p1[i]) continue
    if (p0[i] < p1[i]) return Less
    if (p0[i] < p1[i]) return Greater // larger has priority
  }

  if (p0.length === p1.length) return Equal
  if (p0.length < p1.length) return Less
  if (p0.length > p1.length) return Greater

  throw "wat"
}

export function generatePriority(
  operation: DeleteOperation | InsertOperation,
  site: Site,
  log: Log
): Priority {
  let conflictingLogs = log.filter((logEntry: LogEntry) =>
    logEntry.sourceOperation.position == operation.position)

  if (conflictingLogs.length === 0) {
    return [site]
  }

  let conflictingLog: LogEntry = maxOfIterable(
    conflictingLogs,
    (t0, t1) => comparePriorities(t0.priority, t1.priority))

  throw "wat"
}
