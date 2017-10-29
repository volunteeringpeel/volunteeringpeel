declare module 'promise-mysql' {
  interface EscapeFunctions {
    escape(value: any, stringifyObjects?: boolean, timeZone?: string): string;
    escapeId(value: string, forbidQualified?: boolean): string;
    format(sql: string, values: any[], stringifyObjects?: boolean, timeZone?: string): string;
  }

  // implements EscapeFunctions
  function escape(value: any, stringifyObjects?: boolean, timeZone?: string): string;

  function escapeId(value: string, forbidQualified?: boolean): string;

  function format(
    sql: string,
    values: any[],
    stringifyObjects?: boolean,
    timeZone?: string,
  ): string;

  function createConnection(connectionUri: string | ConnectionConfig): Promise<Connection>;

  function createPool(config: PoolConfig | string): Pool;

  function raw(sql: string): () => string;

  interface Connection extends EscapeFunctions {
    config: ConnectionConfig;
    state: 'connected' | 'authenticated' | 'disconnected' | 'protocol_error' | string;
    threadId: number | null;
    createQuery: QueryFunction;
    connect(callback?: (err: MysqlError, ...args: any[]) => void): void;
    connect(options: any, callback?: (err: MysqlError, ...args: any[]) => void): void;
    changeUser(options: ConnectionOptions, callback?: (err: MysqlError) => void): void;
    changeUser(callback: (err: MysqlError) => void): void;
    beginTransaction(options?: QueryOptions, callback?: (err: MysqlError) => void): void;
    beginTransaction(callback: (err: MysqlError) => void): void;
    commit(options?: QueryOptions, callback?: (err: MysqlError) => void): void;
    commit(callback: (err: MysqlError) => void): void;
    rollback(options?: QueryOptions, callback?: (err: MysqlError) => void): void;
    rollback(callback: (err: MysqlError) => void): void;
    query: QueryFunction;
    ping(options?: QueryOptions, callback?: (err: MysqlError) => void): void;
    ping(callback: (err: MysqlError) => void): void;
    statistics(options?: QueryOptions, callback?: (err: MysqlError) => void): void;
    statistics(callback: (err: MysqlError) => void): void;
    end(callback?: (err: MysqlError, ...args: any[]) => void): void;
    end(options: any, callback: (err: MysqlError, ...args: any[]) => void): void;
    destroy(): void;
    pause(): void;
    resume(): void;
    on(ev: 'drain' | 'connect', callback: () => void): Connection;
    on(ev: 'end', callback: (err?: MysqlError) => void): Connection;
    on(ev: 'fields', callback: (fields: any[]) => void): Connection;
    on(ev: 'error', callback: (err: MysqlError) => void): Connection;
    on(ev: 'enqueue', callback: (...args: any[]) => void): Connection;
    on(ev: string, callback: (...args: any[]) => void): this;
  }

  interface PoolConnection extends Connection {
    release(): void;
    end(): void;
    destroy(): void;
  }

  interface Pool extends EscapeFunctions {
    config: PoolConfig;
    getConnection(): Promise<PoolConnection>;
    acquireConnection(connection: PoolConnection): Promise<PoolConnection>;
    releaseConnection(connection: PoolConnection): void;
    end(callback?: (err: MysqlError) => void): void;
    query: QueryFunction;
    on(
      ev: 'connection' | 'acquire' | 'release',
      callback: (connection: PoolConnection) => void,
    ): Pool;
    on(ev: 'error', callback: (err: MysqlError) => void): Pool;
    on(ev: 'enqueue', callback: (err?: MysqlError) => void): Pool;
    on(ev: string, callback: (...args: any[]) => void): Pool;
  }

  // related to Query
  type packetCallback = (packet: any) => void;

  interface Query {
    /**
     * Template query
     */
    sql: string;
    /**
     * Values for template query
     */
    values?: string[];
    /**
     * Default true
     */
    typeCast?: TypeCast;
    /**
     * Default false
     */
    nestedTables: boolean;
    /**
     * Emits a query packet to start the query
     */
    start(): void;
    /**
     * Determines the packet class to use given the first byte of the packet.
     *
     * @param byte The first byte of the packet
     * @param parser The packet parser
     */
    determinePacket(byte: number, parser: any): any;
    OkPacket: packetCallback;
    ErrorPacket: packetCallback;
    ResultSetHeaderPacket: packetCallback;
    FieldPacket: packetCallback;
    EofPacket: packetCallback;
    RowDataPacket(packet: any, parser: any, connection: Connection): void;
    /**
     * Creates a Readable stream with the given options
     *
     * @param options The options for the stream. (see readable-stream package)
     */
    // stream(options?: stream.ReadableOptions): stream.Readable;
    on(ev: string, callback: (...args: any[]) => void): Query;
    on(ev: 'result', callback: (row: any, index: number) => void): Query;
    on(ev: 'error', callback: (err: MysqlError) => void): Query;
    on(ev: 'fields', callback: (fields: FieldInfo[], index: number) => void): Query;
    on(ev: 'packet', callback: (packet: any) => void): Query;
    on(ev: 'end', callback: () => void): Query;
  }

  interface GeometryType extends Array<{ x: number; y: number } | GeometryType> {
    x: number;
    y: number;
  }

  type TypeCast =
    | boolean
    | ((
        field: FieldInfo & {
          type: string;
          length: number;
          string(): string;
          buffer(): Buffer;
          geometry(): null | GeometryType;
        },
        next: () => void,
      ) => any);

  // values can be non [], see custom format (https://github.com/mysqljs/mysql#custom-format)
  interface QueryFunction {
    (query: Query): Query;
    (options: string | QueryOptions): Promise<any>;
    (options: string, values: any): Promise<any>;
  }

  interface QueryOptions {
    /**
     * The SQL for the query
     */
    sql: string;
    /**
     * Every operation takes an optional inactivity timeout option. This allows you to specify appropriate timeouts for
     * operations. It is important to note that these timeouts are not part of the MySQL protocol, and rather timeout
     * operations through the client. This means that when a timeout is reached, the connection it occurred on will be
     * destroyed and no further operations can be performed.
     */
    timeout?: number;
    /**
     * Either a boolean or string. If true, tables will be nested objects. If string (e.g. '_'), tables will be
     * nested as tableName_fieldName
     */
    nestTables?: any;
    /**
     * Determines if column values should be converted to native JavaScript types. It is not recommended (and may go away / change in the future)
     * to disable type casting, but you can currently do so on either the connection or query level. (Default: true)
     *
     * You can also specify a function (field: any, next: () => void) => {} to do the type casting yourself.
     *
     * WARNING: YOU MUST INVOKE the parser using one of these three field functions in your custom typeCast callback. They can only be called once.
     *
     * field.string()
     * field.buffer()
     * field.geometry()
     *
     * are aliases for
     *
     * parser.parseLengthCodedString()
     * parser.parseLengthCodedBuffer()
     * parser.parseGeometryValue()
     *
     * You can find which field function you need to use by looking at: RowDataPacket.prototype._typeCast
     */
    typeCast?: TypeCast;
  }

  interface ConnectionOptions {
    /**
     * The MySQL user to authenticate as
     */
    user?: string;
    /**
     * The password of that MySQL user
     */
    password?: string;
    /**
     * Name of the database to use for this connection
     */
    database?: string;
    /**
     * The charset for the connection. This is called "collation" in the SQL-level of MySQL (like utf8_general_ci).
     * If a SQL-level charset is specified (like utf8mb4) then the default collation for that charset is used.
     * (Default: 'UTF8_GENERAL_CI')
     */
    charset?: string;
    /**
     * Number of milliseconds
     */
    timeout?: number;
  }

  interface ConnectionConfig extends ConnectionOptions {
    /**
     * The hostname of the database you are connecting to. (Default: localhost)
     */
    host?: string;
    /**
     * The port number to connect to. (Default: 3306)
     */
    port?: number;
    /**
     * The source IP address to use for TCP connection
     */
    localAddress?: string;
    /**
     * The path to a unix domain socket to connect to. When used host and port are ignored
     */
    socketPath?: string;
    /**
     * The timezone used to store local dates. (Default: 'local')
     */
    timezone?: string;
    /**
     * The milliseconds before a timeout occurs during the initial connection to the MySQL server. (Default: 10 seconds)
     */
    connectTimeout?: number;
    /**
     * Stringify objects instead of converting to values. (Default: 'false')
     */
    stringifyObjects?: boolean;
    /**
     * Allow connecting to MySQL instances that ask for the old (insecure) authentication method. (Default: false)
     */
    insecureAuth?: boolean;
    /**
     * Determines if column values should be converted to native JavaScript types. It is not recommended (and may go away / change in the future)
     * to disable type casting, but you can currently do so on either the connection or query level. (Default: true)
     *
     * You can also specify a function (field: any, next: () => void) => {} to do the type casting yourself.
     *
     * WARNING: YOU MUST INVOKE the parser using one of these three field functions in your custom typeCast callback. They can only be called once.
     *
     * field.string()
     * field.buffer()
     * field.geometry()
     *
     * are aliases for
     *
     * parser.parseLengthCodedString()
     * parser.parseLengthCodedBuffer()
     * parser.parseGeometryValue()
     *
     * You can find which field function you need to use by looking at: RowDataPacket.prototype._typeCast
     */
    typeCast?: TypeCast;
    /**
     * A custom query format function
     */
    queryFormat?(query: string, values: any): void;
    /**
     * When dealing with big numbers (BIGINT and DECIMAL columns) in the database, you should enable this option
     * (Default: false)
     */
    supportBigNumbers?: boolean;
    /**
     * Enabling both supportBigNumbers and bigNumberStrings forces big numbers (BIGINT and DECIMAL columns) to be
     * always returned as JavaScript String objects (Default: false). Enabling supportBigNumbers but leaving
     * bigNumberStrings disabled will return big numbers as String objects only when they cannot be accurately
     * represented with [JavaScript Number objects] (http://ecma262-5.com/ELS5_HTML.htm#Section_8.5)
     * (which happens when they exceed the [-2^53, +2^53] range), otherwise they will be returned as Number objects.
     * This option is ignored if supportBigNumbers is disabled.
     */
    bigNumberStrings?: boolean;
    /**
     * Force date types (TIMESTAMP, DATETIME, DATE) to be returned as strings rather then inflated into JavaScript Date
     * objects. (Default: false)
     */
    dateStrings?: boolean;
    /**
     * This will print all incoming and outgoing packets on stdout.
     * You can also restrict debugging to packet types by passing an array of types (strings) to debug;
     *
     * (Default: false)
     */
    debug?: boolean | string[] | Types[];
    /**
     * Generates stack traces on errors to include call site of library entrance ("long stack traces"). Slight
     * performance penalty for most calls. (Default: true)
     */
    trace?: boolean;
    /**
     * Allow multiple mysql statements per query. Be careful with this, it exposes you to SQL injection attacks. (Default: false)
     */
    multipleStatements?: boolean;
    /**
     * List of connection flags to use other than the default ones. It is also possible to blacklist default ones
     */
    flags?: string[];
    /**
     * object with ssl parameters or a string containing name of ssl profile
     */
    // ssl?: tls.SecureContextOptions & { rejectUnauthorized?: boolean };
  }

  interface PoolConfig extends ConnectionConfig {
    /**
     * The milliseconds before a timeout occurs during the connection acquisition. This is slightly different from connectTimeout,
     * because acquiring a pool connection does not always involve making a connection. (Default: 10 seconds)
     */
    acquireTimeout?: number;
    /**
     * Determines the pool's action when no connections are available and the limit has been reached. If true, the pool will queue
     * the connection request and call it when one becomes available. If false, the pool will immediately call back with an error.
     * (Default: true)
     */
    waitForConnections?: boolean;
    /**
     * The maximum number of connections to create at once. (Default: 10)
     */
    connectionLimit?: number;
    /**
     * The maximum number of connection requests the pool will queue before returning an error from getConnection. If set to 0, there
     * is no limit to the number of queued connection requests. (Default: 0)
     */
    queueLimit?: number;
  }

  interface MysqlError extends Error {
    /**
     * Either a MySQL server error (e.g. 'ER_ACCESS_DENIED_ERROR'),
     * a node.js error (e.g. 'ECONNREFUSED') or an internal error
     * (e.g. 'PROTOCOL_CONNECTION_LOST').
     */
    code: string;
    /**
     * The error number for the error code
     */
    errno: number;
    /**
     * The sql state marker
     */
    sqlStateMarker?: string;
    /**
     * The sql state
     */
    sqlState?: string;
    /**
     * The field count
     */
    fieldCount?: number;
    /**
     * The stack trace for the error
     */
    stack?: string;
    /**
     * Boolean, indicating if this error is terminal to the connection object.
     */
    fatal: boolean;
    /**
     * SQL of failed query
     */
    sql?: string;
  }

  const enum Types {
    DECIMAL = 0x00,
    TINY = 0x01,
    SHORT = 0x02,
    LONG = 0x03,
    FLOAT = 0x04,
    DOUBLE = 0x05,
    NULL = 0x06,
    TIMESTAMP = 0x07,
    LONGLONG = 0x08,
    INT24 = 0x09,
    DATE = 0x0a,
    TIME = 0x0b,
    DATETIME = 0x0c,
    YEAR = 0x0d,
    NEWDATE = 0x0e,
    VARCHAR = 0x0f,
    BIT = 0x10,
    TIMESTAMP2 = 0x11,
    DATETIME2 = 0x12,
    TIME2 = 0x13,
    JSON = 0xf5,
    NEWDECIMAL = 0xf6,
    ENUM = 0xf7,
    SET = 0xf8,
    TINY_BLOB = 0xf9,
    MEDIUM_BLOB = 0xfa,
    LONG_BLOB = 0xfb,
    BLOB = 0xfc,
    VAR_STRING = 0xfd,
    STRING = 0xfe,
    GEOMETRY = 0xff, // aka DECIMAL (http://dev.mysql.com/doc/refman/5.0/en/precision-math-decimal-changes.html) // aka TINYINT, 1 byte // aka SMALLINT, 2 bytes // aka INT, 4 bytes // aka FLOAT, 4-8 bytes // aka DOUBLE, 8 bytes // NULL (used for prepared statements, I think) // aka TIMESTAMP // aka BIGINT, 8 bytes // aka MEDIUMINT, 3 bytes // aka DATE // aka TIME // aka DATETIME // aka YEAR, 1 byte (don't ask) // aka ? // aka VARCHAR (?) // aka BIT, 1-8 byte // aka TIMESTAMP with fractional seconds // aka DATETIME with fractional seconds // aka TIME with fractional seconds // aka JSON // aka DECIMAL // aka ENUM // aka SET // aka TINYBLOB, TINYTEXT // aka MEDIUMBLOB, MEDIUMTEXT // aka LONGBLOG, LONGTEXT // aka BLOB, TEXT // aka VARCHAR, VARBINARY // aka CHAR, BINARY // aka GEOMETRY
  }

  interface FieldInfo {
    catalog: string;
    db: string;
    table: string;
    orgTable: string;
    name: string;
    orgName: string;
    charsetNr: number;
    length: number;
    type: Types;
    flags: number;
    decimals: number;
    default?: string;
    zeroFill: boolean;
    protocol41: boolean;
  }
}
