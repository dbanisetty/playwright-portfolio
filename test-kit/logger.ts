const LEVELS = ['info', 'warn', 'error'] as const;
export type LogLevel = (typeof LEVELS)[number];

export interface LogEntry {
  ts: string;
  level: LogLevel;
  context: string;
  message: string;
}

export interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  /** A sub-logger whose context is nested under this one, sharing the same buffer. */
  child(context: string): Logger;
  /** Everything logged through this logger and its children, in order. */
  readonly entries: readonly LogEntry[];
}

function format(entry: LogEntry): string {
  return `${entry.ts} ${entry.level.toUpperCase().padEnd(5)} [${entry.context}] ${entry.message}`;
}

class BufferLogger implements Logger {
  private readonly sink: LogEntry[];

  constructor(
    private readonly context: string,
    sink?: LogEntry[],
  ) {
    this.sink = sink ?? [];
  }

  private write(level: LogLevel, message: string): void {
    const entry: LogEntry = { ts: new Date().toISOString(), level, context: this.context, message };
    this.sink.push(entry);
    const line = format(entry);
    if (level === 'error') console.error(line);
    else if (level === 'warn') console.warn(line);
    else console.log(line);
  }

  info(message: string): void {
    this.write('info', message);
  }

  warn(message: string): void {
    this.write('warn', message);
  }

  error(message: string): void {
    this.write('error', message);
  }

  child(context: string): Logger {
    return new BufferLogger(`${this.context} > ${context}`, this.sink);
  }

  get entries(): readonly LogEntry[] {
    return this.sink;
  }
}

export function createLogger(context: string): Logger {
  return new BufferLogger(context);
}

/** Render a logger's buffer as plain text — used when attaching to the HTML report. */
export function renderLog(logger: Logger): string {
  return logger.entries.map(format).join('\n');
}
