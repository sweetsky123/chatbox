import type { Session, SessionHeader, Updater } from '@shared/types'
import { InMemorySessionRepository } from '@chatbox/core/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { getSessionMock, readThreadsMock, updateSessionMock, uiStoreState } = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  updateSessionMock: vi.fn(),
  readThreadsMock: vi.fn(),
  uiStoreState: {
    sessionAgentModeMap: {} as Record<string, unknown>,
    agentModeSmartSwitchingDefault: false,
    agentModeLastSelected: 'off',
    clearSessionAgentMode: vi.fn(),
  },
}))

vi.mock('@/app/renderer-application', () => ({
  rendererApplication: {
    sessions: {
      getSessionHeader: getSessionMock,
      readSessionThreadSummariesPage: readThreadsMock,
      updateSessionHeader: updateSessionMock,
    },
  },
}))
vi.mock('../uiStore', () => ({
  uiStore: { getState: () => uiStoreState, setState: vi.fn() },
  useUIStore: vi.fn(),
}))

import { lockSessionAgentMode, setSessionAgentMode } from './agent-mode'

function session(overrides: Partial<Session>): Session {
  return { id: 'session-1', name: 'S', messages: [], ...overrides }
}

const userMsg: Session['messages'][number] = { id: 'u1', role: 'user', contentParts: [] }
let repository: InMemorySessionRepository
async function seed(value: Session) {
  await repository.seedSession(value)
}

describe('setSessionAgentMode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    repository = new InMemorySessionRepository()
    getSessionMock.mockImplementation((id: string) => repository.getSessionHeader(id))
    readThreadsMock.mockImplementation((request) => repository.readSessionThreadSummariesPage(request))
    updateSessionMock.mockImplementation(
      async (id: string, updater: Updater<SessionHeader>, options?: { expectedRevision?: number }) =>
        (await repository.executeSessionCommand(id, { type: 'header', updater }, options?.expectedRevision)).delta
          .header
    )
  })

  it.each(['legacy', 'rows'] as const)(
    'persists the first mode change after reopening a %s session',
    async (format) => {
      const value = session({
        type: 'chat',
        settings: { agentMode: { value: 'off', locked: false, lockReason: null } },
      })
      if (format === 'legacy') await repository.recordStore.setRecord(value)
      else await seed(value)
      await expect(setSessionAgentMode(value.id, 'auto')).resolves.toMatchObject({ value: 'auto' })
      expect((await repository.getSessionHeader(value.id))?.header.settings?.agentMode?.value).toBe('auto')
      await expect(lockSessionAgentMode(value.id, 'message_sent')).resolves.toMatchObject({ locked: true })
      expect((await repository.getSessionHeader(value.id))?.header.settings?.agentMode).toMatchObject({
        value: 'on',
        locked: true,
      })
    }
  )

  it('allows a manual chat→work switch after the conversation has started', async () => {
    await seed(
      session({ messages: [userMsg], settings: { agentMode: { value: 'off', locked: false, lockReason: null } } })
    )

    const entry = await setSessionAgentMode('session-1', 'on')

    expect(entry.value).toBe('on')
    expect(updateSessionMock).toHaveBeenCalled()
    expect((await repository.getSessionHeader('session-1'))?.header.settings?.agentMode?.value).toBe('on')
  })

  it('allows manual cross-mode switching before the first user message', async () => {
    await seed(session({ messages: [], settings: { agentMode: { value: 'off', locked: false, lockReason: null } } }))

    await setSessionAgentMode('session-1', 'on')

    expect(updateSessionMock).toHaveBeenCalled()
  })

  it('keeps refusing to leave a locked work session', async () => {
    await seed(
      session({
        messages: [userMsg],
        settings: { agentMode: { value: 'on', locked: true, lockReason: 'message_sent' } },
      })
    )

    const entry = await setSessionAgentMode('session-1', 'off')

    expect(entry.value).toBe('on')
    expect(updateSessionMock).not.toHaveBeenCalled()
  })
})
