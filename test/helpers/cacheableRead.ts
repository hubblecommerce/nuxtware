// Reusable verification helper for the cache-rework read tickets (#4–#7).
//
// The single test seam for every catalog read is
// `useShopwareContext().apiClient.invoke(operationString, options)`, mocked as a
// `vi.fn()`. The operation string encodes operation + HTTP method + path
// (e.g. `readCategory get /category/{navigationId}`); a *cacheable* read is one
// that issues a GET and compresses its Criteria into `options.query._criteria`
// instead of sending a POST body. This module parses that seam and asserts a
// given read chose the cacheable GET variant, so each downstream read ticket
// verifies external behaviour (which operation + method) rather than internals.
import { expect } from 'vitest'
import type { Mock } from 'vitest'

export interface ParsedInvokeCall {
    /** Operation name segment, e.g. `readCategory`. */
    operationName: string
    /** HTTP method segment, lower-cased by the SDK, e.g. `get` / `post`. */
    method: string
    /** Path segment, e.g. `/category/{navigationId}`. */
    path: string
    /** The options object passed alongside the operation string, if any. */
    options: InvokeOptions | undefined
}

interface InvokeOptions {
    query?: Record<string, unknown>
    body?: unknown
    [key: string]: unknown
}

/**
 * Parse one captured `apiClient.invoke(...)` call.
 * Operation string format: `"<operationName> <method> <path>"`.
 */
export function parseInvokeCall (call: readonly unknown[]): ParsedInvokeCall {
    const [operation, options] = call
    const [operationName = '', method = '', path = ''] = String(operation).split(' ')
    return { operationName, method, path, options: options as InvokeOptions | undefined }
}

export interface CacheableGetExpectation {
    /** Operation name the read is expected to invoke, e.g. `readCategory`. */
    operationName: string
    /** Optional path assertion, e.g. `/category/{navigationId}`. */
    path?: string
    /**
     * Whether the read must compress its Criteria into `query._criteria`. True
     * for catalog reads that carry a Criteria (category, product, seo-url,
     * navigation); set `false` for parameterless GET reads (e.g. languages).
     * @default true
     */
    requireCriteria?: boolean
}

/**
 * Assert that a captured `invoke` seam issued the expected cacheable GET.
 *
 * Locates the last call matching `operationName`, then asserts the method is
 * `get`, the path matches (when given), and — unless opted out — that the
 * Criteria travels in `query._criteria` with no POST body. Returns the parsed
 * call so callers can make further assertions.
 */
export function expectCacheableGet (
    invoke: Mock,
    expected: CacheableGetExpectation,
): ParsedInvokeCall {
    const { operationName, path, requireCriteria = true } = expected

    const matches = invoke.mock.calls
        .map(parseInvokeCall)
        .filter(call => call.operationName === operationName)

    expect(
        matches.length,
        `expected apiClient.invoke to be called with a "${operationName}" operation, ` +
        `but saw: ${invoke.mock.calls.map(c => String(c[0])).join(', ') || '(none)'}`,
    ).toBeGreaterThan(0)

    const parsed = matches[matches.length - 1]!

    // A cacheable read MUST be a GET — that is the entire point of the flag.
    expect(parsed.method, `"${operationName}" must issue a GET to be cacheable`).toBe('get')

    if (path !== undefined) {
        expect(parsed.path).toBe(path)
    }

    if (requireCriteria) {
        // The GET variant carries its Criteria in `query._criteria` and never a body.
        expect(
            parsed.options?.query && '_criteria' in parsed.options.query,
            `cacheable GET "${operationName}" must compress its Criteria into query._criteria`,
        ).toBe(true)
        expect(
            parsed.options?.body,
            `cacheable GET "${operationName}" must not send a POST body`,
        ).toBeUndefined()
    }

    return parsed
}

/**
 * Run a read and verify it issued the expected cacheable GET, then return the
 * read's result so the caller can assert the app rendered correctly from it.
 *
 * This is the one-call entry point downstream tickets reuse: it captures the
 * seam behaviour (correct operation + GET method) and hands back the response
 * that the page/component is expected to render from.
 *
 * @param invoke  the mocked `apiClient.invoke` seam
 * @param read    a thunk that triggers the read under test
 * @param expected  which cacheable GET the read is expected to issue
 */
export async function verifyCacheableRead<T> (
    invoke: Mock,
    read: () => Promise<T>,
    expected: CacheableGetExpectation,
): Promise<{ result: T, call: ParsedInvokeCall }> {
    invoke.mockClear()
    const result = await read()
    const call = expectCacheableGet(invoke, expected)
    return { result, call }
}
