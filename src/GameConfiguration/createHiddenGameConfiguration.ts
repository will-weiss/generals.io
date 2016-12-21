import { HiddenGameConfiguration } from '../types'


export default function createHiddenGameConfiguration(): HiddenGameConfiguration {
  return { cities: new Set(), crowns: new Map() }
}
