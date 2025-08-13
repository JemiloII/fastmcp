import { getRandomPort } from 'get-port-please';
import { afterEach, describe, expect, it, vi } from "vitest";

import { FastMCP } from './FastMCP.js';

vi.mock("mcp-proxy", () => ({
  startHTTPServer: vi.fn(),
  startHTTPSServer: vi.fn(),
}));

describe("SSL and host configuration mocking", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("passes custom host to startHTTPServer", async () => {
    const mcpProxy = await import("mcp-proxy");
    vi.mocked(mcpProxy.startHTTPServer).mockResolvedValue({ close: vi.fn() });

    const port = await getRandomPort();
    const server = new FastMCP({
      name: "Test",
      version: "1.0.0",
    });

    await server.start({
      httpStream: {
        host: "0.0.0.0",
        port,
      },
      transportType: "httpStream",
    });

    expect(mcpProxy.startHTTPServer).toHaveBeenCalledWith(
      expect.objectContaining({
        host: "0.0.0.0",
      })
    );

    await server.stop();
  });

  it("passes SSL configuration to startHTTPSServer", async () => {
    const mcpProxy = await import("mcp-proxy");
    vi.mocked(mcpProxy.startHTTPSServer).mockResolvedValue({ close: vi.fn() });

    const port = await getRandomPort();
    const server = new FastMCP({
      name: "Test",
      version: "1.0.0",
    });

    const sslConfig = {
      cert: "test-cert",
      key: "test-key",
    };

    await server.start({
      httpStream: {
        port,
        ssl: sslConfig,
      },
      transportType: "httpStream",
    });

    expect(mcpProxy.startHTTPSServer).toHaveBeenCalledWith(
      expect.objectContaining({
        ssl: sslConfig,
      })
    );

    await server.stop();
  });

  it("passes SSL configuration with passphrase to startHTTPSServer", async () => {
    const mcpProxy = await import("mcp-proxy");
    vi.mocked(mcpProxy.startHTTPSServer).mockResolvedValue({ close: vi.fn() });

    const port = await getRandomPort();
    const server = new FastMCP({
      name: "Test",
      version: "1.0.0",
    });

    const sslConfig = {
      cert: "test-cert",
      key: "test-key",
      passphrase: "test-passphrase",
    };

    await server.start({
      httpStream: {
        port,
        ssl: sslConfig,
      },
      transportType: "httpStream",
    });

    expect(mcpProxy.startHTTPSServer).toHaveBeenCalledWith(
      expect.objectContaining({
        ssl: sslConfig,
      })
    );

    await server.stop();
  });
});
