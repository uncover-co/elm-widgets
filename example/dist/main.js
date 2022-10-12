// elm-watch hot {"version":"1.0.2","webSocketPort":50130}
"use strict";
(() => {
  // node_modules/tiny-decoders/index.mjs
  function number(value) {
    if (typeof value !== "number") {
      throw new DecoderError({ tag: "number", got: value });
    }
    return value;
  }
  function string(value) {
    if (typeof value !== "string") {
      throw new DecoderError({ tag: "string", got: value });
    }
    return value;
  }
  function stringUnion(mapping) {
    return function stringUnionDecoder(value) {
      const str = string(value);
      if (!Object.prototype.hasOwnProperty.call(mapping, str)) {
        throw new DecoderError({
          tag: "unknown stringUnion variant",
          knownVariants: Object.keys(mapping),
          got: str
        });
      }
      return str;
    };
  }
  function unknownArray(value) {
    if (!Array.isArray(value)) {
      throw new DecoderError({ tag: "array", got: value });
    }
    return value;
  }
  function unknownRecord(value) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      throw new DecoderError({ tag: "object", got: value });
    }
    return value;
  }
  function array(decoder) {
    return function arrayDecoder(value) {
      const arr = unknownArray(value);
      const result = [];
      for (let index = 0; index < arr.length; index++) {
        try {
          result.push(decoder(arr[index]));
        } catch (error) {
          throw DecoderError.at(error, index);
        }
      }
      return result;
    };
  }
  function record(decoder) {
    return function recordDecoder(value) {
      const object = unknownRecord(value);
      const keys = Object.keys(object);
      const result = {};
      for (const key of keys) {
        if (key === "__proto__") {
          continue;
        }
        try {
          result[key] = decoder(object[key]);
        } catch (error) {
          throw DecoderError.at(error, key);
        }
      }
      return result;
    };
  }
  function fields(callback, { exact = "allow extra", allow = "object" } = {}) {
    return function fieldsDecoder(value) {
      const object = allow === "array" ? unknownArray(value) : unknownRecord(value);
      const knownFields = /* @__PURE__ */ Object.create(null);
      function field(key, decoder) {
        try {
          const result2 = decoder(object[key]);
          knownFields[key] = null;
          return result2;
        } catch (error) {
          throw DecoderError.at(error, key);
        }
      }
      const result = callback(field, object);
      if (exact !== "allow extra") {
        const unknownFields = Object.keys(object).filter((key) => !Object.prototype.hasOwnProperty.call(knownFields, key));
        if (unknownFields.length > 0) {
          throw new DecoderError({
            tag: "exact fields",
            knownFields: Object.keys(knownFields),
            got: unknownFields
          });
        }
      }
      return result;
    };
  }
  function fieldsAuto(mapping, { exact = "allow extra" } = {}) {
    return function fieldsAutoDecoder(value) {
      const object = unknownRecord(value);
      const keys = Object.keys(mapping);
      const result = {};
      for (const key of keys) {
        if (key === "__proto__") {
          continue;
        }
        const decoder = mapping[key];
        try {
          result[key] = decoder(object[key]);
        } catch (error) {
          throw DecoderError.at(error, key);
        }
      }
      if (exact !== "allow extra") {
        const unknownFields = Object.keys(object).filter((key) => !Object.prototype.hasOwnProperty.call(mapping, key));
        if (unknownFields.length > 0) {
          throw new DecoderError({
            tag: "exact fields",
            knownFields: keys,
            got: unknownFields
          });
        }
      }
      return result;
    };
  }
  function fieldsUnion(key, mapping) {
    return fields(function fieldsUnionFields(field, object) {
      const tag = field(key, string);
      if (Object.prototype.hasOwnProperty.call(mapping, tag)) {
        const decoder = mapping[tag];
        return decoder(object);
      }
      throw new DecoderError({
        tag: "unknown fieldsUnion tag",
        knownTags: Object.keys(mapping),
        got: tag,
        key
      });
    });
  }
  function multi(mapping) {
    return function multiDecoder(value) {
      if (value === void 0) {
        if (mapping.undefined !== void 0) {
          return mapping.undefined(value);
        }
      } else if (value === null) {
        if (mapping.null !== void 0) {
          return mapping.null(value);
        }
      } else if (typeof value === "boolean") {
        if (mapping.boolean !== void 0) {
          return mapping.boolean(value);
        }
      } else if (typeof value === "number") {
        if (mapping.number !== void 0) {
          return mapping.number(value);
        }
      } else if (typeof value === "string") {
        if (mapping.string !== void 0) {
          return mapping.string(value);
        }
      } else if (Array.isArray(value)) {
        if (mapping.array !== void 0) {
          return mapping.array(value);
        }
      } else {
        if (mapping.object !== void 0) {
          return mapping.object(value);
        }
      }
      throw new DecoderError({
        tag: "unknown multi type",
        knownTypes: Object.keys(mapping),
        got: value
      });
    };
  }
  function chain(decoder, next) {
    return function chainDecoder(value) {
      return next(decoder(value));
    };
  }
  function formatDecoderErrorVariant(variant, options) {
    const formatGot = (value) => {
      const formatted = repr(value, options);
      return (options === null || options === void 0 ? void 0 : options.sensitive) === true ? `${formatted}
(Actual values are hidden in sensitive mode.)` : formatted;
    };
    const stringList = (strings) => strings.length === 0 ? "(none)" : strings.map((s) => JSON.stringify(s)).join(", ");
    const got = (message, value) => value === DecoderError.MISSING_VALUE ? message : `${message}
Got: ${formatGot(value)}`;
    switch (variant.tag) {
      case "boolean":
      case "number":
      case "string":
        return got(`Expected a ${variant.tag}`, variant.got);
      case "array":
      case "object":
        return got(`Expected an ${variant.tag}`, variant.got);
      case "unknown multi type":
        return `Expected one of these types: ${variant.knownTypes.length === 0 ? "never" : variant.knownTypes.join(", ")}
Got: ${formatGot(variant.got)}`;
      case "unknown fieldsUnion tag":
        return `Expected one of these tags: ${stringList(variant.knownTags)}
Got: ${formatGot(variant.got)}`;
      case "unknown stringUnion variant":
        return `Expected one of these variants: ${stringList(variant.knownVariants)}
Got: ${formatGot(variant.got)}`;
      case "exact fields":
        return `Expected only these fields: ${stringList(variant.knownFields)}
Found extra fields: ${formatGot(variant.got).replace(/^\[|\]$/g, "")}`;
      case "tuple size":
        return `Expected ${variant.expected} items
Got: ${variant.got}`;
      case "custom":
        return got(variant.message, variant.got);
    }
  }
  var DecoderError = class extends TypeError {
    constructor({ key, ...params }) {
      const variant = "tag" in params ? params : { tag: "custom", message: params.message, got: params.value };
      super(`${formatDecoderErrorVariant(
        variant,
        { sensitive: true }
      )}

For better error messages, see https://github.com/lydell/tiny-decoders#error-messages`);
      this.path = key === void 0 ? [] : [key];
      this.variant = variant;
      this.nullable = false;
      this.optional = false;
    }
    static at(error, key) {
      if (error instanceof DecoderError) {
        if (key !== void 0) {
          error.path.unshift(key);
        }
        return error;
      }
      return new DecoderError({
        tag: "custom",
        message: error instanceof Error ? error.message : String(error),
        got: DecoderError.MISSING_VALUE,
        key
      });
    }
    format(options) {
      const path = this.path.map((part) => `[${JSON.stringify(part)}]`).join("");
      const nullableString = this.nullable ? " (nullable)" : "";
      const optionalString = this.optional ? " (optional)" : "";
      const variant = formatDecoderErrorVariant(this.variant, options);
      return `At root${path}${nullableString}${optionalString}:
${variant}`;
    }
  };
  DecoderError.MISSING_VALUE = Symbol("DecoderError.MISSING_VALUE");
  function repr(value, { recurse = true, maxArrayChildren = 5, maxObjectChildren = 3, maxLength = 100, recurseMaxLength = 20, sensitive = false } = {}) {
    const type = typeof value;
    const toStringType = Object.prototype.toString.call(value).replace(/^\[object\s+(.+)\]$/, "$1");
    try {
      if (value == null || type === "number" || type === "boolean" || type === "symbol" || toStringType === "RegExp") {
        return sensitive ? toStringType.toLowerCase() : truncate(String(value), maxLength);
      }
      if (type === "string") {
        return sensitive ? type : truncate(JSON.stringify(value), maxLength);
      }
      if (typeof value === "function") {
        return `function ${truncate(JSON.stringify(value.name), maxLength)}`;
      }
      if (Array.isArray(value)) {
        const arr = value;
        if (!recurse && arr.length > 0) {
          return `${toStringType}(${arr.length})`;
        }
        const lastIndex = arr.length - 1;
        const items = [];
        const end = Math.min(maxArrayChildren - 1, lastIndex);
        for (let index = 0; index <= end; index++) {
          const item = index in arr ? repr(arr[index], {
            recurse: false,
            maxLength: recurseMaxLength,
            sensitive
          }) : "<empty>";
          items.push(item);
        }
        if (end < lastIndex) {
          items.push(`(${lastIndex - end} more)`);
        }
        return `[${items.join(", ")}]`;
      }
      if (toStringType === "Object") {
        const object = value;
        const keys = Object.keys(object);
        const { name } = object.constructor;
        if (!recurse && keys.length > 0) {
          return `${name}(${keys.length})`;
        }
        const numHidden = Math.max(0, keys.length - maxObjectChildren);
        const items = keys.slice(0, maxObjectChildren).map((key2) => `${truncate(JSON.stringify(key2), recurseMaxLength)}: ${repr(object[key2], {
          recurse: false,
          maxLength: recurseMaxLength,
          sensitive
        })}`).concat(numHidden > 0 ? `(${numHidden} more)` : []);
        const prefix = name === "Object" ? "" : `${name} `;
        return `${prefix}{${items.join(", ")}}`;
      }
      return toStringType;
    } catch (_error) {
      return toStringType;
    }
  }
  function truncate(str, maxLength) {
    const half = Math.floor(maxLength / 2);
    return str.length <= maxLength ? str : `${str.slice(0, half)}\u2026${str.slice(-half)}`;
  }

  // src/Helpers.ts
  function join(array2, separator) {
    return array2.join(separator);
  }
  function pad(number2) {
    return number2.toString().padStart(2, "0");
  }
  function formatDate(date) {
    return join(
      [pad(date.getFullYear()), pad(date.getMonth() + 1), pad(date.getDate())],
      "-"
    );
  }
  function formatTime(date) {
    return join(
      [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())],
      ":"
    );
  }

  // src/TeaProgram.ts
  async function runTeaProgram(options) {
    return new Promise((resolve, reject) => {
      const [initialModel, initialCmds] = options.init;
      let model = initialModel;
      const msgQueue = [];
      let killed = false;
      const dispatch = (dispatchedMsg) => {
        if (killed) {
          return;
        }
        const alreadyRunning = msgQueue.length > 0;
        msgQueue.push(dispatchedMsg);
        if (alreadyRunning) {
          return;
        }
        for (const msg of msgQueue) {
          const [newModel, cmds] = options.update(msg, model);
          model = newModel;
          runCmds(cmds);
        }
        msgQueue.length = 0;
      };
      const runCmds = (cmds) => {
        for (const cmd of cmds) {
          options.runCmd(
            cmd,
            mutable,
            dispatch,
            (result) => {
              cmds.length = 0;
              killed = true;
              resolve(result);
            },
            (error) => {
              cmds.length = 0;
              killed = true;
              reject(error);
            }
          );
          if (killed) {
            break;
          }
        }
      };
      const mutable = options.initMutable(
        dispatch,
        (result) => {
          killed = true;
          resolve(result);
        },
        (error) => {
          killed = true;
          reject(error);
        }
      );
      runCmds(initialCmds);
    });
  }

  // src/Types.ts
  var CompilationMode = stringUnion({
    debug: null,
    standard: null,
    optimize: null
  });

  // client/WebSocketMessages.ts
  var FocusedTabAcknowledged = fieldsAuto({
    tag: () => "FocusedTabAcknowledged"
  });
  var StatusChanged = fieldsAuto({
    tag: () => "StatusChanged",
    status: fieldsUnion("tag", {
      AlreadyUpToDate: fieldsAuto({
        tag: () => "AlreadyUpToDate",
        compilationMode: CompilationMode
      }),
      Busy: fieldsAuto({
        tag: () => "Busy",
        compilationMode: CompilationMode
      }),
      CompileError: fieldsAuto({
        tag: () => "CompileError",
        compilationMode: CompilationMode
      }),
      ClientError: fieldsAuto({
        tag: () => "ClientError",
        message: string
      })
    })
  });
  var SuccessfullyCompiled = fieldsAuto({
    tag: () => "SuccessfullyCompiled",
    code: string,
    elmCompiledTimestamp: number,
    compilationMode: CompilationMode
  });
  var SuccessfullyCompiledButRecordFieldsChanged = fieldsAuto({
    tag: () => "SuccessfullyCompiledButRecordFieldsChanged"
  });
  var WebSocketToClientMessage = fieldsUnion("tag", {
    FocusedTabAcknowledged,
    StatusChanged,
    SuccessfullyCompiled,
    SuccessfullyCompiledButRecordFieldsChanged
  });
  var WebSocketToServerMessage = fieldsUnion("tag", {
    ChangedCompilationMode: fieldsAuto({
      tag: () => "ChangedCompilationMode",
      compilationMode: CompilationMode
    }),
    FocusedTab: fieldsAuto({
      tag: () => "FocusedTab"
    })
  });
  function decodeWebSocketToClientMessage(message) {
    if (message.startsWith("//")) {
      const newlineIndexRaw = message.indexOf("\n");
      const newlineIndex = newlineIndexRaw === -1 ? message.length : newlineIndexRaw;
      const jsonString = message.slice(2, newlineIndex);
      const parsed = SuccessfullyCompiled(JSON.parse(jsonString));
      return { ...parsed, code: message };
    } else {
      return WebSocketToClientMessage(JSON.parse(message));
    }
  }

  // client/client.ts
  window.__ELM_WATCH_MOCKED_TIMINGS ?? (window.__ELM_WATCH_MOCKED_TIMINGS = false);
  window.__ELM_WATCH_WEBSOCKET_TIMEOUT ?? (window.__ELM_WATCH_WEBSOCKET_TIMEOUT = 1e3);
  window.__ELM_WATCH_ON_INIT ?? (window.__ELM_WATCH_ON_INIT = () => {
  });
  window.__ELM_WATCH_ON_RENDER ?? (window.__ELM_WATCH_ON_RENDER = () => {
  });
  window.__ELM_WATCH_ON_REACHED_IDLE_STATE ?? (window.__ELM_WATCH_ON_REACHED_IDLE_STATE = () => {
  });
  window.__ELM_WATCH_RELOAD_STATUSES ?? (window.__ELM_WATCH_RELOAD_STATUSES = {});
  var RELOAD_MESSAGE_KEY = "__elmWatchReloadMessage";
  window.__ELM_WATCH_RELOAD_PAGE ?? (window.__ELM_WATCH_RELOAD_PAGE = (message) => {
    if (message !== void 0) {
      try {
        window.sessionStorage.setItem(RELOAD_MESSAGE_KEY, message);
      } catch {
      }
    }
    window.location.reload();
  });
  window.__ELM_WATCH_KILL_MATCHING ?? (window.__ELM_WATCH_KILL_MATCHING = () => Promise.resolve());
  window.__ELM_WATCH_DISCONNECT ?? (window.__ELM_WATCH_DISCONNECT = () => {
  });
  window.__ELM_WATCH_LOG_DEBUG ?? (window.__ELM_WATCH_LOG_DEBUG = console.debug);
  var VERSION = "1.0.2";
  var TARGET_NAME = "Main";
  var INITIAL_ELM_COMPILED_TIMESTAMP = Number(
    "1665591638346"
  );
  var ORIGINAL_COMPILATION_MODE = "standard";
  var WEBSOCKET_PORT = "50130";
  var CONTAINER_ID = "elm-watch";
  var DEBUG = String("false") === "true";
  var SEND_KEY_DO_NOT_USE_ALL_THE_TIME = Symbol(
    "This value is supposed to only be obtained via `Status`."
  );
  function logDebug(...args) {
    if (DEBUG) {
      window.__ELM_WATCH_LOG_DEBUG(...args);
    }
  }
  function run() {
    try {
      const message = window.sessionStorage.getItem(RELOAD_MESSAGE_KEY);
      if (message !== null) {
        console.info(message);
        window.sessionStorage.removeItem(RELOAD_MESSAGE_KEY);
      }
    } catch {
    }
    const container = getOrCreateContainer();
    const { shadowRoot } = container;
    if (shadowRoot === null) {
      throw new Error(
        `elm-watch: Cannot set up hot reload, because an element with ID ${CONTAINER_ID} exists, but \`.shadowRoot\` is null!`
      );
    }
    let root = shadowRoot.querySelector(`.${CLASS.root}`);
    if (root === null) {
      root = h(HTMLDivElement, { className: CLASS.root });
      shadowRoot.append(root);
    }
    const existingTargetRoot = Array.from(root.children).find(
      (element) => element.getAttribute("data-target") === TARGET_NAME
    );
    if (existingTargetRoot !== void 0) {
      return;
    }
    const targetRoot = createTargetRoot(TARGET_NAME);
    root.append(targetRoot);
    const getNow = () => new Date();
    runTeaProgram({
      initMutable: initMutable(getNow, targetRoot),
      init: init(getNow()),
      update: (msg, model) => {
        const [updatedModel, cmds] = update(msg, model);
        const modelChanged = updatedModel !== model;
        const newModel = modelChanged ? {
          ...updatedModel,
          previousStatusTag: model.status.tag
        } : model;
        const allCmds = modelChanged ? [
          ...cmds,
          {
            tag: "UpdateGlobalStatus",
            reloadStatus: statusToReloadStatus(newModel.status)
          },
          {
            tag: "Render",
            model: newModel,
            manageFocus: msg.tag === "UiMsg"
          }
        ] : cmds;
        logDebug(`${msg.tag} (${TARGET_NAME})`, msg, newModel, allCmds);
        return [newModel, allCmds];
      },
      runCmd: runCmd(getNow, targetRoot)
    }).catch((error) => {
      console.error("elm-watch: Unexpectedly exited with error:", error);
    });
  }
  function statusToReloadStatus(status) {
    switch (status.tag) {
      case "Busy":
      case "Connecting":
        return { tag: "MightWantToReload" };
      case "CompileError":
      case "EvalError":
      case "Idle":
      case "SleepingBeforeReconnect":
      case "UnexpectedError":
        return { tag: "NoReloadWanted" };
      case "WaitingForReload":
        return { tag: "ReloadRequested", reasons: status.reasons };
    }
  }
  function statusToStatusType(statusTag) {
    switch (statusTag) {
      case "Idle":
        return "Success";
      case "Busy":
      case "Connecting":
      case "SleepingBeforeReconnect":
      case "WaitingForReload":
        return "Waiting";
      case "CompileError":
      case "EvalError":
      case "UnexpectedError":
        return "Error";
    }
  }
  function getOrCreateContainer() {
    const existing = document.getElementById(CONTAINER_ID);
    if (existing !== null) {
      return existing;
    }
    const container = h(HTMLDivElement, { id: CONTAINER_ID });
    container.style.all = "unset";
    container.style.position = "fixed";
    container.style.zIndex = "2147483647";
    container.style.left = "-1px";
    container.style.bottom = "-1px";
    const shadowRoot = container.attachShadow({ mode: "open" });
    shadowRoot.append(h(HTMLStyleElement, {}, CSS));
    document.documentElement.append(container);
    return container;
  }
  function createTargetRoot(targetName) {
    return h(HTMLDivElement, {
      className: CLASS.targetRoot,
      attrs: { "data-target": targetName }
    });
  }
  var initMutable = (getNow, targetRoot) => (dispatch, resolvePromise) => {
    const removeListeners = [
      addEventListener(window, "focus", (event) => {
        if (event instanceof CustomEvent && event.detail !== TARGET_NAME) {
          return;
        }
        dispatch({ tag: "FocusedTab" });
      }),
      addEventListener(window, "visibilitychange", () => {
        if (document.visibilityState === "visible") {
          dispatch({ tag: "PageVisibilityChangedToVisible", date: getNow() });
        }
      })
    ];
    const mutable = {
      removeListeners: () => {
        for (const removeListener of removeListeners) {
          removeListener();
        }
      },
      webSocket: initWebSocket(
        getNow,
        INITIAL_ELM_COMPILED_TIMESTAMP,
        dispatch
      ),
      webSocketTimeoutId: void 0
    };
    window.__ELM_WATCH_RELOAD_STATUSES[TARGET_NAME] = {
      tag: "MightWantToReload"
    };
    const originalOnInit = window.__ELM_WATCH_ON_INIT;
    window.__ELM_WATCH_ON_INIT = () => {
      dispatch({ tag: "AppInit" });
      originalOnInit();
    };
    const originalKillMatching = window.__ELM_WATCH_KILL_MATCHING;
    window.__ELM_WATCH_KILL_MATCHING = (targetName) => new Promise((resolve, reject) => {
      if (targetName.test(TARGET_NAME) && mutable.webSocket.readyState !== WebSocket.CLOSED) {
        mutable.webSocket.addEventListener("close", () => {
          originalKillMatching(targetName).then(resolve).catch(reject);
        });
        mutable.removeListeners();
        mutable.webSocket.close();
        if (mutable.webSocketTimeoutId !== void 0) {
          clearTimeout(mutable.webSocketTimeoutId);
          mutable.webSocketTimeoutId = void 0;
        }
        targetRoot.remove();
        resolvePromise(void 0);
      } else {
        originalKillMatching(targetName).then(resolve).catch(reject);
      }
    });
    const originalDisconnect = window.__ELM_WATCH_DISCONNECT;
    window.__ELM_WATCH_DISCONNECT = (targetName) => {
      if (targetName.test(TARGET_NAME) && mutable.webSocket.readyState !== WebSocket.CLOSED) {
        mutable.webSocket.close();
      } else {
        originalDisconnect(targetName);
      }
    };
    return mutable;
  };
  function addEventListener(target, eventName, listener) {
    target.addEventListener(eventName, listener);
    return () => {
      target.removeEventListener(eventName, listener);
    };
  }
  function initWebSocket(getNow, elmCompiledTimestamp, dispatch) {
    const hostname = window.location.hostname === "" ? "localhost" : window.location.hostname;
    const url = new URL(`ws://${hostname}:${WEBSOCKET_PORT}/`);
    url.searchParams.set("elmWatchVersion", VERSION);
    url.searchParams.set("targetName", TARGET_NAME);
    url.searchParams.set("elmCompiledTimestamp", elmCompiledTimestamp.toString());
    const webSocket = new WebSocket(url);
    webSocket.addEventListener("open", () => {
      dispatch({ tag: "WebSocketConnected", date: getNow() });
    });
    webSocket.addEventListener("close", () => {
      dispatch({
        tag: "WebSocketClosed",
        date: getNow()
      });
    });
    webSocket.addEventListener("message", (event) => {
      dispatch({
        tag: "WebSocketMessageReceived",
        date: getNow(),
        data: event.data
      });
    });
    return webSocket;
  }
  var init = (date) => {
    const status = { tag: "Connecting", date, attemptNumber: 1 };
    const model = {
      status,
      previousStatusTag: status.tag,
      compilationMode: ORIGINAL_COMPILATION_MODE,
      elmCompiledTimestamp: INITIAL_ELM_COMPILED_TIMESTAMP,
      uiExpanded: false
    };
    return [model, [{ tag: "Render", model, manageFocus: false }]];
  };
  function update(msg, model) {
    switch (msg.tag) {
      case "AppInit":
        return [{ ...model }, []];
      case "EvalErrored":
        return [
          {
            ...model,
            status: { tag: "EvalError", date: msg.date },
            uiExpanded: true
          },
          [
            {
              tag: "TriggerReachedIdleState",
              reason: "EvalErrored"
            }
          ]
        ];
      case "EvalNeedsReload":
        return [
          {
            ...model,
            status: {
              tag: "WaitingForReload",
              date: msg.date,
              reasons: msg.reasons
            },
            uiExpanded: true
          },
          []
        ];
      case "EvalSucceeded":
        return [
          {
            ...model,
            status: {
              tag: "Idle",
              date: msg.date,
              sendKey: SEND_KEY_DO_NOT_USE_ALL_THE_TIME
            }
          },
          [
            {
              tag: "TriggerReachedIdleState",
              reason: "EvalSucceeded"
            }
          ]
        ];
      case "FocusedTab":
        return [
          statusToStatusType(model.status.tag) === "Error" ? { ...model } : model,
          model.status.tag === "Idle" ? [
            {
              tag: "SendMessage",
              message: { tag: "FocusedTab" },
              sendKey: model.status.sendKey
            },
            {
              tag: "WebSocketTimeoutBegin"
            }
          ] : []
        ];
      case "PageVisibilityChangedToVisible":
        return reconnect(model, msg.date, { force: true });
      case "SleepBeforeReconnectDone":
        return reconnect(model, msg.date, { force: false });
      case "UiMsg":
        return onUiMsg(msg.date, msg.msg, model);
      case "WebSocketClosed": {
        const attemptNumber = "attemptNumber" in model.status ? model.status.attemptNumber + 1 : 1;
        return [
          {
            ...model,
            status: {
              tag: "SleepingBeforeReconnect",
              date: msg.date,
              attemptNumber
            }
          },
          [{ tag: "SleepBeforeReconnect", attemptNumber }]
        ];
      }
      case "WebSocketConnected":
        return [{ ...model, status: { tag: "Busy", date: msg.date } }, []];
      case "WebSocketMessageReceived": {
        const result = parseWebSocketMessageData(msg.data);
        switch (result.tag) {
          case "Success":
            return onWebSocketToClientMessage(msg.date, result.message, model);
          case "Error":
            return [
              {
                ...model,
                status: {
                  tag: "UnexpectedError",
                  date: msg.date,
                  message: result.message
                },
                uiExpanded: true
              },
              []
            ];
        }
      }
    }
  }
  function onUiMsg(date, msg, model) {
    switch (msg.tag) {
      case "ChangedCompilationMode":
        return [
          {
            ...model,
            status: { tag: "Busy", date },
            compilationMode: msg.compilationMode
          },
          [
            {
              tag: "SendMessage",
              message: {
                tag: "ChangedCompilationMode",
                compilationMode: msg.compilationMode
              },
              sendKey: msg.sendKey
            }
          ]
        ];
      case "PressedChevron":
        return [{ ...model, uiExpanded: !model.uiExpanded }, []];
      case "PressedReconnectNow":
        return reconnect(model, date, { force: true });
    }
  }
  function onWebSocketToClientMessage(date, msg, model) {
    switch (msg.tag) {
      case "FocusedTabAcknowledged":
        return [model, [{ tag: "WebSocketTimeoutClear" }]];
      case "StatusChanged":
        return statusChanged(date, msg, model);
      case "SuccessfullyCompiled":
        return msg.compilationMode !== ORIGINAL_COMPILATION_MODE ? [
          {
            ...model,
            status: {
              tag: "WaitingForReload",
              date,
              reasons: ORIGINAL_COMPILATION_MODE === "proxy" ? [] : [
                `compilation mode changed from ${ORIGINAL_COMPILATION_MODE} to ${msg.compilationMode}.`
              ]
            },
            compilationMode: msg.compilationMode
          },
          []
        ] : [
          {
            ...model,
            compilationMode: msg.compilationMode,
            elmCompiledTimestamp: msg.elmCompiledTimestamp
          },
          [{ tag: "Eval", code: msg.code }]
        ];
      case "SuccessfullyCompiledButRecordFieldsChanged":
        return [
          {
            ...model,
            status: {
              tag: "WaitingForReload",
              date,
              reasons: [
                `record field mangling in optimize mode was different than last time.`
              ]
            }
          },
          []
        ];
    }
  }
  function statusChanged(date, { status }, model) {
    switch (status.tag) {
      case "AlreadyUpToDate":
        return [
          {
            ...model,
            status: {
              tag: "Idle",
              date,
              sendKey: SEND_KEY_DO_NOT_USE_ALL_THE_TIME
            },
            compilationMode: status.compilationMode
          },
          [
            {
              tag: "TriggerReachedIdleState",
              reason: "AlreadyUpToDate"
            }
          ]
        ];
      case "Busy":
        return [
          {
            ...model,
            status: {
              tag: "Busy",
              date
            },
            compilationMode: status.compilationMode
          },
          []
        ];
      case "ClientError":
        return [
          {
            ...model,
            status: { tag: "UnexpectedError", date, message: status.message },
            uiExpanded: true
          },
          [
            {
              tag: "TriggerReachedIdleState",
              reason: "ClientError"
            }
          ]
        ];
      case "CompileError":
        return [
          {
            ...model,
            status: {
              tag: "CompileError",
              date,
              sendKey: SEND_KEY_DO_NOT_USE_ALL_THE_TIME
            },
            compilationMode: status.compilationMode
          },
          [
            {
              tag: "TriggerReachedIdleState",
              reason: "CompileError"
            }
          ]
        ];
    }
  }
  function reconnect(model, date, { force }) {
    return model.status.tag === "SleepingBeforeReconnect" && (date.getTime() - model.status.date.getTime() >= retryWaitMs(model.status.attemptNumber) || force) ? [
      {
        ...model,
        status: {
          tag: "Connecting",
          date,
          attemptNumber: model.status.attemptNumber
        }
      },
      [
        {
          tag: "Reconnect",
          elmCompiledTimestamp: model.elmCompiledTimestamp
        }
      ]
    ] : [model, []];
  }
  function retryWaitMs(attemptNumber) {
    return Math.min(1e3 + 10 * attemptNumber ** 2, 1e3 * 60);
  }
  function printRetryWaitMs(attemptNumber) {
    return `${retryWaitMs(attemptNumber) / 1e3} seconds`;
  }
  var runCmd = (getNow, targetRoot) => (cmd, mutable, dispatch, _resolvePromise, rejectPromise) => {
    switch (cmd.tag) {
      case "Eval": {
        const f = new Function(cmd.code);
        try {
          f();
          dispatch({ tag: "EvalSucceeded", date: getNow() });
        } catch (unknownError) {
          if (unknownError instanceof Error && unknownError.message.startsWith("ELM_WATCH_RELOAD_NEEDED")) {
            dispatch({
              tag: "EvalNeedsReload",
              date: getNow(),
              reasons: unknownError.message.split("\n\n---\n\n").slice(1)
            });
          } else {
            void Promise.reject(unknownError);
            dispatch({ tag: "EvalErrored", date: getNow() });
          }
        }
        return;
      }
      case "Reconnect":
        mutable.webSocket = initWebSocket(
          getNow,
          cmd.elmCompiledTimestamp,
          dispatch
        );
        return;
      case "Render":
        render(
          getNow,
          targetRoot,
          dispatch,
          cmd.model,
          {
            version: VERSION,
            webSocketUrl: mutable.webSocket.url,
            targetName: TARGET_NAME,
            originalCompilationMode: ORIGINAL_COMPILATION_MODE,
            initializedElmAppsStatus: checkInitializedElmAppsStatus()
          },
          cmd.manageFocus
        );
        return;
      case "SendMessage":
        mutable.webSocket.send(JSON.stringify(cmd.message));
        return;
      case "SleepBeforeReconnect":
        setTimeout(() => {
          if (document.visibilityState === "visible") {
            dispatch({ tag: "SleepBeforeReconnectDone", date: getNow() });
          }
        }, retryWaitMs(cmd.attemptNumber));
        return;
      case "TriggerReachedIdleState":
        Promise.resolve().then(() => {
          window.__ELM_WATCH_ON_REACHED_IDLE_STATE(cmd.reason);
        }).catch(rejectPromise);
        return;
      case "UpdateGlobalStatus":
        window.__ELM_WATCH_RELOAD_STATUSES[TARGET_NAME] = cmd.reloadStatus;
        reloadPageIfNeeded();
        return;
      case "WebSocketTimeoutBegin":
        if (mutable.webSocketTimeoutId === void 0) {
          mutable.webSocketTimeoutId = setTimeout(() => {
            mutable.webSocketTimeoutId = void 0;
            mutable.webSocket.close();
            dispatch({
              tag: "WebSocketClosed",
              date: getNow()
            });
          }, window.__ELM_WATCH_WEBSOCKET_TIMEOUT);
        }
        return;
      case "WebSocketTimeoutClear":
        if (mutable.webSocketTimeoutId !== void 0) {
          clearTimeout(mutable.webSocketTimeoutId);
          mutable.webSocketTimeoutId = void 0;
        }
        return;
    }
  };
  function parseWebSocketMessageData(data) {
    try {
      return {
        tag: "Success",
        message: decodeWebSocketToClientMessage(string(data))
      };
    } catch (unknownError) {
      return {
        tag: "Error",
        message: `Failed to decode web socket message sent from the server:
${possiblyDecodeErrorToString(
          unknownError
        )}`
      };
    }
  }
  function possiblyDecodeErrorToString(unknownError) {
    return unknownError instanceof DecoderError ? unknownError.format() : unknownError instanceof Error ? unknownError.message : repr(unknownError);
  }
  function functionToNull(value) {
    return typeof value === "function" ? null : value;
  }
  var ProgramType = stringUnion({
    "Platform.worker": null,
    "Browser.sandbox": null,
    "Browser.element": null,
    "Browser.document": null,
    "Browser.application": null,
    Html: null
  });
  var ElmModule = chain(
    record(
      chain(
        functionToNull,
        multi({
          null: () => [],
          array: array(
            fields((field) => field("__elmWatchProgramType", ProgramType))
          ),
          object: (value) => ElmModule(value)
        })
      )
    ),
    (record2) => Object.values(record2).flat()
  );
  var ProgramTypes = fields((field) => field("Elm", ElmModule));
  function checkInitializedElmAppsStatus() {
    if (window.Elm !== void 0 && "__elmWatchProxy" in window.Elm) {
      return {
        tag: "DebuggerModeStatus",
        status: {
          tag: "Disabled",
          reason: noDebuggerYetReason
        }
      };
    }
    let programTypes;
    try {
      programTypes = ProgramTypes(window);
    } catch (unknownError) {
      return {
        tag: "DecodeError",
        message: possiblyDecodeErrorToString(unknownError)
      };
    }
    if (programTypes.length === 0) {
      return { tag: "NoProgramsAtAll" };
    }
    const noDebugger = programTypes.filter((programType) => {
      switch (programType) {
        case "Platform.worker":
        case "Html":
          return true;
        case "Browser.sandbox":
        case "Browser.element":
        case "Browser.document":
        case "Browser.application":
          return false;
      }
    });
    return {
      tag: "DebuggerModeStatus",
      status: noDebugger.length === programTypes.length ? {
        tag: "Disabled",
        reason: noDebuggerReason(new Set(noDebugger))
      } : { tag: "Enabled" }
    };
  }
  function reloadPageIfNeeded() {
    let shouldReload = false;
    const reasons = [];
    for (const [targetName, reloadStatus] of Object.entries(
      window.__ELM_WATCH_RELOAD_STATUSES
    )) {
      switch (reloadStatus.tag) {
        case "MightWantToReload":
          return;
        case "NoReloadWanted":
          break;
        case "ReloadRequested":
          shouldReload = true;
          if (reloadStatus.reasons.length > 0) {
            reasons.push([targetName, reloadStatus.reasons]);
          }
          break;
      }
    }
    if (!shouldReload) {
      return;
    }
    const first = reasons[0];
    const [separator, reasonString] = reasons.length === 1 && first !== void 0 && first[1].length === 1 ? [" ", `${first[1].join("")}
(target: ${first[0]})`] : [
      ":\n\n",
      reasons.map(
        ([targetName, subReasons]) => [
          targetName,
          ...subReasons.map((subReason) => `- ${subReason}`)
        ].join("\n")
      ).join("\n\n")
    ];
    const message = reasons.length === 0 ? void 0 : `elm-watch: I did a full page reload because${separator}${reasonString}`;
    window.__ELM_WATCH_RELOAD_STATUSES = {};
    window.__ELM_WATCH_RELOAD_PAGE(message);
  }
  function h(t, {
    attrs,
    localName,
    ...props
  }, ...children) {
    const element = document.createElement(
      localName ?? t.name.replace(/^HTML(\w+)Element$/, "$1").replace("Anchor", "a").replace("Paragraph", "p").replace(/^([DOU])List$/, "$1l").toLowerCase()
    );
    Object.assign(element, props);
    if (attrs !== void 0) {
      for (const [key, value] of Object.entries(attrs)) {
        element.setAttribute(key, value);
      }
    }
    for (const child of children) {
      if (child !== void 0) {
        element.append(
          typeof child === "string" ? document.createTextNode(child) : child
        );
      }
    }
    return element;
  }
  function render(getNow, targetRoot, dispatch, model, info, manageFocus) {
    targetRoot.classList.toggle(
      CLASS.targetRootBottomHalf,
      getIsPositionedInBottomHalf(targetRoot)
    );
    targetRoot.replaceChildren(
      view(
        (msg) => {
          dispatch({ tag: "UiMsg", date: getNow(), msg });
        },
        model,
        info,
        manageFocus
      )
    );
    const firstFocusableElement = targetRoot.querySelector(`button, [tabindex]`);
    if (manageFocus && firstFocusableElement instanceof HTMLElement) {
      firstFocusableElement.focus();
    }
    window.__ELM_WATCH_ON_RENDER(TARGET_NAME);
  }
  function getIsPositionedInBottomHalf(targetRoot) {
    const { top, height } = targetRoot.getBoundingClientRect();
    return top + height / 2 > window.innerHeight / 2;
  }
  var CLASS = {
    chevronButton: "chevronButton",
    compilationModeWithIcon: "compilationModeWithIcon",
    container: "container",
    debugModeIcon: "debugModeIcon",
    expandedUiContainer: "expandedUiContainer",
    flashError: "flashError",
    flashSuccess: "flashSuccess",
    root: "root",
    shortStatusContainer: "shortStatusContainer",
    targetName: "targetName",
    targetRoot: "targetRoot",
    targetRootBottomHalf: "targetRootBottomHalf"
  };
  function getStatusClass({
    statusType,
    statusTypeChanged,
    hasReceivedHotReload,
    uiRelatedUpdate
  }) {
    switch (statusType) {
      case "Success":
        return statusTypeChanged && hasReceivedHotReload ? CLASS.flashSuccess : void 0;
      case "Error":
        return uiRelatedUpdate ? void 0 : CLASS.flashError;
      case "Waiting":
        return void 0;
    }
  }
  var CSS = `
pre {
  margin: 0;
  white-space: pre-wrap;
  border-left: 0.25em solid var(--grey);
  padding-left: 0.5em;
}

input,
button,
select,
textarea {
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  margin: 0;
}

fieldset {
  display: grid;
  gap: 0.25em;
  margin: 0;
  border: 1px solid var(--grey);
  padding: 0.25em 0.75em 0.5em;
}

fieldset:disabled {
  color: var(--grey);
}

p,
dd {
  margin: 0;
}

dl {
  display: grid;
  grid-template-columns: auto auto;
  gap: 0.25em 1em;
  margin: 0;
  white-space: nowrap;
}

dt {
  text-align: right;
  color: var(--grey);
}

time {
  display: inline-grid;
  overflow: hidden;
}

time::after {
  content: attr(data-format);
  visibility: hidden;
  height: 0;
}

.${CLASS.root} {
  --grey: #767676;
  display: flex;
  align-items: start;
  overflow: auto;
  max-height: 100vh;
  max-width: 100vw;
  color: black;
  font-family: system-ui;
}

.${CLASS.targetRootBottomHalf} {
  align-self: end;
}

.${CLASS.targetRoot} + .${CLASS.targetRoot} {
  margin-left: -1px;
}

.${CLASS.targetRoot}:only-of-type .${CLASS.debugModeIcon},
.${CLASS.targetRoot}:only-of-type .${CLASS.targetName} {
  display: none;
}

.${CLASS.container} {
  display: flex;
  flex-direction: column-reverse;
  background-color: white;
  border: 1px solid var(--grey);
}

.${CLASS.targetRootBottomHalf} .${CLASS.container} {
  flex-direction: column;
}

.${CLASS.expandedUiContainer} {
  padding: 0.75em 1em;
  display: grid;
  gap: 0.75em;
  outline: none;
}

.${CLASS.expandedUiContainer}:is(.length0, .length1) {
  grid-template-columns: min-content;
}

.${CLASS.expandedUiContainer} > dl {
  justify-self: start;
}

.${CLASS.expandedUiContainer} label {
  display: grid;
  grid-template-columns: min-content auto;
  align-items: center;
  gap: 0.25em;
}

.${CLASS.expandedUiContainer} label.Disabled {
  color: var(--grey);
}

.${CLASS.expandedUiContainer} label > small {
  grid-column: 2;
}

.${CLASS.compilationModeWithIcon} {
  display: flex;
  align-items: center;
  gap: 0.25em;
}

.${CLASS.shortStatusContainer} {
  line-height: 1;
  padding: 0.25em;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 0.25em;
}

.${CLASS.flashError}::before,
.${CLASS.flashSuccess}::before {
  content: "";
  position: absolute;
  margin-top: 0.5em;
  margin-left: 0.5em;
  --size: min(500px, 100vmin);
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  animation: flash 0.7s 0.05s ease-out both;
  pointer-events: none;
}

.${CLASS.flashError}::before {
  background-color: #eb0000;
}

.${CLASS.flashSuccess}::before {
  background-color: #00b600;
}

@keyframes flash {
  from {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.9;
  }

  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}

@keyframes nudge {
  from {
    opacity: 0;
  }

  to {
    opacity: 0.8;
  }
}

@media (prefers-reduced-motion: reduce) {
  .${CLASS.flashError}::before,
  .${CLASS.flashSuccess}::before {
    transform: translate(-50%, -50%);
    width: 2em;
    height: 2em;
    animation: nudge 0.25s ease-in-out 4 alternate forwards;
  }
}

.${CLASS.chevronButton} {
  appearance: none;
  border: none;
  border-radius: 0;
  background: none;
  padding: 0;
  cursor: pointer;
}
`;
  function view(dispatch, passedModel, info, manageFocus) {
    const model = window.__ELM_WATCH_MOCKED_TIMINGS ? {
      ...passedModel,
      status: {
        ...passedModel.status,
        date: new Date("2022-02-05T13:10:05Z")
      }
    } : passedModel;
    const statusData = viewStatus(
      dispatch,
      model.status,
      model.compilationMode,
      info
    );
    const statusType = statusToStatusType(model.status.tag);
    const statusTypeChanged = statusType !== statusToStatusType(model.previousStatusTag);
    const statusClass = getStatusClass({
      statusType,
      statusTypeChanged,
      hasReceivedHotReload: model.elmCompiledTimestamp !== INITIAL_ELM_COMPILED_TIMESTAMP,
      uiRelatedUpdate: manageFocus
    });
    return h(
      HTMLDivElement,
      { className: CLASS.container },
      model.uiExpanded ? viewExpandedUi(model.status, statusData, info) : void 0,
      h(
        HTMLDivElement,
        {
          className: CLASS.shortStatusContainer,
          onclick: () => {
            dispatch({ tag: "PressedChevron" });
          }
        },
        h(
          HTMLButtonElement,
          {
            className: CLASS.chevronButton,
            attrs: { "aria-expanded": model.uiExpanded.toString() }
          },
          icon(
            model.uiExpanded ? "\u25B2" : "\u25BC",
            model.uiExpanded ? "Collapse elm-watch" : "Expand elm-watch"
          )
        ),
        compilationModeIcon(model.compilationMode),
        icon(
          statusData.icon,
          statusData.status,
          statusClass === void 0 ? {} : {
            className: statusClass,
            onanimationend: (event) => {
              if (event.currentTarget instanceof HTMLElement) {
                event.currentTarget.classList.remove(statusClass);
              }
            }
          }
        ),
        h(
          HTMLTimeElement,
          { dateTime: model.status.date.toISOString() },
          formatTime(model.status.date)
        ),
        h(HTMLSpanElement, { className: CLASS.targetName }, TARGET_NAME)
      )
    );
  }
  function icon(emoji, alt, props) {
    return h(
      HTMLSpanElement,
      { attrs: { "aria-label": alt }, ...props },
      h(HTMLSpanElement, { attrs: { "aria-hidden": "true" } }, emoji)
    );
  }
  function viewExpandedUi(status, statusData, info) {
    const items = [
      ["target", info.targetName],
      ["elm-watch", info.version],
      ["web socket", new URL(info.webSocketUrl).origin],
      [
        "updated",
        h(
          HTMLTimeElement,
          {
            dateTime: status.date.toISOString(),
            attrs: { "data-format": "2044-04-30 04:44:44" }
          },
          `${formatDate(status.date)} ${formatTime(status.date)}`
        )
      ],
      ["status", statusData.status],
      ...statusData.dl
    ];
    return h(
      HTMLDivElement,
      {
        className: `${CLASS.expandedUiContainer} length${statusData.content.length}`,
        attrs: {
          tabindex: "-1"
        }
      },
      h(
        HTMLDListElement,
        {},
        ...items.flatMap(([key, value]) => [
          h(HTMLElement, { localName: "dt" }, key),
          h(HTMLElement, { localName: "dd" }, value)
        ])
      ),
      ...statusData.content
    );
  }
  function viewStatus(dispatch, status, compilationMode, info) {
    switch (status.tag) {
      case "Busy":
        return {
          icon: "\u23F3",
          status: "Waiting for compilation",
          dl: [],
          content: viewCompilationModeChooser({
            dispatch,
            sendKey: void 0,
            compilationMode,
            warnAboutCompilationModeMismatch: false,
            info
          })
        };
      case "CompileError":
        return {
          icon: "\u{1F6A8}",
          status: "Compilation error",
          dl: [],
          content: [
            ...viewCompilationModeChooser({
              dispatch,
              sendKey: status.sendKey,
              compilationMode,
              warnAboutCompilationModeMismatch: true,
              info
            }),
            h(
              HTMLParagraphElement,
              {},
              h(
                HTMLElement,
                { localName: "strong" },
                "Check the terminal to see errors!"
              )
            )
          ]
        };
      case "Connecting":
        return {
          icon: "\u{1F50C}",
          status: "Connecting",
          dl: [
            ["attempt", status.attemptNumber.toString()],
            ["sleep", printRetryWaitMs(status.attemptNumber)]
          ],
          content: [
            h(HTMLButtonElement, { disabled: true }, "Connecting web socket\u2026")
          ]
        };
      case "EvalError":
        return {
          icon: "\u26D4\uFE0F",
          status: "Eval error",
          dl: [],
          content: [
            h(
              HTMLParagraphElement,
              {},
              "Check the console in the browser developer tools to see errors!"
            )
          ]
        };
      case "Idle":
        return {
          icon: idleIcon(info.initializedElmAppsStatus),
          status: "Successfully compiled",
          dl: [],
          content: viewCompilationModeChooser({
            dispatch,
            sendKey: status.sendKey,
            compilationMode,
            warnAboutCompilationModeMismatch: true,
            info
          })
        };
      case "SleepingBeforeReconnect":
        return {
          icon: "\u{1F50C}",
          status: "Sleeping",
          dl: [
            ["attempt", status.attemptNumber.toString()],
            ["sleep", printRetryWaitMs(status.attemptNumber)]
          ],
          content: [
            h(
              HTMLButtonElement,
              {
                onclick: () => {
                  dispatch({ tag: "PressedReconnectNow" });
                }
              },
              "Reconnect web socket now"
            )
          ]
        };
      case "UnexpectedError":
        return {
          icon: "\u274C",
          status: "Unexpected error",
          dl: [],
          content: [
            h(
              HTMLParagraphElement,
              {},
              "I ran into an unexpected error! This is the error message:"
            ),
            h(HTMLPreElement, {}, status.message)
          ]
        };
      case "WaitingForReload":
        return {
          icon: "\u23F3",
          status: "Waiting for reload",
          dl: [],
          content: [
            h(
              HTMLParagraphElement,
              {},
              "Waiting for other targets to finish compiling\u2026"
            )
          ]
        };
    }
  }
  function idleIcon(status) {
    switch (status.tag) {
      case "DecodeError":
        return "\u274C";
      case "NoProgramsAtAll":
        return "\u2753";
      case "DebuggerModeStatus":
        return "\u2705";
    }
  }
  function compilationModeIcon(compilationMode) {
    switch (compilationMode) {
      case "proxy":
        return void 0;
      case "debug":
        return icon("\u{1F41B}", "Debug mode", { className: CLASS.debugModeIcon });
      case "standard":
        return void 0;
      case "optimize":
        return icon("\u{1F680}", "Optimize mode");
    }
  }
  var noDebuggerYetReason = "The Elm debugger isn't available at this point.";
  function noDebuggerReason(noDebuggerProgramTypes) {
    return `The Elm debugger isn't supported by ${humanList(
      Array.from(noDebuggerProgramTypes, (programType) => `\`${programType}\``),
      "and"
    )} programs.`;
  }
  function humanList(list, joinWord) {
    const { length } = list;
    return length <= 1 ? list.join("") : length === 2 ? list.join(` ${joinWord} `) : `${list.slice(0, length - 2).join(", ")}, ${list.slice(-2).join(` ${joinWord} `)}`;
  }
  function viewCompilationModeChooser({
    dispatch,
    sendKey,
    compilationMode: selectedMode,
    warnAboutCompilationModeMismatch,
    info
  }) {
    switch (info.initializedElmAppsStatus.tag) {
      case "DecodeError":
        return [
          h(
            HTMLParagraphElement,
            {},
            "window.Elm does not look like expected! This is the error message:"
          ),
          h(HTMLPreElement, {}, info.initializedElmAppsStatus.message)
        ];
      case "NoProgramsAtAll":
        return [
          h(
            HTMLParagraphElement,
            {},
            "It looks like no Elm apps were initialized by elm-watch. Check the console in the browser developer tools to see potential errors!"
          )
        ];
      case "DebuggerModeStatus": {
        const compilationModes = [
          {
            mode: "debug",
            name: "Debug",
            status: info.initializedElmAppsStatus.status
          },
          { mode: "standard", name: "Standard", status: { tag: "Enabled" } },
          { mode: "optimize", name: "Optimize", status: { tag: "Enabled" } }
        ];
        return [
          h(
            HTMLFieldSetElement,
            { disabled: sendKey === void 0 },
            h(HTMLLegendElement, {}, "Compilation mode"),
            ...compilationModes.map(({ mode, name, status }) => {
              const nameWithIcon = h(
                HTMLSpanElement,
                { className: CLASS.compilationModeWithIcon },
                name,
                mode === selectedMode ? compilationModeIcon(mode) : void 0
              );
              return h(
                HTMLLabelElement,
                { className: status.tag },
                h(HTMLInputElement, {
                  type: "radio",
                  name: `CompilationMode-${info.targetName}`,
                  value: mode,
                  checked: mode === selectedMode,
                  disabled: sendKey === void 0 || status.tag === "Disabled",
                  onchange: sendKey === void 0 ? void 0 : () => {
                    dispatch({
                      tag: "ChangedCompilationMode",
                      compilationMode: mode,
                      sendKey
                    });
                  }
                }),
                ...status.tag === "Enabled" ? [
                  nameWithIcon,
                  warnAboutCompilationModeMismatch && mode === selectedMode && selectedMode !== info.originalCompilationMode && info.originalCompilationMode !== "proxy" ? h(
                    HTMLElement,
                    { localName: "small" },
                    `Note: The code currently running is in ${ORIGINAL_COMPILATION_MODE} mode.`
                  ) : void 0
                ] : [
                  nameWithIcon,
                  h(HTMLElement, { localName: "small" }, status.reason)
                ]
              );
            })
          )
        ];
      }
    }
  }
  run();
})();
(function(scope){
'use strict';

var _Platform_effectManagers = {}, _Scheduler_enqueue; // added by elm-watch

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

// This function was slightly modified by elm-watch.
function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		// c: null // commented out by elm-watch
		c: Function.prototype // added by elm-watch
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			// }); // commented out by elm-watch
			}) || Function.prototype; // added by elm-watch
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


// This function was slightly modified by elm-watch.
var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		"Platform.worker", // added by elm-watch
		debugMetadata, // added by elm-watch
		flagDecoder,
		args,
		impl.init,
		// impl.update, // commented out by elm-watch
		// impl.subscriptions, // commented out by elm-watch
		impl, // added by elm-watch
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


// This whole function was changed by elm-watch.
function _Platform_initialize(programType, debugMetadata, flagDecoder, args, init, impl, stepperBuilder)
{
	if (args === "__elmWatchReturnData") {
		return { impl: impl, debugMetadata: debugMetadata, flagDecoder : flagDecoder, programType: programType };
	}

	var flags = _Json_wrap(args ? args['flags'] : undefined);
	var flagResult = A2(_Json_run, flagDecoder, flags);
	$elm$core$Result$isOk(flagResult) || _Debug_crash(2 /**/, _Json_errorToString(flagResult.a) /**/);
	var managers = {};
	var initUrl = programType === "Browser.application" ? _Browser_getUrl() : undefined;
	window.__ELM_WATCH_INIT_URL = initUrl;
	var initPair = init(flagResult.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);
	var update;
	var subscriptions;

	function setUpdateAndSubscriptions() {
		update = impl.update || impl._impl.update;
		subscriptions = impl.subscriptions || impl._impl.subscriptions;
		if (typeof $elm$browser$Debugger$Main$wrapUpdate !== "undefined") {
			update = $elm$browser$Debugger$Main$wrapUpdate(update);
			subscriptions = $elm$browser$Debugger$Main$wrapSubs(subscriptions);
		}
	}

	function sendToApp(msg, viewMetadata) {
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	setUpdateAndSubscriptions();
	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	function __elmWatchHotReload(newData, new_Platform_effectManagers, new_Scheduler_enqueue, moduleName) {
		_Platform_enqueueEffects(managers, _Platform_batch(_List_Nil), _Platform_batch(_List_Nil));
		_Scheduler_enqueue = new_Scheduler_enqueue;

		for (var key in new_Platform_effectManagers) {
			var manager = new_Platform_effectManagers[key];
			if (!(key in _Platform_effectManagers)) {
				_Platform_effectManagers[key] = manager;
				managers[key] = _Platform_instantiateManager(manager, sendToApp);
				if (manager.a) {
					console.info("elm-watch: A new port '" + key + "' was added. You might want to reload the page!");
					manager.a(key, sendToApp)
				}
			}
		}

		for (var key in newData.impl) {
			if (key === "_impl" && impl._impl) {
				for (var subKey in newData.impl[key]) {
					impl._impl[subKey] = newData.impl[key][subKey];
				}
			} else {
				impl[key] = newData.impl[key];
			}
		}

		var newFlagResult = A2(_Json_run, newData.flagDecoder, flags);
		if (!$elm$core$Result$isOk(newFlagResult)) {
			return { tag: "ReloadPage", reason: "the flags type in `" + moduleName + "` changed and now the passed flags aren't correct anymore. The idea is to try to run with new flags!\nThis is the error:\n" + _Json_errorToString(newFlagResult.a) };
		}
		if (!_Utils_eq_elmWatchInternal(debugMetadata, newData.debugMetadata)) {
			return { tag: "ReloadPage", reason: "the message type in `" + moduleName + '` changed in debug mode ("debug metadata" changed).' };
		}
		init = impl.init || impl._impl.init;
		if (typeof $elm$browser$Debugger$Main$wrapInit !== "undefined") {
			init = A3($elm$browser$Debugger$Main$wrapInit, _Json_wrap(newData.debugMetadata), initPair.a.popout, init);
		}
		window.__ELM_WATCH_INIT_URL = initUrl;
		var newInitPair = init(newFlagResult.a);
		if (!_Utils_eq_elmWatchInternal(initPair, newInitPair)) {
			return { tag: "ReloadPage", reason: "`" + moduleName + ".init` returned something different than last time. Let's start fresh!" };
		}

		setUpdateAndSubscriptions();
		stepper(model, true /* isSync */);
		_Platform_enqueueEffects(managers, _Platform_batch(_List_Nil), subscriptions(model));
		return { tag: "Success" };
	}

	return Object.defineProperties(
		ports ? { ports: ports } : {},
		{
			__elmWatchHotReload: { value: __elmWatchHotReload },
			__elmWatchProgramType: { value: programType },
		}
	);
}

// This whole function was added by elm-watch.
// Copy-paste of _Utils_eq but does not assume that x and y have the same type,
// and considers functions to always be equal.
function _Utils_eq_elmWatchInternal(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp_elmWatchInternal(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp_elmWatchInternal(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

// This whole function was added by elm-watch.
function _Utils_eqHelp_elmWatchInternal(x, y, depth, stack)
{
	if (x === y) {
		return true;
	}

	var xType = _Utils_typeof_elmWatchInternal(x);
	var yType = _Utils_typeof_elmWatchInternal(y);

	if (xType !== yType) {
		return false;
	}

	switch (xType) {
		case "primitive":
			return false;
		case "function":
			return true;
	}

	if (x.$ !== y.$) {
		return false;
	}

	if (x.$ === 'Set_elm_builtin') {
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	} else if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin' || x.$ < 0) {
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}

	if (Object.keys(x).length !== Object.keys(y).length) {
		return false;
	}

	if (depth > 100) {
		stack.push(_Utils_Tuple2(x, y));
		return true;
	}

	for (var key in x) {
		if (!_Utils_eqHelp_elmWatchInternal(x[key], y[key], depth + 1, stack)) {
			return false;
		}
	}
	return true;
}

// This whole function was added by elm-watch.
function _Utils_typeof_elmWatchInternal(x)
{
	var type = typeof x;
	return type === "function"
		? "function"
		: type !== "object" || type === null
		? "primitive"
		: "objectOrArray";
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


// This whole function was changed by elm-watch.
function _Platform_export(exports)
{
	var reloadReasons = _Platform_mergeExportsElmWatch('Elm', scope['Elm'] || (scope['Elm'] = {}), exports);
	if (reloadReasons.length > 0) {
		throw new Error(["ELM_WATCH_RELOAD_NEEDED"].concat(Array.from(new Set(reloadReasons))).join("\n\n---\n\n"));
	}
}

// This whole function was added by elm-watch.
function _Platform_mergeExportsElmWatch(moduleName, obj, exports)
{
	var reloadReasons = [];
	for (var name in exports) {
		if (name === "init") {
			if ("init" in obj) {
				if ("__elmWatchApps" in obj) {
					var data = exports.init("__elmWatchReturnData");
					for (var index = 0; index < obj.__elmWatchApps.length; index++) {
						var app = obj.__elmWatchApps[index];
						if (app.__elmWatchProgramType !== data.programType) {
							reloadReasons.push("`" + moduleName + ".main` changed from `" + app.__elmWatchProgramType + "` to `" + data.programType + "`.");
						} else {
							var result;
							try {
								result = app.__elmWatchHotReload(data, _Platform_effectManagers, _Scheduler_enqueue, moduleName);
								switch (result.tag) {
									case "Success":
										break;
									case "ReloadPage":
										reloadReasons.push(result.reason);
										break;
								}
							} catch (error) {
								reloadReasons.push("hot reload for `" + moduleName + "` failed, probably because of incompatible model changes.\nThis is the error:\n" + error + "\n" + (error ? error.stack : ""));
							}
						}
					}
				} else {
					throw new Error("elm-watch: I'm trying to create `" + moduleName + ".init`, but it already exists and wasn't created by elm-watch. Maybe a duplicate script is getting loaded accidentally?");
				}
			} else {
				obj.__elmWatchApps = [];
				obj.init = function() {
					var app = exports.init.apply(exports, arguments);
					obj.__elmWatchApps.push(app);
					window.__ELM_WATCH_ON_INIT();
					return app;
				};
			}
		} else {
			var innerReasons = _Platform_mergeExportsElmWatch(moduleName + "." + name, obj[name] || (obj[name] = {}), exports[name]);
			reloadReasons = reloadReasons.concat(innerReasons);
		}
	}
	return reloadReasons;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

// This whole function was changed by elm-watch.
var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	var programType = "Html";

	if (args === "__elmWatchReturnData") {
		return { virtualNode: virtualNode, programType: programType };
	}

	/**_UNUSED/ // always UNUSED with elm-watch
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	var nextNode = _VirtualDom_render(virtualNode, function() {});
	node.parentNode.replaceChild(nextNode, node);
	node = nextNode;
	var sendToApp = function() {};

	function __elmWatchHotReload(newData) {
		var patches = _VirtualDom_diff(virtualNode, newData.virtualNode);
		node = _VirtualDom_applyPatches(node, virtualNode, patches, sendToApp);
		virtualNode = newData.virtualNode;
		return { tag: "Success" };
	}

	return Object.defineProperties(
		{},
		{
			__elmWatchHotReload: { value: __elmWatchHotReload },
			__elmWatchProgramType: { value: programType },
		}
	);
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});




// ELEMENT


var _Debugger_element;

// This function was slightly modified by elm-watch.
var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		impl._impl ? "Browser.sandbox" : "Browser.element", // added by elm-watch
		debugMetadata, // added by elm-watch
		flagDecoder,
		args,
		impl.init,
		// impl.update, // commented out by elm-watch
		// impl.subscriptions, // commented out by elm-watch
		impl, // added by elm-watch
		function(sendToApp, initialModel) {
			// var view = impl.view; // commented out by elm-watch
			/**_UNUSED/ // always UNUSED with elm-watch
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				// var nextNode = view(model); // commented out by elm-watch
				var nextNode = impl.view(model); // added by elm-watch
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

// This function was slightly modified by elm-watch.
var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		impl._impl ? "Browser.application" : "Browser.document", // added by elm-watch
		debugMetadata, // added by elm-watch
		flagDecoder,
		args,
		impl.init,
		// impl.update, // commented out by elm-watch
		// impl.subscriptions, // commented out by elm-watch
		impl, // added by elm-watch
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			// var view = impl.view; // commented out by elm-watch
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				// var doc = view(model); // commented out by elm-watch
				var doc = impl.view(model); // added by elm-watch
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


// This function was slightly modified by elm-watch.
function _Browser_application(impl)
{
	// var onUrlChange = impl.onUrlChange; // commented out by elm-watch
	// var onUrlRequest = impl.onUrlRequest; // commented out by elm-watch
	// var key = function() { key.a(onUrlChange(_Browser_getUrl())); }; // commented out by elm-watch
	var key = function() { key.a(impl.onUrlChange(_Browser_getUrl())); }; // added by elm-watch

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(impl.onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			// return A3(impl.init, flags, _Browser_getUrl(), key); // commented out by elm-watch
			return A3(impl.init, flags, window.__ELM_WATCH_INIT_URL, key); // added by elm-watch
		},
		// view: impl.view, // commented out by elm-watch
		// update: impl.update, // commented out by elm-watch
		// subscriptions: impl.subscriptions // commented out by elm-watch
		view: function(model) { return impl.view(model); }, // added by elm-watch
		_impl: impl // added by elm-watch
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}


// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.multiline) { flags += 'm'; }
	if (options.caseInsensitive) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}var $elm$core$List$cons = _List_cons;
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $dtwrks$elm_book$ElmBook$Internal$Book$BookBuilder = function (a) {
	return {$: 'BookBuilder', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $dtwrks$elm_book$ElmBook$Internal$Chapter$defaultOptions = {hiddenTitle: false};
var $dtwrks$elm_book$ElmBook$Internal$ComponentOptions$Card = {$: 'Card'};
var $dtwrks$elm_book$ElmBook$Internal$ComponentOptions$defaultOptions = {background: '', display: $dtwrks$elm_book$ElmBook$Internal$ComponentOptions$Card, fullWidth: false, hiddenLabel: false};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $dtwrks$elm_book$ElmBook$Internal$StatefulOptions$defaultOptions = {
	initialState: $elm$core$Maybe$Nothing,
	onDarkModeChange: function (_v0) {
		return $elm$core$Basics$identity;
	},
	subscriptions: _List_Nil
};
var $elm$core$Basics$append = _Utils_append;
var $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$defaultAccent = '#ffffff';
var $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$defaultBackgroundEnd = '#56cfff';
var $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$defaultBackgroundStart = '#0087cf';
var $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$defaultNavAccent = '#bdecff';
var $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$defaultNavAccentHighlight = '#ffffff';
var $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$defaultNavBackground = '#ffffff';
var $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$defaultTheme = {accent: $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$defaultAccent, background: 'linear-gradient(150deg, ' + ($dtwrks$elm_book$ElmBook$Internal$ThemeOptions$defaultBackgroundStart + (' 0%, ' + ($dtwrks$elm_book$ElmBook$Internal$ThemeOptions$defaultBackgroundEnd + ' 100%)'))), fontMonospace: 'Fira Code', fontSans: 'IBM Plex Sans', fontSerif: 'IBM Plex Serif', globals: $elm$core$Maybe$Nothing, hashBasedNavigation: false, header: $elm$core$Maybe$Nothing, logo: $elm$core$Maybe$Nothing, navAccent: $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$defaultNavAccent, navAccentHighlight: $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$defaultNavAccentHighlight, navBackground: $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$defaultNavBackground, preferDarkMode: false, routePrefix: '', subtitle: $elm$core$Maybe$Nothing};
var $dtwrks$elm_book$ElmBook$Custom$customBook = F2(
	function (toHtml, title) {
		return $dtwrks$elm_book$ElmBook$Internal$Book$BookBuilder(
			{chapterOptions: $dtwrks$elm_book$ElmBook$Internal$Chapter$defaultOptions, componentOptions: $dtwrks$elm_book$ElmBook$Internal$ComponentOptions$defaultOptions, statefulOptions: $dtwrks$elm_book$ElmBook$Internal$StatefulOptions$defaultOptions, themeOptions: $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$defaultTheme, title: title, toHtml: toHtml});
	});
var $dtwrks$elm_book$ElmBook$book = $dtwrks$elm_book$ElmBook$Custom$customBook($elm$core$Basics$identity);
var $elm$core$Basics$True = {$: 'True'};
var $author$project$Chapters$Core$ButtonGroup$body = '\n- [ ] Icons\n- [ ] Text left/right\n- [ ] Disable uppercase\n- [ ] Receive html?\n';
var $dtwrks$elm_book$ElmBook$Internal$Chapter$ChapterBuilder = function (a) {
	return {$: 'ChapterBuilder', a: a};
};
var $dtwrks$elm_book$ElmBook$Internal$Chapter$ChapterOptions = function (a) {
	return {$: 'ChapterOptions', a: a};
};
var $dtwrks$elm_book$ElmBook$Internal$Chapter$defaultOverrides = $dtwrks$elm_book$ElmBook$Internal$Chapter$ChapterOptions(
	{hiddenTitle: $elm$core$Maybe$Nothing});
var $dtwrks$elm_book$ElmBook$Internal$ComponentOptions$ComponentOptions = function (a) {
	return {$: 'ComponentOptions', a: a};
};
var $dtwrks$elm_book$ElmBook$Internal$ComponentOptions$defaultOverrides = $dtwrks$elm_book$ElmBook$Internal$ComponentOptions$ComponentOptions(
	{background: $elm$core$Maybe$Nothing, display: $elm$core$Maybe$Nothing, fullWidth: $elm$core$Maybe$Nothing, hiddenLabel: $elm$core$Maybe$Nothing});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$String$map = _String_map;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$Char$toLower = _Char_toLower;
var $dtwrks$elm_book$ElmBook$Internal$Helpers$toUrlSafe = function (c) {
	return $elm$core$Char$isAlphaNum(c) ? $elm$core$Char$toLower(c) : _Utils_chr('-');
};
var $elm$core$String$trim = _String_trim;
var $dtwrks$elm_book$ElmBook$Internal$Helpers$toSlug = A2(
	$elm$core$Basics$composeR,
	$elm$core$String$trim,
	$elm$core$String$map($dtwrks$elm_book$ElmBook$Internal$Helpers$toUrlSafe));
var $dtwrks$elm_book$ElmBook$Chapter$chapter = function (title) {
	return $dtwrks$elm_book$ElmBook$Internal$Chapter$ChapterBuilder(
		{
			body: '',
			chapterOptions: $dtwrks$elm_book$ElmBook$Internal$Chapter$defaultOverrides,
			componentList: _List_Nil,
			componentOptions: $dtwrks$elm_book$ElmBook$Internal$ComponentOptions$defaultOverrides,
			groupTitle: $elm$core$Maybe$Nothing,
			init: $elm$core$Maybe$Nothing,
			internal: true,
			title: title,
			url: '/' + $dtwrks$elm_book$ElmBook$Internal$Helpers$toSlug(title)
		});
};
var $author$project$W$ButtonGroup$Attribute = function (a) {
	return {$: 'Attribute', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $author$project$W$ButtonGroup$disabled = function (v) {
	return $author$project$W$ButtonGroup$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{disabled: v});
		});
};
var $elm$core$Basics$eq = _Utils_equal;
var $author$project$W$ButtonGroup$fill = $author$project$W$ButtonGroup$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{fill: true});
	});
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$String$all = _String_all;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $author$project$UI$hSpacer = $elm$html$Html$div(
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('ew ew-h-space')
		]));
var $dtwrks$elm_book$ElmBook$Internal$Msg$LogAction = F2(
	function (a, b) {
		return {$: 'LogAction', a: a, b: b};
	});
var $dtwrks$elm_book$ElmBook$Actions$logActionWith = F3(
	function (toString, action, value) {
		return A2(
			$dtwrks$elm_book$ElmBook$Internal$Msg$LogAction,
			'',
			action + (': ' + toString(value)));
	});
var $author$project$W$ButtonGroup$outlined = $author$project$W$ButtonGroup$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{outlined: true});
	});
var $dtwrks$elm_book$ElmBook$Internal$Chapter$Chapter = function (a) {
	return {$: 'Chapter', a: a};
};
var $dtwrks$elm_book$ElmBook$Chapter$renderWithComponentList = F2(
	function (body, _v0) {
		var builder = _v0.a;
		return $dtwrks$elm_book$ElmBook$Internal$Chapter$Chapter(
			_Utils_update(
				builder,
				{body: builder.body + (body + '\n<component-list />')}));
	});
var $author$project$W$ButtonGroup$rounded = $author$project$W$ButtonGroup$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{rounded: true});
	});
var $author$project$W$ButtonGroup$small = $author$project$W$ButtonGroup$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{small: true});
	});
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$UI$vSpacer = $elm$html$Html$div(
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('ew ew-v-space')
		]));
var $uncover_co$elm_theme_spec$ThemeSpec$namespace = 'tmspc';
var $uncover_co$elm_theme_spec$ThemeSpec$toColorVars = function (name) {
	return {aux: 'var(--' + ($uncover_co$elm_theme_spec$ThemeSpec$namespace + ('-' + (name + '-aux)'))), auxChannels: 'var(--' + ($uncover_co$elm_theme_spec$ThemeSpec$namespace + ('-' + (name + '-aux-ch)'))), bg: 'var(--' + ($uncover_co$elm_theme_spec$ThemeSpec$namespace + ('-' + (name + '-bg)'))), bgChannels: 'var(--' + ($uncover_co$elm_theme_spec$ThemeSpec$namespace + ('-' + (name + '-bg-ch)'))), fg: 'var(--' + ($uncover_co$elm_theme_spec$ThemeSpec$namespace + ('-' + (name + '-fg)'))), fgChannels: 'var(--' + ($uncover_co$elm_theme_spec$ThemeSpec$namespace + ('-' + (name + '-fg-ch)')))};
};
var $uncover_co$elm_theme_spec$ThemeSpec$secondary = $uncover_co$elm_theme_spec$ThemeSpec$toColorVars('secondary');
var $author$project$W$ButtonGroup$defaultAttrs = {
	disabled: false,
	fill: false,
	htmlAttributes: _List_Nil,
	outlined: false,
	rounded: false,
	small: false,
	theme: $uncover_co$elm_theme_spec$ThemeSpec$secondary,
	toDisabled: function (_v0) {
		return false;
	},
	toId: $elm$core$Maybe$Nothing
};
var $author$project$W$ButtonGroup$applyAttrs = function (attrs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, a) {
				var fn = _v0.a;
				return fn(a);
			}),
		$author$project$W$ButtonGroup$defaultAttrs,
		attrs);
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$W$Internal$Helpers$maybeAttr = F2(
	function (fn, a) {
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$html$Html$Attributes$class(''),
			A2($elm$core$Maybe$map, fn, a));
	});
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $author$project$W$Internal$Helpers$styles = function (xs) {
	return A2(
		$elm$html$Html$Attributes$attribute,
		'style',
		A2(
			$elm$core$String$join,
			';',
			A2(
				$elm$core$List$map,
				function (_v0) {
					var k = _v0.a;
					var v = _v0.b;
					return k + (':' + v);
				},
				xs)));
};
var $author$project$W$ButtonGroup$view = F2(
	function (attrs_, props) {
		var attrs = $author$project$W$ButtonGroup$applyAttrs(attrs_);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('ew ew-button-group'),
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('ew-m-outlined', attrs.outlined),
							_Utils_Tuple2('ew-m-rounded', attrs.rounded),
							_Utils_Tuple2('ew-m-small', attrs.small),
							_Utils_Tuple2('ew-m-fill', attrs.fill)
						])),
					$author$project$W$Internal$Helpers$styles(
					_List_fromArray(
						[
							_Utils_Tuple2('--bg', attrs.theme.bgChannels),
							_Utils_Tuple2('--fg', attrs.theme.fgChannels),
							_Utils_Tuple2('--aux', attrs.theme.auxChannels)
						]))
				]),
			A2(
				$elm$core$List$map,
				function (item) {
					return A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								A2(
								$author$project$W$Internal$Helpers$maybeAttr,
								function (fn) {
									return $elm$html$Html$Attributes$id(
										fn(item));
								},
								attrs.toId),
								$elm$html$Html$Attributes$class('ew ew-focusable ew-button-group-item'),
								$elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'ew-m-active',
										props.isActive(item))
									])),
								$elm$html$Html$Attributes$disabled(
								attrs.disabled || attrs.toDisabled(item)),
								$elm$html$Html$Events$onClick(
								props.onClick(item))
							]),
						_List_fromArray(
							[
								props.toLabel(item)
							]));
				},
				props.items));
	});
var $dtwrks$elm_book$ElmBook$Internal$Chapter$ChapterComponentViewStateless = function (a) {
	return {$: 'ChapterComponentViewStateless', a: a};
};
var $dtwrks$elm_book$ElmBook$Chapter$fromTuple = function (_v0) {
	var label = _v0.a;
	var view_ = _v0.b;
	return {
		label: label,
		view: $dtwrks$elm_book$ElmBook$Internal$Chapter$ChapterComponentViewStateless(view_)
	};
};
var $dtwrks$elm_book$ElmBook$Chapter$withComponentList = F2(
	function (componentList, _v0) {
		var builder = _v0.a;
		return $dtwrks$elm_book$ElmBook$Internal$Chapter$ChapterBuilder(
			_Utils_update(
				builder,
				{
					componentList: _Utils_ap(
						A2($elm$core$List$map, $dtwrks$elm_book$ElmBook$Chapter$fromTuple, componentList),
						builder.componentList)
				}));
	});
var $author$project$Chapters$Core$ButtonGroup$chapter_ = A2(
	$dtwrks$elm_book$ElmBook$Chapter$renderWithComponentList,
	$author$project$Chapters$Core$ButtonGroup$body,
	A2(
		$dtwrks$elm_book$ElmBook$Chapter$withComponentList,
		_List_fromArray(
			[
				_Utils_Tuple2(
				'Default',
				$author$project$UI$vSpacer(
					_List_fromArray(
						[
							$author$project$UI$hSpacer(
							_List_fromArray(
								[
									A2(
									$author$project$W$ButtonGroup$view,
									_List_Nil,
									{
										isActive: $elm$core$Basics$eq(2),
										items: A2($elm$core$List$range, 0, 2),
										onClick: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onClick'),
										toLabel: function (i) {
											return $elm$html$Html$text(
												$elm$core$String$fromInt(i));
										}
									}),
									A2(
									$author$project$W$ButtonGroup$view,
									_List_Nil,
									{
										isActive: $elm$core$Basics$eq(2),
										items: _List_fromArray(
											[0, 1]),
										onClick: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onClick'),
										toLabel: function (i) {
											return $elm$html$Html$text(
												$elm$core$String$fromInt(i));
										}
									}),
									A2(
									$author$project$W$ButtonGroup$view,
									_List_Nil,
									{
										isActive: $elm$core$Basics$eq(2),
										items: _List_fromArray(
											[1]),
										onClick: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onClick'),
										toLabel: function (i) {
											return $elm$html$Html$text(
												$elm$core$String$fromInt(i));
										}
									})
								])),
							$author$project$UI$hSpacer(
							_List_fromArray(
								[
									A2(
									$author$project$W$ButtonGroup$view,
									_List_fromArray(
										[$author$project$W$ButtonGroup$outlined]),
									{
										isActive: $elm$core$Basics$eq(2),
										items: A2($elm$core$List$range, 0, 2),
										onClick: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onClick'),
										toLabel: function (i) {
											return $elm$html$Html$text(
												$elm$core$String$fromInt(i));
										}
									}),
									A2(
									$author$project$W$ButtonGroup$view,
									_List_fromArray(
										[$author$project$W$ButtonGroup$outlined]),
									{
										isActive: $elm$core$Basics$eq(2),
										items: _List_fromArray(
											[0, 1]),
										onClick: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onClick'),
										toLabel: function (i) {
											return $elm$html$Html$text(
												$elm$core$String$fromInt(i));
										}
									}),
									A2(
									$author$project$W$ButtonGroup$view,
									_List_fromArray(
										[$author$project$W$ButtonGroup$outlined]),
									{
										isActive: $elm$core$Basics$eq(2),
										items: _List_fromArray(
											[1]),
										onClick: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onClick'),
										toLabel: function (i) {
											return $elm$html$Html$text(
												$elm$core$String$fromInt(i));
										}
									}),
									A2(
									$author$project$W$ButtonGroup$view,
									_List_fromArray(
										[
											$author$project$W$ButtonGroup$disabled(true)
										]),
									{
										isActive: $elm$core$Basics$eq(2),
										items: A2($elm$core$List$range, 0, 2),
										onClick: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onClick'),
										toLabel: function (i) {
											return $elm$html$Html$text(
												$elm$core$String$fromInt(i));
										}
									})
								])),
							$author$project$UI$hSpacer(
							_List_fromArray(
								[
									A2(
									$author$project$W$ButtonGroup$view,
									_List_fromArray(
										[$author$project$W$ButtonGroup$small]),
									{
										isActive: $elm$core$Basics$eq(2),
										items: A2($elm$core$List$range, 0, 2),
										onClick: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onClick'),
										toLabel: function (i) {
											return $elm$html$Html$text(
												$elm$core$String$fromInt(i));
										}
									}),
									A2(
									$author$project$W$ButtonGroup$view,
									_List_fromArray(
										[$author$project$W$ButtonGroup$small, $author$project$W$ButtonGroup$outlined]),
									{
										isActive: $elm$core$Basics$eq(2),
										items: A2($elm$core$List$range, 0, 2),
										onClick: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onClick'),
										toLabel: function (i) {
											return $elm$html$Html$text(
												$elm$core$String$fromInt(i));
										}
									}),
									A2(
									$author$project$W$ButtonGroup$view,
									_List_fromArray(
										[
											$author$project$W$ButtonGroup$disabled(true),
											$author$project$W$ButtonGroup$small
										]),
									{
										isActive: $elm$core$Basics$eq(2),
										items: A2($elm$core$List$range, 0, 2),
										onClick: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onClick'),
										toLabel: function (i) {
											return $elm$html$Html$text(
												$elm$core$String$fromInt(i));
										}
									})
								]))
						]))),
				_Utils_Tuple2(
				'Rounded',
				$author$project$UI$vSpacer(
					_List_fromArray(
						[
							$author$project$UI$hSpacer(
							_List_fromArray(
								[
									A2(
									$author$project$W$ButtonGroup$view,
									_List_fromArray(
										[$author$project$W$ButtonGroup$rounded]),
									{
										isActive: $elm$core$Basics$eq(2),
										items: A2($elm$core$List$range, 0, 2),
										onClick: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onClick'),
										toLabel: function (i) {
											return $elm$html$Html$text(
												$elm$core$String$fromInt(i));
										}
									}),
									A2(
									$author$project$W$ButtonGroup$view,
									_List_fromArray(
										[$author$project$W$ButtonGroup$rounded, $author$project$W$ButtonGroup$outlined]),
									{
										isActive: $elm$core$Basics$eq(2),
										items: A2($elm$core$List$range, 0, 2),
										onClick: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onClick'),
										toLabel: function (i) {
											return $elm$html$Html$text(
												$elm$core$String$fromInt(i));
										}
									}),
									A2(
									$author$project$W$ButtonGroup$view,
									_List_fromArray(
										[
											$author$project$W$ButtonGroup$disabled(true),
											$author$project$W$ButtonGroup$rounded
										]),
									{
										isActive: $elm$core$Basics$eq(2),
										items: A2($elm$core$List$range, 0, 2),
										onClick: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onClick'),
										toLabel: function (i) {
											return $elm$html$Html$text(
												$elm$core$String$fromInt(i));
										}
									})
								])),
							$author$project$UI$hSpacer(
							_List_fromArray(
								[
									A2(
									$author$project$W$ButtonGroup$view,
									_List_fromArray(
										[$author$project$W$ButtonGroup$rounded, $author$project$W$ButtonGroup$small]),
									{
										isActive: $elm$core$Basics$eq(2),
										items: A2($elm$core$List$range, 0, 2),
										onClick: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onClick'),
										toLabel: function (i) {
											return $elm$html$Html$text(
												$elm$core$String$fromInt(i));
										}
									}),
									A2(
									$author$project$W$ButtonGroup$view,
									_List_fromArray(
										[$author$project$W$ButtonGroup$rounded, $author$project$W$ButtonGroup$outlined, $author$project$W$ButtonGroup$small]),
									{
										isActive: $elm$core$Basics$eq(2),
										items: A2($elm$core$List$range, 0, 2),
										onClick: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onClick'),
										toLabel: function (i) {
											return $elm$html$Html$text(
												$elm$core$String$fromInt(i));
										}
									}),
									A2(
									$author$project$W$ButtonGroup$view,
									_List_fromArray(
										[
											$author$project$W$ButtonGroup$disabled(true),
											$author$project$W$ButtonGroup$rounded,
											$author$project$W$ButtonGroup$small
										]),
									{
										isActive: $elm$core$Basics$eq(2),
										items: A2($elm$core$List$range, 0, 2),
										onClick: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onClick'),
										toLabel: function (i) {
											return $elm$html$Html$text(
												$elm$core$String$fromInt(i));
										}
									})
								]))
						]))),
				_Utils_Tuple2(
				'Fill',
				A2(
					$author$project$W$ButtonGroup$view,
					_List_fromArray(
						[$author$project$W$ButtonGroup$fill]),
					{
						isActive: $elm$core$Basics$eq(2),
						items: A2($elm$core$List$range, 0, 2),
						onClick: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onClick'),
						toLabel: function (i) {
							return $elm$html$Html$text(
								$elm$core$String$fromInt(i));
						}
					}))
			]),
		$dtwrks$elm_book$ElmBook$Chapter$chapter('ButtonGroup')));
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $author$project$W$Button$Attribute = function (a) {
	return {$: 'Attribute', a: a};
};
var $uncover_co$elm_theme_spec$ThemeSpec$danger = $uncover_co$elm_theme_spec$ThemeSpec$toColorVars('danger');
var $author$project$W$Button$danger = $author$project$W$Button$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{theme: $uncover_co$elm_theme_spec$ThemeSpec$danger});
	});
var $author$project$W$Button$disabled = function (v) {
	return $author$project$W$Button$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{disabled: v});
		});
};
var $author$project$W$Button$fill = $author$project$W$Button$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{fill: true});
	});
var $author$project$W$Button$Invisible = {$: 'Invisible'};
var $author$project$W$Button$invisible = $author$project$W$Button$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{style: $author$project$W$Button$Invisible});
	});
var $dtwrks$elm_book$ElmBook$Actions$logAction = function (action) {
	return A2($dtwrks$elm_book$ElmBook$Internal$Msg$LogAction, '', action);
};
var $author$project$W$Button$Outlined = {$: 'Outlined'};
var $author$project$W$Button$outlined = $author$project$W$Button$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{style: $author$project$W$Button$Outlined});
	});
var $uncover_co$elm_theme_spec$ThemeSpec$primary = $uncover_co$elm_theme_spec$ThemeSpec$toColorVars('primary');
var $author$project$W$Button$primary = $author$project$W$Button$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{theme: $uncover_co$elm_theme_spec$ThemeSpec$primary});
	});
var $dtwrks$elm_book$ElmBook$Chapter$renderComponentList = F2(
	function (componentList, _v0) {
		var builder = _v0.a;
		return $dtwrks$elm_book$ElmBook$Internal$Chapter$Chapter(
			_Utils_update(
				builder,
				{
					body: builder.body + '<component-list />',
					componentList: _Utils_ap(
						A2($elm$core$List$map, $dtwrks$elm_book$ElmBook$Chapter$fromTuple, componentList),
						builder.componentList)
				}));
	});
var $author$project$W$Button$rounded = $author$project$W$Button$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{rounded: true});
	});
var $author$project$W$Button$small = $author$project$W$Button$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{small: true});
	});
var $uncover_co$elm_theme_spec$ThemeSpec$success = $uncover_co$elm_theme_spec$ThemeSpec$toColorVars('success');
var $author$project$W$Button$success = $author$project$W$Button$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{theme: $uncover_co$elm_theme_spec$ThemeSpec$success});
	});
var $author$project$W$Button$theme = function (v) {
	return $author$project$W$Button$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{theme: v});
		});
};
var $author$project$W$Button$Basic = {$: 'Basic'};
var $author$project$W$Button$defaultAttrs = {_class: '', disabled: false, fill: false, htmlAttributes: _List_Nil, id: $elm$core$Maybe$Nothing, left: $elm$core$Maybe$Nothing, right: $elm$core$Maybe$Nothing, rounded: false, small: false, style: $author$project$W$Button$Basic, theme: $uncover_co$elm_theme_spec$ThemeSpec$secondary};
var $author$project$W$Button$applyAttrs = function (attrs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, a) {
				var fn = _v0.a;
				return fn(a);
			}),
		$author$project$W$Button$defaultAttrs,
		attrs);
};
var $author$project$W$Internal$Helpers$stringIf = F3(
	function (v, a, b) {
		return v ? a : b;
	});
var $author$project$W$Button$styleClass = function (s) {
	switch (s.$) {
		case 'Basic':
			return '';
		case 'Outlined':
			return 'ew-m-outlined';
		default:
			return 'ew-m-invisible';
	}
};
var $author$project$W$Button$attributes = function (attrs_) {
	var attrs = $author$project$W$Button$applyAttrs(attrs_);
	return _Utils_ap(
		attrs.htmlAttributes,
		_List_fromArray(
			[
				A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$id, attrs.id),
				$elm$html$Html$Attributes$disabled(attrs.disabled),
				$elm$html$Html$Attributes$class('ew ew-focusable ew-btn'),
				$elm$html$Html$Attributes$class(
				$author$project$W$Button$styleClass(attrs.style)),
				$elm$html$Html$Attributes$class(attrs._class),
				$elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('ew-m-small', attrs.small),
						_Utils_Tuple2('ew-m-rounded', attrs.rounded)
					])),
				$author$project$W$Internal$Helpers$styles(
				_List_fromArray(
					[
						_Utils_Tuple2('--bg', attrs.theme.bg),
						_Utils_Tuple2('--fg', attrs.theme.fgChannels),
						_Utils_Tuple2('--aux', attrs.theme.aux),
						_Utils_Tuple2(
						'width',
						A3($author$project$W$Internal$Helpers$stringIf, attrs.fill, '100%', 'auto'))
					]))
			]));
};
var $author$project$W$Button$view = F2(
	function (attrs, props) {
		return A2(
			$elm$html$Html$button,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Events$onClick(props.onClick),
				$author$project$W$Button$attributes(attrs)),
			_List_fromArray(
				[
					$elm$html$Html$text(props.label)
				]));
	});
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $author$project$W$Button$viewLink = F2(
	function (attrs, props) {
		return A2(
			$elm$html$Html$a,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$href(props.href),
				$author$project$W$Button$attributes(attrs)),
			_List_fromArray(
				[
					$elm$html$Html$text(props.label)
				]));
	});
var $uncover_co$elm_theme_spec$ThemeSpec$warning = $uncover_co$elm_theme_spec$ThemeSpec$toColorVars('warning');
var $author$project$W$Button$warning = $author$project$W$Button$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{theme: $uncover_co$elm_theme_spec$ThemeSpec$warning});
	});
var $author$project$Chapters$Core$Buttons$chapter_ = A2(
	$dtwrks$elm_book$ElmBook$Chapter$renderComponentList,
	$elm$core$List$concat(
		_List_fromArray(
			[
				A2(
				$elm$core$List$map,
				function (_v0) {
					var name = _v0.a;
					var attrs = _v0.b;
					return _Utils_Tuple2(
						name,
						$author$project$UI$vSpacer(
							_List_fromArray(
								[
									$author$project$UI$hSpacer(
									_List_fromArray(
										[
											A2(
											$author$project$W$Button$view,
											attrs,
											{
												label: 'button',
												onClick: $dtwrks$elm_book$ElmBook$Actions$logAction('')
											}),
											A2(
											$author$project$W$Button$view,
											A2($elm$core$List$cons, $author$project$W$Button$outlined, attrs),
											{
												label: 'button',
												onClick: $dtwrks$elm_book$ElmBook$Actions$logAction('')
											}),
											A2(
											$author$project$W$Button$view,
											A2($elm$core$List$cons, $author$project$W$Button$invisible, attrs),
											{
												label: 'button',
												onClick: $dtwrks$elm_book$ElmBook$Actions$logAction('')
											})
										])),
									$author$project$UI$hSpacer(
									_List_fromArray(
										[
											A2(
											$author$project$W$Button$view,
											A2(
												$elm$core$List$cons,
												$author$project$W$Button$disabled(true),
												attrs),
											{
												label: 'button',
												onClick: $dtwrks$elm_book$ElmBook$Actions$logAction('')
											}),
											A2(
											$author$project$W$Button$view,
											A2(
												$elm$core$List$cons,
												$author$project$W$Button$outlined,
												A2(
													$elm$core$List$cons,
													$author$project$W$Button$disabled(true),
													attrs)),
											{
												label: 'button',
												onClick: $dtwrks$elm_book$ElmBook$Actions$logAction('')
											}),
											A2(
											$author$project$W$Button$view,
											A2(
												$elm$core$List$cons,
												$author$project$W$Button$invisible,
												A2(
													$elm$core$List$cons,
													$author$project$W$Button$disabled(true),
													attrs)),
											{
												label: 'button',
												onClick: $dtwrks$elm_book$ElmBook$Actions$logAction('')
											})
										])),
									$author$project$UI$hSpacer(
									_List_fromArray(
										[
											A2(
											$author$project$W$Button$view,
											A2($elm$core$List$cons, $author$project$W$Button$rounded, attrs),
											{
												label: 'button',
												onClick: $dtwrks$elm_book$ElmBook$Actions$logAction('')
											}),
											A2(
											$author$project$W$Button$view,
											A2(
												$elm$core$List$cons,
												$author$project$W$Button$outlined,
												A2($elm$core$List$cons, $author$project$W$Button$rounded, attrs)),
											{
												label: 'button',
												onClick: $dtwrks$elm_book$ElmBook$Actions$logAction('')
											}),
											A2(
											$author$project$W$Button$view,
											A2(
												$elm$core$List$cons,
												$author$project$W$Button$invisible,
												A2($elm$core$List$cons, $author$project$W$Button$rounded, attrs)),
											{
												label: 'button',
												onClick: $dtwrks$elm_book$ElmBook$Actions$logAction('')
											})
										])),
									$author$project$UI$hSpacer(
									_List_fromArray(
										[
											A2(
											$author$project$W$Button$view,
											A2($elm$core$List$cons, $author$project$W$Button$small, attrs),
											{
												label: 'button',
												onClick: $dtwrks$elm_book$ElmBook$Actions$logAction('')
											}),
											A2(
											$author$project$W$Button$view,
											A2(
												$elm$core$List$cons,
												$author$project$W$Button$outlined,
												A2($elm$core$List$cons, $author$project$W$Button$small, attrs)),
											{
												label: 'button',
												onClick: $dtwrks$elm_book$ElmBook$Actions$logAction('')
											}),
											A2(
											$author$project$W$Button$view,
											A2(
												$elm$core$List$cons,
												$author$project$W$Button$invisible,
												A2($elm$core$List$cons, $author$project$W$Button$small, attrs)),
											{
												label: 'button',
												onClick: $dtwrks$elm_book$ElmBook$Actions$logAction('')
											})
										]))
								])));
				},
				_List_fromArray(
					[
						_Utils_Tuple2('Default', _List_Nil),
						_Utils_Tuple2(
						'Primary',
						_List_fromArray(
							[$author$project$W$Button$primary])),
						_Utils_Tuple2(
						'Success',
						_List_fromArray(
							[$author$project$W$Button$success])),
						_Utils_Tuple2(
						'Warning',
						_List_fromArray(
							[$author$project$W$Button$warning])),
						_Utils_Tuple2(
						'Danger',
						_List_fromArray(
							[$author$project$W$Button$danger])),
						_Utils_Tuple2(
						'Custom',
						_List_fromArray(
							[
								$author$project$W$Button$theme(
								{aux: '#ffedff', auxChannels: '255 237 255', bg: '#ef67ef', bgChannels: '239 103 239', fg: '#f6e1f6', fgChannels: '246 225 246'})
							]))
					])),
				_List_fromArray(
				[
					_Utils_Tuple2(
					'As Link',
					$author$project$UI$vSpacer(
						_List_fromArray(
							[
								$author$project$UI$hSpacer(
								_List_fromArray(
									[
										A2(
										$author$project$W$Button$viewLink,
										_List_Nil,
										{href: '/logAction/#', label: 'link'}),
										A2(
										$author$project$W$Button$viewLink,
										_List_fromArray(
											[$author$project$W$Button$outlined]),
										{href: '/logAction/#', label: 'link'}),
										A2(
										$author$project$W$Button$viewLink,
										_List_fromArray(
											[$author$project$W$Button$invisible]),
										{href: '/logAction/#', label: 'link'})
									])),
								$author$project$UI$hSpacer(
								_List_fromArray(
									[
										A2(
										$author$project$W$Button$viewLink,
										_List_fromArray(
											[
												$author$project$W$Button$disabled(true)
											]),
										{href: '/logAction/#', label: 'link'}),
										A2(
										$author$project$W$Button$viewLink,
										_List_fromArray(
											[
												$author$project$W$Button$outlined,
												$author$project$W$Button$disabled(true)
											]),
										{href: '/logAction/#', label: 'link'}),
										A2(
										$author$project$W$Button$viewLink,
										_List_fromArray(
											[
												$author$project$W$Button$invisible,
												$author$project$W$Button$disabled(true)
											]),
										{href: '/logAction/#', label: 'link'})
									]))
							]))),
					_Utils_Tuple2(
					'Full width',
					A2(
						$author$project$W$Button$view,
						_List_fromArray(
							[$author$project$W$Button$fill]),
						{
							label: 'button',
							onClick: $dtwrks$elm_book$ElmBook$Actions$logAction('')
						}))
				])
			])),
	$dtwrks$elm_book$ElmBook$Chapter$chapter('Buttons'));
var $author$project$W$Divider$baseClasses = 'ew-border-base-aux ew-border-0 ew-border-t-2 ew-opacity-20 ew-m-0';
var $elm$html$Html$hr = _VirtualDom_node('hr');
var $author$project$W$Divider$horizontal = A2(
	$elm$html$Html$hr,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class($author$project$W$Divider$baseClasses),
			$elm$html$Html$Attributes$class('ew-border-t-2')
		]),
	_List_Nil);
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$W$Divider$vertical = A2(
	$elm$html$Html$hr,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class($author$project$W$Divider$baseClasses),
			$elm$html$Html$Attributes$class('ew-border-l-2')
		]),
	_List_Nil);
var $author$project$Chapters$Core$Divider$chapter_ = A2(
	$dtwrks$elm_book$ElmBook$Chapter$renderComponentList,
	_List_fromArray(
		[
			_Utils_Tuple2('Horizontal', $author$project$W$Divider$horizontal),
			_Utils_Tuple2(
			'Vertical',
			A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'height', '40px'),
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between')
					]),
				_List_fromArray(
					[$author$project$W$Divider$vertical, $author$project$W$Divider$vertical, $author$project$W$Divider$vertical, $author$project$W$Divider$vertical])))
		]),
	$dtwrks$elm_book$ElmBook$Chapter$chapter('Divider'));
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$animateTransform = $elm$svg$Svg$trustedNode('animateTransform');
var $author$project$Theme$namespace = 'theme';
var $author$project$Theme$cssVar = function (v) {
	return 'var(--' + ($author$project$Theme$namespace + ('-' + (v + ')')));
};
var $author$project$Theme$baseAux = $author$project$Theme$cssVar('base-aux');
var $author$project$W$Loading$defaultAttrs = {color: $author$project$Theme$baseAux, htmlAttributes: _List_Nil, id: $elm$core$Maybe$Nothing, size: 25};
var $author$project$W$Loading$applyAttrs = function (attrs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, a) {
				var fn = _v0.a;
				return fn(a);
			}),
		$author$project$W$Loading$defaultAttrs,
		attrs);
};
var $elm$svg$Svg$Attributes$attributeName = _VirtualDom_attribute('attributeName');
var $elm$svg$Svg$Attributes$attributeType = _VirtualDom_attribute('attributeType');
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$Attributes$dur = _VirtualDom_attribute('dur');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$from = function (value) {
	return A2(
		_VirtualDom_attribute,
		'from',
		_VirtualDom_noJavaScriptUri(value));
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $author$project$W$Internal$Helpers$maybeSvgAttr = F2(
	function (fn, a) {
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$svg$Svg$Attributes$class(''),
			A2($elm$core$Maybe$map, fn, a));
	});
var $elm$svg$Svg$Attributes$opacity = _VirtualDom_attribute('opacity');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm$svg$Svg$Attributes$repeatCount = _VirtualDom_attribute('repeatCount');
var $elm$svg$Svg$Attributes$style = _VirtualDom_attribute('style');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$to = function (value) {
	return A2(
		_VirtualDom_attribute,
		'to',
		_VirtualDom_noJavaScriptUri(value));
};
var $elm$svg$Svg$Attributes$type_ = _VirtualDom_attribute('type');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$xmlSpace = A2(_VirtualDom_attributeNS, 'http://www.w3.org/XML/1998/namespace', 'xml:space');
var $author$project$W$Loading$circles = function (attrs_) {
	var attrs = $author$project$W$Loading$applyAttrs(attrs_);
	return A2(
		$elm$svg$Svg$svg,
		_Utils_ap(
			attrs.htmlAttributes,
			_List_fromArray(
				[
					A2($author$project$W$Internal$Helpers$maybeSvgAttr, $elm$svg$Svg$Attributes$id, attrs.id),
					$elm$svg$Svg$Attributes$style('--color: ' + attrs.color),
					$elm$svg$Svg$Attributes$class('ew-loading-circle'),
					$elm$svg$Svg$Attributes$viewBox('0 0 40 40'),
					$elm$svg$Svg$Attributes$height(
					$elm$core$String$fromFloat(attrs.size) + 'px'),
					$elm$svg$Svg$Attributes$width(
					$elm$core$String$fromFloat(attrs.size) + 'px'),
					$elm$svg$Svg$Attributes$xmlSpace('preserve')
				])),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill('var(--color)'),
						$elm$svg$Svg$Attributes$opacity('0.2'),
						$elm$svg$Svg$Attributes$d('M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946 s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634 c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill('var(--color)'),
						$elm$svg$Svg$Attributes$d('M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0 C22.32,8.481,24.301,9.057,26.013,10.047z')
					]),
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$animateTransform,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$attributeType('xml'),
								$elm$svg$Svg$Attributes$attributeName('transform'),
								$elm$svg$Svg$Attributes$type_('rotate'),
								$elm$svg$Svg$Attributes$from('0 20 20'),
								$elm$svg$Svg$Attributes$to('360 20 20'),
								$elm$svg$Svg$Attributes$dur('1.2s'),
								$elm$svg$Svg$Attributes$repeatCount('indefinite')
							]),
						_List_Nil)
					]))
			]));
};
var $author$project$W$Loading$Attribute = function (a) {
	return {$: 'Attribute', a: a};
};
var $author$project$W$Loading$color = function (v) {
	return $author$project$W$Loading$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{color: v});
		});
};
var $author$project$W$Loading$dots = function (attrs_) {
	var attrs = $author$project$W$Loading$applyAttrs(attrs_);
	return A2(
		$elm$html$Html$div,
		_Utils_ap(
			attrs.htmlAttributes,
			_List_fromArray(
				[
					A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$id, attrs.id),
					$elm$html$Html$Attributes$class('ew-loading-dots'),
					$author$project$W$Internal$Helpers$styles(
					_List_fromArray(
						[
							_Utils_Tuple2('--color', attrs.color),
							_Utils_Tuple2(
							'--size',
							$elm$core$String$fromFloat(attrs.size) + 'px')
						]))
				])),
		_List_fromArray(
			[
				A2($elm$html$Html$div, _List_Nil, _List_Nil),
				A2($elm$html$Html$div, _List_Nil, _List_Nil),
				A2($elm$html$Html$div, _List_Nil, _List_Nil),
				A2($elm$html$Html$div, _List_Nil, _List_Nil)
			]));
};
var $author$project$W$Loading$ripples = function (attrs_) {
	var attrs = $author$project$W$Loading$applyAttrs(attrs_);
	return A2(
		$elm$html$Html$div,
		_Utils_ap(
			attrs.htmlAttributes,
			_List_fromArray(
				[
					A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$id, attrs.id),
					$elm$html$Html$Attributes$class('ew-loading-ripples'),
					$author$project$W$Internal$Helpers$styles(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'--size',
							$elm$core$String$fromFloat(attrs.size) + 'px'),
							_Utils_Tuple2('--color', attrs.color)
						]))
				])),
		_List_fromArray(
			[
				A2($elm$html$Html$div, _List_Nil, _List_Nil),
				A2($elm$html$Html$div, _List_Nil, _List_Nil)
			]));
};
var $author$project$W$Loading$size = function (v) {
	return $author$project$W$Loading$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{size: v});
		});
};
var $author$project$Chapters$Core$Loading$chapter_ = A2(
	$dtwrks$elm_book$ElmBook$Chapter$renderComponentList,
	_List_fromArray(
		[
			_Utils_Tuple2(
			'Circles',
			$author$project$W$Loading$circles(_List_Nil)),
			_Utils_Tuple2(
			'Circles with Custom Size and Color',
			$author$project$W$Loading$circles(
				_List_fromArray(
					[
						$author$project$W$Loading$size(40),
						$author$project$W$Loading$color('red')
					]))),
			_Utils_Tuple2(
			'Dots',
			$author$project$W$Loading$dots(_List_Nil)),
			_Utils_Tuple2(
			'Dots with Custom Size and Color',
			$author$project$W$Loading$dots(
				_List_fromArray(
					[
						$author$project$W$Loading$size(40),
						$author$project$W$Loading$color('red')
					]))),
			_Utils_Tuple2(
			'Ripples',
			$author$project$W$Loading$ripples(_List_Nil)),
			_Utils_Tuple2(
			'Ripples with Custom Size and Color',
			$author$project$W$Loading$ripples(
				_List_fromArray(
					[
						$author$project$W$Loading$size(40),
						$author$project$W$Loading$color('red')
					])))
		]),
	$dtwrks$elm_book$ElmBook$Chapter$chapter('Loading'));
var $author$project$W$Field$Attribute = function (a) {
	return {$: 'Attribute', a: a};
};
var $author$project$W$Field$alignRight = function (v) {
	return $author$project$W$Field$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{alignRight: v});
		});
};
var $author$project$W$Field$danger = function (v) {
	return $author$project$W$Field$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{
					danger: $elm$core$Maybe$Just(v)
				});
		});
};
var $author$project$W$Field$footer = function (v) {
	return $author$project$W$Field$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{
					footer: $elm$core$Maybe$Just(v)
				});
		});
};
var $author$project$W$Field$hint = function (v) {
	return $author$project$W$Field$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{
					hint: $elm$core$Maybe$Just(v)
				});
		});
};
var $dtwrks$elm_book$ElmBook$Actions$logActionWithString = $dtwrks$elm_book$ElmBook$Actions$logActionWith($elm$core$Basics$identity);
var $author$project$W$InputText$Attribute = function (a) {
	return {$: 'Attribute', a: a};
};
var $author$project$W$InputText$placeholder = function (v) {
	return $author$project$W$InputText$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{
					placeholder: $elm$core$Maybe$Just(v)
				});
		});
};
var $author$project$W$Field$success = function (v) {
	return $author$project$W$Field$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{
					success: $elm$core$Maybe$Just(v)
				});
		});
};
var $author$project$W$Field$defaultAttrs = {alignRight: false, _class: '', danger: $elm$core$Maybe$Nothing, footer: $elm$core$Maybe$Nothing, hint: $elm$core$Maybe$Nothing, htmlAttributes: _List_Nil, id: $elm$core$Maybe$Nothing, success: $elm$core$Maybe$Nothing, warning: $elm$core$Maybe$Nothing};
var $author$project$W$Field$applyAttrs = function (attrs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, a) {
				var fn = _v0.a;
				return fn(a);
			}),
		$author$project$W$Field$defaultAttrs,
		attrs);
};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$section = _VirtualDom_node('section');
var $author$project$W$Field$view = F2(
	function (attrs_, props) {
		var attrs = $author$project$W$Field$applyAttrs(attrs_);
		return A2(
			$elm$html$Html$section,
			_Utils_ap(
				attrs.htmlAttributes,
				_List_fromArray(
					[
						A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$id, attrs.id),
						$elm$html$Html$Attributes$class('ew ew-field'),
						$elm$html$Html$Attributes$class(attrs._class)
					])),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('ew ew-field-main'),
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('ew-m-align-right', attrs.alignRight)
								]))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('ew ew-field-label-wrapper')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h1,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('ew ew-field-label')
										]),
									_List_fromArray(
										[props.label])),
									A2(
									$elm$core$Maybe$withDefault,
									$elm$html$Html$text(''),
									A2(
										$elm$core$Maybe$map,
										function (f) {
											return A2(
												$elm$html$Html$p,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('ew ew-field-label-footer')
													]),
												_List_fromArray(
													[f]));
										},
										attrs.footer))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('ew ew-field-input')
								]),
							_List_fromArray(
								[props.input]))
						])),
					function () {
					var _v0 = _Utils_Tuple3(attrs.danger, attrs.warning, attrs.success);
					if (_v0.a.$ === 'Just') {
						var danger_ = _v0.a.a;
						return A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('ew ew-field-message ew-m-danger')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(danger_)
								]));
					} else {
						if (_v0.b.$ === 'Just') {
							var _v1 = _v0.a;
							var warning_ = _v0.b.a;
							return A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('ew ew-field-message ew-m-warning')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(warning_)
									]));
						} else {
							if (_v0.c.$ === 'Just') {
								var _v2 = _v0.a;
								var _v3 = _v0.b;
								var success_ = _v0.c.a;
								return A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('ew ew-field-message ew-m-success')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(success_)
										]));
							} else {
								var _v4 = _v0.a;
								var _v5 = _v0.b;
								var _v6 = _v0.c;
								var _v7 = attrs.hint;
								if (_v7.$ === 'Just') {
									var hint_ = _v7.a;
									return A2(
										$elm$html$Html$p,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('ew ew-field-message')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(hint_)
											]));
								} else {
									return $elm$html$Html$text('');
								}
							}
						}
					}
				}()
				]));
	});
var $author$project$W$InputText$Text = {$: 'Text'};
var $author$project$W$InputText$defaultAttrs = {_class: '', disabled: false, htmlAttributes: _List_Nil, id: $elm$core$Maybe$Nothing, maxLength: $elm$core$Maybe$Nothing, minLength: $elm$core$Maybe$Nothing, onBlur: $elm$core$Maybe$Nothing, onEnter: $elm$core$Maybe$Nothing, onFocus: $elm$core$Maybe$Nothing, pattern: $elm$core$Maybe$Nothing, placeholder: $elm$core$Maybe$Nothing, readOnly: false, required: false, type_: $author$project$W$InputText$Text, unstyled: false};
var $author$project$W$InputText$applyAttrs = function (attrs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, a) {
				var fn = _v0.a;
				return fn(a);
			}),
		$author$project$W$InputText$defaultAttrs,
		attrs);
};
var $author$project$W$Internal$Helpers$attrIf = F3(
	function (b, fn, a) {
		return b ? fn(a) : $elm$html$Html$Attributes$class('');
	});
var $elm$html$Html$input = _VirtualDom_node('input');
var $author$project$W$InputText$inputTypeToString = function (t) {
	switch (t.$) {
		case 'Text':
			return 'text';
		case 'Telephone':
			return 'tel';
		case 'Password':
			return 'password';
		case 'Search':
			return 'search';
		case 'Email':
			return 'email';
		default:
			return 'url';
	}
};
var $elm$html$Html$Attributes$maxlength = function (n) {
	return A2(
		_VirtualDom_attribute,
		'maxlength',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$Attributes$minlength = function (n) {
	return A2(
		_VirtualDom_attribute,
		'minLength',
		$elm$core$String$fromInt(n));
};
var $elm$core$Basics$not = _Basics_not;
var $elm$html$Html$Events$onBlur = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'blur',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$W$Internal$Helpers$enterDecoder = function (a) {
	return A2(
		$elm$json$Json$Decode$andThen,
		function (key) {
			return (key === 'Enter') ? $elm$json$Json$Decode$succeed(a) : $elm$json$Json$Decode$fail('Invalid key.');
		},
		A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
};
var $author$project$W$Internal$Helpers$onEnter = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'keyup',
		$author$project$W$Internal$Helpers$enterDecoder(msg));
};
var $elm$html$Html$Events$onFocus = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'focus',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$pattern = $elm$html$Html$Attributes$stringProperty('pattern');
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$Attributes$readonly = $elm$html$Html$Attributes$boolProperty('readOnly');
var $elm$html$Html$Attributes$required = $elm$html$Html$Attributes$boolProperty('required');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$W$InputText$view = F2(
	function (attrs_, props) {
		var attrs = $author$project$W$InputText$applyAttrs(attrs_);
		return A2(
			$elm$html$Html$input,
			_Utils_ap(
				attrs.htmlAttributes,
				_List_fromArray(
					[
						A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$id, attrs.id),
						$elm$html$Html$Attributes$type_(
						$author$project$W$InputText$inputTypeToString(attrs.type_)),
						A3($author$project$W$Internal$Helpers$attrIf, !attrs.unstyled, $elm$html$Html$Attributes$class, 'ew ew-input ew-focusable'),
						$elm$html$Html$Attributes$class(attrs._class),
						$elm$html$Html$Attributes$required(attrs.required),
						$elm$html$Html$Attributes$disabled(attrs.disabled),
						$elm$html$Html$Attributes$readonly(attrs.readOnly || attrs.readOnly),
						$elm$html$Html$Attributes$value(props.value),
						$elm$html$Html$Events$onInput(props.onInput),
						A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$placeholder, attrs.placeholder),
						A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$minlength, attrs.minLength),
						A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$maxlength, attrs.maxLength),
						A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$pattern, attrs.pattern),
						A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Events$onFocus, attrs.onFocus),
						A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Events$onBlur, attrs.onBlur),
						A2($author$project$W$Internal$Helpers$maybeAttr, $author$project$W$Internal$Helpers$onEnter, attrs.onEnter)
					])),
			_List_Nil);
	});
var $author$project$W$Field$warning = function (v) {
	return $author$project$W$Field$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{
					warning: $elm$core$Maybe$Just(v)
				});
		});
};
var $author$project$Chapters$Form$Field$chapter_ = function () {
	var props = {
		input: A2(
			$author$project$W$InputText$view,
			_List_fromArray(
				[
					$author$project$W$InputText$placeholder('...')
				]),
			{
				onInput: $dtwrks$elm_book$ElmBook$Actions$logActionWithString('onInput'),
				value: ''
			}),
		label: $elm$html$Html$text('Label')
	};
	return A2(
		$dtwrks$elm_book$ElmBook$Chapter$renderComponentList,
		_List_fromArray(
			[
				_Utils_Tuple2(
				'Single',
				A2($author$project$W$Field$view, _List_Nil, props)),
				_Utils_Tuple2(
				'Group + Status',
				A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2($author$project$W$Field$view, _List_Nil, props),
							A2(
							$author$project$W$Field$view,
							_List_fromArray(
								[
									$author$project$W$Field$hint('Try writing some text here.')
								]),
							props),
							A2(
							$author$project$W$Field$view,
							_List_fromArray(
								[
									$author$project$W$Field$hint('Try writing some text here.'),
									$author$project$W$Field$success('Pretty good text you wrote there!')
								]),
							props),
							A2(
							$author$project$W$Field$view,
							_List_fromArray(
								[
									$author$project$W$Field$hint('Try writing some text here.'),
									$author$project$W$Field$success('Pretty good text you wrote there!'),
									$author$project$W$Field$warning('You know better than this.')
								]),
							props),
							A2(
							$author$project$W$Field$view,
							_List_fromArray(
								[
									$author$project$W$Field$hint('Try writing some text here.'),
									$author$project$W$Field$success('Pretty good text you wrote there!'),
									$author$project$W$Field$warning('You know better than this.'),
									$author$project$W$Field$danger('You\'re in trouble now…')
								]),
							props)
						]))),
				_Utils_Tuple2(
				'Right aligned',
				A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$author$project$W$Field$view,
							_List_fromArray(
								[
									$author$project$W$Field$alignRight(true)
								]),
							props),
							A2(
							$author$project$W$Field$view,
							_List_fromArray(
								[
									$author$project$W$Field$alignRight(true),
									$author$project$W$Field$footer(
									$elm$html$Html$text('Some description')),
									$author$project$W$Field$warning('You know better than this.')
								]),
							props),
							A2(
							$author$project$W$Field$view,
							_List_fromArray(
								[
									$author$project$W$Field$alignRight(true),
									$author$project$W$Field$footer(
									$elm$html$Html$text('Some description')),
									$author$project$W$Field$success('You did it!')
								]),
							props)
						])))
			]),
		$dtwrks$elm_book$ElmBook$Chapter$chapter('Field'));
}();
var $author$project$W$InputAutocomplete$Attribute = function (a) {
	return {$: 'Attribute', a: a};
};
var $author$project$W$InputAutocomplete$placeholder = function (v) {
	return $author$project$W$InputAutocomplete$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{
					placeholder: $elm$core$Maybe$Just(v)
				});
		});
};
var $author$project$W$InputAutocomplete$readOnly = function (v) {
	return $author$project$W$InputAutocomplete$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{readOnly: v});
		});
};
var $author$project$Chapters$Form$InputAutocomplete$result = F2(
	function (search, value) {
		return '\"' + (search + ('\"' + (' ' + function () {
			if (value.$ === 'Just') {
				var int_ = value.a;
				return 'Just ' + $elm$core$String$fromInt(int_);
			} else {
				return 'Nothing';
			}
		}())));
	});
var $author$project$W$InputAutocomplete$defaultAttrs = {_class: '', disabled: false, htmlAttributes: _List_Nil, onBlur: $elm$core$Maybe$Nothing, onEnter: $elm$core$Maybe$Nothing, onFocus: $elm$core$Maybe$Nothing, placeholder: $elm$core$Maybe$Nothing, readOnly: false, required: false};
var $author$project$W$InputAutocomplete$applyAttrs = function (attrs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, a) {
				var fn = _v0.a;
				return fn(a);
			}),
		$author$project$W$InputAutocomplete$defaultAttrs,
		attrs);
};
var $elm$html$Html$Attributes$autocomplete = function (bool) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'autocomplete',
		bool ? 'on' : 'off');
};
var $elm$html$Html$datalist = _VirtualDom_node('datalist');
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$html$Html$Attributes$list = _VirtualDom_attribute('list');
var $elm$html$Html$option = _VirtualDom_node('option');
var $author$project$W$InputAutocomplete$view = F2(
	function (attrs_, props) {
		var options = A2(
			$elm$core$List$map,
			function (o) {
				return _Utils_Tuple2(
					props.toLabel(o),
					o);
			},
			A2($elm$core$Maybe$withDefault, _List_Nil, props.options));
		var optionsDict = $elm$core$Dict$fromList(options);
		var attrs = $author$project$W$InputAutocomplete$applyAttrs(attrs_);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('ew ew-autocomplete')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$input,
					_Utils_ap(
						attrs.htmlAttributes,
						_List_fromArray(
							[
								A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$placeholder, attrs.placeholder),
								$elm$html$Html$Attributes$disabled(attrs.disabled || attrs.readOnly),
								$elm$html$Html$Attributes$readonly(attrs.readOnly),
								$elm$html$Html$Attributes$required(attrs.required),
								$elm$html$Html$Attributes$autocomplete(false),
								$elm$html$Html$Attributes$id(props.id),
								$elm$html$Html$Attributes$class(attrs._class),
								$elm$html$Html$Attributes$class('ew ew-input ew-focusable'),
								$elm$html$Html$Attributes$list(props.id + '-list'),
								$elm$html$Html$Attributes$value(props.search),
								A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Events$onFocus, attrs.onFocus),
								A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Events$onBlur, attrs.onBlur),
								A2($author$project$W$Internal$Helpers$maybeAttr, $author$project$W$Internal$Helpers$onEnter, attrs.onEnter),
								A2(
								$elm$html$Html$Events$on,
								'input',
								A2(
									$elm$json$Json$Decode$andThen,
									function (value) {
										return $elm$json$Json$Decode$succeed(
											A2(
												props.onInput,
												value,
												A2($elm$core$Dict$get, value, optionsDict)));
									},
									A2(
										$elm$json$Json$Decode$at,
										_List_fromArray(
											['target', 'value']),
										$elm$json$Json$Decode$string)))
							])),
					_List_Nil),
					A2(
					$elm$html$Html$datalist,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id(props.id + '-list')
						]),
					A2(
						$elm$core$List$map,
						function (_v0) {
							var label = _v0.a;
							return A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value(label)
									]),
								_List_Nil);
						},
						options)),
					_Utils_eq(props.options, $elm$core$Maybe$Nothing) ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('ew ew-autocomplete-loading')
						]),
					_List_fromArray(
						[
							$author$project$W$Loading$circles(
							_List_fromArray(
								[
									$author$project$W$Loading$size(28)
								]))
						])) : $elm$html$Html$text('')
				]));
	});
var $author$project$Chapters$Form$InputAutocomplete$chapter_ = A2(
	$dtwrks$elm_book$ElmBook$Chapter$renderComponentList,
	_List_fromArray(
		[
			_Utils_Tuple2(
			'Default',
			A2(
				$author$project$W$InputAutocomplete$view,
				_List_fromArray(
					[
						$author$project$W$InputAutocomplete$placeholder('Search for a number…')
					]),
				{
					id: 'default',
					onInput: F2(
						function (a, b) {
							return A2(
								$dtwrks$elm_book$ElmBook$Actions$logActionWithString,
								'onInput',
								A2($author$project$Chapters$Form$InputAutocomplete$result, a, b));
						}),
					options: $elm$core$Maybe$Just(
						A2($elm$core$List$range, 0, 10)),
					search: '',
					toLabel: $elm$core$String$fromInt,
					value: $elm$core$Maybe$Nothing
				})),
			_Utils_Tuple2(
			'Loading',
			A2(
				$author$project$W$InputAutocomplete$view,
				_List_fromArray(
					[
						$author$project$W$InputAutocomplete$placeholder('Fetching some options…')
					]),
				{
					id: 'loading',
					onInput: F2(
						function (a, b) {
							return A2(
								$dtwrks$elm_book$ElmBook$Actions$logActionWithString,
								'onInput',
								A2($author$project$Chapters$Form$InputAutocomplete$result, a, b));
						}),
					options: $elm$core$Maybe$Nothing,
					search: '',
					toLabel: $elm$core$String$fromInt,
					value: $elm$core$Maybe$Nothing
				})),
			_Utils_Tuple2(
			'Read Only',
			A2(
				$author$project$W$InputAutocomplete$view,
				_List_fromArray(
					[
						$author$project$W$InputAutocomplete$readOnly(true),
						$author$project$W$InputAutocomplete$placeholder('You can\'t touch me')
					]),
				{
					id: 'loading',
					onInput: F2(
						function (a, b) {
							return A2(
								$dtwrks$elm_book$ElmBook$Actions$logActionWithString,
								'onInput',
								A2($author$project$Chapters$Form$InputAutocomplete$result, a, b));
						}),
					options: $elm$core$Maybe$Just(
						A2($elm$core$List$range, 0, 10)),
					search: '',
					toLabel: $elm$core$String$fromInt,
					value: $elm$core$Maybe$Nothing
				}))
		]),
	$dtwrks$elm_book$ElmBook$Chapter$chapter('Input Autocomplete'));
var $author$project$W$InputCheckbox$Attribute = function (a) {
	return {$: 'Attribute', a: a};
};
var $author$project$W$InputCheckbox$color = function (v) {
	return $author$project$W$InputCheckbox$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{color: v});
		});
};
var $author$project$W$InputCheckbox$disabled = function (v) {
	return $author$project$W$InputCheckbox$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{disabled: v});
		});
};
var $dtwrks$elm_book$ElmBook$Actions$stringFromBool = function (value) {
	return value ? 'True' : 'False';
};
var $dtwrks$elm_book$ElmBook$Actions$logActionWithBool = $dtwrks$elm_book$ElmBook$Actions$logActionWith($dtwrks$elm_book$ElmBook$Actions$stringFromBool);
var $author$project$W$InputCheckbox$readOnly = function (v) {
	return $author$project$W$InputCheckbox$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{readOnly: v});
		});
};
var $author$project$W$InputCheckbox$defaultAttrs = {color: 'var(--theme-primary-bg)', disabled: false, id: $elm$core$Maybe$Nothing, readOnly: false};
var $author$project$W$InputCheckbox$applyAttrs = function (attrs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, a) {
				var fn = _v0.a;
				return fn(a);
			}),
		$author$project$W$InputCheckbox$defaultAttrs,
		attrs);
};
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$html$Html$Events$targetChecked = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'checked']),
	$elm$json$Json$Decode$bool);
var $elm$html$Html$Events$onCheck = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetChecked));
};
var $author$project$W$InputCheckbox$view = F2(
	function (attrs_, props) {
		var attrs = $author$project$W$InputCheckbox$applyAttrs(attrs_);
		return A2(
			$elm$html$Html$input,
			_List_fromArray(
				[
					A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$id, attrs.id),
					$elm$html$Html$Attributes$class('ew ew-focusable ew-checkbox'),
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('ew-is-disabled', attrs.disabled && (!attrs.readOnly)),
							_Utils_Tuple2('ew-is-read-only', attrs.readOnly)
						])),
					$author$project$W$Internal$Helpers$styles(
					_List_fromArray(
						[
							_Utils_Tuple2('--color', attrs.color)
						])),
					$elm$html$Html$Attributes$type_('checkbox'),
					$elm$html$Html$Attributes$checked(props.value),
					$elm$html$Html$Attributes$disabled(attrs.disabled || attrs.readOnly),
					$elm$html$Html$Attributes$readonly(attrs.readOnly),
					$elm$html$Html$Events$onCheck(props.onInput)
				]),
			_List_Nil);
	});
var $author$project$Chapters$Form$InputCheckbox$chapter_ = A2(
	$dtwrks$elm_book$ElmBook$Chapter$renderComponentList,
	_List_fromArray(
		[
			_Utils_Tuple2(
			'Default',
			A2(
				$author$project$W$InputCheckbox$view,
				_List_Nil,
				{
					onInput: $dtwrks$elm_book$ElmBook$Actions$logActionWithBool('onInput'),
					value: true
				})),
			_Utils_Tuple2(
			'Disabled',
			A2(
				$author$project$W$InputCheckbox$view,
				_List_fromArray(
					[
						$author$project$W$InputCheckbox$disabled(true)
					]),
				{
					onInput: $dtwrks$elm_book$ElmBook$Actions$logActionWithBool('onInput'),
					value: false
				})),
			_Utils_Tuple2(
			'Read Only',
			A2(
				$author$project$W$InputCheckbox$view,
				_List_fromArray(
					[
						$author$project$W$InputCheckbox$readOnly(true)
					]),
				{
					onInput: $dtwrks$elm_book$ElmBook$Actions$logActionWithBool('onInput'),
					value: true
				})),
			_Utils_Tuple2(
			'Custom Color',
			A2(
				$author$project$W$InputCheckbox$view,
				_List_fromArray(
					[
						$author$project$W$InputCheckbox$color('red')
					]),
				{
					onInput: $dtwrks$elm_book$ElmBook$Actions$logActionWithBool('onInput'),
					value: true
				}))
		]),
	$dtwrks$elm_book$ElmBook$Chapter$chapter('Input Checkbox'));
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $justinmimbs$date$Date$RD = function (a) {
	return {$: 'RD', a: a};
};
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$core$Basics$neq = _Utils_notEqual;
var $justinmimbs$date$Date$isLeapYear = function (y) {
	return ((!A2($elm$core$Basics$modBy, 4, y)) && (!(!A2($elm$core$Basics$modBy, 100, y)))) || (!A2($elm$core$Basics$modBy, 400, y));
};
var $justinmimbs$date$Date$daysBeforeMonth = F2(
	function (y, m) {
		var leapDays = $justinmimbs$date$Date$isLeapYear(y) ? 1 : 0;
		switch (m.$) {
			case 'Jan':
				return 0;
			case 'Feb':
				return 31;
			case 'Mar':
				return 59 + leapDays;
			case 'Apr':
				return 90 + leapDays;
			case 'May':
				return 120 + leapDays;
			case 'Jun':
				return 151 + leapDays;
			case 'Jul':
				return 181 + leapDays;
			case 'Aug':
				return 212 + leapDays;
			case 'Sep':
				return 243 + leapDays;
			case 'Oct':
				return 273 + leapDays;
			case 'Nov':
				return 304 + leapDays;
			default:
				return 334 + leapDays;
		}
	});
var $justinmimbs$date$Date$floorDiv = F2(
	function (a, b) {
		return $elm$core$Basics$floor(a / b);
	});
var $justinmimbs$date$Date$daysBeforeYear = function (y1) {
	var y = y1 - 1;
	var leapYears = (A2($justinmimbs$date$Date$floorDiv, y, 4) - A2($justinmimbs$date$Date$floorDiv, y, 100)) + A2($justinmimbs$date$Date$floorDiv, y, 400);
	return (365 * y) + leapYears;
};
var $justinmimbs$date$Date$daysInMonth = F2(
	function (y, m) {
		switch (m.$) {
			case 'Jan':
				return 31;
			case 'Feb':
				return $justinmimbs$date$Date$isLeapYear(y) ? 29 : 28;
			case 'Mar':
				return 31;
			case 'Apr':
				return 30;
			case 'May':
				return 31;
			case 'Jun':
				return 30;
			case 'Jul':
				return 31;
			case 'Aug':
				return 31;
			case 'Sep':
				return 30;
			case 'Oct':
				return 31;
			case 'Nov':
				return 30;
			default:
				return 31;
		}
	});
var $justinmimbs$date$Date$fromCalendarDate = F3(
	function (y, m, d) {
		return $justinmimbs$date$Date$RD(
			($justinmimbs$date$Date$daysBeforeYear(y) + A2($justinmimbs$date$Date$daysBeforeMonth, y, m)) + A3(
				$elm$core$Basics$clamp,
				1,
				A2($justinmimbs$date$Date$daysInMonth, y, m),
				d));
	});
var $elm$time$Time$flooredDiv = F2(
	function (numerator, denominator) {
		return $elm$core$Basics$floor(numerator / denominator);
	});
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0.a;
	return millis;
};
var $elm$time$Time$toAdjustedMinutesHelp = F3(
	function (defaultOffset, posixMinutes, eras) {
		toAdjustedMinutesHelp:
		while (true) {
			if (!eras.b) {
				return posixMinutes + defaultOffset;
			} else {
				var era = eras.a;
				var olderEras = eras.b;
				if (_Utils_cmp(era.start, posixMinutes) < 0) {
					return posixMinutes + era.offset;
				} else {
					var $temp$defaultOffset = defaultOffset,
						$temp$posixMinutes = posixMinutes,
						$temp$eras = olderEras;
					defaultOffset = $temp$defaultOffset;
					posixMinutes = $temp$posixMinutes;
					eras = $temp$eras;
					continue toAdjustedMinutesHelp;
				}
			}
		}
	});
var $elm$time$Time$toAdjustedMinutes = F2(
	function (_v0, time) {
		var defaultOffset = _v0.a;
		var eras = _v0.b;
		return A3(
			$elm$time$Time$toAdjustedMinutesHelp,
			defaultOffset,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				60000),
			eras);
	});
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$time$Time$toCivil = function (minutes) {
	var rawDay = A2($elm$time$Time$flooredDiv, minutes, 60 * 24) + 719468;
	var era = (((rawDay >= 0) ? rawDay : (rawDay - 146096)) / 146097) | 0;
	var dayOfEra = rawDay - (era * 146097);
	var yearOfEra = ((((dayOfEra - ((dayOfEra / 1460) | 0)) + ((dayOfEra / 36524) | 0)) - ((dayOfEra / 146096) | 0)) / 365) | 0;
	var dayOfYear = dayOfEra - (((365 * yearOfEra) + ((yearOfEra / 4) | 0)) - ((yearOfEra / 100) | 0));
	var mp = (((5 * dayOfYear) + 2) / 153) | 0;
	var month = mp + ((mp < 10) ? 3 : (-9));
	var year = yearOfEra + (era * 400);
	return {
		day: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		month: month,
		year: year + ((month <= 2) ? 1 : 0)
	};
};
var $elm$time$Time$toDay = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).day;
	});
var $elm$time$Time$Apr = {$: 'Apr'};
var $elm$time$Time$Aug = {$: 'Aug'};
var $elm$time$Time$Dec = {$: 'Dec'};
var $elm$time$Time$Feb = {$: 'Feb'};
var $elm$time$Time$Jan = {$: 'Jan'};
var $elm$time$Time$Jul = {$: 'Jul'};
var $elm$time$Time$Jun = {$: 'Jun'};
var $elm$time$Time$Mar = {$: 'Mar'};
var $elm$time$Time$May = {$: 'May'};
var $elm$time$Time$Nov = {$: 'Nov'};
var $elm$time$Time$Oct = {$: 'Oct'};
var $elm$time$Time$Sep = {$: 'Sep'};
var $elm$time$Time$toMonth = F2(
	function (zone, time) {
		var _v0 = $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).month;
		switch (_v0) {
			case 1:
				return $elm$time$Time$Jan;
			case 2:
				return $elm$time$Time$Feb;
			case 3:
				return $elm$time$Time$Mar;
			case 4:
				return $elm$time$Time$Apr;
			case 5:
				return $elm$time$Time$May;
			case 6:
				return $elm$time$Time$Jun;
			case 7:
				return $elm$time$Time$Jul;
			case 8:
				return $elm$time$Time$Aug;
			case 9:
				return $elm$time$Time$Sep;
			case 10:
				return $elm$time$Time$Oct;
			case 11:
				return $elm$time$Time$Nov;
			default:
				return $elm$time$Time$Dec;
		}
	});
var $elm$time$Time$toYear = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).year;
	});
var $justinmimbs$date$Date$fromPosix = F2(
	function (zone, posix) {
		return A3(
			$justinmimbs$date$Date$fromCalendarDate,
			A2($elm$time$Time$toYear, zone, posix),
			A2($elm$time$Time$toMonth, zone, posix),
			A2($elm$time$Time$toDay, zone, posix));
	});
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $author$project$W$InputDate$Attribute = function (a) {
	return {$: 'Attribute', a: a};
};
var $author$project$W$InputDate$timeZone = function (v) {
	return $author$project$W$InputDate$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{timeZone: v});
		});
};
var $elm$time$Time$toHour = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			24,
			A2(
				$elm$time$Time$flooredDiv,
				A2($elm$time$Time$toAdjustedMinutes, zone, time),
				60));
	});
var $justinmimbs$date$Date$monthToNumber = function (m) {
	switch (m.$) {
		case 'Jan':
			return 1;
		case 'Feb':
			return 2;
		case 'Mar':
			return 3;
		case 'Apr':
			return 4;
		case 'May':
			return 5;
		case 'Jun':
			return 6;
		case 'Jul':
			return 7;
		case 'Aug':
			return 8;
		case 'Sep':
			return 9;
		case 'Oct':
			return 10;
		case 'Nov':
			return 11;
		default:
			return 12;
	}
};
var $justinmimbs$date$Date$numberToMonth = function (mn) {
	var _v0 = A2($elm$core$Basics$max, 1, mn);
	switch (_v0) {
		case 1:
			return $elm$time$Time$Jan;
		case 2:
			return $elm$time$Time$Feb;
		case 3:
			return $elm$time$Time$Mar;
		case 4:
			return $elm$time$Time$Apr;
		case 5:
			return $elm$time$Time$May;
		case 6:
			return $elm$time$Time$Jun;
		case 7:
			return $elm$time$Time$Jul;
		case 8:
			return $elm$time$Time$Aug;
		case 9:
			return $elm$time$Time$Sep;
		case 10:
			return $elm$time$Time$Oct;
		case 11:
			return $elm$time$Time$Nov;
		default:
			return $elm$time$Time$Dec;
	}
};
var $justinmimbs$date$Date$toCalendarDateHelp = F3(
	function (y, m, d) {
		toCalendarDateHelp:
		while (true) {
			var monthDays = A2($justinmimbs$date$Date$daysInMonth, y, m);
			var mn = $justinmimbs$date$Date$monthToNumber(m);
			if ((mn < 12) && (_Utils_cmp(d, monthDays) > 0)) {
				var $temp$y = y,
					$temp$m = $justinmimbs$date$Date$numberToMonth(mn + 1),
					$temp$d = d - monthDays;
				y = $temp$y;
				m = $temp$m;
				d = $temp$d;
				continue toCalendarDateHelp;
			} else {
				return {day: d, month: m, year: y};
			}
		}
	});
var $justinmimbs$date$Date$divWithRemainder = F2(
	function (a, b) {
		return _Utils_Tuple2(
			A2($justinmimbs$date$Date$floorDiv, a, b),
			A2($elm$core$Basics$modBy, b, a));
	});
var $justinmimbs$date$Date$year = function (_v0) {
	var rd = _v0.a;
	var _v1 = A2($justinmimbs$date$Date$divWithRemainder, rd, 146097);
	var n400 = _v1.a;
	var r400 = _v1.b;
	var _v2 = A2($justinmimbs$date$Date$divWithRemainder, r400, 36524);
	var n100 = _v2.a;
	var r100 = _v2.b;
	var _v3 = A2($justinmimbs$date$Date$divWithRemainder, r100, 1461);
	var n4 = _v3.a;
	var r4 = _v3.b;
	var _v4 = A2($justinmimbs$date$Date$divWithRemainder, r4, 365);
	var n1 = _v4.a;
	var r1 = _v4.b;
	var n = (!r1) ? 0 : 1;
	return ((((n400 * 400) + (n100 * 100)) + (n4 * 4)) + n1) + n;
};
var $justinmimbs$date$Date$toOrdinalDate = function (_v0) {
	var rd = _v0.a;
	var y = $justinmimbs$date$Date$year(
		$justinmimbs$date$Date$RD(rd));
	return {
		ordinalDay: rd - $justinmimbs$date$Date$daysBeforeYear(y),
		year: y
	};
};
var $justinmimbs$date$Date$toCalendarDate = function (_v0) {
	var rd = _v0.a;
	var date = $justinmimbs$date$Date$toOrdinalDate(
		$justinmimbs$date$Date$RD(rd));
	return A3($justinmimbs$date$Date$toCalendarDateHelp, date.year, $elm$time$Time$Jan, date.ordinalDay);
};
var $justinmimbs$date$Date$day = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toCalendarDate,
	function ($) {
		return $.day;
	});
var $elm$core$String$slice = _String_slice;
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $justinmimbs$date$Date$month = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toCalendarDate,
	function ($) {
		return $.month;
	});
var $justinmimbs$date$Date$monthNumber = A2($elm$core$Basics$composeR, $justinmimbs$date$Date$month, $justinmimbs$date$Date$monthToNumber);
var $justinmimbs$date$Date$ordinalDay = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toOrdinalDate,
	function ($) {
		return $.ordinalDay;
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$String$length = _String_length;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $justinmimbs$date$Date$padSignedInt = F2(
	function (length, _int) {
		return _Utils_ap(
			(_int < 0) ? '-' : '',
			A3(
				$elm$core$String$padLeft,
				length,
				_Utils_chr('0'),
				$elm$core$String$fromInt(
					$elm$core$Basics$abs(_int))));
	});
var $justinmimbs$date$Date$monthToQuarter = function (m) {
	return (($justinmimbs$date$Date$monthToNumber(m) + 2) / 3) | 0;
};
var $justinmimbs$date$Date$quarter = A2($elm$core$Basics$composeR, $justinmimbs$date$Date$month, $justinmimbs$date$Date$monthToQuarter);
var $elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			$elm$core$String$slice,
			-n,
			$elm$core$String$length(string),
			string);
	});
var $justinmimbs$date$Date$weekdayNumber = function (_v0) {
	var rd = _v0.a;
	var _v1 = A2($elm$core$Basics$modBy, 7, rd);
	if (!_v1) {
		return 7;
	} else {
		var n = _v1;
		return n;
	}
};
var $justinmimbs$date$Date$daysBeforeWeekYear = function (y) {
	var jan4 = $justinmimbs$date$Date$daysBeforeYear(y) + 4;
	return jan4 - $justinmimbs$date$Date$weekdayNumber(
		$justinmimbs$date$Date$RD(jan4));
};
var $elm$time$Time$Fri = {$: 'Fri'};
var $elm$time$Time$Mon = {$: 'Mon'};
var $elm$time$Time$Sat = {$: 'Sat'};
var $elm$time$Time$Sun = {$: 'Sun'};
var $elm$time$Time$Thu = {$: 'Thu'};
var $elm$time$Time$Tue = {$: 'Tue'};
var $elm$time$Time$Wed = {$: 'Wed'};
var $justinmimbs$date$Date$numberToWeekday = function (wdn) {
	var _v0 = A2($elm$core$Basics$max, 1, wdn);
	switch (_v0) {
		case 1:
			return $elm$time$Time$Mon;
		case 2:
			return $elm$time$Time$Tue;
		case 3:
			return $elm$time$Time$Wed;
		case 4:
			return $elm$time$Time$Thu;
		case 5:
			return $elm$time$Time$Fri;
		case 6:
			return $elm$time$Time$Sat;
		default:
			return $elm$time$Time$Sun;
	}
};
var $justinmimbs$date$Date$toWeekDate = function (_v0) {
	var rd = _v0.a;
	var wdn = $justinmimbs$date$Date$weekdayNumber(
		$justinmimbs$date$Date$RD(rd));
	var wy = $justinmimbs$date$Date$year(
		$justinmimbs$date$Date$RD(rd + (4 - wdn)));
	var week1Day1 = $justinmimbs$date$Date$daysBeforeWeekYear(wy) + 1;
	return {
		weekNumber: 1 + (((rd - week1Day1) / 7) | 0),
		weekYear: wy,
		weekday: $justinmimbs$date$Date$numberToWeekday(wdn)
	};
};
var $justinmimbs$date$Date$weekNumber = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toWeekDate,
	function ($) {
		return $.weekNumber;
	});
var $justinmimbs$date$Date$weekYear = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toWeekDate,
	function ($) {
		return $.weekYear;
	});
var $justinmimbs$date$Date$weekday = A2($elm$core$Basics$composeR, $justinmimbs$date$Date$weekdayNumber, $justinmimbs$date$Date$numberToWeekday);
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $justinmimbs$date$Date$ordinalSuffix = function (n) {
	var nn = A2($elm$core$Basics$modBy, 100, n);
	var _v0 = A2(
		$elm$core$Basics$min,
		(nn < 20) ? nn : A2($elm$core$Basics$modBy, 10, nn),
		4);
	switch (_v0) {
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default:
			return 'th';
	}
};
var $justinmimbs$date$Date$withOrdinalSuffix = function (n) {
	return _Utils_ap(
		$elm$core$String$fromInt(n),
		$justinmimbs$date$Date$ordinalSuffix(n));
};
var $justinmimbs$date$Date$formatField = F4(
	function (language, _char, length, date) {
		switch (_char.valueOf()) {
			case 'y':
				if (length === 2) {
					return A2(
						$elm$core$String$right,
						2,
						A3(
							$elm$core$String$padLeft,
							2,
							_Utils_chr('0'),
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$year(date))));
				} else {
					return A2(
						$justinmimbs$date$Date$padSignedInt,
						length,
						$justinmimbs$date$Date$year(date));
				}
			case 'Y':
				if (length === 2) {
					return A2(
						$elm$core$String$right,
						2,
						A3(
							$elm$core$String$padLeft,
							2,
							_Utils_chr('0'),
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$weekYear(date))));
				} else {
					return A2(
						$justinmimbs$date$Date$padSignedInt,
						length,
						$justinmimbs$date$Date$weekYear(date));
				}
			case 'Q':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$quarter(date));
					case 2:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$quarter(date));
					case 3:
						return 'Q' + $elm$core$String$fromInt(
							$justinmimbs$date$Date$quarter(date));
					case 4:
						return $justinmimbs$date$Date$withOrdinalSuffix(
							$justinmimbs$date$Date$quarter(date));
					case 5:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$quarter(date));
					default:
						return '';
				}
			case 'M':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$monthNumber(date));
					case 2:
						return A3(
							$elm$core$String$padLeft,
							2,
							_Utils_chr('0'),
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$monthNumber(date)));
					case 3:
						return language.monthNameShort(
							$justinmimbs$date$Date$month(date));
					case 4:
						return language.monthName(
							$justinmimbs$date$Date$month(date));
					case 5:
						return A2(
							$elm$core$String$left,
							1,
							language.monthNameShort(
								$justinmimbs$date$Date$month(date)));
					default:
						return '';
				}
			case 'w':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$weekNumber(date));
					case 2:
						return A3(
							$elm$core$String$padLeft,
							2,
							_Utils_chr('0'),
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$weekNumber(date)));
					default:
						return '';
				}
			case 'd':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$day(date));
					case 2:
						return A3(
							$elm$core$String$padLeft,
							2,
							_Utils_chr('0'),
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$day(date)));
					case 3:
						return language.dayWithSuffix(
							$justinmimbs$date$Date$day(date));
					default:
						return '';
				}
			case 'D':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$ordinalDay(date));
					case 2:
						return A3(
							$elm$core$String$padLeft,
							2,
							_Utils_chr('0'),
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$ordinalDay(date)));
					case 3:
						return A3(
							$elm$core$String$padLeft,
							3,
							_Utils_chr('0'),
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$ordinalDay(date)));
					default:
						return '';
				}
			case 'E':
				switch (length) {
					case 1:
						return language.weekdayNameShort(
							$justinmimbs$date$Date$weekday(date));
					case 2:
						return language.weekdayNameShort(
							$justinmimbs$date$Date$weekday(date));
					case 3:
						return language.weekdayNameShort(
							$justinmimbs$date$Date$weekday(date));
					case 4:
						return language.weekdayName(
							$justinmimbs$date$Date$weekday(date));
					case 5:
						return A2(
							$elm$core$String$left,
							1,
							language.weekdayNameShort(
								$justinmimbs$date$Date$weekday(date)));
					case 6:
						return A2(
							$elm$core$String$left,
							2,
							language.weekdayNameShort(
								$justinmimbs$date$Date$weekday(date)));
					default:
						return '';
				}
			case 'e':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$weekdayNumber(date));
					case 2:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$weekdayNumber(date));
					default:
						return A4(
							$justinmimbs$date$Date$formatField,
							language,
							_Utils_chr('E'),
							length,
							date);
				}
			default:
				return '';
		}
	});
var $justinmimbs$date$Date$formatWithTokens = F3(
	function (language, tokens, date) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (token, formatted) {
					if (token.$ === 'Field') {
						var _char = token.a;
						var length = token.b;
						return _Utils_ap(
							A4($justinmimbs$date$Date$formatField, language, _char, length, date),
							formatted);
					} else {
						var str = token.a;
						return _Utils_ap(str, formatted);
					}
				}),
			'',
			tokens);
	});
var $justinmimbs$date$Pattern$Literal = function (a) {
	return {$: 'Literal', a: a};
};
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 'Bad', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 'Good', a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parseA(s0);
				if (_v1.$ === 'Bad') {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p1 = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					var _v2 = callback(a);
					var parseB = _v2.a;
					var _v3 = parseB(s1);
					if (_v3.$ === 'Bad') {
						var p2 = _v3.a;
						var x = _v3.b;
						return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
					} else {
						var p2 = _v3.a;
						var b = _v3.b;
						var s2 = _v3.c;
						return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
					}
				}
			});
	});
var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0.a;
		var parseB = _v1.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v2 = parseA(s0);
				if (_v2.$ === 'Bad') {
					var p = _v2.a;
					var x = _v2.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p1 = _v2.a;
					var a = _v2.b;
					var s1 = _v2.c;
					var _v3 = parseB(s1);
					if (_v3.$ === 'Bad') {
						var p2 = _v3.a;
						var x = _v3.b;
						return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
					} else {
						var p2 = _v3.a;
						var b = _v3.b;
						var s2 = _v3.c;
						return A3(
							$elm$parser$Parser$Advanced$Good,
							p1 || p2,
							A2(func, a, b),
							s2);
					}
				}
			});
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A3($elm$parser$Parser$Advanced$Good, false, a, s);
		});
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $elm$parser$Parser$Expecting = function (a) {
	return {$: 'Expecting', a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 'Token', a: a, b: b};
	});
var $elm$parser$Parser$toToken = function (str) {
	return A2(
		$elm$parser$Parser$Advanced$Token,
		str,
		$elm$parser$Parser$Expecting(str));
};
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 'AddRight', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {col: col, contextStack: contextStack, problem: problem, row: row};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 'Empty'};
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.row, s.col, x, s.context));
	});
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.a;
			var newRow = _v1.b;
			var newCol = _v1.c;
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
				$elm$parser$Parser$Advanced$Good,
				progress,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src});
		});
};
var $elm$parser$Parser$token = function (str) {
	return $elm$parser$Parser$Advanced$token(
		$elm$parser$Parser$toToken(str));
};
var $justinmimbs$date$Pattern$escapedQuote = A2(
	$elm$parser$Parser$ignorer,
	$elm$parser$Parser$succeed(
		$justinmimbs$date$Pattern$Literal('\'')),
	$elm$parser$Parser$token('\'\''));
var $elm$parser$Parser$UnexpectedChar = {$: 'UnexpectedChar'};
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$parser$Parser$Advanced$chompIf = F2(
	function (isGood, expecting) {
		return $elm$parser$Parser$Advanced$Parser(
			function (s) {
				var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, s.offset, s.src);
				return _Utils_eq(newOffset, -1) ? A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : (_Utils_eq(newOffset, -2) ? A3(
					$elm$parser$Parser$Advanced$Good,
					true,
					_Utils_Tuple0,
					{col: 1, context: s.context, indent: s.indent, offset: s.offset + 1, row: s.row + 1, src: s.src}) : A3(
					$elm$parser$Parser$Advanced$Good,
					true,
					_Utils_Tuple0,
					{col: s.col + 1, context: s.context, indent: s.indent, offset: newOffset, row: s.row, src: s.src}));
			});
	});
var $elm$parser$Parser$chompIf = function (isGood) {
	return A2($elm$parser$Parser$Advanced$chompIf, isGood, $elm$parser$Parser$UnexpectedChar);
};
var $justinmimbs$date$Pattern$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.src);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.offset, offset) < 0,
					_Utils_Tuple0,
					{col: col, context: s0.context, indent: s0.indent, offset: offset, row: row, src: s0.src});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.offset, s.row, s.col, s);
		});
};
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $elm$parser$Parser$Advanced$getOffset = $elm$parser$Parser$Advanced$Parser(
	function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, s.offset, s);
	});
var $elm$parser$Parser$getOffset = $elm$parser$Parser$Advanced$getOffset;
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $elm$parser$Parser$Problem = function (a) {
	return {$: 'Problem', a: a};
};
var $elm$parser$Parser$Advanced$problem = function (x) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		});
};
var $elm$parser$Parser$problem = function (msg) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(msg));
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $justinmimbs$date$Pattern$fieldRepeats = function (str) {
	var _v0 = $elm$core$String$toList(str);
	if (_v0.b && (!_v0.b.b)) {
		var _char = _v0.a;
		return A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					F2(
						function (x, y) {
							return A2($justinmimbs$date$Pattern$Field, _char, 1 + (y - x));
						})),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$getOffset,
					$elm$parser$Parser$chompWhile(
						$elm$core$Basics$eq(_char)))),
			$elm$parser$Parser$getOffset);
	} else {
		return $elm$parser$Parser$problem('expected exactly one char');
	}
};
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parse(s0);
				if (_v1.$ === 'Bad') {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p,
						A2(
							func,
							A3($elm$core$String$slice, s0.offset, s1.offset, s0.src),
							a),
						s1);
				}
			});
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $justinmimbs$date$Pattern$field = A2(
	$elm$parser$Parser$andThen,
	$justinmimbs$date$Pattern$fieldRepeats,
	$elm$parser$Parser$getChompedString(
		$elm$parser$Parser$chompIf($elm$core$Char$isAlpha)));
var $justinmimbs$date$Pattern$finalize = A2(
	$elm$core$List$foldl,
	F2(
		function (token, tokens) {
			var _v0 = _Utils_Tuple2(token, tokens);
			if (((_v0.a.$ === 'Literal') && _v0.b.b) && (_v0.b.a.$ === 'Literal')) {
				var x = _v0.a.a;
				var _v1 = _v0.b;
				var y = _v1.a.a;
				var rest = _v1.b;
				return A2(
					$elm$core$List$cons,
					$justinmimbs$date$Pattern$Literal(
						_Utils_ap(x, y)),
					rest);
			} else {
				return A2($elm$core$List$cons, token, tokens);
			}
		}),
	_List_Nil);
var $elm$parser$Parser$Advanced$lazy = function (thunk) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v0 = thunk(_Utils_Tuple0);
			var parse = _v0.a;
			return parse(s);
		});
};
var $elm$parser$Parser$lazy = $elm$parser$Parser$Advanced$lazy;
var $justinmimbs$date$Pattern$isLiteralChar = function (_char) {
	return (!_Utils_eq(
		_char,
		_Utils_chr('\''))) && (!$elm$core$Char$isAlpha(_char));
};
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parse(s0);
				if (_v1.$ === 'Good') {
					var p = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p,
						func(a),
						s1);
				} else {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				}
			});
	});
var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
var $justinmimbs$date$Pattern$literal = A2(
	$elm$parser$Parser$map,
	$justinmimbs$date$Pattern$Literal,
	$elm$parser$Parser$getChompedString(
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(_Utils_Tuple0),
				$elm$parser$Parser$chompIf($justinmimbs$date$Pattern$isLiteralChar)),
			$elm$parser$Parser$chompWhile($justinmimbs$date$Pattern$isLiteralChar))));
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 'Append', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (_v1.$ === 'Good') {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
		});
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $elm$parser$Parser$ExpectingEnd = {$: 'ExpectingEnd'};
var $elm$parser$Parser$Advanced$end = function (x) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return _Utils_eq(
				$elm$core$String$length(s.src),
				s.offset) ? A3($elm$parser$Parser$Advanced$Good, false, _Utils_Tuple0, s) : A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		});
};
var $elm$parser$Parser$end = $elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd);
var $justinmimbs$date$Pattern$quotedHelp = function (result) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$andThen,
				function (str) {
					return $justinmimbs$date$Pattern$quotedHelp(
						_Utils_ap(result, str));
				},
				$elm$parser$Parser$getChompedString(
					A2(
						$elm$parser$Parser$ignorer,
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$succeed(_Utils_Tuple0),
							$elm$parser$Parser$chompIf(
								$elm$core$Basics$neq(
									_Utils_chr('\'')))),
						$elm$parser$Parser$chompWhile(
							$elm$core$Basics$neq(
								_Utils_chr('\'')))))),
				A2(
				$elm$parser$Parser$andThen,
				function (_v0) {
					return $justinmimbs$date$Pattern$quotedHelp(result + '\'');
				},
				$elm$parser$Parser$token('\'\'')),
				$elm$parser$Parser$succeed(result)
			]));
};
var $justinmimbs$date$Pattern$quoted = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($justinmimbs$date$Pattern$Literal),
		$elm$parser$Parser$chompIf(
			$elm$core$Basics$eq(
				_Utils_chr('\'')))),
	A2(
		$elm$parser$Parser$ignorer,
		$justinmimbs$date$Pattern$quotedHelp(''),
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$chompIf(
					$elm$core$Basics$eq(
						_Utils_chr('\''))),
					$elm$parser$Parser$end
				]))));
var $justinmimbs$date$Pattern$patternHelp = function (tokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$andThen,
				function (token) {
					return $justinmimbs$date$Pattern$patternHelp(
						A2($elm$core$List$cons, token, tokens));
				},
				$elm$parser$Parser$oneOf(
					_List_fromArray(
						[$justinmimbs$date$Pattern$field, $justinmimbs$date$Pattern$literal, $justinmimbs$date$Pattern$escapedQuote, $justinmimbs$date$Pattern$quoted]))),
				$elm$parser$Parser$lazy(
				function (_v0) {
					return $elm$parser$Parser$succeed(
						$justinmimbs$date$Pattern$finalize(tokens));
				})
			]));
};
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {col: col, problem: problem, row: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.row, p.col, p.problem);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 'Empty':
					return list;
				case 'AddRight':
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0.a;
		var _v1 = parse(
			{col: 1, context: _List_Nil, indent: 1, offset: 0, row: 1, src: src});
		if (_v1.$ === 'Good') {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (_v0.$ === 'Ok') {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (result.$ === 'Ok') {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $justinmimbs$date$Pattern$fromString = function (str) {
	return A2(
		$elm$core$Result$withDefault,
		_List_fromArray(
			[
				$justinmimbs$date$Pattern$Literal(str)
			]),
		A2(
			$elm$parser$Parser$run,
			$justinmimbs$date$Pattern$patternHelp(_List_Nil),
			str));
};
var $justinmimbs$date$Date$formatWithLanguage = F2(
	function (language, pattern) {
		var tokens = $elm$core$List$reverse(
			$justinmimbs$date$Pattern$fromString(pattern));
		return A2($justinmimbs$date$Date$formatWithTokens, language, tokens);
	});
var $justinmimbs$date$Date$monthToName = function (m) {
	switch (m.$) {
		case 'Jan':
			return 'January';
		case 'Feb':
			return 'February';
		case 'Mar':
			return 'March';
		case 'Apr':
			return 'April';
		case 'May':
			return 'May';
		case 'Jun':
			return 'June';
		case 'Jul':
			return 'July';
		case 'Aug':
			return 'August';
		case 'Sep':
			return 'September';
		case 'Oct':
			return 'October';
		case 'Nov':
			return 'November';
		default:
			return 'December';
	}
};
var $justinmimbs$date$Date$weekdayToName = function (wd) {
	switch (wd.$) {
		case 'Mon':
			return 'Monday';
		case 'Tue':
			return 'Tuesday';
		case 'Wed':
			return 'Wednesday';
		case 'Thu':
			return 'Thursday';
		case 'Fri':
			return 'Friday';
		case 'Sat':
			return 'Saturday';
		default:
			return 'Sunday';
	}
};
var $justinmimbs$date$Date$language_en = {
	dayWithSuffix: $justinmimbs$date$Date$withOrdinalSuffix,
	monthName: $justinmimbs$date$Date$monthToName,
	monthNameShort: A2(
		$elm$core$Basics$composeR,
		$justinmimbs$date$Date$monthToName,
		$elm$core$String$left(3)),
	weekdayName: $justinmimbs$date$Date$weekdayToName,
	weekdayNameShort: A2(
		$elm$core$Basics$composeR,
		$justinmimbs$date$Date$weekdayToName,
		$elm$core$String$left(3))
};
var $justinmimbs$date$Date$format = function (pattern) {
	return A2($justinmimbs$date$Date$formatWithLanguage, $justinmimbs$date$Date$language_en, pattern);
};
var $justinmimbs$date$Date$toIsoString = $justinmimbs$date$Date$format('yyyy-MM-dd');
var $elm$time$Time$toMinute = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2($elm$time$Time$toAdjustedMinutes, zone, time));
	});
var $elm$time$Time$utc = A2($elm$time$Time$Zone, 0, _List_Nil);
var $justinmimbs$time_extra$Time$Extra$Day = {$: 'Day'};
var $justinmimbs$time_extra$Time$Extra$Millisecond = {$: 'Millisecond'};
var $author$project$W$InputDate$defaultAttrs = {_class: '', disabled: false, htmlAttributes: _List_Nil, id: $elm$core$Maybe$Nothing, max: $elm$core$Maybe$Nothing, min: $elm$core$Maybe$Nothing, onBlur: $elm$core$Maybe$Nothing, onEnter: $elm$core$Maybe$Nothing, onFocus: $elm$core$Maybe$Nothing, readOnly: false, required: false, timeZone: $elm$time$Time$utc};
var $author$project$W$InputDate$applyAttrs = function (attrs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, a) {
				var fn = _v0.a;
				return fn(a);
			}),
		$author$project$W$InputDate$defaultAttrs,
		attrs);
};
var $justinmimbs$time_extra$Time$Extra$Month = {$: 'Month'};
var $justinmimbs$time_extra$Time$Extra$Week = {$: 'Week'};
var $justinmimbs$date$Date$Day = {$: 'Day'};
var $justinmimbs$date$Date$Friday = {$: 'Friday'};
var $justinmimbs$date$Date$Monday = {$: 'Monday'};
var $justinmimbs$date$Date$Month = {$: 'Month'};
var $justinmimbs$date$Date$Quarter = {$: 'Quarter'};
var $justinmimbs$date$Date$Saturday = {$: 'Saturday'};
var $justinmimbs$date$Date$Sunday = {$: 'Sunday'};
var $justinmimbs$date$Date$Thursday = {$: 'Thursday'};
var $justinmimbs$date$Date$Tuesday = {$: 'Tuesday'};
var $justinmimbs$date$Date$Wednesday = {$: 'Wednesday'};
var $justinmimbs$date$Date$Week = {$: 'Week'};
var $justinmimbs$date$Date$Year = {$: 'Year'};
var $justinmimbs$date$Date$weekdayToNumber = function (wd) {
	switch (wd.$) {
		case 'Mon':
			return 1;
		case 'Tue':
			return 2;
		case 'Wed':
			return 3;
		case 'Thu':
			return 4;
		case 'Fri':
			return 5;
		case 'Sat':
			return 6;
		default:
			return 7;
	}
};
var $justinmimbs$date$Date$daysSincePreviousWeekday = F2(
	function (wd, date) {
		return A2(
			$elm$core$Basics$modBy,
			7,
			($justinmimbs$date$Date$weekdayNumber(date) + 7) - $justinmimbs$date$Date$weekdayToNumber(wd));
	});
var $justinmimbs$date$Date$firstOfMonth = F2(
	function (y, m) {
		return $justinmimbs$date$Date$RD(
			($justinmimbs$date$Date$daysBeforeYear(y) + A2($justinmimbs$date$Date$daysBeforeMonth, y, m)) + 1);
	});
var $justinmimbs$date$Date$firstOfYear = function (y) {
	return $justinmimbs$date$Date$RD(
		$justinmimbs$date$Date$daysBeforeYear(y) + 1);
};
var $justinmimbs$date$Date$quarterToMonth = function (q) {
	return $justinmimbs$date$Date$numberToMonth((q * 3) - 2);
};
var $justinmimbs$date$Date$floor = F2(
	function (interval, date) {
		var rd = date.a;
		switch (interval.$) {
			case 'Year':
				return $justinmimbs$date$Date$firstOfYear(
					$justinmimbs$date$Date$year(date));
			case 'Quarter':
				return A2(
					$justinmimbs$date$Date$firstOfMonth,
					$justinmimbs$date$Date$year(date),
					$justinmimbs$date$Date$quarterToMonth(
						$justinmimbs$date$Date$quarter(date)));
			case 'Month':
				return A2(
					$justinmimbs$date$Date$firstOfMonth,
					$justinmimbs$date$Date$year(date),
					$justinmimbs$date$Date$month(date));
			case 'Week':
				return $justinmimbs$date$Date$RD(
					rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Mon, date));
			case 'Monday':
				return $justinmimbs$date$Date$RD(
					rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Mon, date));
			case 'Tuesday':
				return $justinmimbs$date$Date$RD(
					rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Tue, date));
			case 'Wednesday':
				return $justinmimbs$date$Date$RD(
					rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Wed, date));
			case 'Thursday':
				return $justinmimbs$date$Date$RD(
					rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Thu, date));
			case 'Friday':
				return $justinmimbs$date$Date$RD(
					rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Fri, date));
			case 'Saturday':
				return $justinmimbs$date$Date$RD(
					rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Sat, date));
			case 'Sunday':
				return $justinmimbs$date$Date$RD(
					rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Sun, date));
			default:
				return date;
		}
	});
var $justinmimbs$date$Date$toRataDie = function (_v0) {
	var rd = _v0.a;
	return rd;
};
var $justinmimbs$time_extra$Time$Extra$dateToMillis = function (date) {
	var daysSinceEpoch = $justinmimbs$date$Date$toRataDie(date) - 719163;
	return daysSinceEpoch * 86400000;
};
var $justinmimbs$time_extra$Time$Extra$timeFromClock = F4(
	function (hour, minute, second, millisecond) {
		return (((hour * 3600000) + (minute * 60000)) + (second * 1000)) + millisecond;
	});
var $elm$time$Time$toMillis = F2(
	function (_v0, time) {
		return A2(
			$elm$core$Basics$modBy,
			1000,
			$elm$time$Time$posixToMillis(time));
	});
var $elm$time$Time$toSecond = F2(
	function (_v0, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				1000));
	});
var $justinmimbs$time_extra$Time$Extra$timeFromPosix = F2(
	function (zone, posix) {
		return A4(
			$justinmimbs$time_extra$Time$Extra$timeFromClock,
			A2($elm$time$Time$toHour, zone, posix),
			A2($elm$time$Time$toMinute, zone, posix),
			A2($elm$time$Time$toSecond, zone, posix),
			A2($elm$time$Time$toMillis, zone, posix));
	});
var $justinmimbs$time_extra$Time$Extra$toOffset = F2(
	function (zone, posix) {
		var millis = $elm$time$Time$posixToMillis(posix);
		var localMillis = $justinmimbs$time_extra$Time$Extra$dateToMillis(
			A2($justinmimbs$date$Date$fromPosix, zone, posix)) + A2($justinmimbs$time_extra$Time$Extra$timeFromPosix, zone, posix);
		return ((localMillis - millis) / 60000) | 0;
	});
var $justinmimbs$time_extra$Time$Extra$posixFromDateTime = F3(
	function (zone, date, time) {
		var millis = $justinmimbs$time_extra$Time$Extra$dateToMillis(date) + time;
		var offset0 = A2(
			$justinmimbs$time_extra$Time$Extra$toOffset,
			zone,
			$elm$time$Time$millisToPosix(millis));
		var posix1 = $elm$time$Time$millisToPosix(millis - (offset0 * 60000));
		var offset1 = A2($justinmimbs$time_extra$Time$Extra$toOffset, zone, posix1);
		if (_Utils_eq(offset0, offset1)) {
			return posix1;
		} else {
			var posix2 = $elm$time$Time$millisToPosix(millis - (offset1 * 60000));
			var offset2 = A2($justinmimbs$time_extra$Time$Extra$toOffset, zone, posix2);
			return _Utils_eq(offset1, offset2) ? posix2 : posix1;
		}
	});
var $justinmimbs$time_extra$Time$Extra$floorDate = F3(
	function (dateInterval, zone, posix) {
		return A3(
			$justinmimbs$time_extra$Time$Extra$posixFromDateTime,
			zone,
			A2(
				$justinmimbs$date$Date$floor,
				dateInterval,
				A2($justinmimbs$date$Date$fromPosix, zone, posix)),
			0);
	});
var $justinmimbs$time_extra$Time$Extra$floor = F3(
	function (interval, zone, posix) {
		switch (interval.$) {
			case 'Millisecond':
				return posix;
			case 'Second':
				return A3(
					$justinmimbs$time_extra$Time$Extra$posixFromDateTime,
					zone,
					A2($justinmimbs$date$Date$fromPosix, zone, posix),
					A4(
						$justinmimbs$time_extra$Time$Extra$timeFromClock,
						A2($elm$time$Time$toHour, zone, posix),
						A2($elm$time$Time$toMinute, zone, posix),
						A2($elm$time$Time$toSecond, zone, posix),
						0));
			case 'Minute':
				return A3(
					$justinmimbs$time_extra$Time$Extra$posixFromDateTime,
					zone,
					A2($justinmimbs$date$Date$fromPosix, zone, posix),
					A4(
						$justinmimbs$time_extra$Time$Extra$timeFromClock,
						A2($elm$time$Time$toHour, zone, posix),
						A2($elm$time$Time$toMinute, zone, posix),
						0,
						0));
			case 'Hour':
				return A3(
					$justinmimbs$time_extra$Time$Extra$posixFromDateTime,
					zone,
					A2($justinmimbs$date$Date$fromPosix, zone, posix),
					A4(
						$justinmimbs$time_extra$Time$Extra$timeFromClock,
						A2($elm$time$Time$toHour, zone, posix),
						0,
						0,
						0));
			case 'Day':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Day, zone, posix);
			case 'Month':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Month, zone, posix);
			case 'Year':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Year, zone, posix);
			case 'Quarter':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Quarter, zone, posix);
			case 'Week':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Week, zone, posix);
			case 'Monday':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Monday, zone, posix);
			case 'Tuesday':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Tuesday, zone, posix);
			case 'Wednesday':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Wednesday, zone, posix);
			case 'Thursday':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Thursday, zone, posix);
			case 'Friday':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Friday, zone, posix);
			case 'Saturday':
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Saturday, zone, posix);
			default:
				return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Sunday, zone, posix);
		}
	});
var $justinmimbs$time_extra$Time$Extra$toFractionalDay = F2(
	function (zone, posix) {
		return A2($justinmimbs$time_extra$Time$Extra$timeFromPosix, zone, posix) / 86400000;
	});
var $justinmimbs$time_extra$Time$Extra$toMonths = F2(
	function (zone, posix) {
		var wholeMonths = (12 * (A2($elm$time$Time$toYear, zone, posix) - 1)) + ($justinmimbs$date$Date$monthToNumber(
			A2($elm$time$Time$toMonth, zone, posix)) - 1);
		var fractionalMonth = (A2($elm$time$Time$toDay, zone, posix) + A2($justinmimbs$time_extra$Time$Extra$toFractionalDay, zone, posix)) / 100;
		return wholeMonths + fractionalMonth;
	});
var $justinmimbs$time_extra$Time$Extra$toRataDieMoment = F2(
	function (zone, posix) {
		return $justinmimbs$date$Date$toRataDie(
			A2($justinmimbs$date$Date$fromPosix, zone, posix)) + A2($justinmimbs$time_extra$Time$Extra$toFractionalDay, zone, posix);
	});
var $elm$core$Basics$truncate = _Basics_truncate;
var $justinmimbs$time_extra$Time$Extra$diff = F4(
	function (interval, zone, posix1, posix2) {
		diff:
		while (true) {
			switch (interval.$) {
				case 'Millisecond':
					return $elm$time$Time$posixToMillis(posix2) - $elm$time$Time$posixToMillis(posix1);
				case 'Second':
					return (A4($justinmimbs$time_extra$Time$Extra$diff, $justinmimbs$time_extra$Time$Extra$Millisecond, zone, posix1, posix2) / 1000) | 0;
				case 'Minute':
					return (A4($justinmimbs$time_extra$Time$Extra$diff, $justinmimbs$time_extra$Time$Extra$Millisecond, zone, posix1, posix2) / 60000) | 0;
				case 'Hour':
					return (A4($justinmimbs$time_extra$Time$Extra$diff, $justinmimbs$time_extra$Time$Extra$Millisecond, zone, posix1, posix2) / 3600000) | 0;
				case 'Day':
					return (A2($justinmimbs$time_extra$Time$Extra$toRataDieMoment, zone, posix2) - A2($justinmimbs$time_extra$Time$Extra$toRataDieMoment, zone, posix1)) | 0;
				case 'Month':
					return (A2($justinmimbs$time_extra$Time$Extra$toMonths, zone, posix2) - A2($justinmimbs$time_extra$Time$Extra$toMonths, zone, posix1)) | 0;
				case 'Year':
					return (A4($justinmimbs$time_extra$Time$Extra$diff, $justinmimbs$time_extra$Time$Extra$Month, zone, posix1, posix2) / 12) | 0;
				case 'Quarter':
					return (A4($justinmimbs$time_extra$Time$Extra$diff, $justinmimbs$time_extra$Time$Extra$Month, zone, posix1, posix2) / 3) | 0;
				case 'Week':
					return (A4($justinmimbs$time_extra$Time$Extra$diff, $justinmimbs$time_extra$Time$Extra$Day, zone, posix1, posix2) / 7) | 0;
				default:
					var weekday = interval;
					var $temp$interval = $justinmimbs$time_extra$Time$Extra$Week,
						$temp$zone = zone,
						$temp$posix1 = A3($justinmimbs$time_extra$Time$Extra$floor, weekday, zone, posix1),
						$temp$posix2 = A3($justinmimbs$time_extra$Time$Extra$floor, weekday, zone, posix2);
					interval = $temp$interval;
					zone = $temp$zone;
					posix1 = $temp$posix1;
					posix2 = $temp$posix2;
					continue diff;
			}
		}
	});
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$core$Basics$isNaN = _Basics_isNaN;
var $author$project$W$InputDate$view = F2(
	function (attrs_, props) {
		var attrs = $author$project$W$InputDate$applyAttrs(attrs_);
		return A2(
			$elm$html$Html$input,
			_Utils_ap(
				attrs.htmlAttributes,
				_List_fromArray(
					[
						A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$id, attrs.id),
						$elm$html$Html$Attributes$type_('date'),
						$elm$html$Html$Attributes$class('ew ew-input ew-focusable'),
						$elm$html$Html$Attributes$class(attrs._class),
						$elm$html$Html$Attributes$required(attrs.required),
						$elm$html$Html$Attributes$disabled(attrs.disabled),
						$elm$html$Html$Attributes$readonly(attrs.readOnly),
						A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Events$onFocus, attrs.onFocus),
						A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Events$onBlur, attrs.onBlur),
						A2($author$project$W$Internal$Helpers$maybeAttr, $author$project$W$Internal$Helpers$onEnter, attrs.onEnter),
						$elm$html$Html$Attributes$value(
						A2(
							$elm$core$Maybe$withDefault,
							'',
							A2(
								$elm$core$Maybe$map,
								function (timestamp) {
									return A2(
										$justinmimbs$date$Date$format,
										'yyyy-MM-dd',
										A2($justinmimbs$date$Date$fromPosix, attrs.timeZone, timestamp));
								},
								props.value))),
						A2(
						$elm$html$Html$Events$on,
						'input',
						A2(
							$elm$json$Json$Decode$andThen,
							function (v) {
								if ($elm$core$Basics$isNaN(v)) {
									return $elm$json$Json$Decode$succeed(
										props.onInput($elm$core$Maybe$Nothing));
								} else {
									var timeOfDayOffset = A2(
										$elm$core$Maybe$withDefault,
										0,
										A2(
											$elm$core$Maybe$map,
											function (userValue) {
												return A4(
													$justinmimbs$time_extra$Time$Extra$diff,
													$justinmimbs$time_extra$Time$Extra$Millisecond,
													attrs.timeZone,
													A3($justinmimbs$time_extra$Time$Extra$floor, $justinmimbs$time_extra$Time$Extra$Day, attrs.timeZone, userValue),
													userValue);
											},
											props.value));
									var notAdjusted = $elm$time$Time$millisToPosix(
										$elm$core$Basics$floor(v));
									var timezoneAdjusted = $elm$core$Basics$floor(v) - ((A2($justinmimbs$time_extra$Time$Extra$toOffset, attrs.timeZone, notAdjusted) * 60) * 1000);
									return $elm$json$Json$Decode$succeed(
										props.onInput(
											$elm$core$Maybe$Just(
												$elm$time$Time$millisToPosix(timezoneAdjusted + timeOfDayOffset))));
								}
							},
							A2(
								$elm$json$Json$Decode$field,
								'target',
								A2($elm$json$Json$Decode$field, 'valueAsNumber', $elm$json$Json$Decode$float))))
					])),
			_List_Nil);
	});
var $author$project$Chapters$Form$InputDate$chapter_ = A2(
	$dtwrks$elm_book$ElmBook$Chapter$renderComponentList,
	_List_fromArray(
		[
			_Utils_Tuple2(
			'Default',
			A2(
				$author$project$W$InputDate$view,
				_List_Nil,
				{
					onInput: function (v) {
						if (v.$ === 'Just') {
							var v_ = v.a;
							return $dtwrks$elm_book$ElmBook$Actions$logAction(
								'Just ' + ($justinmimbs$date$Date$toIsoString(
									A2($justinmimbs$date$Date$fromPosix, $elm$time$Time$utc, v_)) + (' ' + ($elm$core$String$fromInt(
									A2($elm$time$Time$toHour, $elm$time$Time$utc, v_)) + (':' + $elm$core$String$fromInt(
									A2($elm$time$Time$toMinute, $elm$time$Time$utc, v_)))))));
						} else {
							return $dtwrks$elm_book$ElmBook$Actions$logAction('Nothing');
						}
					},
					value: $elm$core$Maybe$Nothing
				})),
			_Utils_Tuple2(
			'Custom Timezone (GMT-3)',
			function () {
				var timeZone = A2($elm$time$Time$customZone, (-3) * 60, _List_Nil);
				return A2(
					$author$project$W$InputDate$view,
					_List_fromArray(
						[
							$author$project$W$InputDate$timeZone(timeZone)
						]),
					{
						onInput: function (v) {
							if (v.$ === 'Just') {
								var v_ = v.a;
								return $dtwrks$elm_book$ElmBook$Actions$logAction(
									'Just ' + ($justinmimbs$date$Date$toIsoString(
										A2($justinmimbs$date$Date$fromPosix, timeZone, v_)) + (' ' + ($elm$core$String$fromInt(
										A2($elm$time$Time$toHour, timeZone, v_)) + (':' + $elm$core$String$fromInt(
										A2($elm$time$Time$toMinute, timeZone, v_)))))));
							} else {
								return $dtwrks$elm_book$ElmBook$Actions$logAction('Nothing');
							}
						},
						value: $elm$core$Maybe$Just(
							$elm$time$Time$millisToPosix(1651693959717))
					});
			}())
		]),
	$dtwrks$elm_book$ElmBook$Chapter$chapter('Input Date'));
var $author$project$W$InputNumber$Attribute = function (a) {
	return {$: 'Attribute', a: a};
};
var $author$project$W$InputNumber$placeholder = function (v) {
	return $author$project$W$InputNumber$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{
					placeholder: $elm$core$Maybe$Just(v)
				});
		});
};
var $dtwrks$elm_book$ElmBook$Internal$Chapter$ChapterComponentViewStateful = function (a) {
	return {$: 'ChapterComponentViewStateful', a: a};
};
var $dtwrks$elm_book$ElmBook$Chapter$fromTupleStateful = function (_v0) {
	var label = _v0.a;
	var view_ = _v0.b;
	return {
		label: label,
		view: $dtwrks$elm_book$ElmBook$Internal$Chapter$ChapterComponentViewStateful(view_)
	};
};
var $dtwrks$elm_book$ElmBook$Chapter$renderStatefulComponentList = F2(
	function (componentList, _v0) {
		var builder = _v0.a;
		return $dtwrks$elm_book$ElmBook$Internal$Chapter$Chapter(
			_Utils_update(
				builder,
				{
					body: builder.body + '<component-list />',
					componentList: _Utils_ap(
						A2($elm$core$List$map, $dtwrks$elm_book$ElmBook$Chapter$fromTupleStateful, componentList),
						builder.componentList)
				}));
	});
var $dtwrks$elm_book$ElmBook$Internal$Msg$UpdateState = function (a) {
	return {$: 'UpdateState', a: a};
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $dtwrks$elm_book$ElmBook$Actions$updateStateWith = F2(
	function (fn, a) {
		return $dtwrks$elm_book$ElmBook$Internal$Msg$UpdateState(
			function (state) {
				return _Utils_Tuple2(
					A2(fn, a, state),
					$elm$core$Platform$Cmd$none);
			});
	});
var $author$project$W$InputNumber$defaultAttrs = {_class: '', disabled: false, htmlAttributes: _List_Nil, id: $elm$core$Maybe$Nothing, max: $elm$core$Maybe$Nothing, min: $elm$core$Maybe$Nothing, onBlur: $elm$core$Maybe$Nothing, onEnter: $elm$core$Maybe$Nothing, onFocus: $elm$core$Maybe$Nothing, placeholder: $elm$core$Maybe$Nothing, readOnly: false, required: false, step: $elm$core$Maybe$Nothing};
var $author$project$W$InputNumber$applyAttrs = function (attrs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, a) {
				var fn = _v0.a;
				return fn(a);
			}),
		$author$project$W$InputNumber$defaultAttrs,
		attrs);
};
var $elm$html$Html$Attributes$max = $elm$html$Html$Attributes$stringProperty('max');
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $elm$html$Html$Attributes$step = function (n) {
	return A2($elm$html$Html$Attributes$stringProperty, 'step', n);
};
var $author$project$W$InputNumber$view = F2(
	function (attrs_, props) {
		var attrs = $author$project$W$InputNumber$applyAttrs(attrs_);
		return A2(
			$elm$html$Html$input,
			_Utils_ap(
				attrs.htmlAttributes,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('number'),
						A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$id, attrs.id),
						$elm$html$Html$Attributes$class('ew ew-input ew-focusable'),
						$elm$html$Html$Attributes$class(attrs._class),
						$elm$html$Html$Attributes$required(attrs.required),
						$elm$html$Html$Attributes$disabled(attrs.disabled),
						$elm$html$Html$Attributes$readonly(attrs.readOnly),
						A2(
						$author$project$W$Internal$Helpers$maybeAttr,
						$elm$html$Html$Attributes$min,
						A2($elm$core$Maybe$map, $elm$core$String$fromFloat, attrs.min)),
						A2(
						$author$project$W$Internal$Helpers$maybeAttr,
						$elm$html$Html$Attributes$max,
						A2($elm$core$Maybe$map, $elm$core$String$fromFloat, attrs.max)),
						A2(
						$author$project$W$Internal$Helpers$maybeAttr,
						$elm$html$Html$Attributes$step,
						A2($elm$core$Maybe$map, $elm$core$String$fromFloat, attrs.step)),
						A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$placeholder, attrs.placeholder),
						A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Events$onFocus, attrs.onFocus),
						A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Events$onBlur, attrs.onBlur),
						A2($author$project$W$Internal$Helpers$maybeAttr, $author$project$W$Internal$Helpers$onEnter, attrs.onEnter),
						$elm$html$Html$Attributes$value(props.value),
						$elm$html$Html$Events$onInput(props.onInput)
					])),
			_List_Nil);
	});
var $author$project$Chapters$Form$InputNumber$chapter_ = A2(
	$dtwrks$elm_book$ElmBook$Chapter$renderStatefulComponentList,
	_List_fromArray(
		[
			_Utils_Tuple2(
			'Default',
			function (_v0) {
				var inputNumber = _v0.inputNumber;
				return A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$author$project$W$InputNumber$view,
							_List_fromArray(
								[
									$author$project$W$InputNumber$placeholder('Type something…')
								]),
							{
								onInput: $dtwrks$elm_book$ElmBook$Actions$updateStateWith(
									F2(
										function (v, model) {
											var state = model.inputNumber;
											return _Utils_update(
												model,
												{
													inputNumber: _Utils_update(
														state,
														{_int: v})
												});
										})),
								value: inputNumber._int
							})
						]));
			})
		]),
	$dtwrks$elm_book$ElmBook$Chapter$chapter('Input Number'));
var $author$project$W$InputRadio$Attribute = function (a) {
	return {$: 'Attribute', a: a};
};
var $author$project$W$InputRadio$color = function (v) {
	return $author$project$W$InputRadio$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{color: v});
		});
};
var $author$project$W$InputRadio$disabled = function (v) {
	return $author$project$W$InputRadio$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{disabled: v});
		});
};
var $author$project$W$InputRadio$readOnly = function (v) {
	return $author$project$W$InputRadio$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{readOnly: v});
		});
};
var $author$project$W$InputRadio$vertical = function (v) {
	return $author$project$W$InputRadio$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{vertical: v});
		});
};
var $author$project$W$InputRadio$defaultAttrs = {color: 'var(--theme-primary-bg)', disabled: false, readOnly: false, vertical: false};
var $author$project$W$InputRadio$applyAttrs = function (attrs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, a) {
				var fn = _v0.a;
				return fn(a);
			}),
		$author$project$W$InputRadio$defaultAttrs,
		attrs);
};
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Attributes$name = $elm$html$Html$Attributes$stringProperty('name');
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$W$InputRadio$view = F2(
	function (attrs_, props) {
		var attrs = $author$project$W$InputRadio$applyAttrs(attrs_);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id(props.id),
					$elm$html$Html$Attributes$class('ew ew-radio-buttons'),
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('ew-m-vertical', attrs.vertical),
							_Utils_Tuple2('ew-is-disabled', attrs.disabled && (!attrs.readOnly)),
							_Utils_Tuple2('ew-is-read-only', attrs.readOnly)
						])),
					$author$project$W$Internal$Helpers$styles(
					_List_fromArray(
						[
							_Utils_Tuple2('--color', attrs.color)
						]))
				]),
			A2(
				$elm$core$List$map,
				function (a) {
					return A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$name(props.id),
								$elm$html$Html$Attributes$class('ew ew-radio-buttons--item')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('ew ew-focusable ew-radio-buttons--item-input'),
										$elm$html$Html$Attributes$classList(
										_List_fromArray(
											[
												_Utils_Tuple2('ew-is-disabled', attrs.disabled && (!attrs.readOnly)),
												_Utils_Tuple2('ew-is-read-only', attrs.readOnly)
											])),
										$elm$html$Html$Attributes$type_('radio'),
										$elm$html$Html$Attributes$name(props.id),
										$elm$html$Html$Attributes$value(
										props.toValue(a)),
										$elm$html$Html$Attributes$checked(
										_Utils_eq(a, props.value)),
										$elm$html$Html$Attributes$disabled(attrs.disabled || attrs.readOnly),
										$elm$html$Html$Attributes$readonly(attrs.readOnly),
										$elm$html$Html$Events$onCheck(
										function (_v0) {
											return props.onInput(a);
										})
									]),
								_List_Nil),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('ew ew-radio-buttons--item-label')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										props.toLabel(a))
									]))
							]));
				},
				props.options));
	});
var $author$project$Chapters$Form$InputRadio$chapter_ = A2(
	$dtwrks$elm_book$ElmBook$Chapter$renderComponentList,
	_List_fromArray(
		[
			_Utils_Tuple2(
			'Default',
			A2(
				$author$project$W$InputRadio$view,
				_List_Nil,
				{
					id: 'default',
					onInput: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onInput'),
					options: _List_fromArray(
						[1, 2, 3]),
					toLabel: $elm$core$String$fromInt,
					toValue: $elm$core$String$fromInt,
					value: 1
				})),
			_Utils_Tuple2(
			'Disabled',
			A2(
				$author$project$W$InputRadio$view,
				_List_fromArray(
					[
						$author$project$W$InputRadio$disabled(true)
					]),
				{
					id: 'disabled',
					onInput: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onInput'),
					options: _List_fromArray(
						[1, 2, 3]),
					toLabel: $elm$core$String$fromInt,
					toValue: $elm$core$String$fromInt,
					value: 2
				})),
			_Utils_Tuple2(
			'Read Only',
			A2(
				$author$project$W$InputRadio$view,
				_List_fromArray(
					[
						$author$project$W$InputRadio$readOnly(true)
					]),
				{
					id: 'read-only',
					onInput: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onInput'),
					options: _List_fromArray(
						[1, 2, 3]),
					toLabel: $elm$core$String$fromInt,
					toValue: $elm$core$String$fromInt,
					value: 2
				})),
			_Utils_Tuple2(
			'Custom Colors',
			A2(
				$author$project$W$InputRadio$view,
				_List_fromArray(
					[
						$author$project$W$InputRadio$color('red')
					]),
				{
					id: 'custom-colors',
					onInput: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onInput'),
					options: _List_fromArray(
						[1, 2, 3]),
					toLabel: $elm$core$String$fromInt,
					toValue: $elm$core$String$fromInt,
					value: 3
				})),
			_Utils_Tuple2(
			'Vertical',
			A2(
				$author$project$W$InputRadio$view,
				_List_fromArray(
					[
						$author$project$W$InputRadio$vertical(true)
					]),
				{
					id: 'vertical',
					onInput: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onInput'),
					options: _List_fromArray(
						[1, 2, 3]),
					toLabel: $elm$core$String$fromInt,
					toValue: $elm$core$String$fromInt,
					value: 2
				}))
		]),
	$dtwrks$elm_book$ElmBook$Chapter$chapter('Input Radio'));
var $author$project$W$InputSelect$Attribute = function (a) {
	return {$: 'Attribute', a: a};
};
var $author$project$W$InputSelect$disabled = function (v) {
	return $author$project$W$InputSelect$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{disabled: v});
		});
};
var $author$project$W$InputSelect$defaultAttrs = {disabled: false, id: $elm$core$Maybe$Nothing, readOnly: false};
var $author$project$W$InputSelect$applyAttrs = function (attrs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, a) {
				var fn = _v0.a;
				return fn(a);
			}),
		$author$project$W$InputSelect$defaultAttrs,
		attrs);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$html$Html$optgroup = _VirtualDom_node('optgroup');
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $author$project$W$InputSelect$viewGroups = F2(
	function (attrs_, props) {
		var values = $elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				function (a) {
					return _Utils_Tuple2(
						props.toValue(a),
						a);
				},
				A2(
					$elm$core$List$append,
					props.options,
					A2($elm$core$List$concatMap, $elm$core$Tuple$second, props.optionGroups))));
		var attrs = $author$project$W$InputSelect$applyAttrs(attrs_);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('ew ew-select-wrapper')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$select,
					_List_fromArray(
						[
							A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$id, attrs.id),
							$elm$html$Html$Attributes$class('ew ew-focusable ew-input ew-select'),
							$elm$html$Html$Attributes$disabled(attrs.disabled),
							$elm$html$Html$Attributes$readonly(attrs.readOnly),
							$elm$html$Html$Attributes$placeholder('Select'),
							$elm$html$Html$Events$onInput(
							function (s) {
								return props.onInput(
									A2(
										$elm$core$Maybe$withDefault,
										props.value,
										A2($elm$core$Dict$get, s, values)));
							})
						]),
					$elm$core$List$concat(
						_List_fromArray(
							[
								A2(
								$elm$core$List$map,
								function (a) {
									return A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$selected(
												_Utils_eq(a, props.value)),
												$elm$html$Html$Attributes$value(
												props.toValue(a))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												props.toLabel(a))
											]));
								},
								props.options),
								A2(
								$elm$core$List$map,
								function (_v0) {
									var l = _v0.a;
									var options_ = _v0.b;
									return A2(
										$elm$html$Html$optgroup,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$attribute, 'label', l)
											]),
										A2(
											$elm$core$List$map,
											function (a) {
												return A2(
													$elm$html$Html$option,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$selected(
															_Utils_eq(a, props.value)),
															$elm$html$Html$Attributes$value(
															props.toValue(a))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(
															props.toLabel(a))
														]));
											},
											options_));
								},
								props.optionGroups)
							]))),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('ew ew-select-icon')
						]),
					_List_Nil)
				]));
	});
var $author$project$W$InputSelect$view = F2(
	function (attrs_, props) {
		return A2(
			$author$project$W$InputSelect$viewGroups,
			attrs_,
			{onInput: props.onInput, optionGroups: _List_Nil, options: props.options, toLabel: props.toLabel, toValue: props.toValue, value: props.value});
	});
var $author$project$Chapters$Form$InputSelect$chapter_ = A2(
	$dtwrks$elm_book$ElmBook$Chapter$renderComponentList,
	_List_fromArray(
		[
			_Utils_Tuple2(
			'Simple',
			A2(
				$author$project$W$InputSelect$view,
				_List_Nil,
				{
					onInput: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onInput'),
					options: _List_fromArray(
						[1, 2]),
					toLabel: $elm$core$String$fromInt,
					toValue: $elm$core$String$fromInt,
					value: 1
				})),
			_Utils_Tuple2(
			'Disabled',
			A2(
				$author$project$W$InputSelect$view,
				_List_fromArray(
					[
						$author$project$W$InputSelect$disabled(true)
					]),
				{
					onInput: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onInput'),
					options: _List_fromArray(
						[1, 2]),
					toLabel: $elm$core$String$fromInt,
					toValue: $elm$core$String$fromInt,
					value: 1
				})),
			_Utils_Tuple2(
			'With Placeholder',
			A2(
				$author$project$W$InputSelect$view,
				_List_Nil,
				{
					onInput: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onInput'),
					options: _List_fromArray(
						[1, 2]),
					toLabel: $elm$core$String$fromInt,
					toValue: $elm$core$String$fromInt,
					value: 2
				})),
			_Utils_Tuple2(
			'With Option Groups',
			A2(
				$author$project$W$InputSelect$viewGroups,
				_List_Nil,
				{
					onInput: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onInput'),
					optionGroups: _List_fromArray(
						[
							_Utils_Tuple2(
							'70\'s',
							_List_fromArray(
								[1978, 1979])),
							_Utils_Tuple2(
							'80\'s',
							_List_fromArray(
								[1988, 1989]))
						]),
					options: _List_fromArray(
						[1900, 2000]),
					toLabel: $elm$core$String$fromInt,
					toValue: $elm$core$String$fromInt,
					value: 2000
				}))
		]),
	$dtwrks$elm_book$ElmBook$Chapter$chapter('Input Select'));
var $author$project$W$InputSlider$Attribute = function (a) {
	return {$: 'Attribute', a: a};
};
var $author$project$W$InputSlider$disabled = function (v) {
	return $author$project$W$InputSlider$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{disabled: v});
		});
};
var $author$project$W$InputSlider$readOnly = function (v) {
	return $author$project$W$InputSlider$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{readOnly: v});
		});
};
var $author$project$W$InputSlider$theme = function (v) {
	return $author$project$W$InputSlider$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{theme: v});
		});
};
var $author$project$W$InputSlider$defaultAttrs = {
	disabled: false,
	format: $elm$core$String$fromFloat,
	id: $elm$core$Maybe$Nothing,
	readOnly: false,
	theme: {color: $uncover_co$elm_theme_spec$ThemeSpec$primary.bg, shadow: 'rgb(' + ($uncover_co$elm_theme_spec$ThemeSpec$primary.bgChannels + ' / 0.2)')}
};
var $author$project$W$InputSlider$applyAttrs = function (attrs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, a) {
				var fn = _v0.a;
				return fn(a);
			}),
		$author$project$W$InputSlider$defaultAttrs,
		attrs);
};
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $author$project$W$Internal$Helpers$stylesList = function (xs) {
	return A2(
		$elm$html$Html$Attributes$attribute,
		'style',
		A2(
			$elm$core$String$join,
			';',
			A2(
				$elm$core$List$filterMap,
				function (_v0) {
					var k = _v0.a;
					var v = _v0.b;
					var f = _v0.c;
					return f ? $elm$core$Maybe$Just(k + (':' + v)) : $elm$core$Maybe$Nothing;
				},
				xs)));
};
var $elm$core$String$toFloat = _String_toFloat;
var $author$project$W$InputSlider$view = F2(
	function (attrs_, props) {
		var attrs = $author$project$W$InputSlider$applyAttrs(attrs_);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('ew ew-slider-wrapper')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('ew ew-slider-value-wrapper')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('ew ew-slider-bounds ew-m-min')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									attrs.format(props.min))
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('ew ew-slider-value')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									attrs.format(props.value))
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('ew ew-slider-bounds ew-m-max')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									attrs.format(props.max))
								]))
						])),
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$id, attrs.id),
							$elm$html$Html$Attributes$class('ew ew-slider'),
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('ew-m-read-only', attrs.readOnly)
								])),
							$elm$html$Html$Attributes$type_('range'),
							$elm$html$Html$Attributes$disabled(attrs.disabled || attrs.readOnly),
							$elm$html$Html$Attributes$readonly(attrs.readOnly),
							$elm$html$Html$Attributes$value(
							$elm$core$String$fromFloat(props.value)),
							$elm$html$Html$Attributes$min(
							$elm$core$String$fromFloat(props.min)),
							$elm$html$Html$Attributes$max(
							$elm$core$String$fromFloat(props.max)),
							$elm$html$Html$Attributes$step(
							$elm$core$String$fromFloat(props.step)),
							A2(
							$elm$html$Html$Events$on,
							'input',
							A2(
								$elm$json$Json$Decode$map,
								props.onInput,
								A2(
									$elm$json$Json$Decode$andThen,
									function (v) {
										var _v0 = $elm$core$String$toFloat(v);
										if (_v0.$ === 'Just') {
											var v_ = _v0.a;
											return $elm$json$Json$Decode$succeed(v_);
										} else {
											return $elm$json$Json$Decode$fail('Invalid value.');
										}
									},
									A2(
										$elm$json$Json$Decode$at,
										_List_fromArray(
											['target', 'value']),
										$elm$json$Json$Decode$string)))),
							$author$project$W$Internal$Helpers$stylesList(
							_List_fromArray(
								[
									_Utils_Tuple3('--color', attrs.theme.color, !attrs.disabled),
									_Utils_Tuple3('--shadow', attrs.theme.shadow, !attrs.disabled),
									_Utils_Tuple3('--color', 'var(--theme-base-aux)', attrs.disabled)
								]))
						]),
					_List_Nil)
				]));
	});
var $author$project$Chapters$Form$InputSlider$chapter_ = A2(
	$dtwrks$elm_book$ElmBook$Chapter$renderStatefulComponentList,
	_List_fromArray(
		[
			_Utils_Tuple2(
			'Default',
			function (_v0) {
				var range = _v0.range;
				return A2(
					$author$project$W$InputSlider$view,
					_List_Nil,
					{
						max: 10,
						min: 0,
						onInput: $dtwrks$elm_book$ElmBook$Actions$updateStateWith(
							F2(
								function (v, model) {
									var range_ = model.range;
									return _Utils_update(
										model,
										{
											range: _Utils_update(
												range_,
												{_default: v})
										});
								})),
						step: 1,
						value: range._default
					});
			}),
			_Utils_Tuple2(
			'Disabled',
			function (_v1) {
				return A2(
					$author$project$W$InputSlider$view,
					_List_fromArray(
						[
							$author$project$W$InputSlider$disabled(true)
						]),
					{
						max: 10,
						min: 0,
						onInput: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromFloat, 'onInput'),
						step: 1,
						value: 5
					});
			}),
			_Utils_Tuple2(
			'Read Only',
			function (_v2) {
				return A2(
					$author$project$W$InputSlider$view,
					_List_fromArray(
						[
							$author$project$W$InputSlider$readOnly(true)
						]),
					{
						max: 10,
						min: 0,
						onInput: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromFloat, 'onInput'),
						step: 1,
						value: 5
					});
			}),
			_Utils_Tuple2(
			'Custom Color',
			function (_v3) {
				var range = _v3.range;
				return A2(
					$author$project$W$InputSlider$view,
					_List_fromArray(
						[
							$author$project$W$InputSlider$theme(
							{color: 'red', shadow: 'rgba(255, 0, 0, 0.1)'})
						]),
					{
						max: 10,
						min: 0,
						onInput: $dtwrks$elm_book$ElmBook$Actions$updateStateWith(
							F2(
								function (v, model) {
									var range_ = model.range;
									return _Utils_update(
										model,
										{
											range: _Utils_update(
												range_,
												{customColor: v})
										});
								})),
						step: 1,
						value: range.customColor
					});
			})
		]),
	$dtwrks$elm_book$ElmBook$Chapter$chapter('Input Slider'));
var $author$project$W$InputText$disabled = function (v) {
	return $author$project$W$InputText$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{disabled: v});
		});
};
var $author$project$W$InputText$Email = {$: 'Email'};
var $author$project$W$InputText$email = $author$project$W$InputText$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{type_: $author$project$W$InputText$Email});
	});
var $author$project$W$InputText$Password = {$: 'Password'};
var $author$project$W$InputText$password = $author$project$W$InputText$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{type_: $author$project$W$InputText$Password});
	});
var $author$project$W$InputText$readOnly = function (v) {
	return $author$project$W$InputText$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{readOnly: v});
		});
};
var $author$project$W$InputText$Search = {$: 'Search'};
var $author$project$W$InputText$search = $author$project$W$InputText$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{type_: $author$project$W$InputText$Search});
	});
var $author$project$W$InputText$Url = {$: 'Url'};
var $author$project$W$InputText$url = $author$project$W$InputText$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{type_: $author$project$W$InputText$Url});
	});
var $author$project$Chapters$Form$InputText$chapter_ = A2(
	$dtwrks$elm_book$ElmBook$Chapter$renderComponentList,
	_List_fromArray(
		[
			_Utils_Tuple2(
			'Default',
			A2(
				$author$project$W$InputText$view,
				_List_fromArray(
					[
						$author$project$W$InputText$placeholder('Type something…')
					]),
				{
					onInput: $dtwrks$elm_book$ElmBook$Actions$logActionWithString('onInput'),
					value: ''
				})),
			_Utils_Tuple2(
			'Disabled',
			A2(
				$author$project$W$InputText$view,
				_List_fromArray(
					[
						$author$project$W$InputText$placeholder('Type something…'),
						$author$project$W$InputText$disabled(true)
					]),
				{
					onInput: $dtwrks$elm_book$ElmBook$Actions$logActionWithString('onInput'),
					value: ''
				})),
			_Utils_Tuple2(
			'Read Only',
			A2(
				$author$project$W$InputText$view,
				_List_fromArray(
					[
						$author$project$W$InputText$placeholder('Type something…'),
						$author$project$W$InputText$readOnly(true)
					]),
				{
					onInput: $dtwrks$elm_book$ElmBook$Actions$logActionWithString('onInput'),
					value: ''
				})),
			_Utils_Tuple2(
			'Password',
			A2(
				$author$project$W$InputText$view,
				_List_fromArray(
					[
						$author$project$W$InputText$password,
						$author$project$W$InputText$placeholder('Type your password…')
					]),
				{
					onInput: $dtwrks$elm_book$ElmBook$Actions$logActionWithString('onInput'),
					value: ''
				})),
			_Utils_Tuple2(
			'Search',
			A2(
				$author$project$W$InputText$view,
				_List_fromArray(
					[
						$author$project$W$InputText$search,
						$author$project$W$InputText$placeholder('Search…')
					]),
				{
					onInput: $dtwrks$elm_book$ElmBook$Actions$logActionWithString('onInput'),
					value: ''
				})),
			_Utils_Tuple2(
			'Email',
			A2(
				$author$project$W$InputText$view,
				_List_fromArray(
					[
						$author$project$W$InputText$email,
						$author$project$W$InputText$placeholder('user@email.com')
					]),
				{
					onInput: $dtwrks$elm_book$ElmBook$Actions$logActionWithString('onInput'),
					value: ''
				})),
			_Utils_Tuple2(
			'Url',
			A2(
				$author$project$W$InputText$view,
				_List_fromArray(
					[
						$author$project$W$InputText$url,
						$author$project$W$InputText$placeholder('https://app.site.com')
					]),
				{
					onInput: $dtwrks$elm_book$ElmBook$Actions$logActionWithString('onInput'),
					value: ''
				}))
		]),
	$dtwrks$elm_book$ElmBook$Chapter$chapter('Input Text'));
var $author$project$W$InputTextArea$Attribute = function (a) {
	return {$: 'Attribute', a: a};
};
var $author$project$W$InputTextArea$autogrow = function (v) {
	return $author$project$W$InputTextArea$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{autogrow: v});
		});
};
var $author$project$W$InputTextArea$placeholder = function (v) {
	return $author$project$W$InputTextArea$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{
					placeholder: $elm$core$Maybe$Just(v)
				});
		});
};
var $author$project$W$InputTextArea$resizable = function (v) {
	return $author$project$W$InputTextArea$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{resizable: v});
		});
};
var $author$project$W$InputTextArea$rows = function (v) {
	return $author$project$W$InputTextArea$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{rows: v});
		});
};
var $author$project$Chapters$Form$InputTextArea$update = $dtwrks$elm_book$ElmBook$Actions$updateStateWith(
	F2(
		function (v, model) {
			return _Utils_update(
				model,
				{inputTextArea: v});
		}));
var $author$project$W$InputTextArea$defaultAttrs = {autogrow: false, _class: '', disabled: false, htmlAttributes: _List_Nil, id: $elm$core$Maybe$Nothing, onBlur: $elm$core$Maybe$Nothing, onEnter: $elm$core$Maybe$Nothing, onFocus: $elm$core$Maybe$Nothing, placeholder: $elm$core$Maybe$Nothing, readOnly: false, required: false, resizable: false, rows: 4, unstyled: false};
var $author$project$W$InputTextArea$applyAttrs = function (attrs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, a) {
				var fn = _v0.a;
				return fn(a);
			}),
		$author$project$W$InputTextArea$defaultAttrs,
		attrs);
};
var $elm$html$Html$Attributes$rows = function (n) {
	return A2(
		_VirtualDom_attribute,
		'rows',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $author$project$W$InputTextArea$view = F2(
	function (attrs_, props) {
		var attrs = $author$project$W$InputTextArea$applyAttrs(attrs_);
		var resizeStyle = attrs.autogrow ? 'none' : A3($author$project$W$Internal$Helpers$stringIf, attrs.resizable, 'vertical', 'none');
		var inputAttrs = _Utils_ap(
			attrs.htmlAttributes,
			_List_fromArray(
				[
					A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$id, attrs.id),
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('ew ew-textarea-input ew-focusable', (!attrs.unstyled) && attrs.autogrow),
							_Utils_Tuple2('ew ew-input ew-focusable', (!attrs.unstyled) && (!attrs.autogrow))
						])),
					$elm$html$Html$Attributes$class(attrs._class),
					$elm$html$Html$Attributes$required(attrs.required),
					$elm$html$Html$Attributes$disabled(attrs.disabled),
					$elm$html$Html$Attributes$readonly(attrs.readOnly),
					$elm$html$Html$Attributes$rows(attrs.rows),
					A2($elm$html$Html$Attributes$style, 'resize', resizeStyle),
					$elm$html$Html$Attributes$value(props.value),
					$elm$html$Html$Events$onInput(props.onInput),
					A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$placeholder, attrs.placeholder),
					A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Events$onFocus, attrs.onFocus),
					A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Events$onBlur, attrs.onBlur),
					A2($author$project$W$Internal$Helpers$maybeAttr, $author$project$W$Internal$Helpers$onEnter, attrs.onEnter)
				]));
		return (!attrs.autogrow) ? A2($elm$html$Html$textarea, inputAttrs, _List_Nil) : A2(
			$elm$html$Html$label,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('ew ew-textarea m-autogrow')
				]),
			_List_fromArray(
				[
					attrs.autogrow ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true'),
							$elm$html$Html$Attributes$class('ew ew-textarea-autogrow')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(props.value + ' ')
						])) : $elm$html$Html$text(''),
					A2($elm$html$Html$textarea, inputAttrs, _List_Nil)
				]));
	});
var $author$project$Chapters$Form$InputTextArea$chapter_ = A2(
	$dtwrks$elm_book$ElmBook$Chapter$renderStatefulComponentList,
	_List_fromArray(
		[
			_Utils_Tuple2(
			'Default',
			function (_v0) {
				var inputTextArea = _v0.inputTextArea;
				return A2(
					$author$project$W$InputTextArea$view,
					_List_fromArray(
						[
							$author$project$W$InputTextArea$placeholder('Type something…'),
							$author$project$W$InputTextArea$rows(4)
						]),
					{onInput: $author$project$Chapters$Form$InputTextArea$update, value: inputTextArea});
			}),
			_Utils_Tuple2(
			'Resizable',
			function (_v1) {
				var inputTextArea = _v1.inputTextArea;
				return A2(
					$author$project$W$InputTextArea$view,
					_List_fromArray(
						[
							$author$project$W$InputTextArea$placeholder('Type something…'),
							$author$project$W$InputTextArea$rows(4),
							$author$project$W$InputTextArea$resizable(true)
						]),
					{onInput: $author$project$Chapters$Form$InputTextArea$update, value: inputTextArea});
			}),
			_Utils_Tuple2(
			'Autogrow',
			function (_v2) {
				var inputTextArea = _v2.inputTextArea;
				return A2(
					$author$project$W$InputTextArea$view,
					_List_fromArray(
						[
							$author$project$W$InputTextArea$placeholder('Type something…'),
							$author$project$W$InputTextArea$rows(1),
							$author$project$W$InputTextArea$autogrow(true)
						]),
					{onInput: $author$project$Chapters$Form$InputTextArea$update, value: inputTextArea});
			})
		]),
	$dtwrks$elm_book$ElmBook$Chapter$chapter('Input TextArea'));
var $author$project$W$InputTime$Attribute = function (a) {
	return {$: 'Attribute', a: a};
};
var $author$project$W$InputTime$timeZone = function (v) {
	return $author$project$W$InputTime$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{timeZone: v});
		});
};
var $author$project$W$InputTime$defaultAttrs = {_class: '', disabled: false, htmlAttributes: _List_Nil, id: $elm$core$Maybe$Nothing, max: $elm$core$Maybe$Nothing, min: $elm$core$Maybe$Nothing, onBlur: $elm$core$Maybe$Nothing, onEnter: $elm$core$Maybe$Nothing, onFocus: $elm$core$Maybe$Nothing, readOnly: false, required: false, timeZone: $elm$time$Time$utc};
var $author$project$W$InputTime$applyAttrs = function (attrs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, a) {
				var fn = _v0.a;
				return fn(a);
			}),
		$author$project$W$InputTime$defaultAttrs,
		attrs);
};
var $elm$core$String$toInt = _String_toInt;
var $author$project$W$InputTime$view = F2(
	function (attrs_, props) {
		var attrs = $author$project$W$InputTime$applyAttrs(attrs_);
		return A2(
			$elm$html$Html$input,
			_Utils_ap(
				attrs.htmlAttributes,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('time'),
						A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$id, attrs.id),
						$elm$html$Html$Attributes$class('ew ew-input ew-focusable'),
						$elm$html$Html$Attributes$class(attrs._class),
						$elm$html$Html$Attributes$required(attrs.required),
						$elm$html$Html$Attributes$disabled(attrs.disabled),
						$elm$html$Html$Attributes$readonly(attrs.readOnly),
						A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Events$onFocus, attrs.onFocus),
						A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Events$onBlur, attrs.onBlur),
						A2($author$project$W$Internal$Helpers$maybeAttr, $author$project$W$Internal$Helpers$onEnter, attrs.onEnter),
						$elm$html$Html$Attributes$value(
						A2(
							$elm$core$Maybe$withDefault,
							'',
							A2(
								$elm$core$Maybe$map,
								function (value) {
									var minute = A3(
										$elm$core$String$padLeft,
										2,
										_Utils_chr('0'),
										$elm$core$String$fromInt(
											A2($elm$time$Time$toMinute, attrs.timeZone, value)));
									var hour = A3(
										$elm$core$String$padLeft,
										2,
										_Utils_chr('0'),
										$elm$core$String$fromInt(
											A2($elm$time$Time$toHour, attrs.timeZone, value)));
									return hour + (':' + minute);
								},
								props.value))),
						$elm$html$Html$Events$onInput(
						function (value) {
							var seconds = F2(
								function (s1, s2) {
									return A2(
										$elm$core$Maybe$withDefault,
										0,
										A2(
											$elm$core$Maybe$map,
											$elm$core$Basics$mul(1000),
											$elm$core$String$toInt(
												_Utils_ap(s1, s2))));
								});
							var minutes = F2(
								function (m1, m2) {
									return A2(
										$elm$core$Maybe$withDefault,
										0,
										A2(
											$elm$core$Maybe$map,
											$elm$core$Basics$mul(60 * 1000),
											$elm$core$String$toInt(
												_Utils_ap(m1, m2))));
								});
							var hours = F2(
								function (h1, h2) {
									return A2(
										$elm$core$Maybe$withDefault,
										0,
										A2(
											$elm$core$Maybe$map,
											$elm$core$Basics$mul((60 * 60) * 1000),
											$elm$core$String$toInt(
												_Utils_ap(h1, h2))));
								});
							var currentStartOfDay = A2(
								$elm$core$Maybe$withDefault,
								0,
								A2(
									$elm$core$Maybe$map,
									$elm$time$Time$posixToMillis,
									A2(
										$elm$core$Maybe$map,
										A2($justinmimbs$time_extra$Time$Extra$floor, $justinmimbs$time_extra$Time$Extra$Day, attrs.timeZone),
										props.value)));
							var _v0 = A2($elm$core$String$split, '', value);
							_v0$2:
							while (true) {
								if (((((_v0.b && _v0.b.b) && _v0.b.b.b) && (_v0.b.b.a === ':')) && _v0.b.b.b.b) && _v0.b.b.b.b.b) {
									if (!_v0.b.b.b.b.b.b) {
										var h1 = _v0.a;
										var _v1 = _v0.b;
										var h2 = _v1.a;
										var _v2 = _v1.b;
										var _v3 = _v2.b;
										var m1 = _v3.a;
										var _v4 = _v3.b;
										var m2 = _v4.a;
										return props.onInput(
											$elm$core$Maybe$Just(
												$elm$time$Time$millisToPosix(
													(A2(hours, h1, h2) + A2(minutes, m1, m2)) + currentStartOfDay)));
									} else {
										if ((((_v0.b.b.b.b.b.a === ':') && _v0.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b) && (!_v0.b.b.b.b.b.b.b.b.b)) {
											var h1 = _v0.a;
											var _v5 = _v0.b;
											var h2 = _v5.a;
											var _v6 = _v5.b;
											var _v7 = _v6.b;
											var m1 = _v7.a;
											var _v8 = _v7.b;
											var m2 = _v8.a;
											var _v9 = _v8.b;
											var _v10 = _v9.b;
											var s1 = _v10.a;
											var _v11 = _v10.b;
											var s2 = _v11.a;
											return props.onInput(
												$elm$core$Maybe$Just(
													$elm$time$Time$millisToPosix(
														((A2(hours, h1, h2) + A2(minutes, m1, m2)) + A2(seconds, s1, s2)) + currentStartOfDay)));
										} else {
											break _v0$2;
										}
									}
								} else {
									break _v0$2;
								}
							}
							return props.onInput($elm$core$Maybe$Nothing);
						})
					])),
			_List_Nil);
	});
var $author$project$Chapters$Form$InputTime$chapter_ = A2(
	$dtwrks$elm_book$ElmBook$Chapter$renderWithComponentList,
	'\n`InputTime` receives an `Time.Posix` and returns a `Time.Posix`. We can retrieve specifics like hour, minutes and hours using the `Time` package.\n\nLet\'s say we just got the current timestamp using the `Time.now` Cmd. We can just pass it to the input time directly and select a new time based on the same day.\n\nBy default this component uses `Time.utc` so if we\'re in a different zone, we should pass in the optional attribute `InputTime.timeZone`.\n',
	A2(
		$dtwrks$elm_book$ElmBook$Chapter$withComponentList,
		_List_fromArray(
			[
				_Utils_Tuple2(
				'Default',
				A2(
					$author$project$W$InputTime$view,
					_List_Nil,
					{
						onInput: function (v) {
							if (v.$ === 'Just') {
								var v_ = v.a;
								return $dtwrks$elm_book$ElmBook$Actions$logAction(
									'Just ' + ($elm$core$String$fromInt(
										A2($elm$time$Time$toHour, $elm$time$Time$utc, v_)) + (':' + ($elm$core$String$fromInt(
										A2($elm$time$Time$toMinute, $elm$time$Time$utc, v_)) + (':' + $elm$core$String$fromInt(
										$elm$time$Time$posixToMillis(v_)))))));
							} else {
								return $dtwrks$elm_book$ElmBook$Actions$logAction('Nothing');
							}
						},
						value: $elm$core$Maybe$Nothing
					})),
				_Utils_Tuple2(
				'Custom Timezone (GMT-3)',
				function () {
					var timeZone = A2($elm$time$Time$customZone, (-3) * 60, _List_Nil);
					return A2(
						$author$project$W$InputTime$view,
						_List_fromArray(
							[
								$author$project$W$InputTime$timeZone(timeZone)
							]),
						{
							onInput: function (v) {
								if (v.$ === 'Just') {
									var v_ = v.a;
									return $dtwrks$elm_book$ElmBook$Actions$logAction(
										'Just ' + ($elm$core$String$fromInt(
											A2($elm$time$Time$toHour, timeZone, v_)) + (':' + $elm$core$String$fromInt(
											A2($elm$time$Time$toMinute, timeZone, v_)))));
								} else {
									return $dtwrks$elm_book$ElmBook$Actions$logAction('Nothing');
								}
							},
							value: $elm$core$Maybe$Just(
								$elm$time$Time$millisToPosix(1651693959717))
						});
				}())
			]),
		$dtwrks$elm_book$ElmBook$Chapter$chapter('Input Time')));
var $author$project$W$DataRow$Attribute = function (a) {
	return {$: 'Attribute', a: a};
};
var $author$project$W$DataRow$footer = function (v) {
	return $author$project$W$DataRow$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{
					footer: $elm$core$Maybe$Just(v)
				});
		});
};
var $author$project$W$DataRow$header = function (v) {
	return $author$project$W$DataRow$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{
					header: $elm$core$Maybe$Just(v)
				});
		});
};
var $author$project$W$DataRow$href = function (v) {
	return $author$project$W$DataRow$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{
					href: $elm$core$Maybe$Just(v)
				});
		});
};
var $author$project$W$DataRow$left = function (v) {
	return $author$project$W$DataRow$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{
					left: $elm$core$Maybe$Just(v)
				});
		});
};
var $author$project$W$DataRow$onClick = function (v) {
	return $author$project$W$DataRow$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{
					onClick: $elm$core$Maybe$Just(v)
				});
		});
};
var $author$project$W$DataRow$right = function (v) {
	return $author$project$W$DataRow$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{
					right: $elm$core$Maybe$Just(v)
				});
		});
};
var $author$project$W$DataRow$defaultAttrs = {footer: $elm$core$Maybe$Nothing, header: $elm$core$Maybe$Nothing, href: $elm$core$Maybe$Nothing, left: $elm$core$Maybe$Nothing, onClick: $elm$core$Maybe$Nothing, right: $elm$core$Maybe$Nothing};
var $author$project$W$DataRow$applyAttrs = function (attrs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, a) {
				var fn = _v0.a;
				return fn(a);
			}),
		$author$project$W$DataRow$defaultAttrs,
		attrs);
};
var $author$project$W$Internal$Helpers$maybeHtml = F2(
	function (fn, a) {
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$html$Html$text(''),
			A2($elm$core$Maybe$map, fn, a));
	});
var $author$project$W$DataRow$view = F2(
	function (attrs_, children) {
		var attrs = $author$project$W$DataRow$applyAttrs(attrs_);
		var main_ = function () {
			var _v0 = _Utils_Tuple2(attrs.onClick, attrs.href);
			if (_v0.a.$ === 'Just') {
				var onClick_ = _v0.a.a;
				return $elm$html$Html$button(
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('ew ew-focusable ew-data-row-main ew-m-button'),
							$elm$html$Html$Events$onClick(onClick_)
						]));
			} else {
				if (_v0.b.$ === 'Just') {
					var _v1 = _v0.a;
					var href_ = _v0.b.a;
					return $elm$html$Html$a(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('ew ew-focusable ew-data-row-main ew-m-link'),
								$elm$html$Html$Attributes$href(href_)
							]));
				} else {
					return $elm$html$Html$div(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('ew ew-data-row-main')
							]));
				}
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('ew ew-data-row')
				]),
			_List_fromArray(
				[
					main_(
					_List_fromArray(
						[
							A2(
							$author$project$W$Internal$Helpers$maybeHtml,
							function (left_) {
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('ew ew-data-row-left')
										]),
									_List_fromArray(
										[left_]));
							},
							attrs.left),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('ew ew-data-row-main-main')
								]),
							_List_fromArray(
								[
									A2(
									$author$project$W$Internal$Helpers$maybeHtml,
									function (header_) {
										return A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('ew ew-data-row-header')
												]),
											_List_fromArray(
												[header_]));
									},
									attrs.header),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('ew ew-data-row-label')
										]),
									children),
									A2(
									$author$project$W$Internal$Helpers$maybeHtml,
									function (footer_) {
										return A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('ew ew-data-row-footer')
												]),
											_List_fromArray(
												[footer_]));
									},
									attrs.footer)
								]))
						])),
					A2(
					$elm$core$Maybe$withDefault,
					$elm$html$Html$text(''),
					A2(
						$elm$core$Maybe$map,
						function (right_) {
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('ew ew-data-row-actions')
									]),
								right_);
						},
						attrs.right))
				]));
	});
var $author$project$Chapters$Information$DataRow$chapter_ = A2(
	$dtwrks$elm_book$ElmBook$Chapter$renderComponentList,
	_List_fromArray(
		[
			_Utils_Tuple2(
			'Simple',
			A2(
				$author$project$W$DataRow$view,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Label')
					]))),
			_Utils_Tuple2(
			'As Button',
			A2(
				$author$project$W$DataRow$view,
				_List_fromArray(
					[
						$author$project$W$DataRow$onClick(
						$dtwrks$elm_book$ElmBook$Actions$logAction('onClick'))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Label')
					]))),
			_Utils_Tuple2(
			'As Link',
			A2(
				$author$project$W$DataRow$view,
				_List_fromArray(
					[
						$author$project$W$DataRow$href('/logAction/#')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Label')
					]))),
			_Utils_Tuple2(
			'With Actions',
			A2(
				$author$project$W$DataRow$view,
				_List_fromArray(
					[
						$author$project$W$DataRow$href('/logAction/#'),
						$author$project$W$DataRow$right(
						_List_fromArray(
							[
								A2(
								$author$project$W$Button$view,
								_List_fromArray(
									[$author$project$W$Button$primary]),
								{
									label: 'Click me',
									onClick: $dtwrks$elm_book$ElmBook$Actions$logAction('onClick Action')
								})
							]))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Label')
					]))),
			_Utils_Tuple2(
			'With Actions + Footer',
			A2(
				$author$project$W$DataRow$view,
				_List_fromArray(
					[
						$author$project$W$DataRow$href('/logAction/#'),
						$author$project$W$DataRow$footer(
						$elm$html$Html$text('user@email.com')),
						$author$project$W$DataRow$right(
						_List_fromArray(
							[
								A2(
								$author$project$W$Button$view,
								_List_fromArray(
									[$author$project$W$Button$primary]),
								{
									label: 'Click me',
									onClick: $dtwrks$elm_book$ElmBook$Actions$logAction('onClick Action')
								})
							]))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Label')
					]))),
			_Utils_Tuple2(
			'With Actions + Header + Footer',
			A2(
				$author$project$W$DataRow$view,
				_List_fromArray(
					[
						$author$project$W$DataRow$href('/logAction/#'),
						$author$project$W$DataRow$header(
						$elm$html$Html$text('Admin')),
						$author$project$W$DataRow$footer(
						$elm$html$Html$text('user@email.com')),
						$author$project$W$DataRow$right(
						_List_fromArray(
							[
								A2(
								$author$project$W$Button$view,
								_List_fromArray(
									[$author$project$W$Button$primary]),
								{
									label: 'Click me',
									onClick: $dtwrks$elm_book$ElmBook$Actions$logAction('onClick Action')
								})
							]))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Label')
					]))),
			_Utils_Tuple2(
			'With Actions + Header + Footer + Left',
			A2(
				$author$project$W$DataRow$view,
				_List_fromArray(
					[
						$author$project$W$DataRow$href('/logAction/#'),
						$author$project$W$DataRow$header(
						$elm$html$Html$text('Admin')),
						$author$project$W$DataRow$footer(
						$elm$html$Html$text('user@email.com')),
						$author$project$W$DataRow$left(
						$author$project$W$Loading$ripples(_List_Nil)),
						$author$project$W$DataRow$right(
						_List_fromArray(
							[
								A2(
								$author$project$W$Button$view,
								_List_fromArray(
									[$author$project$W$Button$primary]),
								{
									label: 'Click me',
									onClick: $dtwrks$elm_book$ElmBook$Actions$logAction('onClick Action')
								})
							]))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Label')
					]))),
			_Utils_Tuple2(
			'With Actions + Header + Footer + Left (Other)',
			A2(
				$author$project$W$DataRow$view,
				_List_fromArray(
					[
						$author$project$W$DataRow$href('/logAction/#'),
						$author$project$W$DataRow$header(
						$elm$html$Html$text('Admin')),
						$author$project$W$DataRow$footer(
						$elm$html$Html$text('user@email.com')),
						$author$project$W$DataRow$left(
						A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'background', '#f5f5f5'),
									A2($elm$html$Html$Attributes$style, 'border-radius', '50%'),
									A2($elm$html$Html$Attributes$style, 'border', '3px solid #dadada'),
									A2($elm$html$Html$Attributes$style, 'width', '20px'),
									A2($elm$html$Html$Attributes$style, 'height', '20px')
								]),
							_List_Nil)),
						$author$project$W$DataRow$right(
						_List_fromArray(
							[
								A2(
								$author$project$W$Button$view,
								_List_fromArray(
									[$author$project$W$Button$primary]),
								{
									label: 'Click me',
									onClick: $dtwrks$elm_book$ElmBook$Actions$logAction('onClick Action')
								})
							]))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Label')
					])))
		]),
	$dtwrks$elm_book$ElmBook$Chapter$chapter('DataRow'));
var $author$project$W$Menu$Attribute = function (a) {
	return {$: 'Attribute', a: a};
};
var $author$project$W$Menu$left = function (v) {
	return $author$project$W$Menu$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{
					left: $elm$core$Maybe$Just(v)
				});
		});
};
var $author$project$W$Menu$right = function (v) {
	return $author$project$W$Menu$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{
					right: $elm$core$Maybe$Just(v)
				});
		});
};
var $author$project$W$Menu$selected = function (v) {
	return $author$project$W$Menu$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{selected: v});
		});
};
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$W$Menu$view = function (children) {
	return A2(
		$elm$html$Html$ul,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('ew-m-0 ew-p-0 ew-list-none ew-bg-base-bg ew-font-text')
			]),
		A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$elm$html$Html$li,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('ew-m-0')
						]),
					_List_fromArray(
						[i]));
			},
			children));
};
var $author$project$W$Menu$defaultAttrs = {disabled: false, htmlAttributes: _List_Nil, id: $elm$core$Maybe$Nothing, left: $elm$core$Maybe$Nothing, right: $elm$core$Maybe$Nothing, selected: false};
var $author$project$W$Menu$applyAttrs = function (attrs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, a) {
				var fn = _v0.a;
				return fn(a);
			}),
		$author$project$W$Menu$defaultAttrs,
		attrs);
};
var $author$project$W$Menu$baseAttrs = function (attrs) {
	return _Utils_ap(
		attrs.htmlAttributes,
		_List_fromArray(
			[
				A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$id, attrs.id),
				$elm$html$Html$Attributes$disabled(attrs.disabled),
				$elm$html$Html$Attributes$class('ew-m-0 ew-w-full ew-box-border ew-flex ew-items-center ew-content-start'),
				$elm$html$Html$Attributes$class('ew-px-3 ew-py-2'),
				$elm$html$Html$Attributes$class('ew-text-left ew-text-base ew-text-fg'),
				$elm$html$Html$Attributes$class('hover:ew-bg-base-aux/[0.07]'),
				$elm$html$Html$Attributes$class('active:ew-bg-base-aux/10'),
				$elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('ew-text-primary-fg ew-bg-primary-fg/10 hover:ew-bg-primary-fg/[0.15] active:ew-bg-primary-fg/20', attrs.selected),
						_Utils_Tuple2('ew-text-base-fg ew-bg-base-bg', !attrs.selected),
						_Utils_Tuple2('ew-m-disabled', attrs.disabled)
					]))
			]));
};
var $author$project$W$Menu$baseContent = F2(
	function (attrs, label) {
		return _List_fromArray(
			[
				A2(
				$author$project$W$Internal$Helpers$maybeHtml,
				function (a) {
					return A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('ew-shrink-0 ew-pr-3')
							]),
						_List_fromArray(
							[a]));
				},
				attrs.left),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ew-grow')
					]),
				_List_fromArray(
					[label])),
				A2(
				$author$project$W$Internal$Helpers$maybeHtml,
				function (a) {
					return A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('ew-shrink-0 ew-pr-3')
							]),
						_List_fromArray(
							[a]));
				},
				attrs.right)
			]);
	});
var $author$project$W$Menu$viewButton = F2(
	function (attrs_, props) {
		var attrs = $author$project$W$Menu$applyAttrs(attrs_);
		return A2(
			$elm$html$Html$button,
			_Utils_ap(
				$author$project$W$Menu$baseAttrs(attrs),
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(props.onClick),
						$elm$html$Html$Attributes$class('ew-border-0')
					])),
			A2($author$project$W$Menu$baseContent, attrs, props.label));
	});
var $author$project$W$Menu$viewLink = F2(
	function (attrs_, props) {
		var attrs = $author$project$W$Menu$applyAttrs(attrs_);
		return A2(
			$elm$html$Html$a,
			_Utils_ap(
				$author$project$W$Menu$baseAttrs(attrs),
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href(props.href),
						$elm$html$Html$Attributes$class('ew-no-underline')
					])),
			A2($author$project$W$Menu$baseContent, attrs, props.label));
	});
var $author$project$W$Menu$viewTitle = F2(
	function (attrs_, props) {
		var attrs = $author$project$W$Menu$applyAttrs(attrs_);
		return A2(
			$elm$html$Html$p,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('ew-m-0 ew-flex ew-items-center'),
					$elm$html$Html$Attributes$class('ew-uppercase ew-text-xs ew-font-bold ew-font-text ew-text-base-aux'),
					$elm$html$Html$Attributes$class('ew-pt-6 ew-px-4 ew-pb-2')
				]),
			A2($author$project$W$Menu$baseContent, attrs, props.label));
	});
var $author$project$Chapters$Information$Menu$chapter_ = A2(
	$dtwrks$elm_book$ElmBook$Chapter$renderComponentList,
	_List_fromArray(
		[
			_Utils_Tuple2(
			'Default',
			$author$project$W$Menu$view(
				_List_fromArray(
					[
						A2(
						$author$project$W$Menu$viewButton,
						_List_Nil,
						{
							label: $elm$html$Html$text('Click me'),
							onClick: $dtwrks$elm_book$ElmBook$Actions$logAction('onClick')
						}),
						A2(
						$author$project$W$Menu$viewLink,
						_List_fromArray(
							[
								$author$project$W$Menu$left(
								$elm$html$Html$text('L'))
							]),
						{
							href: '/logAction/#',
							label: $elm$html$Html$text('Link to')
						}),
						A2(
						$author$project$W$Menu$viewTitle,
						_List_fromArray(
							[
								$author$project$W$Menu$left(
								$elm$html$Html$text('T')),
								$author$project$W$Menu$right(
								$elm$html$Html$text('Edit'))
							]),
						{
							label: $elm$html$Html$text('Title')
						}),
						A2(
						$author$project$W$Menu$viewButton,
						_List_fromArray(
							[
								$author$project$W$Menu$selected(true)
							]),
						{
							label: $elm$html$Html$text('Click me'),
							onClick: $dtwrks$elm_book$ElmBook$Actions$logAction('onClick')
						}),
						A2(
						$author$project$W$Menu$viewLink,
						_List_Nil,
						{
							href: '/logAction/#',
							label: $elm$html$Html$text('Link to')
						})
					])))
		]),
	$dtwrks$elm_book$ElmBook$Chapter$chapter('Menu'));
var $author$project$W$Internal$Pagination$toPages = F2(
	function (active, total) {
		return ((active < 1) || (_Utils_cmp(active, total) > 0)) ? $elm$core$Result$Err('Active must be larger than 1 and less or equal length') : $elm$core$Result$Ok(
			(total <= 7) ? A2($elm$core$List$range, 1, total) : (((total - active) <= 3) ? _List_fromArray(
				[1, -1, total - 4, total - 3, total - 2, total - 1, total]) : ((active <= 4) ? _List_fromArray(
				[1, 2, 3, 4, 5, -1, total]) : _List_fromArray(
				[1, -1, active - 1, active, active + 1, -1, total]))));
	});
var $author$project$W$Pagination$viewPage = F3(
	function (active, onClick, page) {
		return A2(
			$elm$html$Html$p,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(
					onClick(page)),
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'ew-text-base-fg',
							_Utils_eq(page, active))
						]))
				]),
			_List_fromArray(
				[
					(!_Utils_eq(page, -1)) ? $elm$html$Html$text(
					$elm$core$String$fromInt(page)) : $elm$html$Html$text('—')
				]));
	});
var $author$project$W$Pagination$view = function (props) {
	var _v0 = A2($author$project$W$Internal$Pagination$toPages, props.active, props.total);
	if (_v0.$ === 'Ok') {
		var pages = _v0.a;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('ew-flex ew-font-primary ew-space-x-2 ew-text-base-aux')
				]),
			A2(
				$elm$core$List$map,
				A2($author$project$W$Pagination$viewPage, props.active, props.onClick),
				pages));
	} else {
		var errorMessage = _v0.a;
		return $elm$html$Html$text(errorMessage);
	}
};
var $author$project$Chapters$Information$Pagination$chapter_ = A2(
	$dtwrks$elm_book$ElmBook$Chapter$renderComponentList,
	_List_fromArray(
		[
			_Utils_Tuple2(
			'Small amount of pages',
			$author$project$W$Pagination$view(
				{
					active: 1,
					onClick: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onClick'),
					total: 3
				})),
			_Utils_Tuple2(
			'medium amount of pages',
			$author$project$W$Pagination$view(
				{
					active: 5,
					onClick: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onClick'),
					total: 8
				})),
			_Utils_Tuple2(
			'big number of pages',
			$author$project$W$Pagination$view(
				{
					active: 10,
					onClick: A2($dtwrks$elm_book$ElmBook$Actions$logActionWith, $elm$core$String$fromInt, 'onClick'),
					total: 9999
				}))
		]),
	$dtwrks$elm_book$ElmBook$Chapter$chapter('Pagination'));
var $author$project$W$Popover$Attribute = function (a) {
	return {$: 'Attribute', a: a};
};
var $author$project$W$Popover$BottomRight = {$: 'BottomRight'};
var $author$project$W$Popover$bottomRight = $author$project$W$Popover$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{position: $author$project$W$Popover$BottomRight});
	});
var $author$project$Chapters$Information$Popover$children = function (label) {
	return {
		children: _List_fromArray(
			[
				A2(
				$author$project$W$Button$viewLink,
				_List_Nil,
				{href: '/logAction/', label: label})
			]),
		content: _List_fromArray(
			[
				$elm$html$Html$text('Content with considerable size')
			])
	};
};
var $author$project$W$Popover$full = function (v) {
	return $author$project$W$Popover$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{full: v});
		});
};
var $author$project$W$Popover$LeftTop = {$: 'LeftTop'};
var $author$project$W$Popover$left = $author$project$W$Popover$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{position: $author$project$W$Popover$LeftTop});
	});
var $author$project$W$Popover$LeftBottom = {$: 'LeftBottom'};
var $author$project$W$Popover$leftBottom = $author$project$W$Popover$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{position: $author$project$W$Popover$LeftBottom});
	});
var $author$project$W$Popover$offset = function (v) {
	return $author$project$W$Popover$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{offset: v});
		});
};
var $author$project$W$Popover$over = $author$project$W$Popover$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{over: true});
	});
var $author$project$W$Popover$RightTop = {$: 'RightTop'};
var $author$project$W$Popover$right = $author$project$W$Popover$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{position: $author$project$W$Popover$RightTop});
	});
var $author$project$W$Popover$RightBottom = {$: 'RightBottom'};
var $author$project$W$Popover$rightBottom = $author$project$W$Popover$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{position: $author$project$W$Popover$RightBottom});
	});
var $author$project$W$Popover$TopLeft = {$: 'TopLeft'};
var $author$project$W$Popover$top = $author$project$W$Popover$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{position: $author$project$W$Popover$TopLeft});
	});
var $author$project$W$Popover$TopRight = {$: 'TopRight'};
var $author$project$W$Popover$topRight = $author$project$W$Popover$Attribute(
	function (attrs) {
		return _Utils_update(
			attrs,
			{position: $author$project$W$Popover$TopRight});
	});
var $author$project$W$Popover$BottomLeft = {$: 'BottomLeft'};
var $author$project$W$Popover$defaultAttrs = {_class: '', full: false, htmlAttributes: _List_Nil, id: $elm$core$Maybe$Nothing, offset: 0, over: false, position: $author$project$W$Popover$BottomLeft, unstyled: false};
var $author$project$W$Popover$applyAttrs = function (attrs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, a) {
				var fn = _v0.a;
				return fn(a);
			}),
		$author$project$W$Popover$defaultAttrs,
		attrs);
};
var $elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $author$project$W$Popover$view = F2(
	function (attrs_, props) {
		var attrs = $author$project$W$Popover$applyAttrs(attrs_);
		var positionClass = function () {
			var _v0 = attrs.position;
			switch (_v0.$) {
				case 'TopLeft':
					return 'ew-m-top-left';
				case 'TopRight':
					return 'ew-m-top-right';
				case 'LeftTop':
					return 'ew-m-left-top';
				case 'LeftBottom':
					return 'ew-m-left-bottom';
				case 'RightTop':
					return 'ew-m-right-top';
				case 'RightBottom':
					return 'ew-m-right-bottom';
				case 'BottomLeft':
					return 'ew-m-bottom-left';
				default:
					return 'ew-m-bottom-right';
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('ew ew-popover')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$tabindex(0)
						]),
					props.children),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('ew ew-popover-content'),
							$elm$html$Html$Attributes$class(positionClass),
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('ew-m-full', attrs.full),
									_Utils_Tuple2('ew-m-over', attrs.over),
									_Utils_Tuple2('ew-m-styled', !attrs.unstyled)
								])),
							$author$project$W$Internal$Helpers$styles(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'--offset',
									$elm$core$String$fromFloat(attrs.offset) + 'px')
								]))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_Utils_ap(
								attrs.htmlAttributes,
								_List_fromArray(
									[
										A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Attributes$id, attrs.id),
										$elm$html$Html$Attributes$class(attrs._class)
									])),
							props.content)
						]))
				]));
	});
var $author$project$Chapters$Information$Popover$chapter_ = A2(
	$dtwrks$elm_book$ElmBook$Chapter$renderComponentList,
	A2(
		$elm$core$List$map,
		function (_v0) {
			var label = _v0.a;
			var attrs = _v0.b;
			return _Utils_Tuple2(
				label,
				$author$project$UI$hSpacer(
					_List_fromArray(
						[
							A2(
							$author$project$W$Popover$view,
							attrs,
							$author$project$Chapters$Information$Popover$children('Default')),
							A2(
							$author$project$W$Popover$view,
							A2($elm$core$List$cons, $author$project$W$Popover$over, attrs),
							$author$project$Chapters$Information$Popover$children('Over')),
							A2(
							$author$project$W$Popover$view,
							A2(
								$elm$core$List$cons,
								$author$project$W$Popover$offset(4),
								attrs),
							$author$project$Chapters$Information$Popover$children('Offset')),
							A2(
							$author$project$W$Popover$view,
							A2(
								$elm$core$List$cons,
								$author$project$W$Popover$full(true),
								attrs),
							$author$project$Chapters$Information$Popover$children('Full'))
						])));
		},
		_List_fromArray(
			[
				_Utils_Tuple2('Bottom', _List_Nil),
				_Utils_Tuple2(
				'Bottom Right',
				_List_fromArray(
					[$author$project$W$Popover$bottomRight])),
				_Utils_Tuple2(
				'Top',
				_List_fromArray(
					[$author$project$W$Popover$top])),
				_Utils_Tuple2(
				'Top Right',
				_List_fromArray(
					[$author$project$W$Popover$topRight])),
				_Utils_Tuple2(
				'Left',
				_List_fromArray(
					[$author$project$W$Popover$left])),
				_Utils_Tuple2(
				'Left Bottom',
				_List_fromArray(
					[$author$project$W$Popover$leftBottom])),
				_Utils_Tuple2(
				'Right',
				_List_fromArray(
					[$author$project$W$Popover$right])),
				_Utils_Tuple2(
				'Right Bottom',
				_List_fromArray(
					[$author$project$W$Popover$rightBottom]))
			])),
	$dtwrks$elm_book$ElmBook$Chapter$chapter('Popover'));
var $author$project$W$Modal$Attribute = function (a) {
	return {$: 'Attribute', a: a};
};
var $author$project$W$Modal$absolute = function (v) {
	return $author$project$W$Modal$Attribute(
		function (attrs) {
			return _Utils_update(
				attrs,
				{absolute: v});
		});
};
var $uncover_co$elm_theme_spec$ThemeSpec$base = $uncover_co$elm_theme_spec$ThemeSpec$toColorVars('base');
var $author$project$W$Modal$defaultAttrs = {absolute: false, id: $elm$core$Maybe$Nothing};
var $author$project$W$Modal$applyAttrs = function (attrs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, a) {
				var fn = _v0.a;
				return fn(a);
			}),
		$author$project$W$Modal$defaultAttrs,
		attrs);
};
var $author$project$W$Internal$Icons$close = function (props) {
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$width(
				$elm$core$String$fromFloat(props.size) + 'px'),
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromFloat(props.size) + 'px'),
				$elm$svg$Svg$Attributes$viewBox('0 0 512 512')
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d('M289.94,256l95-95A24,24,0,0,0,351,127l-95,95-95-95A24,24,0,0,0,127,161l95,95-95,95A24,24,0,1,0,161,385l95-95,95,95A24,24,0,0,0,385,351Z'),
						$elm$svg$Svg$Attributes$fill('currentColor')
					]),
				_List_Nil)
			]));
};
var $author$project$W$Modal$view = F2(
	function (attrs_, props) {
		var attrs = $author$project$W$Modal$applyAttrs(attrs_);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$attribute, 'role', 'dialog'),
					$elm$html$Html$Attributes$class('ew-inset-0 ew-flex ew-flex-col ew-items-center ew-justify-center ew-p-6'),
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('ew-absolute', attrs.absolute),
							_Utils_Tuple2('ew-fixed', !attrs.absolute)
						]))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('ew-absolute ew-inset-0 ew-opacity-20'),
							A2($elm$html$Html$Attributes$style, 'background', 'rgba(0, 0, 0, 0.4)'),
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'hover:ew-opacity-[0.15]',
									!_Utils_eq(props.onClose, $elm$core$Maybe$Nothing))
								])),
							A2($author$project$W$Internal$Helpers$maybeAttr, $elm$html$Html$Events$onClick, props.onClose)
						]),
					_List_Nil),
					A2(
					$author$project$W$Internal$Helpers$maybeHtml,
					function (onClose) {
						return A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('ew-relative ew-self-end'),
									$elm$html$Html$Attributes$class('ew-p-4 ew-bg-transparent ew-border-0 ew-shadow-none'),
									$elm$html$Html$Attributes$class('ew-text-base-bg'),
									$elm$html$Html$Events$onClick(onClose)
								]),
							_List_fromArray(
								[
									$author$project$W$Internal$Icons$close(
									{size: 24})
								]));
					},
					props.onClose),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('ew-relative'),
							$elm$html$Html$Attributes$class('ew-bg-base-bg ew-shadow-lg ew-rounded-lg'),
							$elm$html$Html$Attributes$class('ew-w-full ew-max-w-md ew-max-h-[80%] ew-overflow-auto')
						]),
					_List_fromArray(
						[props.content]))
				]));
	});
var $author$project$Chapters$Layout$Modal$chapter_ = function () {
	var wrapper = $elm$html$Html$div(
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'relative'),
				A2($elm$html$Html$Attributes$style, 'height', '400px'),
				A2($elm$html$Html$Attributes$style, 'background', $uncover_co$elm_theme_spec$ThemeSpec$base.bg)
			]));
	var content = A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '600px')
			]),
		_List_Nil);
	return A2(
		$dtwrks$elm_book$ElmBook$Chapter$renderComponentList,
		_List_fromArray(
			[
				_Utils_Tuple2(
				'Modal',
				wrapper(
					_List_fromArray(
						[
							A2(
							$author$project$W$Modal$view,
							_List_fromArray(
								[
									$author$project$W$Modal$absolute(true)
								]),
							{content: content, onClose: $elm$core$Maybe$Nothing})
						]))),
				_Utils_Tuple2(
				'Modal with onClose',
				wrapper(
					_List_fromArray(
						[
							A2(
							$author$project$W$Modal$view,
							_List_fromArray(
								[
									$author$project$W$Modal$absolute(true)
								]),
							{
								content: content,
								onClose: $elm$core$Maybe$Just(
									$dtwrks$elm_book$ElmBook$Actions$logAction('onClose'))
							})
						])))
			]),
		$dtwrks$elm_book$ElmBook$Chapter$chapter('Modal'));
}();
var $author$project$Theme$ClassStrategy = function (a) {
	return {$: 'ClassStrategy', a: a};
};
var $author$project$Theme$classStrategy = $author$project$Theme$ClassStrategy;
var $author$project$Theme$ThemeBuilder = function (a) {
	return {$: 'ThemeBuilder', a: a};
};
var $author$project$Theme$Theme = function (a) {
	return {$: 'Theme', a: a};
};
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $elm$core$Basics$round = _Basics_round;
var $avh4$elm_color$Color$toCssString = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	var roundTo = function (x) {
		return $elm$core$Basics$round(x * 1000) / 1000;
	};
	var pct = function (x) {
		return $elm$core$Basics$round(x * 10000) / 100;
	};
	return $elm$core$String$concat(
		_List_fromArray(
			[
				'rgba(',
				$elm$core$String$fromFloat(
				pct(r)),
				'%,',
				$elm$core$String$fromFloat(
				pct(g)),
				'%,',
				$elm$core$String$fromFloat(
				pct(b)),
				'%,',
				$elm$core$String$fromFloat(
				roundTo(a)),
				')'
			]));
};
var $avh4$elm_color$Color$toRgba = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	return {alpha: a, blue: b, green: g, red: r};
};
var $author$project$Theme$toThemeString = function (_v0) {
	var data = _v0.a.data;
	var extra = _v0.a.extra;
	var colorChannels = function (color) {
		var c = $avh4$elm_color$Color$toRgba(color);
		return A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				function (c_) {
					return $elm$core$String$fromInt(
						$elm$core$Basics$ceiling(c_ * 255));
				},
				_List_fromArray(
					[c.red, c.green, c.blue])));
	};
	var colorVars = F2(
		function (name, color) {
			return _List_fromArray(
				[
					_Utils_Tuple2(
					name,
					$avh4$elm_color$Color$toCssString(color)),
					_Utils_Tuple2(
					name + '-ch',
					colorChannels(color))
				]);
		});
	var colorSpec = F2(
		function (name, color) {
			return $elm$core$List$concat(
				_List_fromArray(
					[
						A2(colorVars, name + '-bg', color.background),
						A2(colorVars, name + '-fg', color.foreground),
						A2(colorVars, name + '-aux', color.aux)
					]));
		});
	return A2(
		$elm$core$String$join,
		';',
		A2(
			$elm$core$List$map,
			function (_v1) {
				var k = _v1.a;
				var v = _v1.b;
				return '--' + (k + (':' + v));
			},
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$mapFirst(
					function (v) {
						return $author$project$Theme$namespace + ('-' + v);
					}),
				$elm$core$List$concat(
					_List_fromArray(
						[
							_List_fromArray(
							[
								_Utils_Tuple2('font-title', data.fonts.title),
								_Utils_Tuple2('font-text', data.fonts.text),
								_Utils_Tuple2('font-code', data.fonts.code)
							]),
							A2(colorSpec, 'base', data.base),
							A2(colorSpec, 'neutral', data.neutral),
							A2(colorSpec, 'primary', data.primary),
							A2(colorSpec, 'secondary', data.secondary),
							A2(colorSpec, 'success', data.success),
							A2(colorSpec, 'warning', data.warning),
							A2(colorSpec, 'danger', data.danger),
							extra
						])))));
};
var $author$project$Theme$toTheme = function (builder) {
	return $author$project$Theme$Theme(
		{
			builder: builder,
			string: $author$project$Theme$toThemeString(builder)
		});
};
var $author$project$Theme$new = function (data) {
	return $author$project$Theme$toTheme(
		$author$project$Theme$ThemeBuilder(
			{data: data, extra: _List_Nil}));
};
var $avh4$elm_color$Color$RgbaSpace = F4(
	function (a, b, c, d) {
		return {$: 'RgbaSpace', a: a, b: b, c: c, d: d};
	});
var $avh4$elm_color$Color$scaleFrom255 = function (c) {
	return c / 255;
};
var $avh4$elm_color$Color$rgb255 = F3(
	function (r, g, b) {
		return A4(
			$avh4$elm_color$Color$RgbaSpace,
			$avh4$elm_color$Color$scaleFrom255(r),
			$avh4$elm_color$Color$scaleFrom255(g),
			$avh4$elm_color$Color$scaleFrom255(b),
			1.0);
	});
var $author$project$Theme$darkTheme = $author$project$Theme$new(
	{
		base: {
			aux: A3($avh4$elm_color$Color$rgb255, 110, 114, 120),
			background: A3($avh4$elm_color$Color$rgb255, 37, 40, 48),
			foreground: A3($avh4$elm_color$Color$rgb255, 227, 227, 227)
		},
		danger: {
			aux: A3($avh4$elm_color$Color$rgb255, 91, 0, 1),
			background: A3($avh4$elm_color$Color$rgb255, 255, 77, 79),
			foreground: A3($avh4$elm_color$Color$rgb255, 242, 156, 156)
		},
		fonts: {code: 'monospace', text: 'system-ui, sans-serif', title: 'system-ui, sans-serif'},
		neutral: {
			aux: A3($avh4$elm_color$Color$rgb255, 255, 255, 255),
			background: A3($avh4$elm_color$Color$rgb255, 21, 22, 26),
			foreground: A3($avh4$elm_color$Color$rgb255, 255, 255, 255)
		},
		primary: {
			aux: A3($avh4$elm_color$Color$rgb255, 255, 255, 255),
			background: A3($avh4$elm_color$Color$rgb255, 0, 153, 255),
			foreground: A3($avh4$elm_color$Color$rgb255, 145, 190, 243)
		},
		secondary: {
			aux: A3($avh4$elm_color$Color$rgb255, 255, 255, 255),
			background: A3($avh4$elm_color$Color$rgb255, 234, 96, 223),
			foreground: A3($avh4$elm_color$Color$rgb255, 248, 142, 239)
		},
		success: {
			aux: A3($avh4$elm_color$Color$rgb255, 27, 74, 0),
			background: A3($avh4$elm_color$Color$rgb255, 74, 200, 0),
			foreground: A3($avh4$elm_color$Color$rgb255, 119, 223, 59)
		},
		warning: {
			aux: A3($avh4$elm_color$Color$rgb255, 91, 65, 0),
			background: A3($avh4$elm_color$Color$rgb255, 251, 179, 0),
			foreground: A3($avh4$elm_color$Color$rgb255, 255, 215, 114)
		}
	});
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $author$project$Theme$toString = function (_v0) {
	var theme = _v0.a;
	return theme.string;
};
var $author$project$Theme$globalProvider_ = function (props) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A3(
				$elm$html$Html$node,
				'style',
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						'body { ' + ($author$project$Theme$toString(props.light) + ' }'))
					])),
				function () {
				var _v0 = props.dark;
				if (_v0.$ === 'Just') {
					var dark = _v0.a;
					var _v1 = props.strategy;
					if (_v1.$ === 'ClassStrategy') {
						var darkClass = _v1.a;
						return A3(
							$elm$html$Html$node,
							'style',
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									'.' + (darkClass + (' { ' + ($author$project$Theme$toString(dark) + '; color-scheme: dark; }'))))
								]));
					} else {
						return A3(
							$elm$html$Html$node,
							'style',
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									'@media (prefers-color-scheme: dark) { body { ' + ($author$project$Theme$toString(dark) + '; color-scheme: dark; } }'))
								]));
					}
				} else {
					return $elm$html$Html$text('');
				}
			}()
			]));
};
var $author$project$Theme$globalProviderWithDarkMode = function (props) {
	return $author$project$Theme$globalProvider_(
		{
			dark: $elm$core$Maybe$Just(props.dark),
			light: props.light,
			strategy: props.strategy
		});
};
var $author$project$W$Styles$globalStyles = A3(
	$elm$html$Html$node,
	'style',
	_List_Nil,
	_List_fromArray(
		[
			$elm$html$Html$text('.ew-fixed{position:fixed}.ew-absolute{position:absolute}.ew-relative{position:relative}.ew-inset-0{bottom:0;left:0;right:0;top:0}.ew-m-0{margin:0}.ew-box-border{box-sizing:border-box}.ew-flex{display:flex}.ew-h-full{height:100%}.ew-max-h-\\[80\\%\\]{max-height:80%}.ew-w-full{width:100%}.ew-max-w-md{max-width:28rem}.ew-shrink-0{flex-shrink:0}.ew-grow{flex-grow:1}.ew-list-none{list-style-type:none}.ew-flex-col{flex-direction:column}.ew-content-center{align-content:center}.ew-content-start{align-content:flex-start}.ew-items-center{align-items:center}.ew-justify-center{justify-content:center}.ew-space-x-2>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(.5rem*(1 - var(--tw-space-x-reverse)));margin-right:calc(.5rem*var(--tw-space-x-reverse))}.ew--space-x-2>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(-.5rem*(1 - var(--tw-space-x-reverse)));margin-right:calc(-.5rem*var(--tw-space-x-reverse))}.ew-self-end{align-self:flex-end}.ew-overflow-auto{overflow:auto}.ew-rounded-lg{border-radius:.5rem}.ew-border-0{border-width:0}.ew-border-t-2{border-top-width:2px}.ew-border-l-2{border-left-width:2px}.ew-border-t{border-top-width:1px}.ew-border-l{border-left-width:1px}.ew-border-none{border-style:none}.ew-border-base-aux{--tw-border-opacity:1;border-color:rgb(var(--theme-base-aux-ch)/var(--tw-border-opacity))}.ew-border-opacity-50{--tw-border-opacity:0.5}.ew-border-opacity-30{--tw-border-opacity:0.3}.ew-bg-base-bg{--tw-bg-opacity:1;background-color:rgb(var(--theme-base-bg-ch)/var(--tw-bg-opacity))}.ew-bg-primary-fg\\/10{background-color:rgb(var(--theme-primary-fg-ch)/.1)}.ew-bg-base-aux{--tw-bg-opacity:1;background-color:rgb(var(--theme-base-aux-ch)/var(--tw-bg-opacity))}.ew-bg-primary-fg{--tw-bg-opacity:1;background-color:rgb(var(--theme-primary-fg-ch)/var(--tw-bg-opacity))}.ew-bg-transparent{background-color:transparent}.ew-p-0{padding:0}.ew-p-4{padding:1rem}.ew-p-5{padding:1.25rem}.ew-p-6{padding:1.5rem}.ew-px-3{padding-left:.75rem;padding-right:.75rem}.ew-py-2{padding-bottom:.5rem;padding-top:.5rem}.ew-px-4{padding-left:1rem;padding-right:1rem}.ew-pt-6{padding-top:1.5rem}.ew-pb-2{padding-bottom:.5rem}.ew-pr-3{padding-right:.75rem}.ew-pl-2{padding-left:.5rem}.ew-text-left{text-align:left}.ew-font-text{font-family:var(--theme-font-text)}.ew-text-base{font-size:1rem;line-height:1.5rem}.ew-text-xs{font-size:.75rem;line-height:1rem}.ew-text-sm{font-size:.875rem;line-height:1.25rem}.ew-text-lg{font-size:1.125rem;line-height:1.75rem}.ew-font-bold{font-weight:700}.ew-uppercase{text-transform:uppercase}.ew-text-primary-fg{--tw-text-opacity:1;color:rgb(var(--theme-primary-fg-ch)/var(--tw-text-opacity))}.ew-text-base-fg{--tw-text-opacity:1;color:rgb(var(--theme-base-fg-ch)/var(--tw-text-opacity))}.ew-text-base-aux{--tw-text-opacity:1;color:rgb(var(--theme-base-aux-ch)/var(--tw-text-opacity))}.ew-text-base-bg{--tw-text-opacity:1;color:rgb(var(--theme-base-bg-ch)/var(--tw-text-opacity))}.ew-no-underline{text-decoration-line:none}.ew-opacity-20{opacity:.2}.ew-opacity-30{opacity:.3}.ew-shadow-none{--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000}.ew-shadow-lg,.ew-shadow-none{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.ew-shadow-lg{--tw-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color),0 4px 6px -4px var(--tw-shadow-color)}.ew-loading-dots{display:inline-block;height:var(--size);position:relative;width:var(--size)}.ew-loading-dots div{animation-timing-function:cubic-bezier(0,1,1,0);background:var(--color);border-radius:calc(var(--size)*.2);height:calc(var(--size)*.2);position:absolute;top:calc(var(--size)*.4);width:calc(var(--size)*.2)}.ew-loading-dots>div:first-child{animation:ew-loading-dots-1 .6s infinite;left:0}.ew-loading-dots>div:nth-child(2){animation:ew-loading-dots-2 .6s infinite;left:0}.ew-loading-dots>div:nth-child(3){animation:ew-loading-dots-2 .6s infinite;left:calc(var(--size)*.4)}.ew-loading-dots>div:nth-child(4){animation:ew-loading-dots-3 .6s infinite;left:calc(var(--size)*.8)}@keyframes ew-loading-dots-1{0%{transform:scale(0)}to{transform:scale(1)}}@keyframes ew-loading-dots-2{0%{transform:translate(0)}to{transform:translate(calc(var(--size)*.4))}}@keyframes ew-loading-dots-3{0%{transform:scale(1)}to{transform:scale(0)}}.ew-loading-ripples{display:inline-block;height:var(--size);position:relative;width:var(--size)}.ew-loading-ripples>div{animation:ew-loading-ripples 1.2s cubic-bezier(0,.2,.8,1) infinite;border:calc(var(--size)*.06) solid var(--color);border-radius:50%;opacity:1;position:absolute}.ew-loading-ripples>div:nth-child(2){animation-delay:-.6s}@keyframes ew-loading-ripples{0%{height:0;left:calc(var(--size)*.5);opacity:1;top:calc(var(--size)*.5);width:0}to{height:var(--size);left:0;opacity:0;top:0;width:var(--size)}}.hover\\:ew-bg-base-aux\\/\\[0\\.07\\]:hover{background-color:rgb(var(--theme-base-aux-ch)/.07)}.hover\\:ew-bg-primary-fg\\/\\[0\\.15\\]:hover{background-color:rgb(var(--theme-primary-fg-ch)/.15)}.hover\\:ew-opacity-\\[0\\.15\\]:hover{opacity:.15}.active\\:ew-bg-base-aux\\/10:active{background-color:rgb(var(--theme-base-aux-ch)/.1)}.active\\:ew-bg-primary-fg\\/20:active{background-color:rgb(var(--theme-primary-fg-ch)/.2)}')
		]));
var $dtwrks$elm_book$ElmBook$ThemeOptions$globals = F2(
	function (globals_, options) {
		return _Utils_update(
			options,
			{
				globals: $elm$core$Maybe$Just(
					A2(
						$elm$core$Maybe$withDefault,
						globals_,
						A2(
							$elm$core$Maybe$map,
							$elm$core$Basics$append(globals_),
							options.globals)))
			});
	});
var $author$project$Chapters$Form$InputNumber$init = {
	_float: $elm$core$Maybe$Just(1.2),
	_int: '4'
};
var $author$project$Chapters$Form$InputSlider$init = {customColor: 5, _default: 5};
var $author$project$Chapters$Form$InputTextArea$init = 'Testing a long\n long\n long\n text?';
var $dtwrks$elm_book$ElmBook$StatefulOptions$initialState = F2(
	function (state, options) {
		return _Utils_update(
			options,
			{
				initialState: $elm$core$Maybe$Just(state)
			});
	});
var $author$project$Theme$lightTheme = $author$project$Theme$new(
	{
		base: {
			aux: A3($avh4$elm_color$Color$rgb255, 150, 150, 150),
			background: A3($avh4$elm_color$Color$rgb255, 253, 253, 253),
			foreground: A3($avh4$elm_color$Color$rgb255, 62, 62, 62)
		},
		danger: {
			aux: A3($avh4$elm_color$Color$rgb255, 255, 255, 255),
			background: A3($avh4$elm_color$Color$rgb255, 220, 49, 50),
			foreground: A3($avh4$elm_color$Color$rgb255, 248, 102, 103)
		},
		fonts: {code: 'monospace', text: 'system-ui, sans-serif', title: 'system-ui, sans-serif'},
		neutral: {
			aux: A3($avh4$elm_color$Color$rgb255, 255, 255, 255),
			background: A3($avh4$elm_color$Color$rgb255, 91, 111, 125),
			foreground: A3($avh4$elm_color$Color$rgb255, 141, 160, 174)
		},
		primary: {
			aux: A3($avh4$elm_color$Color$rgb255, 255, 255, 255),
			background: A3($avh4$elm_color$Color$rgb255, 0, 141, 235),
			foreground: A3($avh4$elm_color$Color$rgb255, 95, 185, 244)
		},
		secondary: {
			aux: A3($avh4$elm_color$Color$rgb255, 255, 255, 255),
			background: A3($avh4$elm_color$Color$rgb255, 234, 96, 223),
			foreground: A3($avh4$elm_color$Color$rgb255, 248, 142, 239)
		},
		success: {
			aux: A3($avh4$elm_color$Color$rgb255, 255, 255, 255),
			background: A3($avh4$elm_color$Color$rgb255, 68, 183, 1),
			foreground: A3($avh4$elm_color$Color$rgb255, 115, 209, 60)
		},
		warning: {
			aux: A3($avh4$elm_color$Color$rgb255, 255, 255, 255),
			background: A3($avh4$elm_color$Color$rgb255, 230, 157, 0),
			foreground: A3($avh4$elm_color$Color$rgb255, 249, 188, 34)
		}
	});
var $dtwrks$elm_book$ElmBook$Chapter$render = F2(
	function (body, _v0) {
		var builder = _v0.a;
		return $dtwrks$elm_book$ElmBook$Internal$Chapter$Chapter(
			_Utils_update(
				builder,
				{
					body: _Utils_ap(builder.body, body)
				}));
	});
var $author$project$Main$wip = function (title) {
	return A2(
		$dtwrks$elm_book$ElmBook$Chapter$render,
		'WIP',
		$dtwrks$elm_book$ElmBook$Chapter$chapter(title + ' WIP'));
};
var $dtwrks$elm_book$ElmBook$Internal$Msg$OnUrlChange = function (a) {
	return {$: 'OnUrlChange', a: a};
};
var $dtwrks$elm_book$ElmBook$Internal$Msg$OnUrlRequest = function (a) {
	return {$: 'OnUrlRequest', a: a};
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$application = _Browser_application;
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $dtwrks$elm_book$ElmBook$Internal$Chapter$chapterUrl = function (_v0) {
	var url = _v0.a.url;
	return url;
};
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (value.$ === 'SubTree') {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $dtwrks$elm_book$ElmBook$Internal$Book$configFromBuilder = F2(
	function (chapterGroups_, _v0) {
		var data = _v0.a;
		var chapterGroups = function () {
			var toIndexedGroup = F2(
				function (initialIndex, _v6) {
					var groupTitle = _v6.a;
					var groupChapters = _v6.b;
					return _Utils_Tuple2(
						groupTitle,
						A2(
							$elm$core$List$indexedMap,
							F2(
								function (i, _v5) {
									return i + initialIndex;
								}),
							groupChapters));
				});
			return $elm$core$List$reverse(
				A3(
					$elm$core$List$foldl,
					F2(
						function (_v3, _v4) {
							var label = _v3.a;
							var xs = _v3.b;
							var acc = _v4.a;
							var lastIndex = _v4.b;
							return _Utils_Tuple2(
								A2(
									$elm$core$List$cons,
									A2(
										toIndexedGroup,
										lastIndex,
										_Utils_Tuple2(label, xs)),
									acc),
								lastIndex + $elm$core$List$length(xs));
						}),
					_Utils_Tuple2(_List_Nil, 0),
					chapterGroups_).a);
		}();
		var chapterData = A3(
			$elm$core$List$foldl,
			F2(
				function (_v2, acc) {
					var chapters_ = _v2.b;
					return A3(
						$elm$core$List$foldl,
						F2(
							function (c, acc_) {
								return {
									chapterByUrl: A3(
										$elm$core$Dict$insert,
										$dtwrks$elm_book$ElmBook$Internal$Chapter$chapterUrl(c),
										acc_.chaptersCount,
										acc_.chapterByUrl),
									chapters: A2($elm$core$Array$push, c, acc_.chapters),
									chaptersCount: acc_.chaptersCount + 1
								};
							}),
						{chapterByUrl: acc.chapterByUrl, chapters: acc.chapters, chaptersCount: acc.chaptersCount},
						chapters_);
				}),
			{chapterByUrl: $elm$core$Dict$empty, chapters: $elm$core$Array$empty, chaptersCount: 0},
			chapterGroups_);
		var _v1 = chapterData;
		var chapters = _v1.chapters;
		var chapterByUrl = _v1.chapterByUrl;
		return {chapterByUrl: chapterByUrl, chapterGroups: chapterGroups, chapterOptions: data.chapterOptions, chapters: chapters, componentOptions: data.componentOptions, statefulOptions: data.statefulOptions, themeOptions: data.themeOptions, title: data.title, toHtml: data.toHtml};
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $dtwrks$elm_book$ElmBook$Internal$Book$chapterFromUrl = F2(
	function (config, url) {
		return A2(
			$elm$core$Maybe$andThen,
			function (i) {
				return A2($elm$core$Array$get, i, config.chapters);
			},
			A2($elm$core$Dict$get, url, config.chapterByUrl));
	});
var $dtwrks$elm_book$ElmBook$Internal$Chapter$chapterNavUrl = F2(
	function (hashBasedNavigation, _v0) {
		var url = _v0.a.url;
		var internal = _v0.a.internal;
		return (internal && hashBasedNavigation) ? ('#' + url) : url;
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$defaultOverrides = {accent: $elm$core$Maybe$Nothing, background: $elm$core$Maybe$Nothing, navAccent: $elm$core$Maybe$Nothing, navAccentHighlight: $elm$core$Maybe$Nothing, navBackground: $elm$core$Maybe$Nothing};
var $dtwrks$elm_book$ElmBook$Internal$Application$extractPath = F2(
	function (hashBasedNavigation, url) {
		return hashBasedNavigation ? A2($elm$core$Maybe$withDefault, '/', url.fragment) : url.path;
	});
var $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$hashBasedNavigation = function ($) {
	return $.hashBasedNavigation;
};
var $dtwrks$elm_book$ElmBook$Internal$Chapter$init = function (_v0) {
	var chapter = _v0.a;
	return chapter.init;
};
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 'Nothing') {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $elm$browser$Browser$Navigation$replaceUrl = _Browser_replaceUrl;
var $dtwrks$elm_book$ElmBook$Internal$Application$init = F4(
	function (config, _v0, url_, navKey) {
		var url = A2($dtwrks$elm_book$ElmBook$Internal$Application$extractPath, config.themeOptions.hashBasedNavigation, url_);
		var hashBasedNavigation_ = $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$hashBasedNavigation(config.themeOptions);
		var darkMode = config.themeOptions.preferDarkMode;
		var initialState = A2(
			$elm$core$Maybe$map,
			config.statefulOptions.onDarkModeChange(darkMode),
			config.statefulOptions.initialState);
		var activeChapter = A2(
			$dtwrks$elm_book$ElmBook$Internal$Book$chapterFromUrl,
			config,
			A2($dtwrks$elm_book$ElmBook$Internal$Application$extractPath, hashBasedNavigation_, url_));
		var _v1 = A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2(initialState, $elm$core$Platform$Cmd$none),
			A2(
				$elm$core$Maybe$andThen,
				function (chapter) {
					return A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$mapFirst($elm$core$Maybe$Just),
						A3(
							$elm$core$Maybe$map2,
							F2(
								function (state_, chapterInit) {
									return chapterInit(state_);
								}),
							initialState,
							$dtwrks$elm_book$ElmBook$Internal$Chapter$init(chapter)));
				},
				activeChapter));
		var initialState_ = _v1.a;
		var cmd = _v1.b;
		return _Utils_Tuple2(
			{actionLog: _List_Nil, actionLogModal: false, backCompatibility: $elm$core$Maybe$Nothing, chapterPreSelected: 0, darkMode: darkMode, isMenuOpen: false, isMetaPressed: false, isSearching: false, isShiftPressed: false, navKey: navKey, search: '', state: initialState_, themeOverrides: $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$defaultOverrides, url: url},
			function () {
				if (activeChapter.$ === 'Just') {
					return cmd;
				} else {
					return A2(
						$elm$core$Maybe$withDefault,
						A2($elm$browser$Browser$Navigation$replaceUrl, navKey, '/'),
						A2(
							$elm$core$Maybe$map,
							A2(
								$elm$core$Basics$composeL,
								$elm$browser$Browser$Navigation$replaceUrl(navKey),
								$dtwrks$elm_book$ElmBook$Internal$Chapter$chapterNavUrl(hashBasedNavigation_)),
							A2($elm$core$Array$get, 0, config.chapters)));
				}
			}());
	});
var $dtwrks$elm_book$ElmBook$Internal$Msg$DoNothing = {$: 'DoNothing'};
var $dtwrks$elm_book$ElmBook$Internal$Msg$KeyArrowDown = {$: 'KeyArrowDown'};
var $dtwrks$elm_book$ElmBook$Internal$Msg$KeyArrowUp = {$: 'KeyArrowUp'};
var $dtwrks$elm_book$ElmBook$Internal$Msg$KeyEnter = {$: 'KeyEnter'};
var $dtwrks$elm_book$ElmBook$Internal$Msg$KeyK = {$: 'KeyK'};
var $dtwrks$elm_book$ElmBook$Internal$Msg$KeyMetaOn = {$: 'KeyMetaOn'};
var $dtwrks$elm_book$ElmBook$Internal$Msg$KeyShiftOn = {$: 'KeyShiftOn'};
var $elm$core$String$toLower = _String_toLower;
var $dtwrks$elm_book$ElmBook$Internal$Application$keyDownDecoder = A2(
	$elm$json$Json$Decode$map,
	function (string) {
		var _v0 = $elm$core$String$toLower(string);
		switch (_v0) {
			case 'arrowdown':
				return $dtwrks$elm_book$ElmBook$Internal$Msg$KeyArrowDown;
			case 'arrowup':
				return $dtwrks$elm_book$ElmBook$Internal$Msg$KeyArrowUp;
			case 'shift':
				return $dtwrks$elm_book$ElmBook$Internal$Msg$KeyShiftOn;
			case 'meta':
				return $dtwrks$elm_book$ElmBook$Internal$Msg$KeyMetaOn;
			case 'enter':
				return $dtwrks$elm_book$ElmBook$Internal$Msg$KeyEnter;
			case 'k':
				return $dtwrks$elm_book$ElmBook$Internal$Msg$KeyK;
			default:
				return $dtwrks$elm_book$ElmBook$Internal$Msg$DoNothing;
		}
	},
	A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
var $dtwrks$elm_book$ElmBook$Internal$Msg$KeyMetaOff = {$: 'KeyMetaOff'};
var $dtwrks$elm_book$ElmBook$Internal$Msg$KeyShiftOff = {$: 'KeyShiftOff'};
var $dtwrks$elm_book$ElmBook$Internal$Application$keyUpDecoder = A2(
	$elm$json$Json$Decode$map,
	function (string) {
		var _v0 = $elm$core$String$toLower(string);
		switch (_v0) {
			case 'shift':
				return $dtwrks$elm_book$ElmBook$Internal$Msg$KeyShiftOff;
			case 'meta':
				return $dtwrks$elm_book$ElmBook$Internal$Msg$KeyMetaOff;
			default:
				return $dtwrks$elm_book$ElmBook$Internal$Msg$DoNothing;
		}
	},
	A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
var $elm$browser$Browser$Events$Document = {$: 'Document'};
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 'MySub', a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {pids: pids, subs: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (node.$ === 'Document') {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {event: event, key: key};
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (node.$ === 'Document') {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.pids,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.key;
		var event = _v0.event;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.subs);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'keydown');
var $elm$browser$Browser$Events$onKeyUp = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'keyup');
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2(
					$elm$core$Task$onError,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Err),
					A2(
						$elm$core$Task$andThen,
						A2(
							$elm$core$Basics$composeL,
							A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
							$elm$core$Result$Ok),
						task))));
	});
var $dtwrks$elm_book$ElmBook$Internal$Chapter$chapterInternal = function (_v0) {
	var internal = _v0.a.internal;
	return internal;
};
var $dtwrks$elm_book$ElmBook$Internal$Chapter$chapterTitle = function (_v0) {
	var title = _v0.a.title;
	return title;
};
var $elm$browser$Browser$Dom$focus = _Browser_call('focus');
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $elm$browser$Browser$Dom$setViewportOf = _Browser_setViewportOf;
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 'Nothing') {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 'Nothing') {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.protocol;
		if (_v0.$ === 'Http') {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.fragment,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.query,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.port_,
					_Utils_ap(http, url.host)),
				url.path)));
};
var $dtwrks$elm_book$ElmBook$Internal$Application$updateThemeOverrides = F2(
	function (model, fn) {
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					themeOverrides: fn(model.themeOverrides)
				}),
			$elm$core$Platform$Cmd$none);
	});
var $dtwrks$elm_book$ElmBook$Internal$Application$update = F3(
	function (config, msg, model) {
		var logAction_ = F2(
			function (context, action) {
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							actionLog: A2(
								$elm$core$List$cons,
								_Utils_Tuple2(context, action),
								model.actionLog)
						}),
					$elm$core$Platform$Cmd$none);
			});
		var hashBasedNavigation_ = $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$hashBasedNavigation(config.themeOptions);
		var activeChapter = A2($dtwrks$elm_book$ElmBook$Internal$Book$chapterFromUrl, config, model.url);
		var defaultLogContext = A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				function (s) {
					return s + ' / ';
				},
				A2($elm$core$Maybe$map, $dtwrks$elm_book$ElmBook$Internal$Chapter$chapterTitle, activeChapter)));
		switch (msg.$) {
			case 'OnUrlRequest':
				var request = msg.a;
				if (request.$ === 'External') {
					var url = request.a;
					return _Utils_Tuple2(
						model,
						$elm$browser$Browser$Navigation$load(url));
				} else {
					var url = request.a;
					return A2($elm$core$String$contains, '/logAction', url.path) ? A2(
						logAction_,
						defaultLogContext,
						'Navigate to: ' + A3($elm$core$String$replace, '/logAction', '', url.path)) : _Utils_Tuple2(
						model,
						A2(
							$elm$browser$Browser$Navigation$pushUrl,
							model.navKey,
							$elm$url$Url$toString(url)));
				}
			case 'OnUrlChange':
				var url_ = msg.a;
				var url = A2($dtwrks$elm_book$ElmBook$Internal$Application$extractPath, hashBasedNavigation_, url_);
				if (url === '/') {
					return A2(
						$elm$core$Maybe$withDefault,
						_Utils_Tuple2(
							_Utils_update(
								model,
								{url: '/'}),
							$elm$core$Platform$Cmd$none),
						A2(
							$elm$core$Maybe$map,
							function (fallback) {
								return _Utils_Tuple2(
									model,
									A2(
										$elm$browser$Browser$Navigation$pushUrl,
										model.navKey,
										$dtwrks$elm_book$ElmBook$Internal$Chapter$chapterUrl(fallback)));
							},
							A2($elm$core$Array$get, 0, config.chapters)));
				} else {
					var urlChapter = A2(
						$elm$core$Maybe$andThen,
						function (i) {
							return A2($elm$core$Array$get, i, config.chapters);
						},
						A2($elm$core$Dict$get, url, config.chapterByUrl));
					if (urlChapter.$ === 'Just') {
						var chapter = urlChapter.a;
						var _v4 = A2(
							$elm$core$Maybe$withDefault,
							_Utils_Tuple2(model.state, $elm$core$Platform$Cmd$none),
							A2(
								$elm$core$Maybe$map,
								$elm$core$Tuple$mapFirst($elm$core$Maybe$Just),
								A3(
									$elm$core$Maybe$map2,
									F2(
										function (state_, chapterInit) {
											return chapterInit(state_);
										}),
									model.state,
									$dtwrks$elm_book$ElmBook$Internal$Chapter$init(chapter))));
						var state = _v4.a;
						var cmd = _v4.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{isMenuOpen: false, state: state, url: url}),
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										cmd,
										A2(
										$elm$core$Task$attempt,
										function (_v5) {
											return $dtwrks$elm_book$ElmBook$Internal$Msg$DoNothing;
										},
										A3($elm$browser$Browser$Dom$setViewportOf, 'elm-book-main', 0, 0))
									])));
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{isMenuOpen: false, url: url}),
							A2(
								$elm$browser$Browser$Navigation$replaceUrl,
								model.navKey,
								hashBasedNavigation_ ? '#/' : '/'));
					}
				}
			case 'ToggleDarkMode':
				var darkMode = !model.darkMode;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							darkMode: darkMode,
							state: A2(
								$elm$core$Maybe$map,
								config.statefulOptions.onDarkModeChange(darkMode),
								model.state)
						}),
					$elm$core$Platform$Cmd$none);
			case 'UpdateState':
				var fn = msg.a;
				return A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
					A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$mapFirst(
							function (s) {
								return _Utils_update(
									model,
									{
										state: $elm$core$Maybe$Just(s)
									});
							}),
						A2($elm$core$Maybe$map, fn, model.state)));
			case 'LogAction':
				var context = msg.a;
				var action = msg.b;
				return A2(logAction_, context, action);
			case 'ActionLogShow':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{actionLogModal: true}),
					$elm$core$Platform$Cmd$none);
			case 'ActionLogHide':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{actionLogModal: false}),
					$elm$core$Platform$Cmd$none);
			case 'SearchFocus':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{chapterPreSelected: 0, isSearching: true}),
					$elm$core$Platform$Cmd$none);
			case 'SearchBlur':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{isSearching: false, search: ''}),
					$elm$core$Platform$Cmd$none);
			case 'Search':
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{chapterPreSelected: 0, search: value}),
					$elm$core$Platform$Cmd$none);
			case 'ToggleMenu':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{isMenuOpen: !model.isMenuOpen}),
					$elm$core$Platform$Cmd$none);
			case 'KeyArrowDown':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{chapterPreSelected: model.chapterPreSelected + 1}),
					$elm$core$Platform$Cmd$none);
			case 'KeyArrowUp':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{chapterPreSelected: model.chapterPreSelected - 1}),
					$elm$core$Platform$Cmd$none);
			case 'KeyShiftOn':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{isShiftPressed: true}),
					$elm$core$Platform$Cmd$none);
			case 'KeyShiftOff':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{isShiftPressed: false}),
					$elm$core$Platform$Cmd$none);
			case 'KeyMetaOn':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{isMetaPressed: true}),
					$elm$core$Platform$Cmd$none);
			case 'KeyMetaOff':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{isMetaPressed: false}),
					$elm$core$Platform$Cmd$none);
			case 'KeyK':
				return model.isMetaPressed ? _Utils_Tuple2(
					model,
					A2(
						$elm$core$Task$attempt,
						function (_v6) {
							return $dtwrks$elm_book$ElmBook$Internal$Msg$DoNothing;
						},
						$elm$browser$Browser$Dom$focus('elm-book-search'))) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'KeyEnter':
				if (!model.isSearching) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var preSelectedIndex = A2(
						$elm$core$Basics$modBy,
						$elm$core$Array$length(config.chapters),
						model.chapterPreSelected);
					var targetChapter = A2($elm$core$Array$get, preSelectedIndex, config.chapters);
					if (targetChapter.$ === 'Just') {
						var chapter_ = targetChapter.a;
						return $dtwrks$elm_book$ElmBook$Internal$Chapter$chapterInternal(chapter_) ? _Utils_Tuple2(
							model,
							A2(
								$elm$browser$Browser$Navigation$pushUrl,
								model.navKey,
								A2($dtwrks$elm_book$ElmBook$Internal$Chapter$chapterNavUrl, hashBasedNavigation_, chapter_))) : _Utils_Tuple2(
							model,
							$elm$browser$Browser$Navigation$load(
								$dtwrks$elm_book$ElmBook$Internal$Chapter$chapterUrl(chapter_)));
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				}
			case 'SetThemeBackgroundGradient':
				var startColor = msg.a;
				var endColor = msg.b;
				return A2(
					$dtwrks$elm_book$ElmBook$Internal$Application$updateThemeOverrides,
					model,
					function (t) {
						return _Utils_update(
							t,
							{
								background: $elm$core$Maybe$Just('linear-gradient(150deg, ' + (startColor + (' 0%, ' + (endColor + ' 100%)'))))
							});
					});
			case 'SetThemeBackground':
				var background = msg.a;
				return A2(
					$dtwrks$elm_book$ElmBook$Internal$Application$updateThemeOverrides,
					model,
					function (t) {
						return _Utils_update(
							t,
							{
								background: $elm$core$Maybe$Just(background)
							});
					});
			case 'SetThemeAccent':
				var accent = msg.a;
				return A2(
					$dtwrks$elm_book$ElmBook$Internal$Application$updateThemeOverrides,
					model,
					function (t) {
						return _Utils_update(
							t,
							{
								accent: $elm$core$Maybe$Just(accent)
							});
					});
			case 'SetThemeNavBackground':
				var navBackground = msg.a;
				return A2(
					$dtwrks$elm_book$ElmBook$Internal$Application$updateThemeOverrides,
					model,
					function (t) {
						return _Utils_update(
							t,
							{
								navBackground: $elm$core$Maybe$Just(navBackground)
							});
					});
			case 'SetThemeNavAccent':
				var navAccent = msg.a;
				return A2(
					$dtwrks$elm_book$ElmBook$Internal$Application$updateThemeOverrides,
					model,
					function (t) {
						return _Utils_update(
							t,
							{
								navAccent: $elm$core$Maybe$Just(navAccent)
							});
					});
			case 'SetThemeNavAccentHighlight':
				var navAccentHighlight = msg.a;
				return A2(
					$dtwrks$elm_book$ElmBook$Internal$Application$updateThemeOverrides,
					model,
					function (t) {
						return _Utils_update(
							t,
							{
								navAccentHighlight: $elm$core$Maybe$Just(navAccentHighlight)
							});
					});
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $dtwrks$elm_book$ElmBook$Internal$Msg$ActionLogHide = {$: 'ActionLogHide'};
var $dtwrks$elm_book$ElmBook$Internal$Msg$ActionLogShow = {$: 'ActionLogShow'};
var $dtwrks$elm_book$ElmBook$Internal$Msg$Search = function (a) {
	return {$: 'Search', a: a};
};
var $dtwrks$elm_book$ElmBook$Internal$Msg$SearchBlur = {$: 'SearchBlur'};
var $dtwrks$elm_book$ElmBook$Internal$Msg$SearchFocus = {$: 'SearchFocus'};
var $dtwrks$elm_book$ElmBook$Internal$Msg$ToggleDarkMode = {$: 'ToggleDarkMode'};
var $dtwrks$elm_book$ElmBook$Internal$Msg$ToggleMenu = {$: 'ToggleMenu'};
var $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$applyOverrides = F2(
	function (theme, overrides) {
		return _Utils_update(
			theme,
			{
				accent: A2($elm$core$Maybe$withDefault, theme.accent, overrides.accent),
				background: A2($elm$core$Maybe$withDefault, theme.background, overrides.background),
				navAccent: A2($elm$core$Maybe$withDefault, theme.navAccent, overrides.navAccent),
				navAccentHighlight: A2($elm$core$Maybe$withDefault, theme.navAccentHighlight, overrides.navAccentHighlight),
				navBackground: A2($elm$core$Maybe$withDefault, theme.navBackground, overrides.navBackground)
			});
	});
var $dtwrks$elm_book$ElmBook$Internal$Chapter$chapterBreadcrumb = function (_v0) {
	var chapter = _v0.a;
	return function (t) {
		return _Utils_ap(t, chapter.title);
	}(
		A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				function (t) {
					return t + ' / ';
				},
				chapter.groupTitle)));
};
var $dtwrks$elm_book$ElmBook$Internal$Application$componentView = F3(
	function (toHtml, state_, componentView_) {
		if (componentView_.$ === 'ChapterComponentViewStateless') {
			var html = componentView_.a;
			return toHtml(html);
		} else {
			var html = componentView_.a;
			return A2(
				$elm$core$Maybe$withDefault,
				$elm$html$Html$text(''),
				A2(
					$elm$core$Maybe$map,
					A2($elm$core$Basics$composeL, toHtml, html),
					state_));
		}
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $dtwrks$elm_book$ElmBook$UI$ActionLog$item = F2(
	function (index, _v0) {
		var preffix = _v0.a;
		var label = _v0.b;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('elm-book-wrapper elm-book-action-log-item-wrapper elm-book-monospace')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('elm-book-action-log-item-index')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'(' + ($elm$core$String$fromInt(index + 1) + ')'))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('elm-book-action-log__main')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('elm-book-action-log-item-preffix')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(preffix)
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('elm-book-action-log-item-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(label)
								]))
						]))
				]));
	});
var $dtwrks$elm_book$ElmBook$UI$Helpers$themeBackgroundVar = '--elm-book-background';
var $dtwrks$elm_book$ElmBook$UI$Helpers$var_ = function (v) {
	return 'var(' + (v + ')');
};
var $dtwrks$elm_book$ElmBook$UI$Helpers$themeBackground = $dtwrks$elm_book$ElmBook$UI$Helpers$var_($dtwrks$elm_book$ElmBook$UI$Helpers$themeBackgroundVar);
var $dtwrks$elm_book$ElmBook$UI$ActionLog$list = function (props) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('elm-book elm-book-action-log-list-wrapper')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elm-book elm-book-action-log-list-header elm-book-sans'),
						A2($elm$html$Html$Attributes$style, 'background', $dtwrks$elm_book$ElmBook$UI$Helpers$themeBackground)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Action log')
					])),
				A2(
				$elm$html$Html$ul,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elm-book elm-book-action-log-list')
					]),
				A2(
					$elm$core$List$map,
					function (item_) {
						return A2(
							$elm$html$Html$li,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('elm-book elm-book-action-log-list-item')
								]),
							_List_fromArray(
								[item_]));
					},
					$elm$core$List$reverse(
						A2($elm$core$List$indexedMap, $dtwrks$elm_book$ElmBook$UI$ActionLog$item, props))))
			]));
};
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $dtwrks$elm_book$ElmBook$UI$ActionLog$preview = function (props) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('elm-book-action-log-preview-wrapper')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elm-book-action-log-preview'),
						$elm$html$Html$Events$onClick(props.onClick)
					]),
				_List_fromArray(
					[
						A2($dtwrks$elm_book$ElmBook$UI$ActionLog$item, props.lastActionIndex, props.lastAction)
					]))
			]));
};
var $dtwrks$elm_book$ElmBook$UI$ActionLog$previewEmpty = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('elm-book-monospace elm-book-action-log-preview-empty-wrapper')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('elm-book-action-log-preview-empty')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Your logged actions will appear here.')
				]))
		]));
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm$core$Array$filter = F2(
	function (isGood, array) {
		return $elm$core$Array$fromList(
			A3(
				$elm$core$Array$foldr,
				F2(
					function (x, xs) {
						return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
					}),
				_List_Nil,
				array));
	});
var $dtwrks$elm_book$ElmBook$Internal$Application$searchChapters = F2(
	function (search, chapters) {
		if (search === '') {
			return chapters;
		} else {
			var searchLowerCase = $elm$core$String$toLower(search);
			var titleMatchesSearch = function (_v1) {
				var title = _v1.a.title;
				return A2(
					$elm$core$String$contains,
					searchLowerCase,
					$elm$core$String$toLower(title));
			};
			return A2($elm$core$Array$filter, titleMatchesSearch, chapters);
		}
	});
var $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$subtitle = function (theme) {
	return theme.subtitle;
};
var $dtwrks$elm_book$ElmBook$Internal$Chapter$toValidOptions = F2(
	function (valid, _v0) {
		var options = _v0.a;
		return {
			hiddenTitle: A2($elm$core$Maybe$withDefault, valid.hiddenTitle, options.hiddenTitle)
		};
	});
var $dtwrks$elm_book$ElmBook$Internal$ComponentOptions$toValidOptions = F2(
	function (validSettings, _v0) {
		var settings = _v0.a;
		return {
			background: A2($elm$core$Maybe$withDefault, validSettings.background, settings.background),
			display: A2($elm$core$Maybe$withDefault, validSettings.display, settings.display),
			fullWidth: A2($elm$core$Maybe$withDefault, validSettings.fullWidth, settings.fullWidth),
			hiddenLabel: A2($elm$core$Maybe$withDefault, validSettings.hiddenLabel, settings.hiddenLabel)
		};
	});
var $elm$html$Html$article = _VirtualDom_node('article');
var $dtwrks$elm_book$ElmBook$Internal$ComponentOptions$Inline = {$: 'Inline'};
var $elm$html$Html$Attributes$align = $elm$html$Html$Attributes$stringProperty('align');
var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty('alt');
var $elm$html$Html$blockquote = _VirtualDom_node('blockquote');
var $elm$html$Html$br = _VirtualDom_node('br');
var $elm$html$Html$code = _VirtualDom_node('code');
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$HCode = function (a) {
	return {$: 'HCode', a: a};
};
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (ra.$ === 'Ok') {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style1 = {$: 'Style1'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style2 = {$: 'Style2'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3 = {$: 'Style3'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style4 = {$: 'Style4'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style5 = {$: 'Style5'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$atRuleToFragment = function (a) {
	switch (a.$) {
		case 'Identifier':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'css-ar-i');
		case 'Prefix':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style5, 'css-ar-p');
		case 'Keyword':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'css-ar-k');
		default:
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style4, 'css-ar-v');
	}
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Default = {$: 'Default'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style7 = {$: 'Style7'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$attributeSelectorToFragment = function (att) {
	switch (att.$) {
		case 'AttributeName':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style5, 'css-s-a-an');
		case 'AttributeValue':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style2, 'css-s-a-av');
		default:
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'css-s-a-o');
	}
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$selectorToFragment = function (s) {
	switch (s.$) {
		case 'Element':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'css-s-e');
		case 'Id':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style5, 'css-s-i');
		case 'Class':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style5, 'css-s-cl');
		case 'Combinator':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style7, 'css-s-c');
		case 'Universal':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'css-s-u');
		case 'AttributeSelector':
			var att = s.a;
			return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$attributeSelectorToFragment(att);
		case 'PseudoElement':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Default, 'css-s-pe');
		default:
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Default, 'css-s-pc');
	}
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$syntaxToStyle = function (syntax) {
	switch (syntax.$) {
		case 'String':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style2, 'css-s');
		case 'AtRule':
			var a = syntax.a;
			return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$atRuleToFragment(a);
		case 'Selector':
			var s = syntax.a;
			return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$selectorToFragment(s);
		case 'Property':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style4, 'css-p');
		case 'PropertyValue':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style4, 'css-pv');
		case 'Number':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style1, 'css-n');
		default:
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'css-u');
	}
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$newLine = function (fragments) {
	return {fragments: fragments, highlight: $elm$core$Maybe$Nothing};
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$LineBreak = {$: 'LineBreak'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Comment = {$: 'Comment'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$toFragment = F2(
	function (toStyle, _v0) {
		var syntax = _v0.a;
		var text = _v0.b;
		switch (syntax.$) {
			case 'Normal':
				return {additionalClass: '', requiredStyle: $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Default, text: text};
			case 'Comment':
				return {additionalClass: '', requiredStyle: $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Comment, text: text};
			case 'LineBreak':
				return {additionalClass: '', requiredStyle: $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Default, text: text};
			default:
				var c = syntax.a;
				var _v2 = toStyle(c);
				var requiredStyle = _v2.a;
				var additionalClass = _v2.b;
				return {additionalClass: additionalClass, requiredStyle: requiredStyle, text: text};
		}
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$toLinesHelp = F3(
	function (toStyle, _v0, _v1) {
		var syntax = _v0.a;
		var text = _v0.b;
		var lines = _v1.a;
		var fragments = _v1.b;
		var maybeLastSyntax = _v1.c;
		if (_Utils_eq(syntax, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$LineBreak)) {
			return _Utils_Tuple3(
				A2(
					$elm$core$List$cons,
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$newLine(fragments),
					lines),
				_List_fromArray(
					[
						A2(
						$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$toFragment,
						toStyle,
						_Utils_Tuple2(syntax, text))
					]),
				$elm$core$Maybe$Nothing);
		} else {
			if (_Utils_eq(
				$elm$core$Maybe$Just(syntax),
				maybeLastSyntax)) {
				if (fragments.b) {
					var headFrag = fragments.a;
					var tailFrags = fragments.b;
					return _Utils_Tuple3(
						lines,
						A2(
							$elm$core$List$cons,
							_Utils_update(
								headFrag,
								{
									text: _Utils_ap(text, headFrag.text)
								}),
							tailFrags),
						maybeLastSyntax);
				} else {
					return _Utils_Tuple3(
						lines,
						A2(
							$elm$core$List$cons,
							A2(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$toFragment,
								toStyle,
								_Utils_Tuple2(syntax, text)),
							fragments),
						maybeLastSyntax);
				}
			} else {
				return _Utils_Tuple3(
					lines,
					A2(
						$elm$core$List$cons,
						A2(
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$toFragment,
							toStyle,
							_Utils_Tuple2(syntax, text)),
						fragments),
					$elm$core$Maybe$Just(syntax));
			}
		}
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$toLines = F2(
	function (toStyle, revTokens) {
		return function (_v0) {
			var lines = _v0.a;
			var frags = _v0.b;
			return A2(
				$elm$core$List$cons,
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$newLine(frags),
				lines);
		}(
			A3(
				$elm$core$List$foldl,
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$toLinesHelp(toStyle),
				_Utils_Tuple3(_List_Nil, _List_Nil, $elm$core$Maybe$Nothing),
				revTokens));
	});
var $elm$parser$Parser$Advanced$loopHelp = F4(
	function (p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var parse = _v0.a;
			var _v1 = parse(s0);
			if (_v1.$ === 'Good') {
				var p1 = _v1.a;
				var step = _v1.b;
				var s1 = _v1.c;
				if (step.$ === 'Loop') {
					var newState = step.a;
					var $temp$p = p || p1,
						$temp$state = newState,
						$temp$callback = callback,
						$temp$s0 = s1;
					p = $temp$p;
					state = $temp$state;
					callback = $temp$callback;
					s0 = $temp$s0;
					continue loopHelp;
				} else {
					var result = step.a;
					return A3($elm$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var $elm$parser$Parser$Advanced$loop = F2(
	function (state, callback) {
		return $elm$parser$Parser$Advanced$Parser(
			function (s) {
				return A4($elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
			});
	});
var $elm$parser$Parser$Advanced$Done = function (a) {
	return {$: 'Done', a: a};
};
var $elm$parser$Parser$Advanced$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $elm$parser$Parser$toAdvancedStep = function (step) {
	if (step.$ === 'Loop') {
		var s = step.a;
		return $elm$parser$Parser$Advanced$Loop(s);
	} else {
		var a = step.a;
		return $elm$parser$Parser$Advanced$Done(a);
	}
};
var $elm$parser$Parser$loop = F2(
	function (state, callback) {
		return A2(
			$elm$parser$Parser$Advanced$loop,
			state,
			function (s) {
				return A2(
					$elm$parser$Parser$map,
					$elm$parser$Parser$toAdvancedStep,
					callback(s));
			});
	});
var $elm$parser$Parser$Done = function (a) {
	return {$: 'Done', a: a};
};
var $elm$parser$Parser$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal = {$: 'Normal'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AtRule = function (a) {
	return {$: 'AtRule', a: a};
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C = function (a) {
	return {$: 'C', a: a};
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Identifier = {$: 'Identifier'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Prefix = {$: 'Prefix'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$String = {$: 'String'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AtRuleValue = {$: 'AtRuleValue'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Keyword = {$: 'Keyword'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile = function (isNotRelevant) {
	return A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(_Utils_Tuple0),
			$elm$parser$Parser$chompIf(isNotRelevant)),
		$elm$parser$Parser$chompWhile(isNotRelevant));
};
var $elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var $elm$core$Set$empty = $elm$core$Set$Set_elm_builtin($elm$core$Dict$empty);
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A3($elm$core$Dict$insert, key, _Utils_Tuple0, dict));
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$atRuleKeywordSet = $elm$core$Set$fromList(
	_List_fromArray(
		['and', 'or', 'not', 'only']));
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return A2($elm$core$Dict$member, key, dict);
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isAtRuleKeyword = function (n) {
	return A2($elm$core$Set$member, n, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$atRuleKeywordSet);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isCommentChar = function (c) {
	return _Utils_eq(
		c,
		_Utils_chr('/'));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isLineBreak = function (c) {
	return _Utils_eq(
		c,
		_Utils_chr('\n'));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isSpace = function (c) {
	return _Utils_eq(
		c,
		_Utils_chr(' ')) || _Utils_eq(
		c,
		_Utils_chr('\t'));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isWhitespace = function (c) {
	return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isSpace(c) || $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isLineBreak(c);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$selectorNameInvalidCharSet = $elm$core$Set$fromList(
	_List_fromArray(
		[
			_Utils_chr(':'),
			_Utils_chr('{'),
			_Utils_chr('}'),
			_Utils_chr(','),
			_Utils_chr('.'),
			_Utils_chr('#'),
			_Utils_chr('>'),
			_Utils_chr('+'),
			_Utils_chr('~'),
			_Utils_chr('*'),
			_Utils_chr('['),
			_Utils_chr(']'),
			_Utils_chr('|'),
			_Utils_chr(';'),
			_Utils_chr('('),
			_Utils_chr(')')
		]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isSelectorNameChar = function (c) {
	return !($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isWhitespace(c) || ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isCommentChar(c) || A2($elm$core$Set$member, c, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$selectorNameInvalidCharSet)));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$atRuleKeywordOrValue = function (revTokens) {
	return A2(
		$elm$parser$Parser$map,
		function (n) {
			return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isAtRuleKeyword(n) ? A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C(
						$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AtRule($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Keyword)),
					n),
				revTokens) : A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C(
						$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AtRule($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AtRuleValue)),
					n),
				revTokens);
		},
		$elm$parser$Parser$getChompedString(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isSelectorNameChar)));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$atRuleSet = $elm$core$Set$fromList(
	_List_fromArray(
		['@page', '@font-face', '@swash', '@annotation', '@ornaments', '@stylistic', '@styleset', '@character-variant']));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Comment = {$: 'Comment'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$addThen = F3(
	function (f, list, plist) {
		return A2(
			$elm$parser$Parser$andThen,
			function (n) {
				return f(
					_Utils_ap(n, list));
			},
			plist);
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$consThen = F3(
	function (f, list, pn) {
		return A2(
			$elm$parser$Parser$andThen,
			function (n) {
				return f(
					A2($elm$core$List$cons, n, list));
			},
			pn);
	});
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 'ExpectingSymbol', a: a};
};
var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
var $elm$parser$Parser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile = F2(
	function (isNotRelevant, previousParser) {
		return A2(
			$elm$parser$Parser$ignorer,
			previousParser,
			$elm$parser$Parser$chompWhile(isNotRelevant));
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedUnnestable = F2(
	function (options, revAList) {
		var defaultMap = options.defaultMap;
		var isNotRelevant = options.isNotRelevant;
		var end = options.end;
		var innerParsers = options.innerParsers;
		return $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$map,
					$elm$core$Basics$always(
						A2(
							$elm$core$List$cons,
							defaultMap(end),
							revAList)),
					$elm$parser$Parser$symbol(end)),
					A2(
					$elm$parser$Parser$map,
					$elm$core$Basics$always(revAList),
					$elm$parser$Parser$end),
					A3(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$addThen,
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedUnnestable(options),
					revAList,
					$elm$parser$Parser$oneOf(innerParsers)),
					A3(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$consThen,
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedUnnestable(options),
					revAList,
					A2(
						$elm$parser$Parser$map,
						defaultMap,
						$elm$parser$Parser$getChompedString(
							A2(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
								isNotRelevant,
								$elm$parser$Parser$chompIf(
									$elm$core$Basics$always(true))))))
				]));
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedNestable = F3(
	function (nestLevel, options, revAList) {
		var defaultMap = options.defaultMap;
		var isNotRelevant = options.isNotRelevant;
		var start = options.start;
		var end = options.end;
		var innerParsers = options.innerParsers;
		return $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$andThen,
					function (n) {
						return (nestLevel === 1) ? $elm$parser$Parser$succeed(n) : A3($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedNestable, nestLevel - 1, options, n);
					},
					A2(
						$elm$parser$Parser$map,
						$elm$core$Basics$always(
							A2(
								$elm$core$List$cons,
								defaultMap(end),
								revAList)),
						$elm$parser$Parser$symbol(end))),
					A3(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$consThen,
					A2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedNestable, nestLevel + 1, options),
					revAList,
					A2(
						$elm$parser$Parser$map,
						defaultMap,
						$elm$parser$Parser$getChompedString(
							A2(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
								isNotRelevant,
								$elm$parser$Parser$symbol(start))))),
					A3(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$addThen,
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedUnnestable(options),
					revAList,
					$elm$parser$Parser$oneOf(innerParsers)),
					A2(
					$elm$parser$Parser$map,
					$elm$core$Basics$always(revAList),
					$elm$parser$Parser$end),
					A3(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$consThen,
					A2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedNestable, nestLevel, options),
					revAList,
					A2(
						$elm$parser$Parser$map,
						defaultMap,
						$elm$parser$Parser$getChompedString(
							A2(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
								isNotRelevant,
								$elm$parser$Parser$chompIf(
									$elm$core$Basics$always(true))))))
				]));
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedHelp = F2(
	function (options, revAList) {
		var start = options.start;
		var end = options.end;
		var isNotRelevant = options.isNotRelevant;
		var _v0 = _Utils_Tuple2(
			$elm$core$String$uncons(options.start),
			$elm$core$String$uncons(options.end));
		if (_v0.a.$ === 'Nothing') {
			var _v1 = _v0.a;
			return $elm$parser$Parser$problem('Trying to parse a delimited helper, but the start token cannot be an empty string!');
		} else {
			if (_v0.b.$ === 'Nothing') {
				var _v2 = _v0.b;
				return $elm$parser$Parser$problem('Trying to parse a delimited helper, but the end token cannot be an empty string!');
			} else {
				var _v3 = _v0.a.a;
				var startChar = _v3.a;
				var _v4 = _v0.b.a;
				var endChar = _v4.a;
				return options.isNestable ? A3(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedNestable,
					1,
					_Utils_update(
						options,
						{
							isNotRelevant: function (c) {
								return isNotRelevant(c) && ((!_Utils_eq(c, startChar)) && (!_Utils_eq(c, endChar)));
							}
						}),
					revAList) : A2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedUnnestable,
					_Utils_update(
						options,
						{
							isNotRelevant: function (c) {
								return isNotRelevant(c) && (!_Utils_eq(c, endChar));
							}
						}),
					revAList);
			}
		}
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimited = function (options) {
	var start = options.start;
	var isNotRelevant = options.isNotRelevant;
	var defaultMap = options.defaultMap;
	return A2(
		$elm$parser$Parser$andThen,
		function (n) {
			return A2(
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimitedHelp,
				options,
				_List_fromArray(
					[n]));
		},
		A2(
			$elm$parser$Parser$map,
			$elm$core$Basics$always(
				defaultMap(start)),
			$elm$parser$Parser$symbol(start)));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$lineBreak = A2(
	$elm$parser$Parser$map,
	function (_v0) {
		return _List_fromArray(
			[
				_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$LineBreak, '\n')
			]);
	},
	$elm$parser$Parser$symbol('\n'));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$comment = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimited(
	{
		defaultMap: function (b) {
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Comment, b);
		},
		end: '*/',
		innerParsers: _List_fromArray(
			[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$lineBreak]),
		isNestable: false,
		isNotRelevant: function (c) {
			return !$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isLineBreak(c);
		},
		start: '/*'
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$whitespaceOrCommentStep = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$map,
				function (b) {
					return $elm$parser$Parser$Loop(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b),
							revTokens));
				},
				$elm$parser$Parser$getChompedString(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isSpace))),
				A2(
				$elm$parser$Parser$map,
				function (ns) {
					return $elm$parser$Parser$Loop(
						_Utils_ap(ns, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$lineBreak),
				A2(
				$elm$parser$Parser$map,
				function (ns) {
					return $elm$parser$Parser$Loop(
						_Utils_ap(ns, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$comment)
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$keyframesOrCounterStyle = function (a) {
	return A2(
		$elm$parser$Parser$loop,
		_List_fromArray(
			[
				_Utils_Tuple2(
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AtRule($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Identifier)),
				a)
			]),
		function (ns) {
			return $elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$whitespaceOrCommentStep(ns),
						A2(
						$elm$parser$Parser$map,
						function (b) {
							return $elm$parser$Parser$Loop(
								A2(
									$elm$core$List$cons,
									_Utils_Tuple2(
										$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C(
											$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AtRule($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Prefix)),
										b),
									ns));
						},
						$elm$parser$Parser$getChompedString(
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isSelectorNameChar))),
						A2(
						$elm$parser$Parser$map,
						function (b) {
							return $elm$parser$Parser$Loop(
								A2(
									$elm$core$List$cons,
									_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b),
									ns));
						},
						$elm$parser$Parser$getChompedString(
							$elm$parser$Parser$chompIf(
								function (c) {
									return !_Utils_eq(
										c,
										_Utils_chr('{'));
								}))),
						$elm$parser$Parser$succeed(
						$elm$parser$Parser$Done(ns))
					]));
		});
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$nestableAtRuleOpener = function (ns) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$map,
				$elm$core$Basics$always(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, '{'),
						ns)),
				$elm$parser$Parser$symbol('{')),
				$elm$parser$Parser$succeed(ns)
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Number = {$: 'Number'};
var $elm$parser$Parser$Advanced$backtrackable = function (_v0) {
	var parse = _v0.a;
	return $elm$parser$Parser$Advanced$Parser(
		function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 'Bad') {
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, false, x);
			} else {
				var a = _v1.b;
				var s1 = _v1.c;
				return A3($elm$parser$Parser$Advanced$Good, false, a, s1);
			}
		});
};
var $elm$parser$Parser$backtrackable = $elm$parser$Parser$Advanced$backtrackable;
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$escapableSet = $elm$core$Set$fromList(
	_List_fromArray(
		[
			_Utils_chr('\''),
			_Utils_chr('\"'),
			_Utils_chr('\\'),
			_Utils_chr('n'),
			_Utils_chr('r'),
			_Utils_chr('t'),
			_Utils_chr('b'),
			_Utils_chr('f'),
			_Utils_chr('v')
		]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isEscapableChar = function (c) {
	return A2($elm$core$Set$member, c, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$escapableSet);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$escapable = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(_Utils_Tuple0),
		$elm$parser$Parser$backtrackable(
			$elm$parser$Parser$symbol('\\'))),
	$elm$parser$Parser$chompIf($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isEscapableChar));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$cssEscapable = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _List_fromArray(
			[
				_Utils_Tuple2(
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Number),
				b)
			]);
	},
	$elm$parser$Parser$getChompedString($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$escapable));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isEscapable = function (c) {
	return _Utils_eq(
		c,
		_Utils_chr('\\'));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$quoteDelimiter = {
	defaultMap: function (b) {
		return _Utils_Tuple2(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$String),
			b);
	},
	end: '\'',
	innerParsers: _List_fromArray(
		[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$lineBreak, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$cssEscapable]),
	isNestable: false,
	isNotRelevant: function (c) {
		return !($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isLineBreak(c) || $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isEscapable(c));
	},
	start: '\''
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$doubleQuote = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimited(
	_Utils_update(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$quoteDelimiter,
		{end: '\"', start: '\"'}));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$quote = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimited($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$quoteDelimiter);
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$stringLiteral = function (revTokens) {
	return A2(
		$elm$parser$Parser$map,
		function (n) {
			return _Utils_ap(n, revTokens);
		},
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$quote, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$doubleQuote])));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$mediaOrSupports = function (a) {
	return A2(
		$elm$parser$Parser$andThen,
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$nestableAtRuleOpener,
		A2(
			$elm$parser$Parser$loop,
			_List_fromArray(
				[
					_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C(
						$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AtRule($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Identifier)),
					a)
				]),
			function (ns) {
				return $elm$parser$Parser$oneOf(
					_List_fromArray(
						[
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$whitespaceOrCommentStep(ns),
							A2(
							$elm$parser$Parser$map,
							$elm$parser$Parser$Loop,
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$stringLiteral(ns)),
							A2(
							$elm$parser$Parser$map,
							$elm$parser$Parser$Loop,
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$atRuleKeywordOrValue(ns)),
							A2(
							$elm$parser$Parser$map,
							function (b) {
								return $elm$parser$Parser$Loop(
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b),
										ns));
							},
							$elm$parser$Parser$getChompedString(
								$elm$parser$Parser$chompIf(
									function (c) {
										return !_Utils_eq(
											c,
											_Utils_chr('{'));
									}))),
							$elm$parser$Parser$succeed(
							$elm$parser$Parser$Done(ns))
						]));
			}));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$PropertyValue = {$: 'PropertyValue'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$stringArg = F2(
	function (fnStr, revTokens) {
		return A2(
			$elm$parser$Parser$andThen,
			function (revT_) {
				return $elm$parser$Parser$oneOf(
					_List_fromArray(
						[
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$stringLiteral(revT_),
							A2(
							$elm$parser$Parser$map,
							function (n) {
								return A2(
									$elm$core$List$cons,
									_Utils_Tuple2(
										$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$String),
										n),
									revT_);
							},
							$elm$parser$Parser$getChompedString(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile(
									function (c) {
										return !_Utils_eq(
											c,
											_Utils_chr(')'));
									}))),
							$elm$parser$Parser$succeed(revT_)
						]));
			},
			A2(
				$elm$parser$Parser$map,
				$elm$core$Basics$always(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, '('),
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$PropertyValue),
								fnStr),
							revTokens))),
				$elm$parser$Parser$symbol(fnStr + '(')));
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$atRuleHelper = function (a) {
	switch (a) {
		case '@import':
			return A2(
				$elm$parser$Parser$loop,
				_List_fromArray(
					[
						_Utils_Tuple2(
						$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C(
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AtRule($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Identifier)),
						a)
					]),
				function (ns) {
					return $elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$whitespaceOrCommentStep(ns),
								A2(
								$elm$parser$Parser$map,
								$elm$parser$Parser$Loop,
								A2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$stringArg, 'url', ns)),
								A2(
								$elm$parser$Parser$map,
								$elm$parser$Parser$Loop,
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$stringLiteral(ns)),
								A2(
								$elm$parser$Parser$map,
								$elm$parser$Parser$Loop,
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$atRuleKeywordOrValue(ns)),
								A2(
								$elm$parser$Parser$map,
								function (b) {
									return $elm$parser$Parser$Loop(
										A2(
											$elm$core$List$cons,
											_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b),
											ns));
								},
								$elm$parser$Parser$getChompedString(
									$elm$parser$Parser$chompIf(
										function (c) {
											return !_Utils_eq(
												c,
												_Utils_chr(';'));
										}))),
								$elm$parser$Parser$succeed(
								$elm$parser$Parser$Done(ns))
							]));
				});
		case '@namespace':
			return A2(
				$elm$parser$Parser$loop,
				_List_fromArray(
					[
						_Utils_Tuple2(
						$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C(
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AtRule($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Identifier)),
						a)
					]),
				function (ns) {
					return $elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$whitespaceOrCommentStep(ns),
								A2(
								$elm$parser$Parser$map,
								$elm$parser$Parser$Loop,
								A2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$stringArg, 'url', ns)),
								A2(
								$elm$parser$Parser$map,
								$elm$parser$Parser$Loop,
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$stringLiteral(ns)),
								A2(
								$elm$parser$Parser$map,
								function (b) {
									return $elm$parser$Parser$Loop(
										A2(
											$elm$core$List$cons,
											_Utils_Tuple2(
												$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C(
													$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AtRule($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Prefix)),
												b),
											ns));
								},
								$elm$parser$Parser$getChompedString(
									$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isSelectorNameChar))),
								A2(
								$elm$parser$Parser$map,
								function (b) {
									return $elm$parser$Parser$Loop(
										A2(
											$elm$core$List$cons,
											_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b),
											ns));
								},
								$elm$parser$Parser$getChompedString(
									$elm$parser$Parser$chompIf(
										function (c) {
											return !_Utils_eq(
												c,
												_Utils_chr(';'));
										}))),
								$elm$parser$Parser$succeed(
								$elm$parser$Parser$Done(ns))
							]));
				});
		case '@charset':
			return A2(
				$elm$parser$Parser$loop,
				_List_fromArray(
					[
						_Utils_Tuple2(
						$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C(
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AtRule($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Identifier)),
						a)
					]),
				function (ns) {
					return $elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$whitespaceOrCommentStep(ns),
								A2(
								$elm$parser$Parser$map,
								$elm$parser$Parser$Loop,
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$stringLiteral(ns)),
								A2(
								$elm$parser$Parser$map,
								function (b) {
									return $elm$parser$Parser$Loop(
										A2(
											$elm$core$List$cons,
											_Utils_Tuple2(
												$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$String),
												b),
											ns));
								},
								$elm$parser$Parser$getChompedString(
									$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isSelectorNameChar))),
								A2(
								$elm$parser$Parser$map,
								function (b) {
									return $elm$parser$Parser$Loop(
										A2(
											$elm$core$List$cons,
											_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b),
											ns));
								},
								$elm$parser$Parser$getChompedString(
									$elm$parser$Parser$chompIf(
										function (c) {
											return !_Utils_eq(
												c,
												_Utils_chr(';'));
										}))),
								$elm$parser$Parser$succeed(
								$elm$parser$Parser$Done(ns))
							]));
				});
		case '@media':
			return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$mediaOrSupports(a);
		case '@supports':
			return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$mediaOrSupports(a);
		case '@keyframes':
			return A2(
				$elm$parser$Parser$andThen,
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$nestableAtRuleOpener,
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$keyframesOrCounterStyle(a));
		case '@counter-style':
			return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$keyframesOrCounterStyle(a);
		case '@font-feature-values':
			return A2(
				$elm$parser$Parser$andThen,
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$nestableAtRuleOpener,
				A2(
					$elm$parser$Parser$loop,
					_List_fromArray(
						[
							_Utils_Tuple2(
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AtRule($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Identifier)),
							a)
						]),
					function (ns) {
						return $elm$parser$Parser$oneOf(
							_List_fromArray(
								[
									$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$whitespaceOrCommentStep(ns),
									A2(
									$elm$parser$Parser$map,
									function (b) {
										return $elm$parser$Parser$Loop(
											A2(
												$elm$core$List$cons,
												_Utils_Tuple2(
													$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C(
														$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AtRule($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Prefix)),
													b),
												ns));
									},
									$elm$parser$Parser$getChompedString(
										$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isSelectorNameChar))),
									A2(
									$elm$parser$Parser$map,
									function (b) {
										return $elm$parser$Parser$Loop(
											A2(
												$elm$core$List$cons,
												_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b),
												ns));
									},
									$elm$parser$Parser$getChompedString(
										$elm$parser$Parser$chompIf(
											function (c) {
												return !_Utils_eq(
													c,
													_Utils_chr('{'));
											}))),
									$elm$parser$Parser$succeed(
									$elm$parser$Parser$Done(ns))
								]));
					}));
		default:
			return A2($elm$core$Set$member, a, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$atRuleSet) ? $elm$parser$Parser$succeed(
				_List_fromArray(
					[
						_Utils_Tuple2(
						$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C(
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AtRule($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Identifier)),
						a)
					])) : $elm$parser$Parser$succeed(
				_List_fromArray(
					[
						_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, a)
					]));
	}
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$atRule = A2(
	$elm$parser$Parser$andThen,
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$atRuleHelper,
	$elm$parser$Parser$getChompedString(
		A2(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isSelectorNameChar,
			$elm$parser$Parser$symbol('@'))));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Property = {$: 'Property'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isPropertyChar = function (c) {
	return !($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isWhitespace(c) || ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isCommentChar(c) || (_Utils_eq(
		c,
		_Utils_chr(':')) || (_Utils_eq(
		c,
		_Utils_chr(';')) || _Utils_eq(
		c,
		_Utils_chr('}'))))));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Unit = {$: 'Unit'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$operatorCharSet = $elm$core$Set$fromList(
	_List_fromArray(
		[
			_Utils_chr('+'),
			_Utils_chr('-'),
			_Utils_chr('%'),
			_Utils_chr('*'),
			_Utils_chr('/')
		]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isOperatorChar = function (c) {
	return A2($elm$core$Set$member, c, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$operatorCharSet);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isPropertyValueChar = function (c) {
	return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isPropertyChar(c) && (!(_Utils_eq(
		c,
		_Utils_chr('(')) || (_Utils_eq(
		c,
		_Utils_chr(')')) || (_Utils_eq(
		c,
		_Utils_chr(',')) || $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isOperatorChar(c)))));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$hexColor = function (revTokens) {
	return A2(
		$elm$parser$Parser$map,
		function (n) {
			return A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Number),
					n),
				revTokens);
		},
		$elm$parser$Parser$getChompedString(
			A2(
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isPropertyValueChar,
				$elm$parser$Parser$symbol('#'))));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isNotPropertyValueChar = function (c) {
	return _Utils_eq(
		c,
		_Utils_chr('(')) || (_Utils_eq(
		c,
		_Utils_chr(')')) || (_Utils_eq(
		c,
		_Utils_chr(':')) || (_Utils_eq(
		c,
		_Utils_chr(',')) || _Utils_eq(
		c,
		_Utils_chr('/')))));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$unitSet = $elm$core$Set$fromList(
	_List_fromArray(
		['em', 'ex', 'ch', 'rem', 'vw', 'vh', 'vmin', 'vmax', 'cm', 'mm', 'q', 'in', 'pt', 'pc', 'px', 'deg', 'grad', 'rad', 'turn', 's', 'ms', 'Hz', 'kHz', 'dpi', 'dpcm', 'dppx']));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isUnit = function (n) {
	return A2($elm$core$Set$member, n, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$unitSet);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isNumber = function (c) {
	return $elm$core$Char$isDigit(c) || _Utils_eq(
		c,
		_Utils_chr('.'));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$positiveNumber = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(_Utils_Tuple0),
		$elm$parser$Parser$chompIf($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isNumber)),
	$elm$parser$Parser$chompWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isNumber));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$negativeNumber = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(_Utils_Tuple0),
		$elm$parser$Parser$backtrackable(
			$elm$parser$Parser$symbol('-'))),
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$positiveNumber);
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$number = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$positiveNumber, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$negativeNumber]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$number = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _Utils_Tuple2(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Number),
			b);
	},
	$elm$parser$Parser$getChompedString($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$number));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$valueLoop = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Loop,
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$stringLiteral(revTokens)),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$number),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Loop,
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$hexColor(revTokens)),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Loop,
				A2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$stringArg, 'url', revTokens)),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Loop,
				A2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$stringArg, 'format', revTokens)),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Loop,
				A2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$stringArg, 'local', revTokens)),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isUnit(n) ? $elm$parser$Parser$Loop(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Unit),
								n),
							revTokens)) : $elm$parser$Parser$Loop(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$PropertyValue),
								n),
							revTokens));
				},
				$elm$parser$Parser$getChompedString(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isPropertyValueChar))),
				A2(
				$elm$parser$Parser$map,
				function (b) {
					return $elm$parser$Parser$Loop(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b),
							revTokens));
				},
				$elm$parser$Parser$getChompedString(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isNotPropertyValueChar))),
				A2(
				$elm$parser$Parser$map,
				function (b) {
					return $elm$parser$Parser$Loop(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Unit),
								b),
							revTokens));
				},
				$elm$parser$Parser$getChompedString(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isOperatorChar))),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$valueHelper = function (opener) {
	return A2(
		$elm$parser$Parser$loop,
		_List_fromArray(
			[opener]),
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$valueLoop);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$value = A2(
	$elm$parser$Parser$andThen,
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$valueHelper,
	A2(
		$elm$parser$Parser$map,
		function (b) {
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
		},
		$elm$parser$Parser$getChompedString(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile(
				$elm$core$Basics$eq(
					_Utils_chr(':'))))));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$declarationLoop = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				function (b) {
					return $elm$parser$Parser$Loop(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Property),
								b),
							revTokens));
				},
				$elm$parser$Parser$getChompedString(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isPropertyChar))),
				A2(
				$elm$parser$Parser$map,
				function (b) {
					return $elm$parser$Parser$Loop(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b),
							revTokens));
				},
				$elm$parser$Parser$getChompedString(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile(
						function (c) {
							return _Utils_eq(
								c,
								_Utils_chr(';')) || _Utils_eq(
								c,
								_Utils_chr('/'));
						}))),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						_Utils_ap(n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$value),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$declarationBlockHelper = function (opener) {
	return A2(
		$elm$parser$Parser$loop,
		_List_fromArray(
			[opener]),
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$declarationLoop);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$declarationBlock = A2(
	$elm$parser$Parser$andThen,
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$declarationBlockHelper,
	A2(
		$elm$parser$Parser$map,
		function (b) {
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
		},
		$elm$parser$Parser$getChompedString(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile(
				function (c) {
					return _Utils_eq(
						c,
						_Utils_chr('{'));
				}))));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Selector = function (a) {
	return {$: 'Selector', a: a};
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AttributeName = {$: 'AttributeName'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AttributeSelector = function (a) {
	return {$: 'AttributeSelector', a: a};
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$attSelOperatorCharSet = $elm$core$Set$fromList(
	_List_fromArray(
		[
			_Utils_chr('='),
			_Utils_chr('~'),
			_Utils_chr('|'),
			_Utils_chr('^'),
			_Utils_chr('$'),
			_Utils_chr('*')
		]));
var $elm$core$Set$union = F2(
	function (_v0, _v1) {
		var dict1 = _v0.a;
		var dict2 = _v1.a;
		return $elm$core$Set$Set_elm_builtin(
			A2($elm$core$Dict$union, dict1, dict2));
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$whitespaceCharSet = $elm$core$Set$fromList(
	_List_fromArray(
		[
			_Utils_chr(' '),
			_Utils_chr('\t'),
			_Utils_chr('\n')
		]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$attSelNameInvalidCharSet = A2(
	$elm$core$Set$insert,
	_Utils_chr(']'),
	A2($elm$core$Set$union, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$attSelOperatorCharSet, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$whitespaceCharSet));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$attributeName = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _Utils_Tuple2(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C(
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Selector(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AttributeSelector($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AttributeName))),
			b);
	},
	$elm$parser$Parser$getChompedString(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile(
			function (c) {
				return !A2($elm$core$Set$member, c, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$attSelNameInvalidCharSet);
			})));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AttributeOperator = {$: 'AttributeOperator'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$attributeOperator = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _Utils_Tuple2(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C(
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Selector(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AttributeSelector($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AttributeOperator))),
			b);
	},
	$elm$parser$Parser$getChompedString(
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$symbol('~='),
					$elm$parser$Parser$symbol('|='),
					$elm$parser$Parser$symbol('^='),
					$elm$parser$Parser$symbol('$='),
					$elm$parser$Parser$symbol('*='),
					$elm$parser$Parser$symbol('=')
				]))));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AttributeValue = {$: 'AttributeValue'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$attributeValue = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Done,
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$stringLiteral(revTokens)),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Done,
				A2(
					$elm$parser$Parser$map,
					function (b) {
						return A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C(
									$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Selector(
										$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AttributeSelector($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$AttributeValue))),
								b),
							revTokens);
					},
					$elm$parser$Parser$getChompedString(
						$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile(
							function (c) {
								return (!_Utils_eq(
									c,
									_Utils_chr(']'))) && (!$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isWhitespace(c));
							})))),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$attributeSelectorLoop = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$attributeName),
				A2(
				$elm$parser$Parser$andThen,
				function (operator) {
					return A2(
						$elm$parser$Parser$map,
						function (n) {
							return $elm$parser$Parser$Loop(
								_Utils_ap(n, revTokens));
						},
						A2(
							$elm$parser$Parser$loop,
							_List_fromArray(
								[operator]),
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$attributeValue));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$attributeOperator),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$attributeSelector = A2(
	$elm$parser$Parser$andThen,
	function (opener) {
		return A2(
			$elm$parser$Parser$loop,
			_List_fromArray(
				[opener]),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$attributeSelectorLoop);
	},
	A2(
		$elm$parser$Parser$map,
		$elm$core$Basics$always(
			_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, '[')),
		$elm$parser$Parser$symbol('[')));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Class = {$: 'Class'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$class = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Class, b);
	},
	$elm$parser$Parser$getChompedString(
		A2(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isSelectorNameChar,
			$elm$parser$Parser$symbol('.'))));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Combinator = {$: 'Combinator'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$combinator = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Combinator, b);
	},
	$elm$parser$Parser$getChompedString(
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$symbol('+'),
					$elm$parser$Parser$symbol('~'),
					$elm$parser$Parser$symbol('>')
				]))));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Element = {$: 'Element'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$element = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Element, b);
	},
	$elm$parser$Parser$getChompedString(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isSelectorNameChar)));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Id = {$: 'Id'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$id = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Id, b);
	},
	$elm$parser$Parser$getChompedString(
		A2(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isSelectorNameChar,
			$elm$parser$Parser$symbol('#'))));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$PseudoClass = {$: 'PseudoClass'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$pseudoClass = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$PseudoClass, b);
	},
	$elm$parser$Parser$getChompedString(
		A2(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isSelectorNameChar,
			$elm$parser$Parser$symbol(':'))));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$PseudoElement = {$: 'PseudoElement'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$pseudoElement = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$PseudoElement, b);
	},
	$elm$parser$Parser$getChompedString(
		A2(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$isSelectorNameChar,
			$elm$parser$Parser$symbol('::'))));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Universal = {$: 'Universal'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$universal = A2(
	$elm$parser$Parser$map,
	$elm$core$Basics$always(
		_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Universal, '*')),
	$elm$parser$Parser$symbol('*'));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$selector = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$map,
			function (_v0) {
				var n = _v0.a;
				var s = _v0.b;
				return _List_fromArray(
					[
						_Utils_Tuple2(
						$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C(
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$Selector(n)),
						s)
					]);
			},
			$elm$parser$Parser$oneOf(
				_List_fromArray(
					[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$id, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$class, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$element, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$universal, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$combinator, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$pseudoElement, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$pseudoClass]))),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$attributeSelector
		]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$mainLoop = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						_Utils_ap(n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$atRule),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						_Utils_ap(n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$selector),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						_Utils_ap(n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$declarationBlock),
				A2(
				$elm$parser$Parser$map,
				function (b) {
					return $elm$parser$Parser$Loop(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b),
							revTokens));
				},
				$elm$parser$Parser$getChompedString(
					$elm$parser$Parser$chompIf(
						$elm$core$Basics$always(true)))),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$toRevTokens = A2($elm$parser$Parser$loop, _List_Nil, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$mainLoop);
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$toLines = A2(
	$elm$core$Basics$composeR,
	$elm$parser$Parser$run($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$toRevTokens),
	$elm$core$Result$map(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$toLines($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$syntaxToStyle)));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$css = A2(
	$elm$core$Basics$composeR,
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Css$toLines,
	$elm$core$Result$map($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$HCode));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style6 = {$: 'Style6'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$syntaxToStyle = function (syntax) {
	switch (syntax.$) {
		case 'String':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style2, 'elm-s');
		case 'BasicSymbol':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'elm-bs');
		case 'GroupSymbol':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style4, 'elm-gs');
		case 'Capitalized':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style6, 'elm-c');
		case 'Keyword':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'elm-k');
		case 'Function':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style5, 'elm-f');
		case 'TypeSignature':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style4, 'elm-ts');
		default:
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style1, 'elm-n');
	}
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$inlineComment = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _List_fromArray(
			[
				_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Comment, b)
			]);
	},
	$elm$parser$Parser$getChompedString(
		A2(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isLineBreak),
			$elm$parser$Parser$symbol('--'))));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$lineBreakList = A2(
	$elm$parser$Parser$map,
	function (_v0) {
		return _List_fromArray(
			[
				_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$LineBreak, '\n')
			]);
	},
	$elm$parser$Parser$symbol('\n'));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$multilineComment = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimited(
	{
		defaultMap: function (b) {
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Comment, b);
		},
		end: '-}',
		innerParsers: _List_fromArray(
			[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$lineBreakList]),
		isNestable: true,
		isNotRelevant: function (c) {
			return !$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isLineBreak(c);
		},
		start: '{-'
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$comment = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$inlineComment, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$multilineComment]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$BasicSymbol = {$: 'BasicSymbol'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Capitalized = {$: 'Capitalized'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$GroupSymbol = {$: 'GroupSymbol'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Keyword = {$: 'Keyword'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Number = {$: 'Number'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$basicSymbols = $elm$core$Set$fromList(
	_List_fromArray(
		[
			_Utils_chr('|'),
			_Utils_chr('.'),
			_Utils_chr('='),
			_Utils_chr('\\'),
			_Utils_chr('/'),
			_Utils_chr('('),
			_Utils_chr(')'),
			_Utils_chr('-'),
			_Utils_chr('>'),
			_Utils_chr('<'),
			_Utils_chr(':'),
			_Utils_chr('+'),
			_Utils_chr('!'),
			_Utils_chr('$'),
			_Utils_chr('%'),
			_Utils_chr('&'),
			_Utils_chr('*')
		]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isBasicSymbol = function (c) {
	return A2($elm$core$Set$member, c, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$basicSymbols);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$basicSymbol = $elm$parser$Parser$getChompedString(
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isBasicSymbol));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$groupSymbols = $elm$core$Set$fromList(
	_List_fromArray(
		[
			_Utils_chr(','),
			_Utils_chr('['),
			_Utils_chr(']'),
			_Utils_chr('{'),
			_Utils_chr('}')
		]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isGroupSymbol = function (c) {
	return A2($elm$core$Set$member, c, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$groupSymbols);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isStringLiteralChar = function (c) {
	return _Utils_eq(
		c,
		_Utils_chr('\"')) || _Utils_eq(
		c,
		_Utils_chr('\''));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isVariableChar = function (c) {
	return !($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isWhitespace(c) || ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isBasicSymbol(c) || ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isGroupSymbol(c) || $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isStringLiteralChar(c))));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$capitalized = $elm$parser$Parser$getChompedString(
	A2(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isVariableChar,
		$elm$parser$Parser$chompIf($elm$core$Char$isUpper)));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$groupSymbol = $elm$parser$Parser$getChompedString(
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isGroupSymbol));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Function = {$: 'Function'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$infixSet = $elm$core$Set$fromList(
	_List_fromArray(
		[
			_Utils_chr('+'),
			_Utils_chr('-'),
			_Utils_chr('/'),
			_Utils_chr('*'),
			_Utils_chr('='),
			_Utils_chr('.'),
			_Utils_chr('$'),
			_Utils_chr('<'),
			_Utils_chr('>'),
			_Utils_chr(':'),
			_Utils_chr('&'),
			_Utils_chr('|'),
			_Utils_chr('^'),
			_Utils_chr('?'),
			_Utils_chr('%'),
			_Utils_chr('#'),
			_Utils_chr('@'),
			_Utils_chr('~'),
			_Utils_chr('!'),
			_Utils_chr(',')
		]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isInfixChar = function (c) {
	return A2($elm$core$Set$member, c, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$infixSet);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$infixParser = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _Utils_Tuple2(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Function),
			b);
	},
	$elm$parser$Parser$getChompedString(
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(_Utils_Tuple0),
					$elm$parser$Parser$backtrackable(
						$elm$parser$Parser$symbol('('))),
				$elm$parser$Parser$backtrackable(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isInfixChar))),
			$elm$parser$Parser$backtrackable(
				$elm$parser$Parser$symbol(')')))));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$keywordSet = $elm$core$Set$fromList(
	_List_fromArray(
		['as', 'where', 'let', 'in', 'if', 'else', 'then', 'case', 'of', 'type', 'alias']));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isKeyword = function (str) {
	return A2($elm$core$Set$member, str, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$keywordSet);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$variable = $elm$parser$Parser$getChompedString(
	A2(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isVariableChar,
		$elm$parser$Parser$chompIf($elm$core$Char$isLower)));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$weirdText = $elm$parser$Parser$getChompedString(
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isVariableChar));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionBodyContent = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$map,
			function (b) {
				return _Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Number),
					b);
			},
			$elm$parser$Parser$getChompedString($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$number)),
			A2(
			$elm$parser$Parser$map,
			$elm$core$Basics$always(
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Capitalized),
					'()')),
			$elm$parser$Parser$symbol('()')),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$infixParser,
			A2(
			$elm$parser$Parser$map,
			function (b) {
				return _Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$BasicSymbol),
					b);
			},
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$basicSymbol),
			A2(
			$elm$parser$Parser$map,
			function (b) {
				return _Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$GroupSymbol),
					b);
			},
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$groupSymbol),
			A2(
			$elm$parser$Parser$map,
			function (b) {
				return _Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Capitalized),
					b);
			},
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$capitalized),
			A2(
			$elm$parser$Parser$map,
			function (n) {
				return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isKeyword(n) ? _Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Keyword),
					n) : _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, n);
			},
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$variable),
			A2(
			$elm$parser$Parser$map,
			function (b) {
				return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
			},
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$weirdText)
		]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$String = {$: 'String'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$elmEscapable = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _List_fromArray(
			[
				_Utils_Tuple2(
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Capitalized),
				b)
			]);
	},
	$elm$parser$Parser$getChompedString($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$escapable));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$stringDelimiter = {
	defaultMap: function (b) {
		return _Utils_Tuple2(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$String),
			b);
	},
	end: '\"',
	innerParsers: _List_fromArray(
		[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$lineBreakList, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$elmEscapable]),
	isNestable: false,
	isNotRelevant: function (c) {
		return !($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isLineBreak(c) || $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isEscapable(c));
	},
	start: '\"'
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$doubleQuote = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimited($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$stringDelimiter);
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$quote = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimited(
	_Utils_update(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$stringDelimiter,
		{end: '\'', start: '\''}));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$tripleDoubleQuote = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimited(
	_Utils_update(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$stringDelimiter,
		{end: '\"\"\"', start: '\"\"\"'}));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$stringLiteral = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$tripleDoubleQuote, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$doubleQuote, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$quote]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$lineBreak = A2(
	$elm$parser$Parser$map,
	function (_v0) {
		return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$LineBreak, '\n');
	},
	$elm$parser$Parser$symbol('\n'));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$space = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
	},
	$elm$parser$Parser$getChompedString(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isSpace)));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$checkContext = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStep(revTokens),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStep = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$space),
				A2(
				$elm$parser$Parser$andThen,
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$checkContext,
				A2(
					$elm$parser$Parser$map,
					function (n) {
						return A2($elm$core$List$cons, n, revTokens);
					},
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$lineBreak)),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						_Utils_ap(n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$comment)
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionBody = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				function (ns) {
					return $elm$parser$Parser$Loop(
						_Utils_ap(ns, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$stringLiteral),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionBodyContent),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$TypeSignature = {$: 'TypeSignature'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$fnSigIsNotRelevant = function (c) {
	return !($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isWhitespace(c) || (_Utils_eq(
		c,
		_Utils_chr('(')) || (_Utils_eq(
		c,
		_Utils_chr(')')) || (_Utils_eq(
		c,
		_Utils_chr('-')) || _Utils_eq(
		c,
		_Utils_chr(','))))));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$fnSigContentHelp = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$map,
			$elm$core$Basics$always(
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$TypeSignature),
					'()')),
			$elm$parser$Parser$symbol('()')),
			A2(
			$elm$parser$Parser$map,
			$elm$core$Basics$always(
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$BasicSymbol),
					'->')),
			$elm$parser$Parser$symbol('->')),
			A2(
			$elm$parser$Parser$map,
			function (b) {
				return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
			},
			$elm$parser$Parser$getChompedString(
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile(
					function (c) {
						return _Utils_eq(
							c,
							_Utils_chr('(')) || (_Utils_eq(
							c,
							_Utils_chr(')')) || (_Utils_eq(
							c,
							_Utils_chr('-')) || _Utils_eq(
							c,
							_Utils_chr(','))));
					}))),
			A2(
			$elm$parser$Parser$map,
			function (b) {
				return _Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$TypeSignature),
					b);
			},
			$elm$parser$Parser$getChompedString(
				A2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$fnSigIsNotRelevant,
					$elm$parser$Parser$chompIf($elm$core$Char$isUpper)))),
			A2(
			$elm$parser$Parser$map,
			function (b) {
				return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
			},
			$elm$parser$Parser$getChompedString(
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$fnSigIsNotRelevant)))
		]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$fnSigContent = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$fnSigContentHelp),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionSignature = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Done,
				A2(
					$elm$parser$Parser$andThen,
					function (ns) {
						return A2($elm$parser$Parser$loop, ns, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$fnSigContent);
					},
					A2(
						$elm$parser$Parser$map,
						$elm$core$Basics$always(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$BasicSymbol),
									':'),
								revTokens)),
						$elm$parser$Parser$symbol(':')))),
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Done,
				A2($elm$parser$Parser$loop, revTokens, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionBody)),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isCommentChar = function (c) {
	return _Utils_eq(
		c,
		_Utils_chr('-')) || _Utils_eq(
		c,
		_Utils_chr('{'));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$commentChar = $elm$parser$Parser$getChompedString(
	$elm$parser$Parser$chompIf($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isCommentChar));
var $elm$parser$Parser$ExpectingKeyword = function (a) {
	return {$: 'ExpectingKeyword', a: a};
};
var $elm$parser$Parser$Advanced$keyword = function (_v0) {
	var kwd = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(kwd);
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v1 = A5($elm$parser$Parser$Advanced$isSubString, kwd, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.a;
			var newRow = _v1.b;
			var newCol = _v1.c;
			return (_Utils_eq(newOffset, -1) || (0 <= A3(
				$elm$parser$Parser$Advanced$isSubChar,
				function (c) {
					return $elm$core$Char$isAlphaNum(c) || _Utils_eq(
						c,
						_Utils_chr('_'));
				},
				newOffset,
				s.src))) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
				$elm$parser$Parser$Advanced$Good,
				progress,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src});
		});
};
var $elm$parser$Parser$keyword = function (kwd) {
	return $elm$parser$Parser$Advanced$keyword(
		A2(
			$elm$parser$Parser$Advanced$Token,
			kwd,
			$elm$parser$Parser$ExpectingKeyword(kwd)));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$modDecIsNotRelevant = function (c) {
	return !($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isWhitespace(c) || ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isCommentChar(c) || _Utils_eq(
		c,
		_Utils_chr('('))));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$mdpIsNotRelevant = function (c) {
	return !($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isWhitespace(c) || ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isCommentChar(c) || (_Utils_eq(
		c,
		_Utils_chr('(')) || (_Utils_eq(
		c,
		_Utils_chr(')')) || (_Utils_eq(
		c,
		_Utils_chr(',')) || _Utils_eq(
		c,
		_Utils_chr('.')))))));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$mdpnIsSpecialChar = function (c) {
	return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isLineBreak(c) || ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isCommentChar(c) || (_Utils_eq(
		c,
		_Utils_chr('(')) || _Utils_eq(
		c,
		_Utils_chr(')'))));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$checkContextNested = function (_v1) {
	var nestLevel = _v1.a;
	var revTokens = _v1.b;
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStepNested(
				_Utils_Tuple2(nestLevel, revTokens)),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStepNested = function (_v0) {
	var nestLevel = _v0.a;
	var revTokens = _v0.b;
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						_Utils_Tuple2(
							nestLevel,
							A2($elm$core$List$cons, n, revTokens)));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$space),
				A2(
				$elm$parser$Parser$andThen,
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$checkContextNested,
				A2(
					$elm$parser$Parser$map,
					function (n) {
						return _Utils_Tuple2(
							nestLevel,
							A2($elm$core$List$cons, n, revTokens));
					},
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$lineBreak)),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						_Utils_Tuple2(
							nestLevel,
							_Utils_ap(n, revTokens)));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$comment)
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$modDecParNest = function (_v0) {
	var nestLevel = _v0.a;
	var revTokens = _v0.b;
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStepNested(
				_Utils_Tuple2(nestLevel, revTokens)),
				A2(
				$elm$parser$Parser$map,
				function (ns) {
					return $elm$parser$Parser$Loop(
						_Utils_Tuple2(nestLevel + 1, ns));
				},
				A2(
					$elm$parser$Parser$map,
					$elm$core$Basics$always(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, '('),
							revTokens)),
					$elm$parser$Parser$symbol('('))),
				A2(
				$elm$parser$Parser$map,
				function (ns) {
					return (!nestLevel) ? $elm$parser$Parser$Done(ns) : $elm$parser$Parser$Loop(
						_Utils_Tuple2(nestLevel - 1, ns));
				},
				A2(
					$elm$parser$Parser$map,
					$elm$core$Basics$always(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, ')'),
							revTokens)),
					$elm$parser$Parser$symbol(')'))),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						_Utils_Tuple2(
							nestLevel,
							A2($elm$core$List$cons, n, revTokens)));
				},
				$elm$parser$Parser$oneOf(
					_List_fromArray(
						[
							A2(
							$elm$parser$Parser$map,
							function (b) {
								return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
							},
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$commentChar),
							A2(
							$elm$parser$Parser$map,
							function (s) {
								return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, s);
							},
							$elm$parser$Parser$getChompedString(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile(
									A2($elm$core$Basics$composeL, $elm$core$Basics$not, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$mdpnIsSpecialChar))))
						]))),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$modDecParentheses = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Done,
				A2(
					$elm$parser$Parser$map,
					$elm$core$Basics$always(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, ')'),
							revTokens)),
					$elm$parser$Parser$symbol(')'))),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				$elm$parser$Parser$oneOf(
					_List_fromArray(
						[
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$infixParser,
							A2(
							$elm$parser$Parser$map,
							function (b) {
								return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
							},
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$commentChar),
							A2(
							$elm$parser$Parser$map,
							function (b) {
								return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
							},
							$elm$parser$Parser$getChompedString(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile(
									function (c) {
										return _Utils_eq(
											c,
											_Utils_chr(',')) || _Utils_eq(
											c,
											_Utils_chr('.'));
									}))),
							A2(
							$elm$parser$Parser$map,
							function (b) {
								return _Utils_Tuple2(
									$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$TypeSignature),
									b);
							},
							$elm$parser$Parser$getChompedString(
								A2(
									$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
									$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$mdpIsNotRelevant,
									$elm$parser$Parser$chompIf($elm$core$Char$isUpper)))),
							A2(
							$elm$parser$Parser$map,
							function (b) {
								return _Utils_Tuple2(
									$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Function),
									b);
							},
							$elm$parser$Parser$getChompedString(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$mdpIsNotRelevant)))
						]))),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Loop,
				A2(
					$elm$parser$Parser$andThen,
					function (n) {
						return A2(
							$elm$parser$Parser$loop,
							_Utils_Tuple2(0, n),
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$modDecParNest);
					},
					A2(
						$elm$parser$Parser$map,
						$elm$core$Basics$always(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, '('),
								revTokens)),
						$elm$parser$Parser$symbol('(')))),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$moduleDeclaration = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Loop,
				A2(
					$elm$parser$Parser$andThen,
					function (n) {
						return A2($elm$parser$Parser$loop, n, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$modDecParentheses);
					},
					A2(
						$elm$parser$Parser$map,
						$elm$core$Basics$always(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, '('),
								revTokens)),
						$elm$parser$Parser$symbol('(')))),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				$elm$parser$Parser$oneOf(
					_List_fromArray(
						[
							A2(
							$elm$parser$Parser$map,
							function (b) {
								return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
							},
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$commentChar),
							A2(
							$elm$parser$Parser$map,
							$elm$core$Basics$always(
								_Utils_Tuple2(
									$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Keyword),
									'exposing')),
							$elm$parser$Parser$keyword('exposing')),
							A2(
							$elm$parser$Parser$map,
							$elm$core$Basics$always(
								_Utils_Tuple2(
									$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Keyword),
									'as')),
							$elm$parser$Parser$keyword('as')),
							A2(
							$elm$parser$Parser$map,
							function (b) {
								return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
							},
							$elm$parser$Parser$getChompedString(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$modDecIsNotRelevant)))
						]))),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$portDeclarationHelp = F2(
	function (revTokens, str) {
		return (str === 'module') ? A2(
			$elm$parser$Parser$loop,
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Keyword),
					str),
				revTokens),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$moduleDeclaration) : A2(
			$elm$parser$Parser$loop,
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Function),
					str),
				revTokens),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionSignature);
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$portDeclaration = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Done,
				A2(
					$elm$parser$Parser$andThen,
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$portDeclarationHelp(revTokens),
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$variable)),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Done,
				A2($elm$parser$Parser$loop, revTokens, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionBody)),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$lineStartVariable = F2(
	function (revTokens, n) {
		return ((n === 'module') || (n === 'import')) ? A2(
			$elm$parser$Parser$loop,
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Keyword),
					n),
				revTokens),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$moduleDeclaration) : ((n === 'port') ? A2(
			$elm$parser$Parser$loop,
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Keyword),
					n),
				revTokens),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$portDeclaration) : ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$isKeyword(n) ? A2(
			$elm$parser$Parser$loop,
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Keyword),
					n),
				revTokens),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionBody) : A2(
			$elm$parser$Parser$loop,
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$Function),
					n),
				revTokens),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionSignature)));
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$mainLoop = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$space),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$lineBreak),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						_Utils_ap(n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$comment),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Loop,
				A2(
					$elm$parser$Parser$andThen,
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$lineStartVariable(revTokens),
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$variable)),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Loop,
				A2(
					$elm$parser$Parser$andThen,
					function (s) {
						return A2(
							$elm$parser$Parser$loop,
							_Utils_ap(s, revTokens),
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionBody);
					},
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$stringLiteral)),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Loop,
				A2(
					$elm$parser$Parser$andThen,
					function (s) {
						return A2(
							$elm$parser$Parser$loop,
							A2($elm$core$List$cons, s, revTokens),
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionBody);
					},
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$functionBodyContent)),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$toRevTokens = A2($elm$parser$Parser$loop, _List_Nil, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$mainLoop);
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$toLines = A2(
	$elm$core$Basics$composeR,
	$elm$parser$Parser$run($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$toRevTokens),
	$elm$core$Result$map(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$toLines($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$syntaxToStyle)));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$elm = A2(
	$elm$core$Basics$composeR,
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Elm$toLines,
	$elm$core$Result$map($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$HCode));
var $elm$html$Html$em = _VirtualDom_node('em');
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$h4 = _VirtualDom_node('h4');
var $elm$html$Html$h5 = _VirtualDom_node('h5');
var $elm$html$Html$h6 = _VirtualDom_node('h6');
var $elm$html$Html$img = _VirtualDom_node('img');
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$syntaxToStyle = function (syntax) {
	switch (syntax.$) {
		case 'Number':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style1, 'js-n');
		case 'String':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style2, 'js-s');
		case 'Keyword':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'js-k');
		case 'DeclarationKeyword':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style4, 'js-dk');
		case 'FunctionEval':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style4, 'js-fe');
		case 'Function':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style5, 'js-f');
		case 'LiteralKeyword':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style6, 'js-lk');
		case 'Param':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style7, 'js-p');
		default:
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style5, 'js-ce');
	}
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$groupSet = $elm$core$Set$fromList(
	_List_fromArray(
		[
			_Utils_chr('{'),
			_Utils_chr('}'),
			_Utils_chr('('),
			_Utils_chr(')'),
			_Utils_chr('['),
			_Utils_chr(']'),
			_Utils_chr(','),
			_Utils_chr(';')
		]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isGroupChar = function (c) {
	return A2($elm$core$Set$member, c, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$groupSet);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$groupChar = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
	},
	$elm$parser$Parser$getChompedString(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isGroupChar)));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isCommentChar = function (c) {
	return _Utils_eq(
		c,
		_Utils_chr('/'));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$operatorSet = $elm$core$Set$fromList(
	_List_fromArray(
		[
			_Utils_chr('+'),
			_Utils_chr('-'),
			_Utils_chr('*'),
			_Utils_chr('/'),
			_Utils_chr('='),
			_Utils_chr('!'),
			_Utils_chr('<'),
			_Utils_chr('>'),
			_Utils_chr('&'),
			_Utils_chr('|'),
			_Utils_chr('?'),
			_Utils_chr('^'),
			_Utils_chr(':'),
			_Utils_chr('~'),
			_Utils_chr('%'),
			_Utils_chr('.')
		]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$punctuactorSet = A2($elm$core$Set$union, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$operatorSet, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$groupSet);
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isPunctuaction = function (c) {
	return A2($elm$core$Set$member, c, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$punctuactorSet);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isStringLiteralChar = function (c) {
	return _Utils_eq(
		c,
		_Utils_chr('\"')) || (_Utils_eq(
		c,
		_Utils_chr('\'')) || _Utils_eq(
		c,
		_Utils_chr('`')));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isIdentifierNameChar = function (c) {
	return !($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isPunctuaction(c) || ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isStringLiteralChar(c) || ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isCommentChar(c) || $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isWhitespace(c))));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$DeclarationKeyword = {$: 'DeclarationKeyword'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$Function = {$: 'Function'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$Keyword = {$: 'Keyword'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$LiteralKeyword = {$: 'LiteralKeyword'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$Param = {$: 'Param'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$ClassExtends = {$: 'ClassExtends'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$inlineComment = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _List_fromArray(
			[
				_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Comment, b)
			]);
	},
	$elm$parser$Parser$getChompedString(
		A2(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$thenChompWhile,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isLineBreak),
			$elm$parser$Parser$symbol('//'))));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$lineBreakList = A2(
	$elm$parser$Parser$map,
	function (_v0) {
		return _List_fromArray(
			[
				_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$LineBreak, '\n')
			]);
	},
	$elm$parser$Parser$symbol('\n'));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$multilineComment = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimited(
	{
		defaultMap: function (b) {
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Comment, b);
		},
		end: '*/',
		innerParsers: _List_fromArray(
			[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$lineBreakList]),
		isNestable: false,
		isNotRelevant: function (c) {
			return !$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isLineBreak(c);
		},
		start: '/*'
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$comment = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$inlineComment, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$multilineComment]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$whitespaceOrCommentStep = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$map,
				function (b) {
					return $elm$parser$Parser$Loop(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b),
							revTokens));
				},
				$elm$parser$Parser$getChompedString(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isSpace))),
				A2(
				$elm$parser$Parser$map,
				function (ns) {
					return $elm$parser$Parser$Loop(
						_Utils_ap(ns, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$lineBreakList),
				A2(
				$elm$parser$Parser$map,
				function (ns) {
					return $elm$parser$Parser$Loop(
						_Utils_ap(ns, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$comment)
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$classExtendsLoop = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				function (b) {
					return $elm$parser$Parser$Loop(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$ClassExtends),
								b),
							revTokens));
				},
				$elm$parser$Parser$getChompedString(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isIdentifierNameChar))),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$classDeclarationLoop = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$andThen,
				function (n) {
					return (n === 'extends') ? A2(
						$elm$parser$Parser$map,
						$elm$parser$Parser$Loop,
						A2(
							$elm$parser$Parser$loop,
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$Keyword),
									n),
								revTokens),
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$classExtendsLoop)) : $elm$parser$Parser$succeed(
						$elm$parser$Parser$Loop(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$Function),
									n),
								revTokens)));
				},
				$elm$parser$Parser$getChompedString(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isIdentifierNameChar))),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$argLoop = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				function (b) {
					return $elm$parser$Parser$Loop(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$Param),
								b),
							revTokens));
				},
				$elm$parser$Parser$getChompedString(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile(
						function (c) {
							return !($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isCommentChar(c) || ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isWhitespace(c) || (_Utils_eq(
								c,
								_Utils_chr(',')) || _Utils_eq(
								c,
								_Utils_chr(')')))));
						}))),
				A2(
				$elm$parser$Parser$map,
				function (b) {
					return $elm$parser$Parser$Loop(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b),
							revTokens));
				},
				$elm$parser$Parser$getChompedString(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile(
						function (c) {
							return _Utils_eq(
								c,
								_Utils_chr('/')) || _Utils_eq(
								c,
								_Utils_chr(','));
						}))),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$functionDeclarationLoop = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				function (b) {
					return $elm$parser$Parser$Loop(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$Function),
								b),
							revTokens));
				},
				$elm$parser$Parser$getChompedString(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isIdentifierNameChar))),
				A2(
				$elm$parser$Parser$map,
				function (_v0) {
					return $elm$parser$Parser$Loop(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$Keyword),
								'*'),
							revTokens));
				},
				$elm$parser$Parser$symbol('*')),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Loop,
				A2(
					$elm$parser$Parser$andThen,
					function (_v1) {
						return A2(
							$elm$parser$Parser$loop,
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, '('),
								revTokens),
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$argLoop);
					},
					$elm$parser$Parser$symbol('('))),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$FunctionEval = {$: 'FunctionEval'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$functionEvalLoop = F3(
	function (identifier, revTokens, thisRevToken) {
		return $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$whitespaceOrCommentStep(thisRevToken),
					A2(
					$elm$parser$Parser$map,
					function (_v0) {
						return $elm$parser$Parser$Done(
							_Utils_ap(
								A2(
									$elm$core$List$cons,
									_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, '('),
									thisRevToken),
								A2(
									$elm$core$List$cons,
									_Utils_Tuple2(
										$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$FunctionEval),
										identifier),
									revTokens)));
					},
					$elm$parser$Parser$symbol('(')),
					$elm$parser$Parser$succeed(
					$elm$parser$Parser$Done(
						_Utils_ap(
							thisRevToken,
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, identifier),
								revTokens))))
				]));
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$declarationKeywordSet = $elm$core$Set$fromList(
	_List_fromArray(
		['var', 'const', 'let']));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isDeclarationKeyword = function (str) {
	return A2($elm$core$Set$member, str, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$declarationKeywordSet);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$keywordSet = $elm$core$Set$fromList(
	_List_fromArray(
		['break', 'do', 'instanceof', 'typeof', 'case', 'else', 'new', 'catch', 'finally', 'return', 'void', 'continue', 'for', 'switch', 'while', 'debugger', 'this', 'with', 'default', 'if', 'throw', 'delete', 'in', 'try', 'enum', 'extends', 'export', 'import', 'implements', 'private', 'public', 'yield', 'interface', 'package', 'protected']));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isKeyword = function (str) {
	return A2($elm$core$Set$member, str, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$keywordSet);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$literalKeywordSet = $elm$core$Set$fromList(
	_List_fromArray(
		['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isLiteralKeyword = function (str) {
	return A2($elm$core$Set$member, str, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$literalKeywordSet);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$keywordParser = F2(
	function (revTokens, n) {
		return ((n === 'function') || (n === 'static')) ? A2(
			$elm$parser$Parser$loop,
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$DeclarationKeyword),
					n),
				revTokens),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$functionDeclarationLoop) : ((n === 'class') ? A2(
			$elm$parser$Parser$loop,
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$DeclarationKeyword),
					n),
				revTokens),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$classDeclarationLoop) : (((n === 'this') || (n === 'super')) ? $elm$parser$Parser$succeed(
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$Param),
					n),
				revTokens)) : ((n === 'constructor') ? A2(
			$elm$parser$Parser$loop,
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$Function),
					n),
				revTokens),
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$functionDeclarationLoop) : ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isKeyword(n) ? $elm$parser$Parser$succeed(
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$Keyword),
					n),
				revTokens)) : ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isDeclarationKeyword(n) ? $elm$parser$Parser$succeed(
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$DeclarationKeyword),
					n),
				revTokens)) : ($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isLiteralKeyword(n) ? $elm$parser$Parser$succeed(
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$LiteralKeyword),
					n),
				revTokens)) : A2(
			$elm$parser$Parser$loop,
			_List_Nil,
			A2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$functionEvalLoop, n, revTokens))))))));
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$Number = {$: 'Number'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$number = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _Utils_Tuple2(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$Number),
			b);
	},
	$elm$parser$Parser$getChompedString($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$number));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isOperatorChar = function (c) {
	return A2($elm$core$Set$member, c, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$operatorSet);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$operatorChar = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _Utils_Tuple2(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$Keyword),
			b);
	},
	$elm$parser$Parser$getChompedString(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isOperatorChar)));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$String = {$: 'String'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$jsEscapable = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _List_fromArray(
			[
				_Utils_Tuple2(
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$LiteralKeyword),
				b)
			]);
	},
	$elm$parser$Parser$getChompedString($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$escapable));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$quoteDelimiter = {
	defaultMap: function (b) {
		return _Utils_Tuple2(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$String),
			b);
	},
	end: '\'',
	innerParsers: _List_fromArray(
		[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$lineBreakList, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$jsEscapable]),
	isNestable: false,
	isNotRelevant: function (c) {
		return !($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isLineBreak(c) || $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isEscapable(c));
	},
	start: '\''
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$doubleQuote = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimited(
	_Utils_update(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$quoteDelimiter,
		{end: '\"', start: '\"'}));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$quote = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimited($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$quoteDelimiter);
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$templateString = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimited(
	_Utils_update(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$quoteDelimiter,
		{
			end: '`',
			innerParsers: _List_fromArray(
				[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$lineBreakList, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$jsEscapable]),
			isNotRelevant: function (c) {
				return !($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isLineBreak(c) || $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isEscapable(c));
			},
			start: '`'
		}));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$stringLiteral = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$quote, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$doubleQuote, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$templateString]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$mainLoop = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$whitespaceOrCommentStep(revTokens),
				A2(
				$elm$parser$Parser$map,
				function (s) {
					return $elm$parser$Parser$Loop(
						_Utils_ap(s, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$stringLiteral),
				A2(
				$elm$parser$Parser$map,
				function (s) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, s, revTokens));
				},
				$elm$parser$Parser$oneOf(
					_List_fromArray(
						[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$operatorChar, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$groupChar, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$number]))),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Loop,
				A2(
					$elm$parser$Parser$andThen,
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$keywordParser(revTokens),
					$elm$parser$Parser$getChompedString(
						$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$isIdentifierNameChar)))),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$toRevTokens = A2($elm$parser$Parser$loop, _List_Nil, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$mainLoop);
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$toLines = A2(
	$elm$core$Basics$composeR,
	$elm$parser$Parser$run($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$toRevTokens),
	$elm$core$Result$map(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$toLines($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$syntaxToStyle)));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$javascript = A2(
	$elm$core$Basics$composeR,
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Javascript$toLines,
	$elm$core$Result$map($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$HCode));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$syntaxToStyle = function (syntax) {
	switch (syntax.$) {
		case 'String':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style2, 'json-s');
		case 'Escapable':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style1, 'json-e');
		case 'Number':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style1, 'json-n');
		case 'Boolean':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'json-b');
		case 'Null':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style3, 'json-null');
		case 'ObjectKey':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Style4, 'json-k');
		case 'Object':
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Default, 'json-o');
		default:
			return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Default, 'json-a');
	}
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$Array = {$: 'Array'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$Boolean = {$: 'Boolean'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$Null = {$: 'Null'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$Object = {$: 'Object'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$ObjectKey = {$: 'ObjectKey'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$String = {$: 'String'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$Number = {$: 'Number'};
var $elm$parser$Parser$ExpectingFloat = {$: 'ExpectingFloat'};
var $elm$parser$Parser$Advanced$consumeBase = _Parser_consumeBase;
var $elm$parser$Parser$Advanced$consumeBase16 = _Parser_consumeBase16;
var $elm$parser$Parser$Advanced$bumpOffset = F2(
	function (newOffset, s) {
		return {col: s.col + (newOffset - s.offset), context: s.context, indent: s.indent, offset: newOffset, row: s.row, src: s.src};
	});
var $elm$parser$Parser$Advanced$chompBase10 = _Parser_chompBase10;
var $elm$parser$Parser$Advanced$isAsciiCode = _Parser_isAsciiCode;
var $elm$parser$Parser$Advanced$consumeExp = F2(
	function (offset, src) {
		if (A3($elm$parser$Parser$Advanced$isAsciiCode, 101, offset, src) || A3($elm$parser$Parser$Advanced$isAsciiCode, 69, offset, src)) {
			var eOffset = offset + 1;
			var expOffset = (A3($elm$parser$Parser$Advanced$isAsciiCode, 43, eOffset, src) || A3($elm$parser$Parser$Advanced$isAsciiCode, 45, eOffset, src)) ? (eOffset + 1) : eOffset;
			var newOffset = A2($elm$parser$Parser$Advanced$chompBase10, expOffset, src);
			return _Utils_eq(expOffset, newOffset) ? (-newOffset) : newOffset;
		} else {
			return offset;
		}
	});
var $elm$parser$Parser$Advanced$consumeDotAndExp = F2(
	function (offset, src) {
		return A3($elm$parser$Parser$Advanced$isAsciiCode, 46, offset, src) ? A2(
			$elm$parser$Parser$Advanced$consumeExp,
			A2($elm$parser$Parser$Advanced$chompBase10, offset + 1, src),
			src) : A2($elm$parser$Parser$Advanced$consumeExp, offset, src);
	});
var $elm$parser$Parser$Advanced$finalizeInt = F5(
	function (invalid, handler, startOffset, _v0, s) {
		var endOffset = _v0.a;
		var n = _v0.b;
		if (handler.$ === 'Err') {
			var x = handler.a;
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				true,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		} else {
			var toValue = handler.a;
			return _Utils_eq(startOffset, endOffset) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				_Utils_cmp(s.offset, startOffset) < 0,
				A2($elm$parser$Parser$Advanced$fromState, s, invalid)) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				toValue(n),
				A2($elm$parser$Parser$Advanced$bumpOffset, endOffset, s));
		}
	});
var $elm$parser$Parser$Advanced$fromInfo = F4(
	function (row, col, x, context) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, row, col, x, context));
	});
var $elm$parser$Parser$Advanced$finalizeFloat = F6(
	function (invalid, expecting, intSettings, floatSettings, intPair, s) {
		var intOffset = intPair.a;
		var floatOffset = A2($elm$parser$Parser$Advanced$consumeDotAndExp, intOffset, s.src);
		if (floatOffset < 0) {
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				true,
				A4($elm$parser$Parser$Advanced$fromInfo, s.row, s.col - (floatOffset + s.offset), invalid, s.context));
		} else {
			if (_Utils_eq(s.offset, floatOffset)) {
				return A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, expecting));
			} else {
				if (_Utils_eq(intOffset, floatOffset)) {
					return A5($elm$parser$Parser$Advanced$finalizeInt, invalid, intSettings, s.offset, intPair, s);
				} else {
					if (floatSettings.$ === 'Err') {
						var x = floatSettings.a;
						return A2(
							$elm$parser$Parser$Advanced$Bad,
							true,
							A2($elm$parser$Parser$Advanced$fromState, s, invalid));
					} else {
						var toValue = floatSettings.a;
						var _v1 = $elm$core$String$toFloat(
							A3($elm$core$String$slice, s.offset, floatOffset, s.src));
						if (_v1.$ === 'Nothing') {
							return A2(
								$elm$parser$Parser$Advanced$Bad,
								true,
								A2($elm$parser$Parser$Advanced$fromState, s, invalid));
						} else {
							var n = _v1.a;
							return A3(
								$elm$parser$Parser$Advanced$Good,
								true,
								toValue(n),
								A2($elm$parser$Parser$Advanced$bumpOffset, floatOffset, s));
						}
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$number = function (c) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			if (A3($elm$parser$Parser$Advanced$isAsciiCode, 48, s.offset, s.src)) {
				var zeroOffset = s.offset + 1;
				var baseOffset = zeroOffset + 1;
				return A3($elm$parser$Parser$Advanced$isAsciiCode, 120, zeroOffset, s.src) ? A5(
					$elm$parser$Parser$Advanced$finalizeInt,
					c.invalid,
					c.hex,
					baseOffset,
					A2($elm$parser$Parser$Advanced$consumeBase16, baseOffset, s.src),
					s) : (A3($elm$parser$Parser$Advanced$isAsciiCode, 111, zeroOffset, s.src) ? A5(
					$elm$parser$Parser$Advanced$finalizeInt,
					c.invalid,
					c.octal,
					baseOffset,
					A3($elm$parser$Parser$Advanced$consumeBase, 8, baseOffset, s.src),
					s) : (A3($elm$parser$Parser$Advanced$isAsciiCode, 98, zeroOffset, s.src) ? A5(
					$elm$parser$Parser$Advanced$finalizeInt,
					c.invalid,
					c.binary,
					baseOffset,
					A3($elm$parser$Parser$Advanced$consumeBase, 2, baseOffset, s.src),
					s) : A6(
					$elm$parser$Parser$Advanced$finalizeFloat,
					c.invalid,
					c.expecting,
					c._int,
					c._float,
					_Utils_Tuple2(zeroOffset, 0),
					s)));
			} else {
				return A6(
					$elm$parser$Parser$Advanced$finalizeFloat,
					c.invalid,
					c.expecting,
					c._int,
					c._float,
					A3($elm$parser$Parser$Advanced$consumeBase, 10, s.offset, s.src),
					s);
			}
		});
};
var $elm$parser$Parser$Advanced$float = F2(
	function (expecting, invalid) {
		return $elm$parser$Parser$Advanced$number(
			{
				binary: $elm$core$Result$Err(invalid),
				expecting: expecting,
				_float: $elm$core$Result$Ok($elm$core$Basics$identity),
				hex: $elm$core$Result$Err(invalid),
				_int: $elm$core$Result$Ok($elm$core$Basics$toFloat),
				invalid: invalid,
				octal: $elm$core$Result$Err(invalid)
			});
	});
var $elm$parser$Parser$float = A2($elm$parser$Parser$Advanced$float, $elm$parser$Parser$ExpectingFloat, $elm$parser$Parser$ExpectingFloat);
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$positiveNumberExponentialNotation = A2(
	$elm$parser$Parser$ignorer,
	$elm$parser$Parser$succeed(_Utils_Tuple0),
	$elm$parser$Parser$backtrackable($elm$parser$Parser$float));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$negativeNumberExponentialNotation = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(_Utils_Tuple0),
		$elm$parser$Parser$backtrackable(
			$elm$parser$Parser$symbol('-'))),
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$positiveNumberExponentialNotation);
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$numberExponentialNotation = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$positiveNumberExponentialNotation, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$negativeNumberExponentialNotation, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$number]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$number = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _Utils_Tuple2(
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$Number),
			b);
	},
	$elm$parser$Parser$getChompedString($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$numberExponentialNotation));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$lineBreak = A2(
	$elm$parser$Parser$map,
	function (_v0) {
		return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$LineBreak, '\n');
	},
	$elm$parser$Parser$symbol('\n'));
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$Escapable = {$: 'Escapable'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$escapableSet = $elm$core$Set$fromList(
	_List_fromArray(
		[
			_Utils_chr('\"'),
			_Utils_chr('\\'),
			_Utils_chr('/'),
			_Utils_chr('b'),
			_Utils_chr('f'),
			_Utils_chr('n'),
			_Utils_chr('r'),
			_Utils_chr('t'),
			_Utils_chr('u')
		]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$isEscapableChar = function (c) {
	return A2($elm$core$Set$member, c, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$escapableSet);
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$escapable = A2(
	$elm$parser$Parser$ignorer,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed(_Utils_Tuple0),
		$elm$parser$Parser$backtrackable(
			$elm$parser$Parser$symbol('\\'))),
	$elm$parser$Parser$chompIf($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$isEscapableChar));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$stringEscapable = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _List_fromArray(
			[
				_Utils_Tuple2(
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$Escapable),
				b)
			]);
	},
	$elm$parser$Parser$getChompedString($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$escapable));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$doubleQuoteDelimiter = function (syntax_) {
	return {
		defaultMap: function (b) {
			return _Utils_Tuple2(
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C(syntax_),
				b);
		},
		end: '\"',
		innerParsers: _List_fromArray(
			[
				A2($elm$parser$Parser$map, $elm$core$List$singleton, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$lineBreak),
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$stringEscapable
			]),
		isNestable: false,
		isNotRelevant: function (c) {
			return !($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isLineBreak(c) || $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isEscapable(c));
		},
		start: '\"'
	};
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$stringLiteral = F2(
	function (syntax_, revTokens) {
		return A2(
			$elm$parser$Parser$map,
			function (n) {
				return _Utils_ap(n, revTokens);
			},
			$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$delimited(
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$doubleQuoteDelimiter(syntax_)));
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$space = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
	},
	$elm$parser$Parser$getChompedString(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isSpace)));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$whitespace = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$space, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$lineBreak]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$arrayLoop = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$whitespace),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				A2(
					$elm$parser$Parser$map,
					function (_v4) {
						return _Utils_Tuple2(
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$Array),
							',');
					},
					$elm$parser$Parser$symbol(','))),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Done(
						A2($elm$core$List$cons, n, revTokens));
				},
				A2(
					$elm$parser$Parser$map,
					function (_v5) {
						return _Utils_Tuple2(
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$Array),
							']');
					},
					$elm$parser$Parser$symbol(']'))),
				A2(
				$elm$parser$Parser$map,
				function (ns) {
					return $elm$parser$Parser$Loop(
						_Utils_ap(ns, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$cyclic$value()),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$objectLoop = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$whitespace),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Loop,
				A2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$stringLiteral, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$ObjectKey, revTokens)),
				A2(
				$elm$parser$Parser$map,
				$elm$parser$Parser$Loop,
				A2(
					$elm$parser$Parser$andThen,
					function (_v0) {
						var revTokens_ = A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$Object),
								':'),
							revTokens);
						return A2(
							$elm$parser$Parser$map,
							function (ns) {
								return _Utils_ap(ns, revTokens_);
							},
							$elm$parser$Parser$oneOf(
								_List_fromArray(
									[
										A2(
										$elm$parser$Parser$andThen,
										function (ws) {
											return $elm$parser$Parser$oneOf(
												_List_fromArray(
													[
														A2(
														$elm$parser$Parser$map,
														function (v) {
															return _Utils_ap(
																v,
																_List_fromArray(
																	[ws]));
														},
														$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$cyclic$value()),
														$elm$parser$Parser$succeed(
														_List_fromArray(
															[ws]))
													]));
										},
										$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$whitespace),
										$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$cyclic$value(),
										$elm$parser$Parser$succeed(_List_Nil)
									])));
					},
					$elm$parser$Parser$symbol(':'))),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				A2(
					$elm$parser$Parser$map,
					function (_v1) {
						return _Utils_Tuple2(
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$Object),
							',');
					},
					$elm$parser$Parser$symbol(','))),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Done(
						A2($elm$core$List$cons, n, revTokens));
				},
				A2(
					$elm$parser$Parser$map,
					function (_v2) {
						return _Utils_Tuple2(
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$Object),
							'}');
					},
					$elm$parser$Parser$symbol('}'))),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
function $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$cyclic$value() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$stringLiteral, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$String, _List_Nil),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return _List_fromArray(
						[n]);
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$number),
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$cyclic$object(),
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$cyclic$array(),
				A2(
				$elm$parser$Parser$map,
				function (s) {
					return _List_fromArray(
						[
							_Utils_Tuple2(
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$Null),
							s)
						]);
				},
				$elm$parser$Parser$getChompedString(
					$elm$parser$Parser$keyword('null'))),
				A2(
				$elm$parser$Parser$map,
				function (s) {
					return _List_fromArray(
						[
							_Utils_Tuple2(
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$Boolean),
							s)
						]);
				},
				$elm$parser$Parser$getChompedString(
					$elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								$elm$parser$Parser$keyword('true'),
								$elm$parser$Parser$keyword('false')
							]))))
			]));
}
function $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$cyclic$array() {
	return A2(
		$elm$parser$Parser$andThen,
		function (_v6) {
			return A2(
				$elm$parser$Parser$loop,
				_List_fromArray(
					[
						_Utils_Tuple2(
						$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$Array),
						'[')
					]),
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$arrayLoop);
		},
		$elm$parser$Parser$symbol('['));
}
function $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$cyclic$object() {
	return A2(
		$elm$parser$Parser$andThen,
		function (_v3) {
			return A2(
				$elm$parser$Parser$loop,
				_List_fromArray(
					[
						_Utils_Tuple2(
						$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$C($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$Object),
						'{')
					]),
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$objectLoop);
		},
		$elm$parser$Parser$symbol('{'));
}
try {
	var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$value = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$cyclic$value();
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$cyclic$value = function () {
		return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$value;
	};
	var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$array = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$cyclic$array();
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$cyclic$array = function () {
		return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$array;
	};
	var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$object = $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$cyclic$object();
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$cyclic$object = function () {
		return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$object;
	};
} catch ($) {
	throw 'Some top-level definitions from `SyntaxHighlight.Language.Json` are causing infinite recursion:\n\n  ┌─────┐\n  │    value\n  │     ↓\n  │    array\n  │     ↓\n  │    arrayLoop\n  │     ↓\n  │    object\n  │     ↓\n  │    objectLoop\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$mainLoop = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$whitespace),
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						_Utils_ap(n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$object),
				A2(
				$elm$parser$Parser$map,
				function (b) {
					return $elm$parser$Parser$Loop(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b),
							revTokens));
				},
				$elm$parser$Parser$getChompedString(
					$elm$parser$Parser$chompIf(
						$elm$core$Basics$always(true)))),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$toRevTokens = A2($elm$parser$Parser$loop, _List_Nil, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$mainLoop);
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$toLines = A2(
	$elm$core$Basics$composeR,
	$elm$parser$Parser$run($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$toRevTokens),
	$elm$core$Result$map(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$toLines($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$syntaxToStyle)));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$json = A2(
	$elm$core$Basics$composeR,
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Json$toLines,
	$elm$core$Result$map($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$HCode));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$NoLang$syntaxToStyle = function (syntax) {
	return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Default, 'nolang');
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$NoLang$lineBreak = A2(
	$elm$parser$Parser$map,
	function (_v0) {
		return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$LineBreak, '\n');
	},
	$elm$parser$Parser$symbol('\n'));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$NoLang$space = A2(
	$elm$parser$Parser$map,
	function (b) {
		return _Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b);
	},
	$elm$parser$Parser$getChompedString(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$chompIfThenWhile($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Helpers$isSpace)));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$NoLang$whitespace = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$NoLang$space, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$NoLang$lineBreak]));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$NoLang$mainLoop = function (revTokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$map,
				function (n) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, n, revTokens));
				},
				$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$NoLang$whitespace),
				A2(
				$elm$parser$Parser$map,
				function (b) {
					return $elm$parser$Parser$Loop(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$Type$Normal, b),
							revTokens));
				},
				$elm$parser$Parser$getChompedString(
					$elm$parser$Parser$chompIf(
						$elm$core$Basics$always(true)))),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(revTokens))
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$NoLang$toRevTokens = A2($elm$parser$Parser$loop, _List_Nil, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$NoLang$mainLoop);
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$NoLang$toLines = A2(
	$elm$core$Basics$composeR,
	$elm$parser$Parser$run($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$NoLang$toRevTokens),
	$elm$core$Result$map(
		$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Helpers$toLines($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$NoLang$syntaxToStyle)));
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$noLang = A2(
	$elm$core$Basics$composeR,
	$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Language$NoLang$toLines,
	$elm$core$Result$map($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$HCode));
var $elm$html$Html$ol = _VirtualDom_node('ol');
var $dillonkearns$elm_markdown$Markdown$HtmlRenderer$HtmlRenderer = function (a) {
	return {$: 'HtmlRenderer', a: a};
};
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (result.$ === 'Ok') {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $dillonkearns$elm_markdown$Markdown$Html$resultOr = F2(
	function (ra, rb) {
		if (ra.$ === 'Err') {
			var singleError = ra.a;
			if (rb.$ === 'Ok') {
				var okValue = rb.a;
				return $elm$core$Result$Ok(okValue);
			} else {
				var errorsSoFar = rb.a;
				return $elm$core$Result$Err(
					A2($elm$core$List$cons, singleError, errorsSoFar));
			}
		} else {
			var okValue = ra.a;
			return $elm$core$Result$Ok(okValue);
		}
	});
var $dillonkearns$elm_markdown$Markdown$Html$attributesToString = function (attributes) {
	return A2(
		$elm$core$String$join,
		' ',
		A2(
			$elm$core$List$map,
			function (_v0) {
				var name = _v0.name;
				var value = _v0.value;
				return name + ('=\"' + (value + '\"'));
			},
			attributes));
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $dillonkearns$elm_markdown$Markdown$Html$tagToString = F2(
	function (tagName, attributes) {
		return $elm$core$List$isEmpty(attributes) ? ('<' + (tagName + '>')) : ('<' + (tagName + (' ' + ($dillonkearns$elm_markdown$Markdown$Html$attributesToString(attributes) + '>'))));
	});
var $dillonkearns$elm_markdown$Markdown$Html$oneOf = function (decoders) {
	var unwrappedDecoders = A2(
		$elm$core$List$map,
		function (_v1) {
			var rawDecoder = _v1.a;
			return rawDecoder;
		},
		decoders);
	return function (rawDecoder) {
		return $dillonkearns$elm_markdown$Markdown$HtmlRenderer$HtmlRenderer(
			F3(
				function (tagName, attributes, innerBlocks) {
					return A2(
						$elm$core$Result$mapError,
						function (errors) {
							if (!errors.b) {
								return 'Ran into a oneOf with no possibilities!';
							} else {
								if (!errors.b.b) {
									var singleError = errors.a;
									return 'Problem with the given value:\n\n' + (A2($dillonkearns$elm_markdown$Markdown$Html$tagToString, tagName, attributes) + ('\n\n' + (singleError + '\n')));
								} else {
									return 'oneOf failed parsing this value:\n    ' + (A2($dillonkearns$elm_markdown$Markdown$Html$tagToString, tagName, attributes) + ('\n\nParsing failed in the following 2 ways:\n\n\n' + (A2(
										$elm$core$String$join,
										'\n\n',
										A2(
											$elm$core$List$indexedMap,
											F2(
												function (index, error) {
													return '(' + ($elm$core$String$fromInt(index + 1) + (') ' + error));
												}),
											errors)) + '\n')));
								}
							}
						},
						A3(rawDecoder, tagName, attributes, innerBlocks));
				}));
	}(
		A3(
			$elm$core$List$foldl,
			F2(
				function (decoder, soFar) {
					return F3(
						function (tagName, attributes, children) {
							return A2(
								$dillonkearns$elm_markdown$Markdown$Html$resultOr,
								A3(decoder, tagName, attributes, children),
								A3(soFar, tagName, attributes, children));
						});
				}),
			F3(
				function (tagName, attributes, children) {
					return $elm$core$Result$Err(_List_Nil);
				}),
			unwrappedDecoders));
};
var $elm$html$Html$pre = _VirtualDom_node('pre');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$html$Html$Attributes$start = function (n) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'start',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$strong = _VirtualDom_node('strong');
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$tbody = _VirtualDom_node('tbody');
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$th = _VirtualDom_node('th');
var $elm$html$Html$thead = _VirtualDom_node('thead');
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Add = {$: 'Add'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Del = {$: 'Del'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Normal = {$: 'Normal'};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$requiredStyleToString = function (required) {
	return 'elmsh' + function () {
		switch (required.$) {
			case 'Default':
				return '0';
			case 'Comment':
				return '-comm';
			case 'Style1':
				return '1';
			case 'Style2':
				return '2';
			case 'Style3':
				return '3';
			case 'Style4':
				return '4';
			case 'Style5':
				return '5';
			case 'Style6':
				return '6';
			default:
				return '7';
		}
	}();
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$fragmentView = function (_v0) {
	var text = _v0.text;
	var requiredStyle = _v0.requiredStyle;
	var additionalClass = _v0.additionalClass;
	return (_Utils_eq(requiredStyle, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Default) && $elm$core$String$isEmpty(additionalClass)) ? $elm$html$Html$text(text) : A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2(
						$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$requiredStyleToString(requiredStyle),
						!_Utils_eq(requiredStyle, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Style$Default)),
						_Utils_Tuple2('elmsh-' + additionalClass, additionalClass !== '')
					]))
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(text)
			]));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$lineView = F3(
	function (start, index, _v0) {
		var fragments = _v0.fragments;
		var highlight = _v0.highlight;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('elmsh-line', true),
							_Utils_Tuple2(
							'elmsh-hl',
							_Utils_eq(
								highlight,
								$elm$core$Maybe$Just($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Normal))),
							_Utils_Tuple2(
							'elmsh-add',
							_Utils_eq(
								highlight,
								$elm$core$Maybe$Just($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Add))),
							_Utils_Tuple2(
							'elmsh-del',
							_Utils_eq(
								highlight,
								$elm$core$Maybe$Just($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Del)))
						])),
					A2(
					$elm$html$Html$Attributes$attribute,
					'data-elmsh-lc',
					$elm$core$String$fromInt(start + index))
				]),
			A2($elm$core$List$map, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$fragmentView, fragments));
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$toInlineHtml = function (lines) {
	return A2(
		$elm$html$Html$code,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('elmsh')
			]),
		$elm$core$List$concat(
			A2(
				$elm$core$List$map,
				function (_v0) {
					var highlight = _v0.highlight;
					var fragments = _v0.fragments;
					return _Utils_eq(highlight, $elm$core$Maybe$Nothing) ? A2($elm$core$List$map, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$fragmentView, fragments) : _List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'elmsh-hl',
											_Utils_eq(
												highlight,
												$elm$core$Maybe$Just($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Normal))),
											_Utils_Tuple2(
											'elmsh-add',
											_Utils_eq(
												highlight,
												$elm$core$Maybe$Just($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Add))),
											_Utils_Tuple2(
											'elmsh-del',
											_Utils_eq(
												highlight,
												$elm$core$Maybe$Just($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$Line$Del)))
										]))
								]),
							A2($elm$core$List$map, $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$fragmentView, fragments))
						]);
				},
				lines)));
};
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$toBlockHtml = F2(
	function (maybeStart, lines) {
		if (maybeStart.$ === 'Nothing') {
			return A2(
				$elm$html$Html$pre,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elmsh')
					]),
				_List_fromArray(
					[
						$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$toInlineHtml(lines)
					]));
		} else {
			var start = maybeStart.a;
			return A2(
				$elm$html$Html$pre,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elmsh')
					]),
				$elm$core$List$singleton(
					A2(
						$elm$html$Html$code,
						_List_Nil,
						A2(
							$elm$core$List$indexedMap,
							$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$lineView(start),
							lines))));
		}
	});
var $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$toBlockHtml = F2(
	function (maybeStart, _v0) {
		var lines = _v0.a;
		return A2($pablohirafuji$elm_syntax_highlight$SyntaxHighlight$View$toBlockHtml, maybeStart, lines);
	});
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $dtwrks$elm_book$ElmBook$UI$Markdown$defaultRenderer = {
	blockQuote: function (children) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('elm-book-md elm-book-serif')
				]),
			_List_fromArray(
				[
					A2($elm$html$Html$blockquote, _List_Nil, children)
				]));
	},
	codeBlock: function (_v0) {
		var body = _v0.body;
		var language = _v0.language;
		var hCode = function () {
			var _v1 = A2($elm$core$Maybe$withDefault, 'elm', language);
			switch (_v1) {
				case 'elm':
					return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$elm(body);
				case 'js':
					return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$javascript(body);
				case 'json':
					return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$json(body);
				case 'css':
					return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$css(body);
				default:
					return $pablohirafuji$elm_syntax_highlight$SyntaxHighlight$noLang(body);
			}
		}();
		return A2(
			$elm$core$Result$withDefault,
			A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elm-book-md')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$pre,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('elm-book-md__code-default elm-book-monospace elm-book-shadows-light')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(body)
							]))
					])),
			A2(
				$elm$core$Result$map,
				function (content) {
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('elm-book-md')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('elm-book-md__code elm-book-monospace elm-book-shadows-light')
									]),
								_List_fromArray(
									[content]))
							]));
				},
				A2(
					$elm$core$Result$map,
					$pablohirafuji$elm_syntax_highlight$SyntaxHighlight$toBlockHtml($elm$core$Maybe$Nothing),
					hCode)));
	},
	codeSpan: function (children) {
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('elm-book-md')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$code,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('elm-book-monospace')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(children)
						]))
				]));
	},
	emphasis: $elm$html$Html$em(_List_Nil),
	hardLineBreak: A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('elm-book-md')
			]),
		_List_fromArray(
			[
				A2($elm$html$Html$br, _List_Nil, _List_Nil)
			])),
	heading: function (_v2) {
		var level = _v2.level;
		var children = _v2.children;
		var tag = function () {
			switch (level.$) {
				case 'H1':
					return $elm$html$Html$h1(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('elm-book-serif')
							]));
				case 'H2':
					return $elm$html$Html$h2(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('elm-book-serif')
							]));
				case 'H3':
					return $elm$html$Html$h3(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('elm-book-serif')
							]));
				case 'H4':
					return $elm$html$Html$h4(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('elm-book-sans')
							]));
				case 'H5':
					return $elm$html$Html$h5(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('elm-book-sans')
							]));
				default:
					return $elm$html$Html$h6(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('elm-book-sans')
							]));
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('elm-book-md')
				]),
			_List_fromArray(
				[
					tag(children)
				]));
	},
	html: $dillonkearns$elm_markdown$Markdown$Html$oneOf(_List_Nil),
	image: function (image) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('elm-book-md')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$img,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$src(image.src),
							$elm$html$Html$Attributes$alt(image.alt),
							$elm$html$Html$Attributes$title(
							A2($elm$core$Maybe$withDefault, '', image.title))
						]),
					_List_Nil)
				]));
	},
	link: F2(
		function (link, children) {
			return A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href(link.destination),
						$elm$html$Html$Attributes$title(
						A2($elm$core$Maybe$withDefault, '', link.title))
					]),
				children);
		}),
	orderedList: F2(
		function (startingIndex, items) {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elm-book-md elm-book-serif elm-book-md__default')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$ol,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$start(startingIndex)
							]),
						A2(
							$elm$core$List$map,
							$elm$html$Html$li(_List_Nil),
							items))
					]));
		}),
	paragraph: function (children) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('elm-book-md elm-book-serif elm-book-md__default')
				]),
			_List_fromArray(
				[
					A2($elm$html$Html$p, _List_Nil, children)
				]));
	},
	strikethrough: $elm$html$Html$span(_List_Nil),
	strong: $elm$html$Html$strong(_List_Nil),
	table: function (children) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('elm-book-md elm-book-md__default elm-book-sans')
				]),
			_List_fromArray(
				[
					A2($elm$html$Html$table, _List_Nil, children)
				]));
	},
	tableBody: $elm$html$Html$tbody(_List_Nil),
	tableCell: F2(
		function (_v4, children_) {
			return A2($elm$html$Html$td, _List_Nil, children_);
		}),
	tableHeader: $elm$html$Html$thead(_List_Nil),
	tableHeaderCell: function (maybeAlignment) {
		var attrs = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				$elm$core$List$singleton,
				A2(
					$elm$core$Maybe$map,
					$elm$html$Html$Attributes$align,
					A2(
						$elm$core$Maybe$map,
						function (alignment) {
							switch (alignment.$) {
								case 'AlignLeft':
									return 'left';
								case 'AlignCenter':
									return 'center';
								default:
									return 'right';
							}
						},
						maybeAlignment))));
		return $elm$html$Html$th(attrs);
	},
	tableRow: $elm$html$Html$tr(_List_Nil),
	text: $elm$html$Html$text,
	thematicBreak: A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('elm-book-md')
			]),
		_List_fromArray(
			[
				A2($elm$html$Html$hr, _List_Nil, _List_Nil)
			])),
	unorderedList: function (items) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('elm-book-md elm-book-serif elm-book-md__default')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$ul,
					_List_Nil,
					A2(
						$elm$core$List$map,
						function (item) {
							var task = item.a;
							var children = item.b;
							var checkbox = function () {
								switch (task.$) {
									case 'NoTask':
										return $elm$html$Html$text('');
									case 'IncompleteTask':
										return A2(
											$elm$html$Html$input,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$disabled(true),
													$elm$html$Html$Attributes$checked(false),
													$elm$html$Html$Attributes$type_('checkbox')
												]),
											_List_Nil);
									default:
										return A2(
											$elm$html$Html$input,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$disabled(true),
													$elm$html$Html$Attributes$checked(true),
													$elm$html$Html$Attributes$type_('checkbox')
												]),
											_List_Nil);
								}
							}();
							return A2(
								$elm$html$Html$li,
								_List_Nil,
								A2($elm$core$List$cons, checkbox, children));
						},
						items))
				]));
	}
};
var $dtwrks$elm_book$ElmBook$Internal$ComponentOptions$parseBool = function (v) {
	if ((v.$ === 'Just') && (v.a === 'true')) {
		return $elm$core$Maybe$Just(true);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $dtwrks$elm_book$ElmBook$Internal$ComponentOptions$Block = {$: 'Block'};
var $dtwrks$elm_book$ElmBook$Internal$ComponentOptions$parseDisplay = function (displayString) {
	_v0$3:
	while (true) {
		if (displayString.$ === 'Just') {
			switch (displayString.a) {
				case 'block':
					return $elm$core$Maybe$Just($dtwrks$elm_book$ElmBook$Internal$ComponentOptions$Block);
				case 'inline':
					return $elm$core$Maybe$Just($dtwrks$elm_book$ElmBook$Internal$ComponentOptions$Inline);
				case 'card':
					return $elm$core$Maybe$Just($dtwrks$elm_book$ElmBook$Internal$ComponentOptions$Card);
				default:
					break _v0$3;
			}
		} else {
			break _v0$3;
		}
	}
	return $elm$core$Maybe$Nothing;
};
var $dtwrks$elm_book$ElmBook$Internal$ComponentOptions$markdownOptions = F2(
	function (validOptions, options) {
		return A2(
			$dtwrks$elm_book$ElmBook$Internal$ComponentOptions$toValidOptions,
			validOptions,
			$dtwrks$elm_book$ElmBook$Internal$ComponentOptions$ComponentOptions(
				{
					background: options.background,
					display: $dtwrks$elm_book$ElmBook$Internal$ComponentOptions$parseDisplay(options.display),
					fullWidth: $dtwrks$elm_book$ElmBook$Internal$ComponentOptions$parseBool(options.fullWidth),
					hiddenLabel: $dtwrks$elm_book$ElmBook$Internal$ComponentOptions$parseBool(options.hiddenLabel)
				}));
	});
var $dillonkearns$elm_markdown$Markdown$Html$tag = F2(
	function (expectedTag, a) {
		return $dillonkearns$elm_markdown$Markdown$HtmlRenderer$HtmlRenderer(
			F3(
				function (tagName, attributes, children) {
					return _Utils_eq(tagName, expectedTag) ? $elm$core$Result$Ok(a) : $elm$core$Result$Err('Expected ' + (expectedTag + (' but was ' + tagName)));
				}));
	});
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $dtwrks$elm_book$ElmBook$UI$ChapterComponent$viewLabel = F2(
	function (options_, label) {
		var _v0 = _Utils_Tuple3(label, options_.hiddenLabel, options_.display);
		if (_v0.a === '') {
			return $elm$html$Html$text('');
		} else {
			if (_v0.b) {
				return $elm$html$Html$text('');
			} else {
				if (_v0.c.$ === 'Inline') {
					var _v1 = _v0.c;
					return $elm$html$Html$text('');
				} else {
					return A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('elm-book elm-book__chapter-component__title elm-book-sans')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(label)
							]));
				}
			}
		}
	});
var $dtwrks$elm_book$ElmBook$UI$ChapterComponent$viewBlock = F2(
	function (options_, _v0) {
		var label = _v0.a;
		var html = _v0.b;
		return A2(
			$elm$html$Html$article,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('elm-book__chapter-component')
				]),
			_List_fromArray(
				[
					A2($dtwrks$elm_book$ElmBook$UI$ChapterComponent$viewLabel, options_, label),
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[html]))
				]));
	});
var $dtwrks$elm_book$ElmBook$UI$ChapterComponent$viewCard = F2(
	function (options_, _v0) {
		var label = _v0.a;
		var html = _v0.b;
		return A2(
			$elm$html$Html$article,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('elm-book__chapter-component')
				]),
			_List_fromArray(
				[
					A2($dtwrks$elm_book$ElmBook$UI$ChapterComponent$viewLabel, options_, label),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('elm-book__chapter-component__background elm-book-shadows-light'),
							A2($elm$html$Html$Attributes$style, 'background', options_.background)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('elm-book__chapter-component__content')
								]),
							_List_fromArray(
								[html]))
						]))
				]));
	});
var $dtwrks$elm_book$ElmBook$UI$ChapterComponent$viewDisplay = F2(
	function (options_, _v0) {
		var label = _v0.a;
		var html = _v0.b;
		var _v1 = options_.display;
		switch (_v1.$) {
			case 'Inline':
				return html;
			case 'Block':
				return A2(
					$dtwrks$elm_book$ElmBook$UI$ChapterComponent$viewBlock,
					options_,
					_Utils_Tuple2(label, html));
			default:
				return A2(
					$dtwrks$elm_book$ElmBook$UI$ChapterComponent$viewCard,
					options_,
					_Utils_Tuple2(label, html));
		}
	});
var $dtwrks$elm_book$ElmBook$UI$ChapterComponent$view = F3(
	function (chapterTitle, options_, _v0) {
		var label = _v0.a;
		var html = _v0.b;
		return A2(
			$elm$html$Html$map,
			function (msg) {
				var actionContext = (label !== '') ? (chapterTitle + (' / ' + (label + ' / '))) : (chapterTitle + ' / ');
				if (msg.$ === 'LogAction') {
					var label_ = msg.b;
					return A2($dtwrks$elm_book$ElmBook$Internal$Msg$LogAction, actionContext, label_);
				} else {
					return msg;
				}
			},
			A2(
				$dtwrks$elm_book$ElmBook$UI$ChapterComponent$viewDisplay,
				options_,
				_Utils_Tuple2(label, html)));
	});
var $dillonkearns$elm_markdown$List$Helpers$find = F2(
	function (predicate, list) {
		find:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var first = list.a;
				var rest = list.b;
				if (predicate(first)) {
					return $elm$core$Maybe$Just(first);
				} else {
					var $temp$predicate = predicate,
						$temp$list = rest;
					predicate = $temp$predicate;
					list = $temp$list;
					continue find;
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$Html$withOptionalAttribute = F2(
	function (attributeName, _v0) {
		var renderer = _v0.a;
		return $dillonkearns$elm_markdown$Markdown$HtmlRenderer$HtmlRenderer(
			F3(
				function (tagName, attributes, innerBlocks) {
					return function () {
						var _v1 = A2(
							$dillonkearns$elm_markdown$List$Helpers$find,
							function (_v2) {
								var name = _v2.name;
								var value = _v2.value;
								return _Utils_eq(name, attributeName);
							},
							attributes);
						if (_v1.$ === 'Just') {
							var value = _v1.a.value;
							return $elm$core$Result$map(
								$elm$core$Basics$apR(
									$elm$core$Maybe$Just(value)));
						} else {
							return $elm$core$Result$map(
								$elm$core$Basics$apR($elm$core$Maybe$Nothing));
						}
					}()(
						A3(renderer, tagName, attributes, innerBlocks));
				}));
	});
var $dtwrks$elm_book$ElmBook$UI$Markdown$componentRenderer = F3(
	function (chapterTitle, chapterComponents, componentOptions) {
		return _Utils_update(
			$dtwrks$elm_book$ElmBook$UI$Markdown$defaultRenderer,
			{
				html: $dillonkearns$elm_markdown$Markdown$Html$oneOf(
					_List_fromArray(
						[
							A2(
							$dillonkearns$elm_markdown$Markdown$Html$withOptionalAttribute,
							'with-full-width',
							A2(
								$dillonkearns$elm_markdown$Markdown$Html$withOptionalAttribute,
								'with-display',
								A2(
									$dillonkearns$elm_markdown$Markdown$Html$withOptionalAttribute,
									'with-background',
									A2(
										$dillonkearns$elm_markdown$Markdown$Html$withOptionalAttribute,
										'with-hidden-label',
										A2(
											$dillonkearns$elm_markdown$Markdown$Html$withOptionalAttribute,
											'with-label',
											A2(
												$dillonkearns$elm_markdown$Markdown$Html$tag,
												'component',
												F6(
													function (labelFilter, hiddenLabel_, background_, display_, fullWidth_, _v0) {
														var section_ = function () {
															if (labelFilter.$ === 'Just') {
																var label_ = labelFilter.a;
																return A2(
																	$elm$core$Maybe$map,
																	function (v) {
																		return _Utils_Tuple2(label_, v);
																	},
																	A2(
																		$elm$core$Dict$get,
																		label_,
																		$elm$core$Dict$fromList(chapterComponents)));
															} else {
																return $elm$core$List$head(chapterComponents);
															}
														}();
														var options_ = A2(
															$dtwrks$elm_book$ElmBook$Internal$ComponentOptions$markdownOptions,
															componentOptions,
															{background: background_, display: display_, fullWidth: fullWidth_, hiddenLabel: hiddenLabel_});
														return A2(
															$elm$core$Maybe$withDefault,
															A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('elm-book__component-wrapper')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$div,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$class('elm-book-sans elm-book__component-empty')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text(
																				'Oops!… \"' + (A2($elm$core$Maybe$withDefault, '', labelFilter) + '\" component not found.'))
																			]))
																	])),
															A2(
																$elm$core$Maybe$map,
																function (c) {
																	return _Utils_eq(options_.display, $dtwrks$elm_book$ElmBook$Internal$ComponentOptions$Inline) ? c : A2(
																		$elm$html$Html$div,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$classList(
																				_List_fromArray(
																					[
																						_Utils_Tuple2('elm-book__component-wrapper', true),
																						_Utils_Tuple2('full', options_.fullWidth)
																					]))
																			]),
																		_List_fromArray(
																			[c]));
																},
																A2(
																	$elm$core$Maybe$map,
																	A2($dtwrks$elm_book$ElmBook$UI$ChapterComponent$view, chapterTitle, options_),
																	section_)));
													}))))))),
							A2(
							$dillonkearns$elm_markdown$Markdown$Html$withOptionalAttribute,
							'with-full-width',
							A2(
								$dillonkearns$elm_markdown$Markdown$Html$withOptionalAttribute,
								'with-display',
								A2(
									$dillonkearns$elm_markdown$Markdown$Html$withOptionalAttribute,
									'with-background',
									A2(
										$dillonkearns$elm_markdown$Markdown$Html$withOptionalAttribute,
										'with-hidden-label',
										A2(
											$dillonkearns$elm_markdown$Markdown$Html$withOptionalAttribute,
											'with-label',
											A2(
												$dillonkearns$elm_markdown$Markdown$Html$tag,
												'component-list',
												F6(
													function (labelFilter, hiddenLabel_, background_, display_, fullWidth_, _v2) {
														var options_ = A2(
															$dtwrks$elm_book$ElmBook$Internal$ComponentOptions$markdownOptions,
															componentOptions,
															{background: background_, display: display_, fullWidth: fullWidth_, hiddenLabel: hiddenLabel_});
														var components = function () {
															if (labelFilter.$ === 'Just') {
																var s = labelFilter.a;
																return A2(
																	$elm$core$List$filter,
																	A2(
																		$elm$core$Basics$composeR,
																		$elm$core$Tuple$first,
																		$elm$core$String$startsWith(s)),
																	chapterComponents);
															} else {
																return chapterComponents;
															}
														}();
														return A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$classList(
																	_List_fromArray(
																		[
																			_Utils_Tuple2('elm-book__component-wrapper', true),
																			_Utils_Tuple2('full', options_.fullWidth)
																		]))
																]),
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$ul,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('elm-book-md__component-list')
																		]),
																	A2(
																		$elm$core$List$map,
																		function (section) {
																			return A2(
																				$elm$html$Html$li,
																				_List_fromArray(
																					[
																						$elm$html$Html$Attributes$class('elm-book elm-book-md__component-list__item')
																					]),
																				_List_fromArray(
																					[
																						A3($dtwrks$elm_book$ElmBook$UI$ChapterComponent$view, chapterTitle, options_, section)
																					]));
																		},
																		components))
																]));
													})))))))
						]))
			});
	});
var $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine = {$: 'BlankLine'};
var $dillonkearns$elm_markdown$Markdown$Block$BlockQuote = function (a) {
	return {$: 'BlockQuote', a: a};
};
var $dillonkearns$elm_markdown$Markdown$RawBlock$BlockQuote = function (a) {
	return {$: 'BlockQuote', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$Cdata = function (a) {
	return {$: 'Cdata', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$CodeBlock = function (a) {
	return {$: 'CodeBlock', a: a};
};
var $dillonkearns$elm_markdown$Markdown$RawBlock$CodeBlock = function (a) {
	return {$: 'CodeBlock', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$CodeSpan = function (a) {
	return {$: 'CodeSpan', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$CompletedTask = {$: 'CompletedTask'};
var $dillonkearns$elm_markdown$Markdown$Block$Emphasis = function (a) {
	return {$: 'Emphasis', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Inline$Emphasis = F2(
	function (a, b) {
		return {$: 'Emphasis', a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$Parser$EmptyBlock = {$: 'EmptyBlock'};
var $dillonkearns$elm_markdown$Markdown$Block$HardLineBreak = {$: 'HardLineBreak'};
var $dillonkearns$elm_markdown$Markdown$Block$Heading = F2(
	function (a, b) {
		return {$: 'Heading', a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$RawBlock$Heading = F2(
	function (a, b) {
		return {$: 'Heading', a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$RawBlock$Html = function (a) {
	return {$: 'Html', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$HtmlBlock = function (a) {
	return {$: 'HtmlBlock', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$HtmlComment = function (a) {
	return {$: 'HtmlComment', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$HtmlDeclaration = F2(
	function (a, b) {
		return {$: 'HtmlDeclaration', a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$Block$HtmlElement = F3(
	function (a, b, c) {
		return {$: 'HtmlElement', a: a, b: b, c: c};
	});
var $dillonkearns$elm_markdown$Markdown$Block$HtmlInline = function (a) {
	return {$: 'HtmlInline', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$Image = F3(
	function (a, b, c) {
		return {$: 'Image', a: a, b: b, c: c};
	});
var $dillonkearns$elm_markdown$Markdown$Block$IncompleteTask = {$: 'IncompleteTask'};
var $dillonkearns$elm_markdown$Markdown$RawBlock$IndentedCodeBlock = function (a) {
	return {$: 'IndentedCodeBlock', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Parser$InlineProblem = function (a) {
	return {$: 'InlineProblem', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$Link = F3(
	function (a, b, c) {
		return {$: 'Link', a: a, b: b, c: c};
	});
var $dillonkearns$elm_markdown$Markdown$Block$ListItem = F2(
	function (a, b) {
		return {$: 'ListItem', a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$Block$NoTask = {$: 'NoTask'};
var $dillonkearns$elm_markdown$Markdown$RawBlock$OpenBlockOrParagraph = function (a) {
	return {$: 'OpenBlockOrParagraph', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$OrderedList = F3(
	function (a, b, c) {
		return {$: 'OrderedList', a: a, b: b, c: c};
	});
var $dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock = F6(
	function (a, b, c, d, e, f) {
		return {$: 'OrderedListBlock', a: a, b: b, c: c, d: d, e: e, f: f};
	});
var $dillonkearns$elm_markdown$Markdown$Block$Paragraph = function (a) {
	return {$: 'Paragraph', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock = function (a) {
	return {$: 'ParsedBlock', a: a};
};
var $dillonkearns$elm_markdown$Markdown$RawBlock$ParsedBlockQuote = function (a) {
	return {$: 'ParsedBlockQuote', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$ProcessingInstruction = function (a) {
	return {$: 'ProcessingInstruction', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$Strikethrough = function (a) {
	return {$: 'Strikethrough', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$Strong = function (a) {
	return {$: 'Strong', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$Table = F2(
	function (a, b) {
		return {$: 'Table', a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$RawBlock$Table = function (a) {
	return {$: 'Table', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Table$Table = F2(
	function (a, b) {
		return {$: 'Table', a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$Table$TableDelimiterRow = F2(
	function (a, b) {
		return {$: 'TableDelimiterRow', a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$Block$Text = function (a) {
	return {$: 'Text', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Block$ThematicBreak = {$: 'ThematicBreak'};
var $dillonkearns$elm_markdown$Markdown$RawBlock$ThematicBreak = {$: 'ThematicBreak'};
var $dillonkearns$elm_markdown$Markdown$Block$UnorderedList = F2(
	function (a, b) {
		return {$: 'UnorderedList', a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock = F4(
	function (a, b, c, d) {
		return {$: 'UnorderedListBlock', a: a, b: b, c: c, d: d};
	});
var $dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines = function (a) {
	return {$: 'UnparsedInlines', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Parser$addReference = F2(
	function (state, linkRef) {
		return {
			linkReferenceDefinitions: A2($elm$core$List$cons, linkRef, state.linkReferenceDefinitions),
			rawBlocks: state.rawBlocks
		};
	});
var $dillonkearns$elm_markdown$Whitespace$isSpaceOrTab = function (_char) {
	switch (_char.valueOf()) {
		case ' ':
			return true;
		case '\t':
			return true;
		default:
			return false;
	}
};
var $dillonkearns$elm_markdown$Parser$Token$carriageReturn = A2(
	$elm$parser$Parser$Advanced$Token,
	'\r',
	$elm$parser$Parser$Expecting('a carriage return'));
var $dillonkearns$elm_markdown$Parser$Token$newline = A2(
	$elm$parser$Parser$Advanced$Token,
	'\n',
	$elm$parser$Parser$Expecting('a newline'));
var $dillonkearns$elm_markdown$Whitespace$lineEnd = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			$elm$parser$Parser$Advanced$token($dillonkearns$elm_markdown$Parser$Token$newline),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$token($dillonkearns$elm_markdown$Parser$Token$carriageReturn),
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						$elm$parser$Parser$Advanced$token($dillonkearns$elm_markdown$Parser$Token$newline),
						$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
					])))
		]));
var $dillonkearns$elm_markdown$Markdown$Parser$blankLine = A2(
	$elm$parser$Parser$Advanced$map,
	function (_v0) {
		return $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine;
	},
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$backtrackable(
			$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab)),
		$dillonkearns$elm_markdown$Whitespace$lineEnd));
var $dillonkearns$elm_markdown$Parser$Token$space = A2(
	$elm$parser$Parser$Advanced$Token,
	' ',
	$elm$parser$Parser$Expecting('a space'));
var $dillonkearns$elm_markdown$Markdown$Parser$blockQuoteStarts = _List_fromArray(
	[
		$elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			'>',
			$elm$parser$Parser$Expecting('>'))),
		A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$backtrackable(
			$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$space)),
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$Advanced$symbol(
					A2(
						$elm$parser$Parser$Advanced$Token,
						'>',
						$elm$parser$Parser$Expecting(' >'))),
					$elm$parser$Parser$Advanced$symbol(
					A2(
						$elm$parser$Parser$Advanced$Token,
						' >',
						$elm$parser$Parser$Expecting('  >'))),
					$elm$parser$Parser$Advanced$symbol(
					A2(
						$elm$parser$Parser$Advanced$Token,
						'  >',
						$elm$parser$Parser$Expecting('   >')))
				])))
	]);
var $dillonkearns$elm_markdown$Whitespace$isLineEnd = function (_char) {
	switch (_char.valueOf()) {
		case '\n':
			return true;
		case '\r':
			return true;
		default:
			return false;
	}
};
var $dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd = $elm$parser$Parser$Advanced$chompWhile(
	A2($elm$core$Basics$composeL, $elm$core$Basics$not, $dillonkearns$elm_markdown$Whitespace$isLineEnd));
var $dillonkearns$elm_markdown$Helpers$endOfFile = $elm$parser$Parser$Advanced$end(
	$elm$parser$Parser$Expecting('the end of the input'));
var $dillonkearns$elm_markdown$Helpers$lineEndOrEnd = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[$dillonkearns$elm_markdown$Whitespace$lineEnd, $dillonkearns$elm_markdown$Helpers$endOfFile]));
var $dillonkearns$elm_markdown$Markdown$Parser$blockQuote = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$RawBlock$BlockQuote),
			$elm$parser$Parser$Advanced$oneOf($dillonkearns$elm_markdown$Markdown$Parser$blockQuoteStarts)),
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$space),
					$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
				]))),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd),
		$dillonkearns$elm_markdown$Helpers$lineEndOrEnd));
var $dillonkearns$elm_markdown$Markdown$Parser$problemToString = function (problem) {
	switch (problem.$) {
		case 'Expecting':
			var string = problem.a;
			return 'Expecting ' + string;
		case 'ExpectingInt':
			return 'Expecting int';
		case 'ExpectingHex':
			return 'Expecting hex';
		case 'ExpectingOctal':
			return 'Expecting octal';
		case 'ExpectingBinary':
			return 'Expecting binary';
		case 'ExpectingFloat':
			return 'Expecting float';
		case 'ExpectingNumber':
			return 'Expecting number';
		case 'ExpectingVariable':
			return 'Expecting variable';
		case 'ExpectingSymbol':
			var string = problem.a;
			return 'Expecting symbol ' + string;
		case 'ExpectingKeyword':
			var string = problem.a;
			return 'Expecting keyword ' + string;
		case 'ExpectingEnd':
			return 'Expecting keyword end';
		case 'UnexpectedChar':
			return 'Unexpected char';
		case 'Problem':
			var problemDescription = problem.a;
			return problemDescription;
		default:
			return 'Bad repeat';
	}
};
var $dillonkearns$elm_markdown$Markdown$Parser$deadEndToString = function (deadEnd) {
	return 'Problem at row ' + ($elm$core$String$fromInt(deadEnd.row) + ('\n' + $dillonkearns$elm_markdown$Markdown$Parser$problemToString(deadEnd.problem)));
};
var $dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString = function (deadEnds) {
	return A2(
		$elm$core$String$join,
		'\n',
		A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$deadEndToString, deadEnds));
};
var $dillonkearns$elm_markdown$HtmlParser$Cdata = function (a) {
	return {$: 'Cdata', a: a};
};
var $dillonkearns$elm_markdown$HtmlParser$Element = F3(
	function (a, b, c) {
		return {$: 'Element', a: a, b: b, c: c};
	});
var $dillonkearns$elm_markdown$HtmlParser$Text = function (a) {
	return {$: 'Text', a: a};
};
var $dillonkearns$elm_markdown$HtmlParser$expectTagNameCharacter = $elm$parser$Parser$Expecting('at least 1 tag name character');
var $dillonkearns$elm_markdown$HtmlParser$tagNameCharacter = function (c) {
	switch (c.valueOf()) {
		case ' ':
			return false;
		case '\r':
			return false;
		case '\n':
			return false;
		case '\t':
			return false;
		case '/':
			return false;
		case '<':
			return false;
		case '>':
			return false;
		case '\"':
			return false;
		case '\'':
			return false;
		case '=':
			return false;
		default:
			return true;
	}
};
var $dillonkearns$elm_markdown$HtmlParser$tagName = A2(
	$elm$parser$Parser$Advanced$mapChompedString,
	F2(
		function (name, _v0) {
			return $elm$core$String$toLower(name);
		}),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2($elm$parser$Parser$Advanced$chompIf, $dillonkearns$elm_markdown$HtmlParser$tagNameCharacter, $dillonkearns$elm_markdown$HtmlParser$expectTagNameCharacter),
		$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$HtmlParser$tagNameCharacter)));
var $dillonkearns$elm_markdown$HtmlParser$attributeName = $dillonkearns$elm_markdown$HtmlParser$tagName;
var $dillonkearns$elm_markdown$HtmlParser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$token(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $dillonkearns$elm_markdown$HtmlParser$entities = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			'amp',
			_Utils_chr('&')),
			_Utils_Tuple2(
			'lt',
			_Utils_chr('<')),
			_Utils_Tuple2(
			'gt',
			_Utils_chr('>')),
			_Utils_Tuple2(
			'apos',
			_Utils_chr('\'')),
			_Utils_Tuple2(
			'quot',
			_Utils_chr('\"'))
		]));
var $elm$core$Char$fromCode = _Char_fromCode;
var $elm$core$Result$fromMaybe = F2(
	function (err, maybe) {
		if (maybe.$ === 'Just') {
			var v = maybe.a;
			return $elm$core$Result$Ok(v);
		} else {
			return $elm$core$Result$Err(err);
		}
	});
var $elm$core$Basics$pow = _Basics_pow;
var $rtfeldman$elm_hex$Hex$fromStringHelp = F3(
	function (position, chars, accumulated) {
		fromStringHelp:
		while (true) {
			if (!chars.b) {
				return $elm$core$Result$Ok(accumulated);
			} else {
				var _char = chars.a;
				var rest = chars.b;
				switch (_char.valueOf()) {
					case '0':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated;
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '1':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + A2($elm$core$Basics$pow, 16, position);
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '2':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (2 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '3':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (3 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '4':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (4 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '5':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (5 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '6':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (6 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '7':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (7 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '8':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (8 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '9':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (9 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'a':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (10 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'b':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (11 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'c':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (12 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'd':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (13 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'e':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (14 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'f':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (15 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					default:
						var nonHex = _char;
						return $elm$core$Result$Err(
							$elm$core$String$fromChar(nonHex) + ' is not a valid hexadecimal character.');
				}
			}
		}
	});
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $rtfeldman$elm_hex$Hex$fromString = function (str) {
	if ($elm$core$String$isEmpty(str)) {
		return $elm$core$Result$Err('Empty strings are not valid hexadecimal strings.');
	} else {
		var result = function () {
			if (A2($elm$core$String$startsWith, '-', str)) {
				var list = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					$elm$core$List$tail(
						$elm$core$String$toList(str)));
				return A2(
					$elm$core$Result$map,
					$elm$core$Basics$negate,
					A3(
						$rtfeldman$elm_hex$Hex$fromStringHelp,
						$elm$core$List$length(list) - 1,
						list,
						0));
			} else {
				return A3(
					$rtfeldman$elm_hex$Hex$fromStringHelp,
					$elm$core$String$length(str) - 1,
					$elm$core$String$toList(str),
					0);
			}
		}();
		var formatError = function (err) {
			return A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					['\"' + (str + '\"'), 'is not a valid hexadecimal string because', err]));
		};
		return A2($elm$core$Result$mapError, formatError, result);
	}
};
var $dillonkearns$elm_markdown$HtmlParser$decodeEscape = function (s) {
	return A2($elm$core$String$startsWith, '#x', s) ? A2(
		$elm$core$Result$mapError,
		$elm$parser$Parser$Problem,
		A2(
			$elm$core$Result$map,
			$elm$core$Char$fromCode,
			$rtfeldman$elm_hex$Hex$fromString(
				A2($elm$core$String$dropLeft, 2, s)))) : (A2($elm$core$String$startsWith, '#', s) ? A2(
		$elm$core$Result$fromMaybe,
		$elm$parser$Parser$Problem('Invalid escaped character: ' + s),
		A2(
			$elm$core$Maybe$map,
			$elm$core$Char$fromCode,
			$elm$core$String$toInt(
				A2($elm$core$String$dropLeft, 1, s)))) : A2(
		$elm$core$Result$fromMaybe,
		$elm$parser$Parser$Problem('No entity named \"&' + (s + ';\" found.')),
		A2($elm$core$Dict$get, s, $dillonkearns$elm_markdown$HtmlParser$entities)));
};
var $dillonkearns$elm_markdown$HtmlParser$escapedChar = function (end_) {
	var process = function (entityStr) {
		var _v0 = $dillonkearns$elm_markdown$HtmlParser$decodeEscape(entityStr);
		if (_v0.$ === 'Ok') {
			var c = _v0.a;
			return $elm$parser$Parser$Advanced$succeed(c);
		} else {
			var e = _v0.a;
			return $elm$parser$Parser$Advanced$problem(e);
		}
	};
	var isEntityChar = function (c) {
		return (!_Utils_eq(c, end_)) && (!_Utils_eq(
			c,
			_Utils_chr(';')));
	};
	return A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
			$dillonkearns$elm_markdown$HtmlParser$symbol('&')),
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$andThen,
				process,
				$elm$parser$Parser$Advanced$getChompedString(
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						A2(
							$elm$parser$Parser$Advanced$chompIf,
							isEntityChar,
							$elm$parser$Parser$Expecting('an entity character')),
						$elm$parser$Parser$Advanced$chompWhile(isEntityChar)))),
			$dillonkearns$elm_markdown$HtmlParser$symbol(';')));
};
var $dillonkearns$elm_markdown$HtmlParser$textStringStep = F3(
	function (closingChar, predicate, accum) {
		return A2(
			$elm$parser$Parser$Advanced$andThen,
			function (soFar) {
				return $elm$parser$Parser$Advanced$oneOf(
					_List_fromArray(
						[
							A2(
							$elm$parser$Parser$Advanced$map,
							function (escaped) {
								return $elm$parser$Parser$Advanced$Loop(
									_Utils_ap(
										accum,
										_Utils_ap(
											soFar,
											$elm$core$String$fromChar(escaped))));
							},
							$dillonkearns$elm_markdown$HtmlParser$escapedChar(closingChar)),
							$elm$parser$Parser$Advanced$succeed(
							$elm$parser$Parser$Advanced$Done(
								_Utils_ap(accum, soFar)))
						]));
			},
			$elm$parser$Parser$Advanced$getChompedString(
				$elm$parser$Parser$Advanced$chompWhile(predicate)));
	});
var $dillonkearns$elm_markdown$HtmlParser$textString = function (closingChar) {
	var predicate = function (c) {
		return (!_Utils_eq(c, closingChar)) && (!_Utils_eq(
			c,
			_Utils_chr('&')));
	};
	return A2(
		$elm$parser$Parser$Advanced$loop,
		'',
		A2($dillonkearns$elm_markdown$HtmlParser$textStringStep, closingChar, predicate));
};
var $dillonkearns$elm_markdown$HtmlParser$attributeValue = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
				$dillonkearns$elm_markdown$HtmlParser$symbol('\"')),
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$dillonkearns$elm_markdown$HtmlParser$textString(
					_Utils_chr('\"')),
				$dillonkearns$elm_markdown$HtmlParser$symbol('\"'))),
			A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
				$dillonkearns$elm_markdown$HtmlParser$symbol('\'')),
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$dillonkearns$elm_markdown$HtmlParser$textString(
					_Utils_chr('\'')),
				$dillonkearns$elm_markdown$HtmlParser$symbol('\'')))
		]));
var $dillonkearns$elm_markdown$HtmlParser$keepOldest = F2(
	function (_new, mValue) {
		if (mValue.$ === 'Just') {
			var v = mValue.a;
			return $elm$core$Maybe$Just(v);
		} else {
			return $elm$core$Maybe$Just(_new);
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $dillonkearns$elm_markdown$HtmlParser$isWhitespace = function (c) {
	switch (c.valueOf()) {
		case ' ':
			return true;
		case '\r':
			return true;
		case '\n':
			return true;
		case '\t':
			return true;
		default:
			return false;
	}
};
var $dillonkearns$elm_markdown$HtmlParser$whiteSpace = $elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$HtmlParser$isWhitespace);
var $dillonkearns$elm_markdown$HtmlParser$attributesStep = function (attrs) {
	var process = F2(
		function (name, value) {
			return $elm$parser$Parser$Advanced$Loop(
				A3(
					$elm$core$Dict$update,
					$elm$core$String$toLower(name),
					$dillonkearns$elm_markdown$HtmlParser$keepOldest(value),
					attrs));
		});
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$keeper,
					$elm$parser$Parser$Advanced$succeed(process),
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$HtmlParser$attributeName, $dillonkearns$elm_markdown$HtmlParser$whiteSpace),
							$dillonkearns$elm_markdown$HtmlParser$symbol('=')),
						$dillonkearns$elm_markdown$HtmlParser$whiteSpace)),
				A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$HtmlParser$attributeValue, $dillonkearns$elm_markdown$HtmlParser$whiteSpace)),
				$elm$parser$Parser$Advanced$succeed(
				$elm$parser$Parser$Advanced$Done(attrs))
			]));
};
var $dillonkearns$elm_markdown$HtmlParser$attributes = A2(
	$elm$parser$Parser$Advanced$map,
	A2(
		$elm$core$Dict$foldl,
		F3(
			function (key, value, accum) {
				return A2(
					$elm$core$List$cons,
					{name: key, value: value},
					accum);
			}),
		_List_Nil),
	A2($elm$parser$Parser$Advanced$loop, $elm$core$Dict$empty, $dillonkearns$elm_markdown$HtmlParser$attributesStep));
var $elm$parser$Parser$Advanced$chompUntilEndOr = function (str) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v0 = A5(_Parser_findSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v0.a;
			var newRow = _v0.b;
			var newCol = _v0.c;
			var adjustedOffset = (newOffset < 0) ? $elm$core$String$length(s.src) : newOffset;
			return A3(
				$elm$parser$Parser$Advanced$Good,
				_Utils_cmp(s.offset, adjustedOffset) < 0,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: adjustedOffset, row: newRow, src: s.src});
		});
};
var $dillonkearns$elm_markdown$HtmlParser$cdata = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
		$dillonkearns$elm_markdown$HtmlParser$symbol('<![CDATA[')),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString(
			$elm$parser$Parser$Advanced$chompUntilEndOr(']]>')),
		$dillonkearns$elm_markdown$HtmlParser$symbol(']]>')));
var $dillonkearns$elm_markdown$HtmlParser$childrenStep = F2(
	function (options, accum) {
		return A2(
			$elm$parser$Parser$Advanced$map,
			function (f) {
				return f(accum);
			},
			$elm$parser$Parser$Advanced$oneOf(options));
	});
var $dillonkearns$elm_markdown$HtmlParser$fail = function (str) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(str));
};
var $dillonkearns$elm_markdown$HtmlParser$closingTag = function (startTagName) {
	var closingTagName = A2(
		$elm$parser$Parser$Advanced$andThen,
		function (endTagName) {
			return _Utils_eq(startTagName, endTagName) ? $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0) : $dillonkearns$elm_markdown$HtmlParser$fail('tag name mismatch: ' + (startTagName + (' and ' + endTagName)));
		},
		$dillonkearns$elm_markdown$HtmlParser$tagName);
	return A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$dillonkearns$elm_markdown$HtmlParser$symbol('</'),
					$dillonkearns$elm_markdown$HtmlParser$whiteSpace),
				closingTagName),
			$dillonkearns$elm_markdown$HtmlParser$whiteSpace),
		$dillonkearns$elm_markdown$HtmlParser$symbol('>'));
};
var $dillonkearns$elm_markdown$HtmlParser$Comment = function (a) {
	return {$: 'Comment', a: a};
};
var $dillonkearns$elm_markdown$HtmlParser$toToken = function (str) {
	return A2(
		$elm$parser$Parser$Advanced$Token,
		str,
		$elm$parser$Parser$Expecting(str));
};
var $dillonkearns$elm_markdown$HtmlParser$comment = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$HtmlParser$Comment),
		$elm$parser$Parser$Advanced$token(
			$dillonkearns$elm_markdown$HtmlParser$toToken('<!--'))),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString(
			$elm$parser$Parser$Advanced$chompUntilEndOr('-->')),
		$elm$parser$Parser$Advanced$token(
			$dillonkearns$elm_markdown$HtmlParser$toToken('-->'))));
var $dillonkearns$elm_markdown$HtmlParser$Declaration = F2(
	function (a, b) {
		return {$: 'Declaration', a: a, b: b};
	});
var $dillonkearns$elm_markdown$HtmlParser$expectUppercaseCharacter = $elm$parser$Parser$Expecting('at least 1 uppercase character');
var $dillonkearns$elm_markdown$HtmlParser$allUppercase = $elm$parser$Parser$Advanced$getChompedString(
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2($elm$parser$Parser$Advanced$chompIf, $elm$core$Char$isUpper, $dillonkearns$elm_markdown$HtmlParser$expectUppercaseCharacter),
		$elm$parser$Parser$Advanced$chompWhile($elm$core$Char$isUpper)));
var $dillonkearns$elm_markdown$HtmlParser$oneOrMoreWhiteSpace = A2(
	$elm$parser$Parser$Advanced$ignorer,
	A2(
		$elm$parser$Parser$Advanced$chompIf,
		$dillonkearns$elm_markdown$HtmlParser$isWhitespace,
		$elm$parser$Parser$Expecting('at least one whitespace')),
	$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$HtmlParser$isWhitespace));
var $dillonkearns$elm_markdown$HtmlParser$docType = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$HtmlParser$Declaration),
			$dillonkearns$elm_markdown$HtmlParser$symbol('<!')),
		A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$HtmlParser$allUppercase, $dillonkearns$elm_markdown$HtmlParser$oneOrMoreWhiteSpace)),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString(
			$elm$parser$Parser$Advanced$chompUntilEndOr('>')),
		$dillonkearns$elm_markdown$HtmlParser$symbol('>')));
var $dillonkearns$elm_markdown$HtmlParser$ProcessingInstruction = function (a) {
	return {$: 'ProcessingInstruction', a: a};
};
var $dillonkearns$elm_markdown$HtmlParser$processingInstruction = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$HtmlParser$ProcessingInstruction),
		$dillonkearns$elm_markdown$HtmlParser$symbol('<?')),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString(
			$elm$parser$Parser$Advanced$chompUntilEndOr('?>')),
		$dillonkearns$elm_markdown$HtmlParser$symbol('?>')));
var $dillonkearns$elm_markdown$HtmlParser$isNotTextNodeIgnoreChar = function (c) {
	switch (c.valueOf()) {
		case '<':
			return false;
		case '&':
			return false;
		default:
			return true;
	}
};
var $dillonkearns$elm_markdown$HtmlParser$textNodeStringStepOptions = _List_fromArray(
	[
		A2(
		$elm$parser$Parser$Advanced$map,
		function (_v0) {
			return $elm$parser$Parser$Advanced$Loop(_Utils_Tuple0);
		},
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$chompIf,
				$dillonkearns$elm_markdown$HtmlParser$isNotTextNodeIgnoreChar,
				$elm$parser$Parser$Expecting('is not & or <')),
			$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$HtmlParser$isNotTextNodeIgnoreChar))),
		A2(
		$elm$parser$Parser$Advanced$map,
		function (_v1) {
			return $elm$parser$Parser$Advanced$Loop(_Utils_Tuple0);
		},
		$dillonkearns$elm_markdown$HtmlParser$escapedChar(
			_Utils_chr('<'))),
		$elm$parser$Parser$Advanced$succeed(
		$elm$parser$Parser$Advanced$Done(_Utils_Tuple0))
	]);
var $dillonkearns$elm_markdown$HtmlParser$textNodeStringStep = function (_v0) {
	return $elm$parser$Parser$Advanced$oneOf($dillonkearns$elm_markdown$HtmlParser$textNodeStringStepOptions);
};
var $dillonkearns$elm_markdown$HtmlParser$textNodeString = $elm$parser$Parser$Advanced$getChompedString(
	A2($elm$parser$Parser$Advanced$loop, _Utils_Tuple0, $dillonkearns$elm_markdown$HtmlParser$textNodeStringStep));
var $dillonkearns$elm_markdown$HtmlParser$children = function (startTagName) {
	return A2(
		$elm$parser$Parser$Advanced$loop,
		_List_Nil,
		$dillonkearns$elm_markdown$HtmlParser$childrenStep(
			$dillonkearns$elm_markdown$HtmlParser$childrenStepOptions(startTagName)));
};
var $dillonkearns$elm_markdown$HtmlParser$childrenStepOptions = function (startTagName) {
	return _List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$map,
			F2(
				function (_v1, accum) {
					return $elm$parser$Parser$Advanced$Done(
						$elm$core$List$reverse(accum));
				}),
			$dillonkearns$elm_markdown$HtmlParser$closingTag(startTagName)),
			A2(
			$elm$parser$Parser$Advanced$andThen,
			function (text) {
				return $elm$core$String$isEmpty(text) ? A2(
					$elm$parser$Parser$Advanced$map,
					F2(
						function (_v2, accum) {
							return $elm$parser$Parser$Advanced$Done(
								$elm$core$List$reverse(accum));
						}),
					$dillonkearns$elm_markdown$HtmlParser$closingTag(startTagName)) : $elm$parser$Parser$Advanced$succeed(
					function (accum) {
						return $elm$parser$Parser$Advanced$Loop(
							A2(
								$elm$core$List$cons,
								$dillonkearns$elm_markdown$HtmlParser$Text(text),
								accum));
					});
			},
			$dillonkearns$elm_markdown$HtmlParser$textNodeString),
			A2(
			$elm$parser$Parser$Advanced$map,
			F2(
				function (_new, accum) {
					return $elm$parser$Parser$Advanced$Loop(
						A2($elm$core$List$cons, _new, accum));
				}),
			$dillonkearns$elm_markdown$HtmlParser$cyclic$html())
		]);
};
var $dillonkearns$elm_markdown$HtmlParser$elementContinuation = function (startTagName) {
	return A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed(
					$dillonkearns$elm_markdown$HtmlParser$Element(startTagName)),
				$dillonkearns$elm_markdown$HtmlParser$whiteSpace),
			A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$HtmlParser$attributes, $dillonkearns$elm_markdown$HtmlParser$whiteSpace)),
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$Advanced$map,
					function (_v0) {
						return _List_Nil;
					},
					$dillonkearns$elm_markdown$HtmlParser$symbol('/>')),
					A2(
					$elm$parser$Parser$Advanced$keeper,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
						$dillonkearns$elm_markdown$HtmlParser$symbol('>')),
					$dillonkearns$elm_markdown$HtmlParser$children(startTagName))
				])));
};
function $dillonkearns$elm_markdown$HtmlParser$cyclic$html() {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2($elm$parser$Parser$Advanced$map, $dillonkearns$elm_markdown$HtmlParser$Cdata, $dillonkearns$elm_markdown$HtmlParser$cdata),
				$dillonkearns$elm_markdown$HtmlParser$processingInstruction,
				$dillonkearns$elm_markdown$HtmlParser$comment,
				$dillonkearns$elm_markdown$HtmlParser$docType,
				$dillonkearns$elm_markdown$HtmlParser$cyclic$element()
			]));
}
function $dillonkearns$elm_markdown$HtmlParser$cyclic$element() {
	return A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
			$dillonkearns$elm_markdown$HtmlParser$symbol('<')),
		A2($elm$parser$Parser$Advanced$andThen, $dillonkearns$elm_markdown$HtmlParser$elementContinuation, $dillonkearns$elm_markdown$HtmlParser$tagName));
}
try {
	var $dillonkearns$elm_markdown$HtmlParser$html = $dillonkearns$elm_markdown$HtmlParser$cyclic$html();
	$dillonkearns$elm_markdown$HtmlParser$cyclic$html = function () {
		return $dillonkearns$elm_markdown$HtmlParser$html;
	};
	var $dillonkearns$elm_markdown$HtmlParser$element = $dillonkearns$elm_markdown$HtmlParser$cyclic$element();
	$dillonkearns$elm_markdown$HtmlParser$cyclic$element = function () {
		return $dillonkearns$elm_markdown$HtmlParser$element;
	};
} catch ($) {
	throw 'Some top-level definitions from `HtmlParser` are causing infinite recursion:\n\n  ┌─────┐\n  │    children\n  │     ↓\n  │    childrenStepOptions\n  │     ↓\n  │    html\n  │     ↓\n  │    element\n  │     ↓\n  │    elementContinuation\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $dillonkearns$elm_markdown$Parser$Token$tab = A2(
	$elm$parser$Parser$Advanced$Token,
	'\t',
	$elm$parser$Parser$Expecting('a tab'));
var $dillonkearns$elm_markdown$Markdown$Parser$exactlyFourSpaces = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$tab),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$backtrackable(
				$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$space)),
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						$elm$parser$Parser$Advanced$symbol(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'   ',
							$elm$parser$Parser$ExpectingSymbol('Indentation'))),
						$elm$parser$Parser$Advanced$symbol(
						A2(
							$elm$parser$Parser$Advanced$Token,
							' \t',
							$elm$parser$Parser$ExpectingSymbol('Indentation'))),
						$elm$parser$Parser$Advanced$symbol(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'  \t',
							$elm$parser$Parser$ExpectingSymbol('Indentation')))
					])))
		]));
var $dillonkearns$elm_markdown$Markdown$Parser$indentedCodeBlock = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$RawBlock$IndentedCodeBlock),
		$dillonkearns$elm_markdown$Markdown$Parser$exactlyFourSpaces),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd),
		$dillonkearns$elm_markdown$Helpers$lineEndOrEnd));
var $dillonkearns$elm_markdown$Markdown$Helpers$isEven = function (_int) {
	return !A2($elm$core$Basics$modBy, 2, _int);
};
var $dillonkearns$elm_markdown$Markdown$Block$Loose = {$: 'Loose'};
var $dillonkearns$elm_markdown$Markdown$Block$Tight = {$: 'Tight'};
var $dillonkearns$elm_markdown$Markdown$Parser$isTightBoolToListDisplay = function (isTight) {
	return isTight ? $dillonkearns$elm_markdown$Markdown$Block$Tight : $dillonkearns$elm_markdown$Markdown$Block$Loose;
};
var $dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith = F3(
	function (joinWith, string1, string2) {
		var _v0 = _Utils_Tuple2(string1, string2);
		if (_v0.a === '') {
			return string2;
		} else {
			if (_v0.b === '') {
				return string1;
			} else {
				return _Utils_ap(
					string1,
					_Utils_ap(joinWith, string2));
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$Parser$joinStringsPreserveAll = F2(
	function (string1, string2) {
		return string1 + ('\n' + string2);
	});
var $dillonkearns$elm_markdown$Markdown$Parser$innerParagraphParser = A2(
	$elm$parser$Parser$Advanced$mapChompedString,
	F2(
		function (rawLine, _v0) {
			return $dillonkearns$elm_markdown$Markdown$RawBlock$OpenBlockOrParagraph(
				$dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(rawLine));
		}),
	$dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd);
var $dillonkearns$elm_markdown$Markdown$Parser$openBlockOrParagraphParser = A2($elm$parser$Parser$Advanced$ignorer, $dillonkearns$elm_markdown$Markdown$Parser$innerParagraphParser, $dillonkearns$elm_markdown$Helpers$lineEndOrEnd);
var $dillonkearns$elm_markdown$Markdown$OrderedList$ListItem = F4(
	function (order, intended, marker, body) {
		return {body: body, intended: intended, marker: marker, order: order};
	});
var $elm$parser$Parser$Advanced$getCol = $elm$parser$Parser$Advanced$Parser(
	function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, s.col, s);
	});
var $dillonkearns$elm_markdown$Markdown$OrderedList$orderedListEmptyItemParser = A2(
	$elm$parser$Parser$Advanced$keeper,
	$elm$parser$Parser$Advanced$succeed(
		function (bodyStartPos) {
			return _Utils_Tuple2(bodyStartPos, '');
		}),
	A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getCol, $dillonkearns$elm_markdown$Helpers$lineEndOrEnd));
var $dillonkearns$elm_markdown$Parser$Extra$chompOneOrMore = function (condition) {
	return A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2(
			$elm$parser$Parser$Advanced$chompIf,
			condition,
			$elm$parser$Parser$Problem('Expected one or more character')),
		$elm$parser$Parser$Advanced$chompWhile(condition));
};
var $dillonkearns$elm_markdown$Markdown$OrderedList$orderedListItemBodyParser = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(
				F2(
					function (bodyStartPos, item) {
						return _Utils_Tuple2(bodyStartPos, item);
					})),
			$dillonkearns$elm_markdown$Parser$Extra$chompOneOrMore($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab)),
		$elm$parser$Parser$Advanced$getCol),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd),
		$dillonkearns$elm_markdown$Helpers$lineEndOrEnd));
var $dillonkearns$elm_markdown$Markdown$OrderedList$Dot = {$: 'Dot'};
var $dillonkearns$elm_markdown$Markdown$OrderedList$Paren = {$: 'Paren'};
var $dillonkearns$elm_markdown$Parser$Token$closingParen = A2(
	$elm$parser$Parser$Advanced$Token,
	')',
	$elm$parser$Parser$Expecting('a `)`'));
var $dillonkearns$elm_markdown$Parser$Token$dot = A2(
	$elm$parser$Parser$Advanced$Token,
	'.',
	$elm$parser$Parser$Expecting('a `.`'));
var $dillonkearns$elm_markdown$Markdown$OrderedList$orderedListMarkerParser = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$OrderedList$Dot),
			$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$dot)),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$OrderedList$Paren),
			$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$closingParen))
		]));
var $dillonkearns$elm_markdown$Parser$Extra$positiveInteger = A2(
	$elm$parser$Parser$Advanced$mapChompedString,
	F2(
		function (str, _v0) {
			return A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(str));
		}),
	$dillonkearns$elm_markdown$Parser$Extra$chompOneOrMore($elm$core$Char$isDigit));
var $dillonkearns$elm_markdown$Markdown$OrderedList$positiveIntegerMaxOf9Digits = A2(
	$elm$parser$Parser$Advanced$andThen,
	function (parsed) {
		return (parsed <= 999999999) ? $elm$parser$Parser$Advanced$succeed(parsed) : $elm$parser$Parser$Advanced$problem(
			$elm$parser$Parser$Problem('Starting numbers must be nine digits or less.'));
	},
	$dillonkearns$elm_markdown$Parser$Extra$positiveInteger);
var $dillonkearns$elm_markdown$Whitespace$space = $elm$parser$Parser$Advanced$token($dillonkearns$elm_markdown$Parser$Token$space);
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $dillonkearns$elm_markdown$Parser$Extra$upTo = F2(
	function (n, parser) {
		var _v0 = A2($elm$core$List$repeat, n, parser);
		if (!_v0.b) {
			return $elm$parser$Parser$Advanced$succeed(_Utils_Tuple0);
		} else {
			var firstParser = _v0.a;
			var remainingParsers = _v0.b;
			return A3(
				$elm$core$List$foldl,
				F2(
					function (p, parsers) {
						return $elm$parser$Parser$Advanced$oneOf(
							_List_fromArray(
								[
									A2($elm$parser$Parser$Advanced$ignorer, p, parsers),
									$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
								]));
					}),
				$elm$parser$Parser$Advanced$oneOf(
					_List_fromArray(
						[
							firstParser,
							$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
						])),
				remainingParsers);
		}
	});
var $dillonkearns$elm_markdown$Markdown$OrderedList$validateStartsWith1 = function (parsed) {
	if (parsed === 1) {
		return $elm$parser$Parser$Advanced$succeed(parsed);
	} else {
		return $elm$parser$Parser$Advanced$problem(
			$elm$parser$Parser$Problem('Lists inside a paragraph or after a paragraph without a blank line must start with 1'));
	}
};
var $dillonkearns$elm_markdown$Markdown$OrderedList$orderedListOrderParser = function (previousWasBody) {
	return previousWasBody ? A2(
		$elm$parser$Parser$Advanced$andThen,
		$dillonkearns$elm_markdown$Markdown$OrderedList$validateStartsWith1,
		A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
				A2($dillonkearns$elm_markdown$Parser$Extra$upTo, 3, $dillonkearns$elm_markdown$Whitespace$space)),
			$dillonkearns$elm_markdown$Markdown$OrderedList$positiveIntegerMaxOf9Digits)) : A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
			A2($dillonkearns$elm_markdown$Parser$Extra$upTo, 3, $dillonkearns$elm_markdown$Whitespace$space)),
		$dillonkearns$elm_markdown$Markdown$OrderedList$positiveIntegerMaxOf9Digits);
};
var $dillonkearns$elm_markdown$Markdown$OrderedList$parser = function (previousWasBody) {
	var parseSubsequentItem = F5(
		function (start, order, marker, mid, _v0) {
			var end = _v0.a;
			var body = _v0.b;
			return ((end - mid) <= 4) ? A4($dillonkearns$elm_markdown$Markdown$OrderedList$ListItem, order, end - start, marker, body) : A4(
				$dillonkearns$elm_markdown$Markdown$OrderedList$ListItem,
				order,
				(mid - start) + 1,
				marker,
				_Utils_ap(
					A2($elm$core$String$repeat, (end - mid) - 1, ' '),
					body));
		});
	return A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$keeper,
					A2(
						$elm$parser$Parser$Advanced$keeper,
						$elm$parser$Parser$Advanced$succeed(parseSubsequentItem),
						$elm$parser$Parser$Advanced$getCol),
					$elm$parser$Parser$Advanced$backtrackable(
						$dillonkearns$elm_markdown$Markdown$OrderedList$orderedListOrderParser(previousWasBody))),
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$OrderedList$orderedListMarkerParser)),
			$elm$parser$Parser$Advanced$getCol),
		previousWasBody ? $dillonkearns$elm_markdown$Markdown$OrderedList$orderedListItemBodyParser : $elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[$dillonkearns$elm_markdown$Markdown$OrderedList$orderedListEmptyItemParser, $dillonkearns$elm_markdown$Markdown$OrderedList$orderedListItemBodyParser])));
};
var $dillonkearns$elm_markdown$Markdown$Parser$orderedListBlock = function (previousWasBody) {
	return A2(
		$elm$parser$Parser$Advanced$map,
		function (item) {
			return A6($dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock, true, item.intended, item.marker, item.order, _List_Nil, item.body);
		},
		$dillonkearns$elm_markdown$Markdown$OrderedList$parser(previousWasBody));
};
var $dillonkearns$elm_markdown$Markdown$Inline$CodeInline = function (a) {
	return {$: 'CodeInline', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Inline$HardLineBreak = {$: 'HardLineBreak'};
var $dillonkearns$elm_markdown$Markdown$Inline$HtmlInline = function (a) {
	return {$: 'HtmlInline', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Inline$Image = F3(
	function (a, b, c) {
		return {$: 'Image', a: a, b: b, c: c};
	});
var $dillonkearns$elm_markdown$Markdown$Inline$Link = F3(
	function (a, b, c) {
		return {$: 'Link', a: a, b: b, c: c};
	});
var $dillonkearns$elm_markdown$Markdown$Inline$Strikethrough = function (a) {
	return {$: 'Strikethrough', a: a};
};
var $dillonkearns$elm_markdown$Markdown$Inline$Text = function (a) {
	return {$: 'Text', a: a};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$matchToInline = function (_v0) {
	var match = _v0.a;
	var _v1 = match.type_;
	switch (_v1.$) {
		case 'NormalType':
			return $dillonkearns$elm_markdown$Markdown$Inline$Text(match.text);
		case 'HardLineBreakType':
			return $dillonkearns$elm_markdown$Markdown$Inline$HardLineBreak;
		case 'CodeType':
			return $dillonkearns$elm_markdown$Markdown$Inline$CodeInline(match.text);
		case 'AutolinkType':
			var _v2 = _v1.a;
			var text = _v2.a;
			var url = _v2.b;
			return A3(
				$dillonkearns$elm_markdown$Markdown$Inline$Link,
				url,
				$elm$core$Maybe$Nothing,
				_List_fromArray(
					[
						$dillonkearns$elm_markdown$Markdown$Inline$Text(text)
					]));
		case 'LinkType':
			var _v3 = _v1.a;
			var url = _v3.a;
			var maybeTitle = _v3.b;
			return A3(
				$dillonkearns$elm_markdown$Markdown$Inline$Link,
				url,
				maybeTitle,
				$dillonkearns$elm_markdown$Markdown$InlineParser$matchesToInlines(match.matches));
		case 'ImageType':
			var _v4 = _v1.a;
			var url = _v4.a;
			var maybeTitle = _v4.b;
			return A3(
				$dillonkearns$elm_markdown$Markdown$Inline$Image,
				url,
				maybeTitle,
				$dillonkearns$elm_markdown$Markdown$InlineParser$matchesToInlines(match.matches));
		case 'HtmlType':
			var model = _v1.a;
			return $dillonkearns$elm_markdown$Markdown$Inline$HtmlInline(model);
		case 'EmphasisType':
			var length = _v1.a;
			return A2(
				$dillonkearns$elm_markdown$Markdown$Inline$Emphasis,
				length,
				$dillonkearns$elm_markdown$Markdown$InlineParser$matchesToInlines(match.matches));
		default:
			return $dillonkearns$elm_markdown$Markdown$Inline$Strikethrough(
				$dillonkearns$elm_markdown$Markdown$InlineParser$matchesToInlines(match.matches));
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$matchesToInlines = function (matches) {
	return A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$InlineParser$matchToInline, matches);
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$Match = function (a) {
	return {$: 'Match', a: a};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$prepareChildMatch = F2(
	function (parentMatch, childMatch) {
		return $dillonkearns$elm_markdown$Markdown$InlineParser$Match(
			{end: childMatch.end - parentMatch.textStart, matches: childMatch.matches, start: childMatch.start - parentMatch.textStart, text: childMatch.text, textEnd: childMatch.textEnd - parentMatch.textStart, textStart: childMatch.textStart - parentMatch.textStart, type_: childMatch.type_});
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$addChild = F2(
	function (parentMatch, childMatch) {
		return $dillonkearns$elm_markdown$Markdown$InlineParser$Match(
			{
				end: parentMatch.end,
				matches: A2(
					$elm$core$List$cons,
					A2($dillonkearns$elm_markdown$Markdown$InlineParser$prepareChildMatch, parentMatch, childMatch),
					parentMatch.matches),
				start: parentMatch.start,
				text: parentMatch.text,
				textEnd: parentMatch.textEnd,
				textStart: parentMatch.textStart,
				type_: parentMatch.type_
			});
	});
var $elm$core$List$sortBy = _List_sortBy;
var $dillonkearns$elm_markdown$Markdown$InlineParser$organizeChildren = function (_v4) {
	var match = _v4.a;
	return $dillonkearns$elm_markdown$Markdown$InlineParser$Match(
		{
			end: match.end,
			matches: $dillonkearns$elm_markdown$Markdown$InlineParser$organizeMatches(match.matches),
			start: match.start,
			text: match.text,
			textEnd: match.textEnd,
			textStart: match.textStart,
			type_: match.type_
		});
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$organizeMatches = function (matches) {
	var _v2 = A2(
		$elm$core$List$sortBy,
		function (_v3) {
			var match = _v3.a;
			return match.start;
		},
		matches);
	if (!_v2.b) {
		return _List_Nil;
	} else {
		var first = _v2.a;
		var rest = _v2.b;
		return A3($dillonkearns$elm_markdown$Markdown$InlineParser$organizeMatchesHelp, rest, first, _List_Nil);
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$organizeMatchesHelp = F3(
	function (remaining, _v0, matchesTail) {
		organizeMatchesHelp:
		while (true) {
			var prevMatch = _v0.a;
			if (!remaining.b) {
				return A2(
					$elm$core$List$cons,
					$dillonkearns$elm_markdown$Markdown$InlineParser$organizeChildren(
						$dillonkearns$elm_markdown$Markdown$InlineParser$Match(prevMatch)),
					matchesTail);
			} else {
				var match = remaining.a.a;
				var rest = remaining.b;
				if (_Utils_cmp(prevMatch.end, match.start) < 1) {
					var $temp$remaining = rest,
						$temp$_v0 = $dillonkearns$elm_markdown$Markdown$InlineParser$Match(match),
						$temp$matchesTail = A2(
						$elm$core$List$cons,
						$dillonkearns$elm_markdown$Markdown$InlineParser$organizeChildren(
							$dillonkearns$elm_markdown$Markdown$InlineParser$Match(prevMatch)),
						matchesTail);
					remaining = $temp$remaining;
					_v0 = $temp$_v0;
					matchesTail = $temp$matchesTail;
					continue organizeMatchesHelp;
				} else {
					if ((_Utils_cmp(prevMatch.start, match.start) < 0) && (_Utils_cmp(prevMatch.end, match.end) > 0)) {
						var $temp$remaining = rest,
							$temp$_v0 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$addChild, prevMatch, match),
							$temp$matchesTail = matchesTail;
						remaining = $temp$remaining;
						_v0 = $temp$_v0;
						matchesTail = $temp$matchesTail;
						continue organizeMatchesHelp;
					} else {
						var $temp$remaining = rest,
							$temp$_v0 = $dillonkearns$elm_markdown$Markdown$InlineParser$Match(prevMatch),
							$temp$matchesTail = matchesTail;
						remaining = $temp$remaining;
						_v0 = $temp$_v0;
						matchesTail = $temp$matchesTail;
						continue organizeMatchesHelp;
					}
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$NormalType = {$: 'NormalType'};
var $dillonkearns$elm_markdown$Markdown$Helpers$containsAmpersand = function (string) {
	return A2($elm$core$String$contains, '&', string);
};
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {index: index, match: match, number: number, submatches: submatches};
	});
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{caseInsensitive: false, multiline: false},
		string);
};
var $elm$regex$Regex$never = _Regex_never;
var $dillonkearns$elm_markdown$Markdown$Entity$decimalRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('&#([0-9]{1,8});'));
var $elm$regex$Regex$replace = _Regex_replaceAtMost(_Regex_infinity);
var $dillonkearns$elm_markdown$Markdown$Entity$isBadEndUnicode = function (_int) {
	var remain_ = A2($elm$core$Basics$modBy, 16, _int);
	var remain = A2($elm$core$Basics$modBy, 131070, _int);
	return (_int >= 131070) && ((((0 <= remain) && (remain <= 15)) || ((65536 <= remain) && (remain <= 65551))) && ((remain_ === 14) || (remain_ === 15)));
};
var $dillonkearns$elm_markdown$Markdown$Entity$isValidUnicode = function (_int) {
	return (_int === 9) || ((_int === 10) || ((_int === 13) || ((_int === 133) || (((32 <= _int) && (_int <= 126)) || (((160 <= _int) && (_int <= 55295)) || (((57344 <= _int) && (_int <= 64975)) || (((65008 <= _int) && (_int <= 65533)) || ((65536 <= _int) && (_int <= 1114109)))))))));
};
var $dillonkearns$elm_markdown$Markdown$Entity$validUnicode = function (_int) {
	return ($dillonkearns$elm_markdown$Markdown$Entity$isValidUnicode(_int) && (!$dillonkearns$elm_markdown$Markdown$Entity$isBadEndUnicode(_int))) ? $elm$core$String$fromChar(
		$elm$core$Char$fromCode(_int)) : $elm$core$String$fromChar(
		$elm$core$Char$fromCode(65533));
};
var $dillonkearns$elm_markdown$Markdown$Entity$replaceDecimal = function (match) {
	var _v0 = match.submatches;
	if (_v0.b && (_v0.a.$ === 'Just')) {
		var first = _v0.a.a;
		var _v1 = $elm$core$String$toInt(first);
		if (_v1.$ === 'Just') {
			var v = _v1.a;
			return $dillonkearns$elm_markdown$Markdown$Entity$validUnicode(v);
		} else {
			return match.match;
		}
	} else {
		return match.match;
	}
};
var $dillonkearns$elm_markdown$Markdown$Entity$replaceDecimals = A2($elm$regex$Regex$replace, $dillonkearns$elm_markdown$Markdown$Entity$decimalRegex, $dillonkearns$elm_markdown$Markdown$Entity$replaceDecimal);
var $dillonkearns$elm_markdown$Markdown$Entity$entitiesRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('&([0-9a-zA-Z]+);'));
var $dillonkearns$elm_markdown$Markdown$Entity$entities = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('quot', 34),
			_Utils_Tuple2('amp', 38),
			_Utils_Tuple2('apos', 39),
			_Utils_Tuple2('lt', 60),
			_Utils_Tuple2('gt', 62),
			_Utils_Tuple2('nbsp', 160),
			_Utils_Tuple2('iexcl', 161),
			_Utils_Tuple2('cent', 162),
			_Utils_Tuple2('pound', 163),
			_Utils_Tuple2('curren', 164),
			_Utils_Tuple2('yen', 165),
			_Utils_Tuple2('brvbar', 166),
			_Utils_Tuple2('sect', 167),
			_Utils_Tuple2('uml', 168),
			_Utils_Tuple2('copy', 169),
			_Utils_Tuple2('ordf', 170),
			_Utils_Tuple2('laquo', 171),
			_Utils_Tuple2('not', 172),
			_Utils_Tuple2('shy', 173),
			_Utils_Tuple2('reg', 174),
			_Utils_Tuple2('macr', 175),
			_Utils_Tuple2('deg', 176),
			_Utils_Tuple2('plusmn', 177),
			_Utils_Tuple2('sup2', 178),
			_Utils_Tuple2('sup3', 179),
			_Utils_Tuple2('acute', 180),
			_Utils_Tuple2('micro', 181),
			_Utils_Tuple2('para', 182),
			_Utils_Tuple2('middot', 183),
			_Utils_Tuple2('cedil', 184),
			_Utils_Tuple2('sup1', 185),
			_Utils_Tuple2('ordm', 186),
			_Utils_Tuple2('raquo', 187),
			_Utils_Tuple2('frac14', 188),
			_Utils_Tuple2('frac12', 189),
			_Utils_Tuple2('frac34', 190),
			_Utils_Tuple2('iquest', 191),
			_Utils_Tuple2('Agrave', 192),
			_Utils_Tuple2('Aacute', 193),
			_Utils_Tuple2('Acirc', 194),
			_Utils_Tuple2('Atilde', 195),
			_Utils_Tuple2('Auml', 196),
			_Utils_Tuple2('Aring', 197),
			_Utils_Tuple2('AElig', 198),
			_Utils_Tuple2('Ccedil', 199),
			_Utils_Tuple2('Egrave', 200),
			_Utils_Tuple2('Eacute', 201),
			_Utils_Tuple2('Ecirc', 202),
			_Utils_Tuple2('Euml', 203),
			_Utils_Tuple2('Igrave', 204),
			_Utils_Tuple2('Iacute', 205),
			_Utils_Tuple2('Icirc', 206),
			_Utils_Tuple2('Iuml', 207),
			_Utils_Tuple2('ETH', 208),
			_Utils_Tuple2('Ntilde', 209),
			_Utils_Tuple2('Ograve', 210),
			_Utils_Tuple2('Oacute', 211),
			_Utils_Tuple2('Ocirc', 212),
			_Utils_Tuple2('Otilde', 213),
			_Utils_Tuple2('Ouml', 214),
			_Utils_Tuple2('times', 215),
			_Utils_Tuple2('Oslash', 216),
			_Utils_Tuple2('Ugrave', 217),
			_Utils_Tuple2('Uacute', 218),
			_Utils_Tuple2('Ucirc', 219),
			_Utils_Tuple2('Uuml', 220),
			_Utils_Tuple2('Yacute', 221),
			_Utils_Tuple2('THORN', 222),
			_Utils_Tuple2('szlig', 223),
			_Utils_Tuple2('agrave', 224),
			_Utils_Tuple2('aacute', 225),
			_Utils_Tuple2('acirc', 226),
			_Utils_Tuple2('atilde', 227),
			_Utils_Tuple2('auml', 228),
			_Utils_Tuple2('aring', 229),
			_Utils_Tuple2('aelig', 230),
			_Utils_Tuple2('ccedil', 231),
			_Utils_Tuple2('egrave', 232),
			_Utils_Tuple2('eacute', 233),
			_Utils_Tuple2('ecirc', 234),
			_Utils_Tuple2('euml', 235),
			_Utils_Tuple2('igrave', 236),
			_Utils_Tuple2('iacute', 237),
			_Utils_Tuple2('icirc', 238),
			_Utils_Tuple2('iuml', 239),
			_Utils_Tuple2('eth', 240),
			_Utils_Tuple2('ntilde', 241),
			_Utils_Tuple2('ograve', 242),
			_Utils_Tuple2('oacute', 243),
			_Utils_Tuple2('ocirc', 244),
			_Utils_Tuple2('otilde', 245),
			_Utils_Tuple2('ouml', 246),
			_Utils_Tuple2('divide', 247),
			_Utils_Tuple2('oslash', 248),
			_Utils_Tuple2('ugrave', 249),
			_Utils_Tuple2('uacute', 250),
			_Utils_Tuple2('ucirc', 251),
			_Utils_Tuple2('uuml', 252),
			_Utils_Tuple2('yacute', 253),
			_Utils_Tuple2('thorn', 254),
			_Utils_Tuple2('yuml', 255),
			_Utils_Tuple2('OElig', 338),
			_Utils_Tuple2('oelig', 339),
			_Utils_Tuple2('Scaron', 352),
			_Utils_Tuple2('scaron', 353),
			_Utils_Tuple2('Yuml', 376),
			_Utils_Tuple2('fnof', 402),
			_Utils_Tuple2('circ', 710),
			_Utils_Tuple2('tilde', 732),
			_Utils_Tuple2('Alpha', 913),
			_Utils_Tuple2('Beta', 914),
			_Utils_Tuple2('Gamma', 915),
			_Utils_Tuple2('Delta', 916),
			_Utils_Tuple2('Epsilon', 917),
			_Utils_Tuple2('Zeta', 918),
			_Utils_Tuple2('Eta', 919),
			_Utils_Tuple2('Theta', 920),
			_Utils_Tuple2('Iota', 921),
			_Utils_Tuple2('Kappa', 922),
			_Utils_Tuple2('Lambda', 923),
			_Utils_Tuple2('Mu', 924),
			_Utils_Tuple2('Nu', 925),
			_Utils_Tuple2('Xi', 926),
			_Utils_Tuple2('Omicron', 927),
			_Utils_Tuple2('Pi', 928),
			_Utils_Tuple2('Rho', 929),
			_Utils_Tuple2('Sigma', 931),
			_Utils_Tuple2('Tau', 932),
			_Utils_Tuple2('Upsilon', 933),
			_Utils_Tuple2('Phi', 934),
			_Utils_Tuple2('Chi', 935),
			_Utils_Tuple2('Psi', 936),
			_Utils_Tuple2('Omega', 937),
			_Utils_Tuple2('alpha', 945),
			_Utils_Tuple2('beta', 946),
			_Utils_Tuple2('gamma', 947),
			_Utils_Tuple2('delta', 948),
			_Utils_Tuple2('epsilon', 949),
			_Utils_Tuple2('zeta', 950),
			_Utils_Tuple2('eta', 951),
			_Utils_Tuple2('theta', 952),
			_Utils_Tuple2('iota', 953),
			_Utils_Tuple2('kappa', 954),
			_Utils_Tuple2('lambda', 955),
			_Utils_Tuple2('mu', 956),
			_Utils_Tuple2('nu', 957),
			_Utils_Tuple2('xi', 958),
			_Utils_Tuple2('omicron', 959),
			_Utils_Tuple2('pi', 960),
			_Utils_Tuple2('rho', 961),
			_Utils_Tuple2('sigmaf', 962),
			_Utils_Tuple2('sigma', 963),
			_Utils_Tuple2('tau', 964),
			_Utils_Tuple2('upsilon', 965),
			_Utils_Tuple2('phi', 966),
			_Utils_Tuple2('chi', 967),
			_Utils_Tuple2('psi', 968),
			_Utils_Tuple2('omega', 969),
			_Utils_Tuple2('thetasym', 977),
			_Utils_Tuple2('upsih', 978),
			_Utils_Tuple2('piv', 982),
			_Utils_Tuple2('ensp', 8194),
			_Utils_Tuple2('emsp', 8195),
			_Utils_Tuple2('thinsp', 8201),
			_Utils_Tuple2('zwnj', 8204),
			_Utils_Tuple2('zwj', 8205),
			_Utils_Tuple2('lrm', 8206),
			_Utils_Tuple2('rlm', 8207),
			_Utils_Tuple2('ndash', 8211),
			_Utils_Tuple2('mdash', 8212),
			_Utils_Tuple2('lsquo', 8216),
			_Utils_Tuple2('rsquo', 8217),
			_Utils_Tuple2('sbquo', 8218),
			_Utils_Tuple2('ldquo', 8220),
			_Utils_Tuple2('rdquo', 8221),
			_Utils_Tuple2('bdquo', 8222),
			_Utils_Tuple2('dagger', 8224),
			_Utils_Tuple2('Dagger', 8225),
			_Utils_Tuple2('bull', 8226),
			_Utils_Tuple2('hellip', 8230),
			_Utils_Tuple2('permil', 8240),
			_Utils_Tuple2('prime', 8242),
			_Utils_Tuple2('Prime', 8243),
			_Utils_Tuple2('lsaquo', 8249),
			_Utils_Tuple2('rsaquo', 8250),
			_Utils_Tuple2('oline', 8254),
			_Utils_Tuple2('frasl', 8260),
			_Utils_Tuple2('euro', 8364),
			_Utils_Tuple2('image', 8465),
			_Utils_Tuple2('weierp', 8472),
			_Utils_Tuple2('real', 8476),
			_Utils_Tuple2('trade', 8482),
			_Utils_Tuple2('alefsym', 8501),
			_Utils_Tuple2('larr', 8592),
			_Utils_Tuple2('uarr', 8593),
			_Utils_Tuple2('rarr', 8594),
			_Utils_Tuple2('darr', 8595),
			_Utils_Tuple2('harr', 8596),
			_Utils_Tuple2('crarr', 8629),
			_Utils_Tuple2('lArr', 8656),
			_Utils_Tuple2('uArr', 8657),
			_Utils_Tuple2('rArr', 8658),
			_Utils_Tuple2('dArr', 8659),
			_Utils_Tuple2('hArr', 8660),
			_Utils_Tuple2('forall', 8704),
			_Utils_Tuple2('part', 8706),
			_Utils_Tuple2('exist', 8707),
			_Utils_Tuple2('empty', 8709),
			_Utils_Tuple2('nabla', 8711),
			_Utils_Tuple2('isin', 8712),
			_Utils_Tuple2('notin', 8713),
			_Utils_Tuple2('ni', 8715),
			_Utils_Tuple2('prod', 8719),
			_Utils_Tuple2('sum', 8721),
			_Utils_Tuple2('minus', 8722),
			_Utils_Tuple2('lowast', 8727),
			_Utils_Tuple2('radic', 8730),
			_Utils_Tuple2('prop', 8733),
			_Utils_Tuple2('infin', 8734),
			_Utils_Tuple2('ang', 8736),
			_Utils_Tuple2('and', 8743),
			_Utils_Tuple2('or', 8744),
			_Utils_Tuple2('cap', 8745),
			_Utils_Tuple2('cup', 8746),
			_Utils_Tuple2('int', 8747),
			_Utils_Tuple2('there4', 8756),
			_Utils_Tuple2('sim', 8764),
			_Utils_Tuple2('cong', 8773),
			_Utils_Tuple2('asymp', 8776),
			_Utils_Tuple2('ne', 8800),
			_Utils_Tuple2('equiv', 8801),
			_Utils_Tuple2('le', 8804),
			_Utils_Tuple2('ge', 8805),
			_Utils_Tuple2('sub', 8834),
			_Utils_Tuple2('sup', 8835),
			_Utils_Tuple2('nsub', 8836),
			_Utils_Tuple2('sube', 8838),
			_Utils_Tuple2('supe', 8839),
			_Utils_Tuple2('oplus', 8853),
			_Utils_Tuple2('otimes', 8855),
			_Utils_Tuple2('perp', 8869),
			_Utils_Tuple2('sdot', 8901),
			_Utils_Tuple2('lceil', 8968),
			_Utils_Tuple2('rceil', 8969),
			_Utils_Tuple2('lfloor', 8970),
			_Utils_Tuple2('rfloor', 8971),
			_Utils_Tuple2('lang', 9001),
			_Utils_Tuple2('rang', 9002),
			_Utils_Tuple2('loz', 9674),
			_Utils_Tuple2('spades', 9824),
			_Utils_Tuple2('clubs', 9827),
			_Utils_Tuple2('hearts', 9829),
			_Utils_Tuple2('diams', 9830)
		]));
var $dillonkearns$elm_markdown$Markdown$Entity$replaceEntity = function (match) {
	var _v0 = match.submatches;
	if (_v0.b && (_v0.a.$ === 'Just')) {
		var first = _v0.a.a;
		var _v1 = A2($elm$core$Dict$get, first, $dillonkearns$elm_markdown$Markdown$Entity$entities);
		if (_v1.$ === 'Just') {
			var code = _v1.a;
			return $elm$core$String$fromChar(
				$elm$core$Char$fromCode(code));
		} else {
			return match.match;
		}
	} else {
		return match.match;
	}
};
var $dillonkearns$elm_markdown$Markdown$Entity$replaceEntities = A2($elm$regex$Regex$replace, $dillonkearns$elm_markdown$Markdown$Entity$entitiesRegex, $dillonkearns$elm_markdown$Markdown$Entity$replaceEntity);
var $dillonkearns$elm_markdown$Markdown$Helpers$escapableRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\+)([!\"#$%&\\\'()*+,./:;<=>?@[\\\\\\]^_`{|}~-])'));
var $dillonkearns$elm_markdown$Markdown$Helpers$replaceEscapable = A2(
	$elm$regex$Regex$replace,
	$dillonkearns$elm_markdown$Markdown$Helpers$escapableRegex,
	function (regexMatch) {
		var _v0 = regexMatch.submatches;
		if (((_v0.b && (_v0.a.$ === 'Just')) && _v0.b.b) && (_v0.b.a.$ === 'Just')) {
			var backslashes = _v0.a.a;
			var _v1 = _v0.b;
			var escapedStr = _v1.a.a;
			return _Utils_ap(
				A2(
					$elm$core$String$repeat,
					($elm$core$String$length(backslashes) / 2) | 0,
					'\\'),
				escapedStr);
		} else {
			return regexMatch.match;
		}
	});
var $dillonkearns$elm_markdown$Markdown$Entity$hexadecimalRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('&#[Xx]([0-9a-fA-F]{1,8});'));
var $elm$core$String$foldl = _String_foldl;
var $dillonkearns$elm_markdown$Markdown$Entity$hexToInt = function (string) {
	var folder = F2(
		function (hexDigit, _int) {
			return ((_int * 16) + A2(
				$elm$core$Basics$modBy,
				39,
				$elm$core$Char$toCode(hexDigit))) - 9;
		});
	return A3(
		$elm$core$String$foldl,
		folder,
		0,
		$elm$core$String$toLower(string));
};
var $dillonkearns$elm_markdown$Markdown$Entity$replaceHexadecimal = function (match) {
	var _v0 = match.submatches;
	if (_v0.b && (_v0.a.$ === 'Just')) {
		var first = _v0.a.a;
		return $dillonkearns$elm_markdown$Markdown$Entity$validUnicode(
			$dillonkearns$elm_markdown$Markdown$Entity$hexToInt(first));
	} else {
		return match.match;
	}
};
var $dillonkearns$elm_markdown$Markdown$Entity$replaceHexadecimals = A2($elm$regex$Regex$replace, $dillonkearns$elm_markdown$Markdown$Entity$hexadecimalRegex, $dillonkearns$elm_markdown$Markdown$Entity$replaceHexadecimal);
var $dillonkearns$elm_markdown$Markdown$Helpers$formatStr = function (str) {
	var withEscapes = $dillonkearns$elm_markdown$Markdown$Helpers$replaceEscapable(str);
	return $dillonkearns$elm_markdown$Markdown$Helpers$containsAmpersand(withEscapes) ? $dillonkearns$elm_markdown$Markdown$Entity$replaceHexadecimals(
		$dillonkearns$elm_markdown$Markdown$Entity$replaceDecimals(
			$dillonkearns$elm_markdown$Markdown$Entity$replaceEntities(withEscapes))) : withEscapes;
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$normalMatch = function (text) {
	return $dillonkearns$elm_markdown$Markdown$InlineParser$Match(
		{
			end: 0,
			matches: _List_Nil,
			start: 0,
			text: $dillonkearns$elm_markdown$Markdown$Helpers$formatStr(text),
			textEnd: 0,
			textStart: 0,
			type_: $dillonkearns$elm_markdown$Markdown$InlineParser$NormalType
		});
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$parseTextMatch = F3(
	function (rawText, _v2, parsedMatches) {
		var matchModel = _v2.a;
		var updtMatch = $dillonkearns$elm_markdown$Markdown$InlineParser$Match(
			{
				end: matchModel.end,
				matches: A3($dillonkearns$elm_markdown$Markdown$InlineParser$parseTextMatches, matchModel.text, _List_Nil, matchModel.matches),
				start: matchModel.start,
				text: matchModel.text,
				textEnd: matchModel.textEnd,
				textStart: matchModel.textStart,
				type_: matchModel.type_
			});
		if (!parsedMatches.b) {
			var finalStr = A2($elm$core$String$dropLeft, matchModel.end, rawText);
			return $elm$core$String$isEmpty(finalStr) ? _List_fromArray(
				[updtMatch]) : _List_fromArray(
				[
					updtMatch,
					$dillonkearns$elm_markdown$Markdown$InlineParser$normalMatch(finalStr)
				]);
		} else {
			var matchHead = parsedMatches.a.a;
			var matchesTail = parsedMatches.b;
			var _v4 = matchHead.type_;
			if (_v4.$ === 'NormalType') {
				return A2($elm$core$List$cons, updtMatch, parsedMatches);
			} else {
				return _Utils_eq(matchModel.end, matchHead.start) ? A2($elm$core$List$cons, updtMatch, parsedMatches) : ((_Utils_cmp(matchModel.end, matchHead.start) < 0) ? A2(
					$elm$core$List$cons,
					updtMatch,
					A2(
						$elm$core$List$cons,
						$dillonkearns$elm_markdown$Markdown$InlineParser$normalMatch(
							A3($elm$core$String$slice, matchModel.end, matchHead.start, rawText)),
						parsedMatches)) : parsedMatches);
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$parseTextMatches = F3(
	function (rawText, parsedMatches, matches) {
		parseTextMatches:
		while (true) {
			if (!matches.b) {
				if (!parsedMatches.b) {
					return $elm$core$String$isEmpty(rawText) ? _List_Nil : _List_fromArray(
						[
							$dillonkearns$elm_markdown$Markdown$InlineParser$normalMatch(rawText)
						]);
				} else {
					var matchModel = parsedMatches.a.a;
					return (matchModel.start > 0) ? A2(
						$elm$core$List$cons,
						$dillonkearns$elm_markdown$Markdown$InlineParser$normalMatch(
							A2($elm$core$String$left, matchModel.start, rawText)),
						parsedMatches) : parsedMatches;
				}
			} else {
				var match = matches.a;
				var matchesTail = matches.b;
				var $temp$rawText = rawText,
					$temp$parsedMatches = A3($dillonkearns$elm_markdown$Markdown$InlineParser$parseTextMatch, rawText, match, parsedMatches),
					$temp$matches = matchesTail;
				rawText = $temp$rawText;
				parsedMatches = $temp$parsedMatches;
				matches = $temp$matches;
				continue parseTextMatches;
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$angleBracketLTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(\\<)'));
var $elm$regex$Regex$find = _Regex_findAtMost(_Regex_infinity);
var $dillonkearns$elm_markdown$Markdown$InlineParser$AngleBracketOpen = {$: 'AngleBracketOpen'};
var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToAngleBracketLToken = function (regMatch) {
	var _v0 = regMatch.submatches;
	if ((_v0.b && _v0.b.b) && (_v0.b.a.$ === 'Just')) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var delimiter = _v1.a.a;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		return $dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? $elm$core$Maybe$Just(
			{index: regMatch.index + backslashesLength, length: 1, meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$AngleBracketOpen}) : $elm$core$Maybe$Nothing;
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$findAngleBracketLTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToAngleBracketLToken,
		A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$angleBracketLTokenRegex, str));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$angleBracketRTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(\\>)'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$AngleBracketClose = function (a) {
	return {$: 'AngleBracketClose', a: a};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$Escaped = {$: 'Escaped'};
var $dillonkearns$elm_markdown$Markdown$InlineParser$NotEscaped = {$: 'NotEscaped'};
var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToAngleBracketRToken = function (regMatch) {
	var _v0 = regMatch.submatches;
	if ((_v0.b && _v0.b.b) && (_v0.b.a.$ === 'Just')) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		return $elm$core$Maybe$Just(
			{
				index: regMatch.index + backslashesLength,
				length: 1,
				meaning: $dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? $dillonkearns$elm_markdown$Markdown$InlineParser$AngleBracketClose($dillonkearns$elm_markdown$Markdown$InlineParser$NotEscaped) : $dillonkearns$elm_markdown$Markdown$InlineParser$AngleBracketClose($dillonkearns$elm_markdown$Markdown$InlineParser$Escaped)
			});
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$findAngleBracketRTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToAngleBracketRToken,
		A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$angleBracketRTokenRegex, str));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$asteriskEmphasisTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)([^*])?(\\*+)([^*])?'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$EmphasisToken = F2(
	function (a, b) {
		return {$: 'EmphasisToken', a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$isPunctuation = function (c) {
	switch (c.valueOf()) {
		case '!':
			return true;
		case '\"':
			return true;
		case '#':
			return true;
		case '%':
			return true;
		case '&':
			return true;
		case '\'':
			return true;
		case '(':
			return true;
		case ')':
			return true;
		case '*':
			return true;
		case ',':
			return true;
		case '-':
			return true;
		case '.':
			return true;
		case '/':
			return true;
		case ':':
			return true;
		case ';':
			return true;
		case '?':
			return true;
		case '@':
			return true;
		case '[':
			return true;
		case ']':
			return true;
		case '_':
			return true;
		case '{':
			return true;
		case '}':
			return true;
		case '~':
			return true;
		default:
			return false;
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$containPunctuation = A2(
	$elm$core$String$foldl,
	F2(
		function (c, accum) {
			return accum || $dillonkearns$elm_markdown$Markdown$InlineParser$isPunctuation(c);
		}),
	false);
var $dillonkearns$elm_markdown$Markdown$InlineParser$isWhitespace = function (c) {
	switch (c.valueOf()) {
		case ' ':
			return true;
		case '\u000C':
			return true;
		case '\n':
			return true;
		case '\r':
			return true;
		case '\t':
			return true;
		case '\u000B':
			return true;
		case '\u00A0':
			return true;
		case '\u2028':
			return true;
		case '\u2029':
			return true;
		default:
			return false;
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$containSpace = A2(
	$elm$core$String$foldl,
	F2(
		function (c, accum) {
			return accum || $dillonkearns$elm_markdown$Markdown$InlineParser$isWhitespace(c);
		}),
	false);
var $dillonkearns$elm_markdown$Markdown$InlineParser$getFringeRank = function (mstring) {
	if (mstring.$ === 'Just') {
		var string = mstring.a;
		return ($elm$core$String$isEmpty(string) || $dillonkearns$elm_markdown$Markdown$InlineParser$containSpace(string)) ? 0 : ($dillonkearns$elm_markdown$Markdown$InlineParser$containPunctuation(string) ? 1 : 2);
	} else {
		return 0;
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToEmphasisToken = F3(
	function (_char, rawText, regMatch) {
		var _v0 = regMatch.submatches;
		if ((((_v0.b && _v0.b.b) && _v0.b.b.b) && (_v0.b.b.a.$ === 'Just')) && _v0.b.b.b.b) {
			var maybeBackslashes = _v0.a;
			var _v1 = _v0.b;
			var maybeLeftFringe = _v1.a;
			var _v2 = _v1.b;
			var delimiter = _v2.a.a;
			var _v3 = _v2.b;
			var maybeRightFringe = _v3.a;
			var rFringeRank = $dillonkearns$elm_markdown$Markdown$InlineParser$getFringeRank(maybeRightFringe);
			var leftFringeLength = function () {
				if (maybeLeftFringe.$ === 'Just') {
					var left = maybeLeftFringe.a;
					return $elm$core$String$length(left);
				} else {
					return 0;
				}
			}();
			var mLeftFringe = ((!(!regMatch.index)) && (!leftFringeLength)) ? $elm$core$Maybe$Just(
				A3($elm$core$String$slice, regMatch.index - 1, regMatch.index, rawText)) : maybeLeftFringe;
			var backslashesLength = function () {
				if (maybeBackslashes.$ === 'Just') {
					var backslashes = maybeBackslashes.a;
					return $elm$core$String$length(backslashes);
				} else {
					return 0;
				}
			}();
			var isEscaped = ((!$dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength)) && (!leftFringeLength)) || function () {
				if ((mLeftFringe.$ === 'Just') && (mLeftFringe.a === '\\')) {
					return true;
				} else {
					return false;
				}
			}();
			var delimiterLength = isEscaped ? ($elm$core$String$length(delimiter) - 1) : $elm$core$String$length(delimiter);
			var lFringeRank = isEscaped ? 1 : $dillonkearns$elm_markdown$Markdown$InlineParser$getFringeRank(mLeftFringe);
			if ((delimiterLength <= 0) || (_Utils_eq(
				_char,
				_Utils_chr('_')) && ((lFringeRank === 2) && (rFringeRank === 2)))) {
				return $elm$core$Maybe$Nothing;
			} else {
				var index = ((regMatch.index + backslashesLength) + leftFringeLength) + (isEscaped ? 1 : 0);
				return $elm$core$Maybe$Just(
					{
						index: index,
						length: delimiterLength,
						meaning: A2(
							$dillonkearns$elm_markdown$Markdown$InlineParser$EmphasisToken,
							_char,
							{leftFringeRank: lFringeRank, rightFringeRank: rFringeRank})
					});
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$findAsteriskEmphasisTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		A2(
			$dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToEmphasisToken,
			_Utils_chr('*'),
			str),
		A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$asteriskEmphasisTokenRegex, str));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$codeTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(\\`+)'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$CodeToken = function (a) {
	return {$: 'CodeToken', a: a};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToCodeToken = function (regMatch) {
	var _v0 = regMatch.submatches;
	if ((_v0.b && _v0.b.b) && (_v0.b.a.$ === 'Just')) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var backtick = _v1.a.a;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		return $elm$core$Maybe$Just(
			{
				index: regMatch.index + backslashesLength,
				length: $elm$core$String$length(backtick),
				meaning: $dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? $dillonkearns$elm_markdown$Markdown$InlineParser$CodeToken($dillonkearns$elm_markdown$Markdown$InlineParser$NotEscaped) : $dillonkearns$elm_markdown$Markdown$InlineParser$CodeToken($dillonkearns$elm_markdown$Markdown$InlineParser$Escaped)
			});
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$findCodeTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToCodeToken,
		A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$codeTokenRegex, str));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$hardBreakTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(?:(\\\\+)|( {2,}))\\n'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakToken = {$: 'HardLineBreakToken'};
var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToHardBreakToken = function (regMatch) {
	var _v0 = regMatch.submatches;
	_v0$2:
	while (true) {
		if (_v0.b) {
			if (_v0.a.$ === 'Just') {
				var backslashes = _v0.a.a;
				var backslashesLength = $elm$core$String$length(backslashes);
				return (!$dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength)) ? $elm$core$Maybe$Just(
					{index: (regMatch.index + backslashesLength) - 1, length: 2, meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakToken}) : $elm$core$Maybe$Nothing;
			} else {
				if (_v0.b.b && (_v0.b.a.$ === 'Just')) {
					var _v1 = _v0.b;
					return $elm$core$Maybe$Just(
						{
							index: regMatch.index,
							length: $elm$core$String$length(regMatch.match),
							meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakToken
						});
				} else {
					break _v0$2;
				}
			}
		} else {
			break _v0$2;
		}
	}
	return $elm$core$Maybe$Nothing;
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToSoftHardBreakToken = function (regMatch) {
	var _v0 = regMatch.submatches;
	_v0$2:
	while (true) {
		if (_v0.b) {
			if (_v0.a.$ === 'Just') {
				var backslashes = _v0.a.a;
				var backslashesLength = $elm$core$String$length(backslashes);
				return $dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? $elm$core$Maybe$Just(
					{index: regMatch.index + backslashesLength, length: 1, meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakToken}) : $elm$core$Maybe$Just(
					{index: (regMatch.index + backslashesLength) - 1, length: 2, meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakToken});
			} else {
				if (_v0.b.b) {
					var _v1 = _v0.b;
					var maybeSpaces = _v1.a;
					return $elm$core$Maybe$Just(
						{
							index: regMatch.index,
							length: $elm$core$String$length(regMatch.match),
							meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakToken
						});
				} else {
					break _v0$2;
				}
			}
		} else {
			break _v0$2;
		}
	}
	return $elm$core$Maybe$Nothing;
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$softAsHardLineBreak = false;
var $dillonkearns$elm_markdown$Markdown$InlineParser$softAsHardLineBreakTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(?:(\\\\+)|( *))\\n'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$findHardBreakTokens = function (str) {
	return $dillonkearns$elm_markdown$Markdown$InlineParser$softAsHardLineBreak ? A2(
		$elm$core$List$filterMap,
		$dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToSoftHardBreakToken,
		A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$softAsHardLineBreakTokenRegex, str)) : A2(
		$elm$core$List$filterMap,
		$dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToHardBreakToken,
		A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$hardBreakTokenRegex, str));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$linkImageCloseTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(\\])'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$SquareBracketClose = {$: 'SquareBracketClose'};
var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToLinkImageCloseToken = function (regMatch) {
	var _v0 = regMatch.submatches;
	if ((_v0.b && _v0.b.b) && (_v0.b.a.$ === 'Just')) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		return $dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? $elm$core$Maybe$Just(
			{index: regMatch.index + backslashesLength, length: 1, meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$SquareBracketClose}) : $elm$core$Maybe$Nothing;
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$findLinkImageCloseTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToLinkImageCloseToken,
		A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$linkImageCloseTokenRegex, str));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$linkImageOpenTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(\\!)?(\\[)'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$Active = {$: 'Active'};
var $dillonkearns$elm_markdown$Markdown$InlineParser$ImageOpenToken = {$: 'ImageOpenToken'};
var $dillonkearns$elm_markdown$Markdown$InlineParser$LinkOpenToken = function (a) {
	return {$: 'LinkOpenToken', a: a};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToLinkImageOpenToken = function (regMatch) {
	var _v0 = regMatch.submatches;
	if (((_v0.b && _v0.b.b) && _v0.b.b.b) && (_v0.b.b.a.$ === 'Just')) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var maybeImageOpen = _v1.a;
		var _v2 = _v1.b;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		var isEscaped = !$dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength);
		var index = isEscaped ? ((regMatch.index + backslashesLength) + 1) : (regMatch.index + backslashesLength);
		if (isEscaped) {
			if (maybeImageOpen.$ === 'Just') {
				return $elm$core$Maybe$Just(
					{
						index: index,
						length: 1,
						meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$LinkOpenToken($dillonkearns$elm_markdown$Markdown$InlineParser$Active)
					});
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			if (maybeImageOpen.$ === 'Just') {
				return $elm$core$Maybe$Just(
					{index: index, length: 2, meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$ImageOpenToken});
			} else {
				return $elm$core$Maybe$Just(
					{
						index: index,
						length: 1,
						meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$LinkOpenToken($dillonkearns$elm_markdown$Markdown$InlineParser$Active)
					});
			}
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$findLinkImageOpenTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToLinkImageOpenToken,
		A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$linkImageOpenTokenRegex, str));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$StrikethroughToken = function (a) {
	return {$: 'StrikethroughToken', a: a};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToStrikethroughToken = function (regMatch) {
	var _v0 = regMatch.submatches;
	if ((_v0.b && _v0.b.b) && (_v0.b.a.$ === 'Just')) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var tilde = _v1.a.a;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		var _v2 = $dillonkearns$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? _Utils_Tuple2(
			$elm$core$String$length(tilde),
			$dillonkearns$elm_markdown$Markdown$InlineParser$StrikethroughToken($dillonkearns$elm_markdown$Markdown$InlineParser$NotEscaped)) : _Utils_Tuple2(
			$elm$core$String$length(tilde),
			$dillonkearns$elm_markdown$Markdown$InlineParser$StrikethroughToken($dillonkearns$elm_markdown$Markdown$InlineParser$Escaped));
		var length = _v2.a;
		var meaning = _v2.b;
		return $elm$core$Maybe$Just(
			{index: regMatch.index + backslashesLength, length: length, meaning: meaning});
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$strikethroughTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(~{2,})([^~])?'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$findStrikethroughTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToStrikethroughToken,
		A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$strikethroughTokenRegex, str));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$underlineEmphasisTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)([^_])?(\\_+)([^_])?'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$findUnderlineEmphasisTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		A2(
			$dillonkearns$elm_markdown$Markdown$InlineParser$regMatchToEmphasisToken,
			_Utils_chr('_'),
			str),
		A2($elm$regex$Regex$find, $dillonkearns$elm_markdown$Markdown$InlineParser$underlineEmphasisTokenRegex, str));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex = F2(
	function (left, right) {
		if (left.b) {
			var lfirst = left.a;
			var lrest = left.b;
			if (right.b) {
				var rfirst = right.a;
				var rrest = right.b;
				return (_Utils_cmp(lfirst.index, rfirst.index) < 0) ? A2(
					$elm$core$List$cons,
					lfirst,
					A2($dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex, lrest, right)) : A2(
					$elm$core$List$cons,
					rfirst,
					A2($dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex, left, rrest));
			} else {
				return left;
			}
		} else {
			return right;
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$tokenize = function (rawText) {
	return A2(
		$dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex,
		$dillonkearns$elm_markdown$Markdown$InlineParser$findAngleBracketRTokens(rawText),
		A2(
			$dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex,
			$dillonkearns$elm_markdown$Markdown$InlineParser$findAngleBracketLTokens(rawText),
			A2(
				$dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex,
				$dillonkearns$elm_markdown$Markdown$InlineParser$findHardBreakTokens(rawText),
				A2(
					$dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex,
					$dillonkearns$elm_markdown$Markdown$InlineParser$findLinkImageCloseTokens(rawText),
					A2(
						$dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex,
						$dillonkearns$elm_markdown$Markdown$InlineParser$findLinkImageOpenTokens(rawText),
						A2(
							$dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex,
							$dillonkearns$elm_markdown$Markdown$InlineParser$findStrikethroughTokens(rawText),
							A2(
								$dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex,
								$dillonkearns$elm_markdown$Markdown$InlineParser$findUnderlineEmphasisTokens(rawText),
								A2(
									$dillonkearns$elm_markdown$Markdown$InlineParser$mergeByIndex,
									$dillonkearns$elm_markdown$Markdown$InlineParser$findAsteriskEmphasisTokens(rawText),
									$dillonkearns$elm_markdown$Markdown$InlineParser$findCodeTokens(rawText)))))))));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$CodeType = {$: 'CodeType'};
var $dillonkearns$elm_markdown$Markdown$InlineParser$EmphasisType = function (a) {
	return {$: 'EmphasisType', a: a};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$HtmlType = function (a) {
	return {$: 'HtmlType', a: a};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$ImageType = function (a) {
	return {$: 'ImageType', a: a};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$Inactive = {$: 'Inactive'};
var $dillonkearns$elm_markdown$Markdown$InlineParser$LinkType = function (a) {
	return {$: 'LinkType', a: a};
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$StrikethroughType = {$: 'StrikethroughType'};
var $dillonkearns$elm_markdown$Markdown$InlineParser$AutolinkType = function (a) {
	return {$: 'AutolinkType', a: a};
};
var $elm$regex$Regex$contains = _Regex_contains;
var $dillonkearns$elm_markdown$Markdown$InlineParser$decodeUrlRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('%(?:3B|2C|2F|3F|3A|40|26|3D|2B|24|23|25)'));
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $dillonkearns$elm_markdown$Markdown$InlineParser$encodeUrl = A2(
	$elm$core$Basics$composeR,
	$elm$url$Url$percentEncode,
	A2(
		$elm$regex$Regex$replace,
		$dillonkearns$elm_markdown$Markdown$InlineParser$decodeUrlRegex,
		function (match) {
			return A2(
				$elm$core$Maybe$withDefault,
				match.match,
				$elm$url$Url$percentDecode(match.match));
		}));
var $dillonkearns$elm_markdown$Markdown$InlineParser$urlRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^([A-Za-z][A-Za-z0-9.+\\-]{1,31}:[^<>\\x00-\\x20]*)$'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$autolinkToMatch = function (_v0) {
	var match = _v0.a;
	return A2($elm$regex$Regex$contains, $dillonkearns$elm_markdown$Markdown$InlineParser$urlRegex, match.text) ? $elm$core$Result$Ok(
		$dillonkearns$elm_markdown$Markdown$InlineParser$Match(
			_Utils_update(
				match,
				{
					type_: $dillonkearns$elm_markdown$Markdown$InlineParser$AutolinkType(
						_Utils_Tuple2(
							match.text,
							$dillonkearns$elm_markdown$Markdown$InlineParser$encodeUrl(match.text)))
				}))) : $elm$core$Result$Err(
		$dillonkearns$elm_markdown$Markdown$InlineParser$Match(match));
};
var $elm$regex$Regex$findAtMost = _Regex_findAtMost;
var $dillonkearns$elm_markdown$Markdown$Helpers$insideSquareBracketRegex = '[^\\[\\]\\\\]*(?:\\\\.[^\\[\\]\\\\]*)*';
var $dillonkearns$elm_markdown$Markdown$InlineParser$refLabelRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^\\[\\s*(' + ($dillonkearns$elm_markdown$Markdown$Helpers$insideSquareBracketRegex + ')\\s*\\]')));
var $dillonkearns$elm_markdown$Markdown$Helpers$cleanWhitespaces = function (original) {
	return original;
};
var $dillonkearns$elm_markdown$Markdown$Helpers$prepareRefLabel = A2($elm$core$Basics$composeR, $dillonkearns$elm_markdown$Markdown$Helpers$cleanWhitespaces, $elm$core$String$toLower);
var $dillonkearns$elm_markdown$Markdown$InlineParser$prepareUrlAndTitle = F2(
	function (rawUrl, maybeTitle) {
		return _Utils_Tuple2(
			$dillonkearns$elm_markdown$Markdown$InlineParser$encodeUrl(
				$dillonkearns$elm_markdown$Markdown$Helpers$formatStr(rawUrl)),
			A2($elm$core$Maybe$map, $dillonkearns$elm_markdown$Markdown$Helpers$formatStr, maybeTitle));
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$refRegexToMatch = F3(
	function (matchModel, references, maybeRegexMatch) {
		var refLabel = function (str) {
			return $elm$core$String$isEmpty(str) ? matchModel.text : str;
		}(
			A2(
				$elm$core$Maybe$withDefault,
				matchModel.text,
				A2(
					$elm$core$Maybe$withDefault,
					$elm$core$Maybe$Nothing,
					A2(
						$elm$core$Maybe$andThen,
						A2(
							$elm$core$Basics$composeR,
							function ($) {
								return $.submatches;
							},
							$elm$core$List$head),
						maybeRegexMatch))));
		var _v0 = A2(
			$elm$core$Dict$get,
			$dillonkearns$elm_markdown$Markdown$Helpers$prepareRefLabel(refLabel),
			references);
		if (_v0.$ === 'Nothing') {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v1 = _v0.a;
			var rawUrl = _v1.a;
			var maybeTitle = _v1.b;
			var type_ = function () {
				var _v3 = matchModel.type_;
				if (_v3.$ === 'ImageType') {
					return $dillonkearns$elm_markdown$Markdown$InlineParser$ImageType(
						A2($dillonkearns$elm_markdown$Markdown$InlineParser$prepareUrlAndTitle, rawUrl, maybeTitle));
				} else {
					return $dillonkearns$elm_markdown$Markdown$InlineParser$LinkType(
						A2($dillonkearns$elm_markdown$Markdown$InlineParser$prepareUrlAndTitle, rawUrl, maybeTitle));
				}
			}();
			var regexMatchLength = function () {
				if (maybeRegexMatch.$ === 'Just') {
					var match = maybeRegexMatch.a.match;
					return $elm$core$String$length(match);
				} else {
					return 0;
				}
			}();
			return $elm$core$Maybe$Just(
				$dillonkearns$elm_markdown$Markdown$InlineParser$Match(
					_Utils_update(
						matchModel,
						{end: matchModel.end + regexMatchLength, type_: type_})));
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$checkForInlineReferences = F3(
	function (remainText, _v0, references) {
		var tempMatch = _v0.a;
		var matches = A3($elm$regex$Regex$findAtMost, 1, $dillonkearns$elm_markdown$Markdown$InlineParser$refLabelRegex, remainText);
		return A3(
			$dillonkearns$elm_markdown$Markdown$InlineParser$refRegexToMatch,
			tempMatch,
			references,
			$elm$core$List$head(matches));
	});
var $dillonkearns$elm_markdown$Markdown$Helpers$lineEndChars = '\\f\\v\\r\\n';
var $dillonkearns$elm_markdown$Markdown$Helpers$whiteSpaceChars = ' \\t\\f\\v\\r\\n';
var $dillonkearns$elm_markdown$Markdown$InlineParser$hrefRegex = '(?:<([^<>' + ($dillonkearns$elm_markdown$Markdown$Helpers$lineEndChars + (']*)>|([^' + ($dillonkearns$elm_markdown$Markdown$Helpers$whiteSpaceChars + ('\\(\\)\\\\]*(?:\\\\.[^' + ($dillonkearns$elm_markdown$Markdown$Helpers$whiteSpaceChars + '\\(\\)\\\\]*)*))')))));
var $dillonkearns$elm_markdown$Markdown$Helpers$titleRegex = '(?:[' + ($dillonkearns$elm_markdown$Markdown$Helpers$whiteSpaceChars + (']+' + ('(?:\'([^\'\\\\]*(?:\\\\.[^\'\\\\]*)*)\'|' + ('\"([^\"\\\\]*(?:\\\\.[^\"\\\\]*)*)\"|' + '\\(([^\\)\\\\]*(?:\\\\.[^\\)\\\\]*)*)\\)))?'))));
var $dillonkearns$elm_markdown$Markdown$InlineParser$inlineLinkTypeOrImageTypeRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^\\(\\s*' + ($dillonkearns$elm_markdown$Markdown$InlineParser$hrefRegex + ($dillonkearns$elm_markdown$Markdown$Helpers$titleRegex + '\\s*\\)'))));
var $dillonkearns$elm_markdown$Markdown$Helpers$returnFirstJust = function (maybes) {
	var process = F2(
		function (a, maybeFound) {
			if (maybeFound.$ === 'Just') {
				var found = maybeFound.a;
				return $elm$core$Maybe$Just(found);
			} else {
				return a;
			}
		});
	return A3($elm$core$List$foldl, process, $elm$core$Maybe$Nothing, maybes);
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$inlineLinkTypeOrImageTypeRegexToMatch = F2(
	function (matchModel, regexMatch) {
		var _v0 = regexMatch.submatches;
		if ((((_v0.b && _v0.b.b) && _v0.b.b.b) && _v0.b.b.b.b) && _v0.b.b.b.b.b) {
			var maybeRawUrlAngleBrackets = _v0.a;
			var _v1 = _v0.b;
			var maybeRawUrlWithoutBrackets = _v1.a;
			var _v2 = _v1.b;
			var maybeTitleSingleQuotes = _v2.a;
			var _v3 = _v2.b;
			var maybeTitleDoubleQuotes = _v3.a;
			var _v4 = _v3.b;
			var maybeTitleParenthesis = _v4.a;
			var maybeTitle = $dillonkearns$elm_markdown$Markdown$Helpers$returnFirstJust(
				_List_fromArray(
					[maybeTitleSingleQuotes, maybeTitleDoubleQuotes, maybeTitleParenthesis]));
			var toMatch = function (rawUrl) {
				return $dillonkearns$elm_markdown$Markdown$InlineParser$Match(
					_Utils_update(
						matchModel,
						{
							end: matchModel.end + $elm$core$String$length(regexMatch.match),
							type_: function () {
								var _v5 = matchModel.type_;
								if (_v5.$ === 'ImageType') {
									return $dillonkearns$elm_markdown$Markdown$InlineParser$ImageType;
								} else {
									return $dillonkearns$elm_markdown$Markdown$InlineParser$LinkType;
								}
							}()(
								A2($dillonkearns$elm_markdown$Markdown$InlineParser$prepareUrlAndTitle, rawUrl, maybeTitle))
						}));
			};
			var maybeRawUrl = $dillonkearns$elm_markdown$Markdown$Helpers$returnFirstJust(
				_List_fromArray(
					[maybeRawUrlAngleBrackets, maybeRawUrlWithoutBrackets]));
			return $elm$core$Maybe$Just(
				toMatch(
					A2($elm$core$Maybe$withDefault, '', maybeRawUrl)));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$checkForInlineLinkTypeOrImageType = F3(
	function (remainText, _v0, refs) {
		var tempMatch = _v0.a;
		var _v1 = A3($elm$regex$Regex$findAtMost, 1, $dillonkearns$elm_markdown$Markdown$InlineParser$inlineLinkTypeOrImageTypeRegex, remainText);
		if (_v1.b) {
			var first = _v1.a;
			var _v2 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$inlineLinkTypeOrImageTypeRegexToMatch, tempMatch, first);
			if (_v2.$ === 'Just') {
				var match = _v2.a;
				return $elm$core$Maybe$Just(match);
			} else {
				return A3(
					$dillonkearns$elm_markdown$Markdown$InlineParser$checkForInlineReferences,
					remainText,
					$dillonkearns$elm_markdown$Markdown$InlineParser$Match(tempMatch),
					refs);
			}
		} else {
			return A3(
				$dillonkearns$elm_markdown$Markdown$InlineParser$checkForInlineReferences,
				remainText,
				$dillonkearns$elm_markdown$Markdown$InlineParser$Match(tempMatch),
				refs);
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$checkParsedAheadOverlapping = F2(
	function (_v0, remainMatches) {
		var match = _v0.a;
		var overlappingMatches = $elm$core$List$filter(
			function (_v1) {
				var testMatch = _v1.a;
				return (_Utils_cmp(match.end, testMatch.start) > 0) && (_Utils_cmp(match.end, testMatch.end) < 0);
			});
		return ($elm$core$List$isEmpty(remainMatches) || $elm$core$List$isEmpty(
			overlappingMatches(remainMatches))) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$List$cons,
				$dillonkearns$elm_markdown$Markdown$InlineParser$Match(match),
				remainMatches)) : $elm$core$Maybe$Nothing;
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$emailRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^([a-zA-Z0-9.!#$%&\'*+\\/=?^_`{|}~\\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?)*)$'));
var $dillonkearns$elm_markdown$Markdown$InlineParser$emailAutolinkTypeToMatch = function (_v0) {
	var match = _v0.a;
	return A2($elm$regex$Regex$contains, $dillonkearns$elm_markdown$Markdown$InlineParser$emailRegex, match.text) ? $elm$core$Result$Ok(
		$dillonkearns$elm_markdown$Markdown$InlineParser$Match(
			_Utils_update(
				match,
				{
					type_: $dillonkearns$elm_markdown$Markdown$InlineParser$AutolinkType(
						_Utils_Tuple2(
							match.text,
							'mailto:' + $dillonkearns$elm_markdown$Markdown$InlineParser$encodeUrl(match.text)))
				}))) : $elm$core$Result$Err(
		$dillonkearns$elm_markdown$Markdown$InlineParser$Match(match));
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$findTokenHelp = F3(
	function (innerTokens, isToken, tokens) {
		findTokenHelp:
		while (true) {
			if (!tokens.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var nextToken = tokens.a;
				var remainingTokens = tokens.b;
				if (isToken(nextToken)) {
					return $elm$core$Maybe$Just(
						_Utils_Tuple3(
							nextToken,
							$elm$core$List$reverse(innerTokens),
							remainingTokens));
				} else {
					var $temp$innerTokens = A2($elm$core$List$cons, nextToken, innerTokens),
						$temp$isToken = isToken,
						$temp$tokens = remainingTokens;
					innerTokens = $temp$innerTokens;
					isToken = $temp$isToken;
					tokens = $temp$tokens;
					continue findTokenHelp;
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$findToken = F2(
	function (isToken, tokens) {
		return A3($dillonkearns$elm_markdown$Markdown$InlineParser$findTokenHelp, _List_Nil, isToken, tokens);
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$HtmlToken = F2(
	function (a, b) {
		return {$: 'HtmlToken', a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$NotOpening = {$: 'NotOpening'};
var $dillonkearns$elm_markdown$Markdown$InlineParser$htmlToToken = F2(
	function (rawText, _v0) {
		var match = _v0.a;
		var consumedCharacters = A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$keeper,
					$elm$parser$Parser$Advanced$succeed(
						F3(
							function (startOffset, htmlTag, endOffset) {
								return {htmlTag: htmlTag, length: endOffset - startOffset};
							})),
					$elm$parser$Parser$Advanced$getOffset),
				$dillonkearns$elm_markdown$HtmlParser$html),
			$elm$parser$Parser$Advanced$getOffset);
		var parsed = A2(
			$elm$parser$Parser$Advanced$run,
			consumedCharacters,
			A2($elm$core$String$dropLeft, match.start, rawText));
		if (parsed.$ === 'Ok') {
			var htmlTag = parsed.a.htmlTag;
			var length = parsed.a.length;
			var htmlToken = A2($dillonkearns$elm_markdown$Markdown$InlineParser$HtmlToken, $dillonkearns$elm_markdown$Markdown$InlineParser$NotOpening, htmlTag);
			return $elm$core$Maybe$Just(
				{index: match.start, length: length, meaning: htmlToken});
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $dillonkearns$elm_markdown$Markdown$Helpers$ifError = F2(
	function (_function, result) {
		if (result.$ === 'Ok') {
			return result;
		} else {
			var err = result.a;
			return _function(err);
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$isCloseToken = F2(
	function (htmlModel, token) {
		return false;
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$isCodeTokenPair = F2(
	function (closeToken, openToken) {
		var _v0 = openToken.meaning;
		if (_v0.$ === 'CodeToken') {
			if (_v0.a.$ === 'Escaped') {
				var _v1 = _v0.a;
				return _Utils_eq(openToken.length - 1, closeToken.length);
			} else {
				var _v2 = _v0.a;
				return _Utils_eq(openToken.length, closeToken.length);
			}
		} else {
			return false;
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$isLinkTypeOrImageOpenToken = function (token) {
	var _v0 = token.meaning;
	switch (_v0.$) {
		case 'LinkOpenToken':
			return true;
		case 'ImageOpenToken':
			return true;
		default:
			return false;
	}
};
var $dillonkearns$elm_markdown$Markdown$InlineParser$isOpenEmphasisToken = F2(
	function (closeToken, openToken) {
		var _v0 = openToken.meaning;
		if (_v0.$ === 'EmphasisToken') {
			var openChar = _v0.a;
			var open = _v0.b;
			var _v1 = closeToken.meaning;
			if (_v1.$ === 'EmphasisToken') {
				var closeChar = _v1.a;
				var close = _v1.b;
				return _Utils_eq(openChar, closeChar) ? ((_Utils_eq(open.leftFringeRank, open.rightFringeRank) || _Utils_eq(close.leftFringeRank, close.rightFringeRank)) ? ((!(!A2($elm$core$Basics$modBy, 3, closeToken.length + openToken.length))) || ((!A2($elm$core$Basics$modBy, 3, closeToken.length)) && (!A2($elm$core$Basics$modBy, 3, openToken.length)))) : true) : false;
			} else {
				return false;
			}
		} else {
			return false;
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$isStrikethroughTokenPair = F2(
	function (closeToken, openToken) {
		var _v0 = function () {
			var _v1 = openToken.meaning;
			if (_v1.$ === 'StrikethroughToken') {
				if (_v1.a.$ === 'Escaped') {
					var _v2 = _v1.a;
					return _Utils_Tuple2(true, openToken.length - 1);
				} else {
					var _v3 = _v1.a;
					return _Utils_Tuple2(true, openToken.length);
				}
			} else {
				return _Utils_Tuple2(false, 0);
			}
		}();
		var openTokenIsStrikethrough = _v0.a;
		var openTokenLength = _v0.b;
		var _v4 = function () {
			var _v5 = closeToken.meaning;
			if (_v5.$ === 'StrikethroughToken') {
				if (_v5.a.$ === 'Escaped') {
					var _v6 = _v5.a;
					return _Utils_Tuple2(true, closeToken.length - 1);
				} else {
					var _v7 = _v5.a;
					return _Utils_Tuple2(true, closeToken.length);
				}
			} else {
				return _Utils_Tuple2(false, 0);
			}
		}();
		var closeTokenIsStrikethrough = _v4.a;
		var closeTokenLength = _v4.b;
		return closeTokenIsStrikethrough && (openTokenIsStrikethrough && _Utils_eq(closeTokenLength, openTokenLength));
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakType = {$: 'HardLineBreakType'};
var $dillonkearns$elm_markdown$Markdown$InlineParser$tokenToMatch = F2(
	function (token, type_) {
		return $dillonkearns$elm_markdown$Markdown$InlineParser$Match(
			{end: token.index + token.length, matches: _List_Nil, start: token.index, text: '', textEnd: 0, textStart: 0, type_: type_});
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$lineBreakTTM = F5(
	function (remaining, tokens, matches, refs, rawText) {
		lineBreakTTM:
		while (true) {
			if (!remaining.b) {
				return matches;
			} else {
				var token = remaining.a;
				var tokensTail = remaining.b;
				var _v1 = token.meaning;
				if (_v1.$ === 'HardLineBreakToken') {
					var $temp$remaining = tokensTail,
						$temp$tokens = tokens,
						$temp$matches = A2(
						$elm$core$List$cons,
						A2($dillonkearns$elm_markdown$Markdown$InlineParser$tokenToMatch, token, $dillonkearns$elm_markdown$Markdown$InlineParser$HardLineBreakType),
						matches),
						$temp$refs = refs,
						$temp$rawText = rawText;
					remaining = $temp$remaining;
					tokens = $temp$tokens;
					matches = $temp$matches;
					refs = $temp$refs;
					rawText = $temp$rawText;
					continue lineBreakTTM;
				} else {
					var $temp$remaining = tokensTail,
						$temp$tokens = A2($elm$core$List$cons, token, tokens),
						$temp$matches = matches,
						$temp$refs = refs,
						$temp$rawText = rawText;
					remaining = $temp$remaining;
					tokens = $temp$tokens;
					matches = $temp$matches;
					refs = $temp$refs;
					rawText = $temp$rawText;
					continue lineBreakTTM;
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$removeParsedAheadTokens = F2(
	function (_v0, tokensTail) {
		var match = _v0.a;
		return A2(
			$elm$core$List$filter,
			function (token) {
				return _Utils_cmp(token.index, match.end) > -1;
			},
			tokensTail);
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$angleBracketsToMatch = F6(
	function (closeToken, escaped, matches, references, rawText, _v46) {
		var openToken = _v46.a;
		var remainTokens = _v46.c;
		var result = A2(
			$dillonkearns$elm_markdown$Markdown$Helpers$ifError,
			$dillonkearns$elm_markdown$Markdown$InlineParser$emailAutolinkTypeToMatch,
			$dillonkearns$elm_markdown$Markdown$InlineParser$autolinkToMatch(
				A7(
					$dillonkearns$elm_markdown$Markdown$InlineParser$tokenPairToMatch,
					references,
					rawText,
					function (s) {
						return s;
					},
					$dillonkearns$elm_markdown$Markdown$InlineParser$CodeType,
					openToken,
					closeToken,
					_List_Nil)));
		if (result.$ === 'Err') {
			var tempMatch = result.a;
			if (escaped.$ === 'NotEscaped') {
				var _v49 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$htmlToToken, rawText, tempMatch);
				if (_v49.$ === 'Just') {
					var newToken = _v49.a;
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							A2($elm$core$List$cons, newToken, remainTokens),
							matches));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			var newMatch = result.a;
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(
					remainTokens,
					A2($elm$core$List$cons, newMatch, matches)));
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$codeAutolinkTypeHtmlTagTTM = F5(
	function (remaining, tokens, matches, references, rawText) {
		codeAutolinkTypeHtmlTagTTM:
		while (true) {
			if (!remaining.b) {
				return A5(
					$dillonkearns$elm_markdown$Markdown$InlineParser$htmlElementTTM,
					$elm$core$List$reverse(tokens),
					_List_Nil,
					matches,
					references,
					rawText);
			} else {
				var token = remaining.a;
				var tokensTail = remaining.b;
				var _v38 = token.meaning;
				switch (_v38.$) {
					case 'CodeToken':
						var isEscaped = _v38.a;
						var _v39 = A2(
							$dillonkearns$elm_markdown$Markdown$InlineParser$findToken,
							$dillonkearns$elm_markdown$Markdown$InlineParser$isCodeTokenPair(token),
							tokens);
						if (_v39.$ === 'Just') {
							var code = _v39.a;
							var _v40 = A5($dillonkearns$elm_markdown$Markdown$InlineParser$codeToMatch, token, matches, references, rawText, code);
							var newTokens = _v40.a;
							var newMatches = _v40.b;
							var $temp$remaining = tokensTail,
								$temp$tokens = newTokens,
								$temp$matches = newMatches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue codeAutolinkTypeHtmlTagTTM;
						} else {
							var $temp$remaining = tokensTail,
								$temp$tokens = A2($elm$core$List$cons, token, tokens),
								$temp$matches = matches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue codeAutolinkTypeHtmlTagTTM;
						}
					case 'AngleBracketClose':
						var isEscaped = _v38.a;
						var isAngleBracketOpen = function (_v45) {
							var meaning = _v45.meaning;
							if (meaning.$ === 'AngleBracketOpen') {
								return true;
							} else {
								return false;
							}
						};
						var _v41 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$findToken, isAngleBracketOpen, tokens);
						if (_v41.$ === 'Just') {
							var found = _v41.a;
							var _v42 = A6($dillonkearns$elm_markdown$Markdown$InlineParser$angleBracketsToMatch, token, isEscaped, matches, references, rawText, found);
							if (_v42.$ === 'Just') {
								var _v43 = _v42.a;
								var newTokens = _v43.a;
								var newMatches = _v43.b;
								var $temp$remaining = tokensTail,
									$temp$tokens = A2(
									$elm$core$List$filter,
									A2($elm$core$Basics$composeL, $elm$core$Basics$not, isAngleBracketOpen),
									newTokens),
									$temp$matches = newMatches,
									$temp$references = references,
									$temp$rawText = rawText;
								remaining = $temp$remaining;
								tokens = $temp$tokens;
								matches = $temp$matches;
								references = $temp$references;
								rawText = $temp$rawText;
								continue codeAutolinkTypeHtmlTagTTM;
							} else {
								var $temp$remaining = tokensTail,
									$temp$tokens = A2(
									$elm$core$List$filter,
									A2($elm$core$Basics$composeL, $elm$core$Basics$not, isAngleBracketOpen),
									tokens),
									$temp$matches = matches,
									$temp$references = references,
									$temp$rawText = rawText;
								remaining = $temp$remaining;
								tokens = $temp$tokens;
								matches = $temp$matches;
								references = $temp$references;
								rawText = $temp$rawText;
								continue codeAutolinkTypeHtmlTagTTM;
							}
						} else {
							var $temp$remaining = tokensTail,
								$temp$tokens = A2(
								$elm$core$List$filter,
								A2($elm$core$Basics$composeL, $elm$core$Basics$not, isAngleBracketOpen),
								tokens),
								$temp$matches = matches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue codeAutolinkTypeHtmlTagTTM;
						}
					default:
						var $temp$remaining = tokensTail,
							$temp$tokens = A2($elm$core$List$cons, token, tokens),
							$temp$matches = matches,
							$temp$references = references,
							$temp$rawText = rawText;
						remaining = $temp$remaining;
						tokens = $temp$tokens;
						matches = $temp$matches;
						references = $temp$references;
						rawText = $temp$rawText;
						continue codeAutolinkTypeHtmlTagTTM;
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$codeToMatch = F5(
	function (closeToken, matches, references, rawText, _v34) {
		var openToken = _v34.a;
		var remainTokens = _v34.c;
		var updatedOpenToken = function () {
			var _v35 = openToken.meaning;
			if ((_v35.$ === 'CodeToken') && (_v35.a.$ === 'Escaped')) {
				var _v36 = _v35.a;
				return _Utils_update(
					openToken,
					{index: openToken.index + 1, length: openToken.length - 1});
			} else {
				return openToken;
			}
		}();
		var match = A7($dillonkearns$elm_markdown$Markdown$InlineParser$tokenPairToMatch, references, rawText, $dillonkearns$elm_markdown$Markdown$Helpers$cleanWhitespaces, $dillonkearns$elm_markdown$Markdown$InlineParser$CodeType, updatedOpenToken, closeToken, _List_Nil);
		return _Utils_Tuple2(
			remainTokens,
			A2($elm$core$List$cons, match, matches));
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$emphasisTTM = F5(
	function (remaining, tokens, matches, references, rawText) {
		emphasisTTM:
		while (true) {
			if (!remaining.b) {
				return A5(
					$dillonkearns$elm_markdown$Markdown$InlineParser$strikethroughTTM,
					$elm$core$List$reverse(tokens),
					_List_Nil,
					matches,
					references,
					rawText);
			} else {
				var token = remaining.a;
				var tokensTail = remaining.b;
				var _v29 = token.meaning;
				if (_v29.$ === 'EmphasisToken') {
					var _char = _v29.a;
					var leftFringeRank = _v29.b.leftFringeRank;
					var rightFringeRank = _v29.b.rightFringeRank;
					if (_Utils_eq(leftFringeRank, rightFringeRank)) {
						if ((!(!rightFringeRank)) && ((!_Utils_eq(
							_char,
							_Utils_chr('_'))) || (rightFringeRank === 1))) {
							var _v30 = A2(
								$dillonkearns$elm_markdown$Markdown$InlineParser$findToken,
								$dillonkearns$elm_markdown$Markdown$InlineParser$isOpenEmphasisToken(token),
								tokens);
							if (_v30.$ === 'Just') {
								var found = _v30.a;
								var _v31 = A5($dillonkearns$elm_markdown$Markdown$InlineParser$emphasisToMatch, references, rawText, token, tokensTail, found);
								var newRemaining = _v31.a;
								var match = _v31.b;
								var newTokens = _v31.c;
								var $temp$remaining = newRemaining,
									$temp$tokens = newTokens,
									$temp$matches = A2($elm$core$List$cons, match, matches),
									$temp$references = references,
									$temp$rawText = rawText;
								remaining = $temp$remaining;
								tokens = $temp$tokens;
								matches = $temp$matches;
								references = $temp$references;
								rawText = $temp$rawText;
								continue emphasisTTM;
							} else {
								var $temp$remaining = tokensTail,
									$temp$tokens = A2($elm$core$List$cons, token, tokens),
									$temp$matches = matches,
									$temp$references = references,
									$temp$rawText = rawText;
								remaining = $temp$remaining;
								tokens = $temp$tokens;
								matches = $temp$matches;
								references = $temp$references;
								rawText = $temp$rawText;
								continue emphasisTTM;
							}
						} else {
							var $temp$remaining = tokensTail,
								$temp$tokens = tokens,
								$temp$matches = matches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue emphasisTTM;
						}
					} else {
						if (_Utils_cmp(leftFringeRank, rightFringeRank) < 0) {
							var $temp$remaining = tokensTail,
								$temp$tokens = A2($elm$core$List$cons, token, tokens),
								$temp$matches = matches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue emphasisTTM;
						} else {
							var _v32 = A2(
								$dillonkearns$elm_markdown$Markdown$InlineParser$findToken,
								$dillonkearns$elm_markdown$Markdown$InlineParser$isOpenEmphasisToken(token),
								tokens);
							if (_v32.$ === 'Just') {
								var found = _v32.a;
								var _v33 = A5($dillonkearns$elm_markdown$Markdown$InlineParser$emphasisToMatch, references, rawText, token, tokensTail, found);
								var newRemaining = _v33.a;
								var match = _v33.b;
								var newTokens = _v33.c;
								var $temp$remaining = newRemaining,
									$temp$tokens = newTokens,
									$temp$matches = A2($elm$core$List$cons, match, matches),
									$temp$references = references,
									$temp$rawText = rawText;
								remaining = $temp$remaining;
								tokens = $temp$tokens;
								matches = $temp$matches;
								references = $temp$references;
								rawText = $temp$rawText;
								continue emphasisTTM;
							} else {
								var $temp$remaining = tokensTail,
									$temp$tokens = tokens,
									$temp$matches = matches,
									$temp$references = references,
									$temp$rawText = rawText;
								remaining = $temp$remaining;
								tokens = $temp$tokens;
								matches = $temp$matches;
								references = $temp$references;
								rawText = $temp$rawText;
								continue emphasisTTM;
							}
						}
					}
				} else {
					var $temp$remaining = tokensTail,
						$temp$tokens = A2($elm$core$List$cons, token, tokens),
						$temp$matches = matches,
						$temp$references = references,
						$temp$rawText = rawText;
					remaining = $temp$remaining;
					tokens = $temp$tokens;
					matches = $temp$matches;
					references = $temp$references;
					rawText = $temp$rawText;
					continue emphasisTTM;
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$emphasisToMatch = F5(
	function (references, rawText, closeToken, tokensTail, _v27) {
		var openToken = _v27.a;
		var innerTokens = _v27.b;
		var remainTokens = _v27.c;
		var remainLength = openToken.length - closeToken.length;
		var updt = (!remainLength) ? {closeToken: closeToken, openToken: openToken, remainTokens: remainTokens, tokensTail: tokensTail} : ((remainLength > 0) ? {
			closeToken: closeToken,
			openToken: _Utils_update(
				openToken,
				{index: openToken.index + remainLength, length: closeToken.length}),
			remainTokens: A2(
				$elm$core$List$cons,
				_Utils_update(
					openToken,
					{length: remainLength}),
				remainTokens),
			tokensTail: tokensTail
		} : {
			closeToken: _Utils_update(
				closeToken,
				{length: openToken.length}),
			openToken: openToken,
			remainTokens: remainTokens,
			tokensTail: A2(
				$elm$core$List$cons,
				_Utils_update(
					closeToken,
					{index: closeToken.index + openToken.length, length: -remainLength}),
				tokensTail)
		});
		var match = A7(
			$dillonkearns$elm_markdown$Markdown$InlineParser$tokenPairToMatch,
			references,
			rawText,
			function (s) {
				return s;
			},
			$dillonkearns$elm_markdown$Markdown$InlineParser$EmphasisType(updt.openToken.length),
			updt.openToken,
			updt.closeToken,
			$elm$core$List$reverse(innerTokens));
		return _Utils_Tuple3(updt.tokensTail, match, updt.remainTokens);
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$htmlElementTTM = F5(
	function (remaining, tokens, matches, references, rawText) {
		htmlElementTTM:
		while (true) {
			if (!remaining.b) {
				return A5(
					$dillonkearns$elm_markdown$Markdown$InlineParser$linkImageTypeTTM,
					$elm$core$List$reverse(tokens),
					_List_Nil,
					matches,
					references,
					rawText);
			} else {
				var token = remaining.a;
				var tokensTail = remaining.b;
				var _v23 = token.meaning;
				if (_v23.$ === 'HtmlToken') {
					var isOpen = _v23.a;
					var htmlModel = _v23.b;
					if (isOpen.$ === 'NotOpening') {
						var $temp$remaining = tokensTail,
							$temp$tokens = tokens,
							$temp$matches = A2(
							$elm$core$List$cons,
							A2(
								$dillonkearns$elm_markdown$Markdown$InlineParser$tokenToMatch,
								token,
								$dillonkearns$elm_markdown$Markdown$InlineParser$HtmlType(htmlModel)),
							matches),
							$temp$references = references,
							$temp$rawText = rawText;
						remaining = $temp$remaining;
						tokens = $temp$tokens;
						matches = $temp$matches;
						references = $temp$references;
						rawText = $temp$rawText;
						continue htmlElementTTM;
					} else {
						var _v25 = A2(
							$dillonkearns$elm_markdown$Markdown$InlineParser$findToken,
							$dillonkearns$elm_markdown$Markdown$InlineParser$isCloseToken(htmlModel),
							tokensTail);
						if (_v25.$ === 'Nothing') {
							var $temp$remaining = tokensTail,
								$temp$tokens = tokens,
								$temp$matches = A2(
								$elm$core$List$cons,
								A2(
									$dillonkearns$elm_markdown$Markdown$InlineParser$tokenToMatch,
									token,
									$dillonkearns$elm_markdown$Markdown$InlineParser$HtmlType(htmlModel)),
								matches),
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue htmlElementTTM;
						} else {
							var _v26 = _v25.a;
							var closeToken = _v26.a;
							var innerTokens = _v26.b;
							var newTail = _v26.c;
							var newMatch = A7(
								$dillonkearns$elm_markdown$Markdown$InlineParser$tokenPairToMatch,
								references,
								rawText,
								function (s) {
									return s;
								},
								$dillonkearns$elm_markdown$Markdown$InlineParser$HtmlType(htmlModel),
								token,
								closeToken,
								innerTokens);
							var $temp$remaining = newTail,
								$temp$tokens = tokens,
								$temp$matches = A2($elm$core$List$cons, newMatch, matches),
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue htmlElementTTM;
						}
					}
				} else {
					var $temp$remaining = tokensTail,
						$temp$tokens = A2($elm$core$List$cons, token, tokens),
						$temp$matches = matches,
						$temp$references = references,
						$temp$rawText = rawText;
					remaining = $temp$remaining;
					tokens = $temp$tokens;
					matches = $temp$matches;
					references = $temp$references;
					rawText = $temp$rawText;
					continue htmlElementTTM;
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$linkImageTypeTTM = F5(
	function (remaining, tokens, matches, references, rawText) {
		linkImageTypeTTM:
		while (true) {
			if (!remaining.b) {
				return A5(
					$dillonkearns$elm_markdown$Markdown$InlineParser$emphasisTTM,
					$elm$core$List$reverse(tokens),
					_List_Nil,
					matches,
					references,
					rawText);
			} else {
				var token = remaining.a;
				var tokensTail = remaining.b;
				var _v18 = token.meaning;
				if (_v18.$ === 'SquareBracketClose') {
					var _v19 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$findToken, $dillonkearns$elm_markdown$Markdown$InlineParser$isLinkTypeOrImageOpenToken, tokens);
					if (_v19.$ === 'Just') {
						var found = _v19.a;
						var _v20 = A6($dillonkearns$elm_markdown$Markdown$InlineParser$linkOrImageTypeToMatch, token, tokensTail, matches, references, rawText, found);
						if (_v20.$ === 'Just') {
							var _v21 = _v20.a;
							var x = _v21.a;
							var newMatches = _v21.b;
							var newTokens = _v21.c;
							var $temp$remaining = x,
								$temp$tokens = newTokens,
								$temp$matches = newMatches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue linkImageTypeTTM;
						} else {
							var $temp$remaining = tokensTail,
								$temp$tokens = tokens,
								$temp$matches = matches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue linkImageTypeTTM;
						}
					} else {
						var $temp$remaining = tokensTail,
							$temp$tokens = tokens,
							$temp$matches = matches,
							$temp$references = references,
							$temp$rawText = rawText;
						remaining = $temp$remaining;
						tokens = $temp$tokens;
						matches = $temp$matches;
						references = $temp$references;
						rawText = $temp$rawText;
						continue linkImageTypeTTM;
					}
				} else {
					var $temp$remaining = tokensTail,
						$temp$tokens = A2($elm$core$List$cons, token, tokens),
						$temp$matches = matches,
						$temp$references = references,
						$temp$rawText = rawText;
					remaining = $temp$remaining;
					tokens = $temp$tokens;
					matches = $temp$matches;
					references = $temp$references;
					rawText = $temp$rawText;
					continue linkImageTypeTTM;
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$linkOrImageTypeToMatch = F6(
	function (closeToken, tokensTail, oldMatches, references, rawText, _v8) {
		var openToken = _v8.a;
		var innerTokens = _v8.b;
		var remainTokens = _v8.c;
		var removeOpenToken = _Utils_Tuple3(
			tokensTail,
			oldMatches,
			_Utils_ap(innerTokens, remainTokens));
		var remainText = A2($elm$core$String$dropLeft, closeToken.index + 1, rawText);
		var inactivateLinkOpenToken = function (token) {
			var _v16 = token.meaning;
			if (_v16.$ === 'LinkOpenToken') {
				return _Utils_update(
					token,
					{
						meaning: $dillonkearns$elm_markdown$Markdown$InlineParser$LinkOpenToken($dillonkearns$elm_markdown$Markdown$InlineParser$Inactive)
					});
			} else {
				return token;
			}
		};
		var findTempMatch = function (isLinkType) {
			return A7(
				$dillonkearns$elm_markdown$Markdown$InlineParser$tokenPairToMatch,
				references,
				rawText,
				function (s) {
					return s;
				},
				isLinkType ? $dillonkearns$elm_markdown$Markdown$InlineParser$LinkType(
					_Utils_Tuple2('', $elm$core$Maybe$Nothing)) : $dillonkearns$elm_markdown$Markdown$InlineParser$ImageType(
					_Utils_Tuple2('', $elm$core$Maybe$Nothing)),
				openToken,
				closeToken,
				$elm$core$List$reverse(innerTokens));
		};
		var _v9 = openToken.meaning;
		switch (_v9.$) {
			case 'ImageOpenToken':
				var tempMatch = findTempMatch(false);
				var _v10 = A3($dillonkearns$elm_markdown$Markdown$InlineParser$checkForInlineLinkTypeOrImageType, remainText, tempMatch, references);
				if (_v10.$ === 'Nothing') {
					return $elm$core$Maybe$Just(removeOpenToken);
				} else {
					var match = _v10.a;
					var _v11 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$checkParsedAheadOverlapping, match, oldMatches);
					if (_v11.$ === 'Just') {
						var matches = _v11.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple3(
								A2($dillonkearns$elm_markdown$Markdown$InlineParser$removeParsedAheadTokens, match, tokensTail),
								matches,
								remainTokens));
					} else {
						return $elm$core$Maybe$Just(removeOpenToken);
					}
				}
			case 'LinkOpenToken':
				if (_v9.a.$ === 'Active') {
					var _v12 = _v9.a;
					var tempMatch = findTempMatch(true);
					var _v13 = A3($dillonkearns$elm_markdown$Markdown$InlineParser$checkForInlineLinkTypeOrImageType, remainText, tempMatch, references);
					if (_v13.$ === 'Nothing') {
						return $elm$core$Maybe$Just(removeOpenToken);
					} else {
						var match = _v13.a;
						var _v14 = A2($dillonkearns$elm_markdown$Markdown$InlineParser$checkParsedAheadOverlapping, match, oldMatches);
						if (_v14.$ === 'Just') {
							var matches = _v14.a;
							return $elm$core$Maybe$Just(
								_Utils_Tuple3(
									A2($dillonkearns$elm_markdown$Markdown$InlineParser$removeParsedAheadTokens, match, tokensTail),
									matches,
									A2($elm$core$List$map, inactivateLinkOpenToken, remainTokens)));
						} else {
							return $elm$core$Maybe$Just(removeOpenToken);
						}
					}
				} else {
					var _v15 = _v9.a;
					return $elm$core$Maybe$Just(removeOpenToken);
				}
			default:
				return $elm$core$Maybe$Nothing;
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$strikethroughTTM = F5(
	function (remaining, tokens, matches, references, rawText) {
		strikethroughTTM:
		while (true) {
			if (!remaining.b) {
				return A5(
					$dillonkearns$elm_markdown$Markdown$InlineParser$lineBreakTTM,
					$elm$core$List$reverse(tokens),
					_List_Nil,
					matches,
					references,
					rawText);
			} else {
				var token = remaining.a;
				var tokensTail = remaining.b;
				var _v5 = token.meaning;
				if (_v5.$ === 'StrikethroughToken') {
					var isEscaped = _v5.a;
					var _v6 = A2(
						$dillonkearns$elm_markdown$Markdown$InlineParser$findToken,
						$dillonkearns$elm_markdown$Markdown$InlineParser$isStrikethroughTokenPair(token),
						tokens);
					if (_v6.$ === 'Just') {
						var content = _v6.a;
						var _v7 = A5($dillonkearns$elm_markdown$Markdown$InlineParser$strikethroughToMatch, token, matches, references, rawText, content);
						var newTokens = _v7.a;
						var newMatches = _v7.b;
						var $temp$remaining = tokensTail,
							$temp$tokens = newTokens,
							$temp$matches = newMatches,
							$temp$references = references,
							$temp$rawText = rawText;
						remaining = $temp$remaining;
						tokens = $temp$tokens;
						matches = $temp$matches;
						references = $temp$references;
						rawText = $temp$rawText;
						continue strikethroughTTM;
					} else {
						var $temp$remaining = tokensTail,
							$temp$tokens = A2($elm$core$List$cons, token, tokens),
							$temp$matches = matches,
							$temp$references = references,
							$temp$rawText = rawText;
						remaining = $temp$remaining;
						tokens = $temp$tokens;
						matches = $temp$matches;
						references = $temp$references;
						rawText = $temp$rawText;
						continue strikethroughTTM;
					}
				} else {
					var $temp$remaining = tokensTail,
						$temp$tokens = A2($elm$core$List$cons, token, tokens),
						$temp$matches = matches,
						$temp$references = references,
						$temp$rawText = rawText;
					remaining = $temp$remaining;
					tokens = $temp$tokens;
					matches = $temp$matches;
					references = $temp$references;
					rawText = $temp$rawText;
					continue strikethroughTTM;
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$strikethroughToMatch = F5(
	function (closeToken, matches, references, rawText, _v1) {
		var openToken = _v1.a;
		var remainTokens = _v1.c;
		var updatedOpenToken = function () {
			var _v2 = openToken.meaning;
			if ((_v2.$ === 'StrikethroughToken') && (_v2.a.$ === 'Escaped')) {
				var _v3 = _v2.a;
				return _Utils_update(
					openToken,
					{index: openToken.index + 1, length: openToken.length - 1});
			} else {
				return openToken;
			}
		}();
		var match = A7($dillonkearns$elm_markdown$Markdown$InlineParser$tokenPairToMatch, references, rawText, $dillonkearns$elm_markdown$Markdown$Helpers$cleanWhitespaces, $dillonkearns$elm_markdown$Markdown$InlineParser$StrikethroughType, updatedOpenToken, closeToken, _List_Nil);
		return _Utils_Tuple2(
			remainTokens,
			A2($elm$core$List$cons, match, matches));
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$tokenPairToMatch = F7(
	function (references, rawText, processText, type_, openToken, closeToken, innerTokens) {
		var textStart = openToken.index + openToken.length;
		var textEnd = closeToken.index;
		var text = processText(
			A3($elm$core$String$slice, textStart, textEnd, rawText));
		var start = openToken.index;
		var end = closeToken.index + closeToken.length;
		var match = {end: end, matches: _List_Nil, start: start, text: text, textEnd: textEnd, textStart: textStart, type_: type_};
		var matches = A2(
			$elm$core$List$map,
			function (_v0) {
				var matchModel = _v0.a;
				return A2($dillonkearns$elm_markdown$Markdown$InlineParser$prepareChildMatch, match, matchModel);
			},
			A4($dillonkearns$elm_markdown$Markdown$InlineParser$tokensToMatches, innerTokens, _List_Nil, references, rawText));
		return $dillonkearns$elm_markdown$Markdown$InlineParser$Match(
			{end: end, matches: matches, start: start, text: text, textEnd: textEnd, textStart: textStart, type_: type_});
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$tokensToMatches = F4(
	function (tokens, matches, references, rawText) {
		return A5($dillonkearns$elm_markdown$Markdown$InlineParser$codeAutolinkTypeHtmlTagTTM, tokens, _List_Nil, matches, references, rawText);
	});
var $dillonkearns$elm_markdown$Markdown$InlineParser$parse = F2(
	function (refs, rawText_) {
		var rawText = $elm$core$String$trim(rawText_);
		var tokens = $dillonkearns$elm_markdown$Markdown$InlineParser$tokenize(rawText);
		return $dillonkearns$elm_markdown$Markdown$InlineParser$matchesToInlines(
			A3(
				$dillonkearns$elm_markdown$Markdown$InlineParser$parseTextMatches,
				rawText,
				_List_Nil,
				$dillonkearns$elm_markdown$Markdown$InlineParser$organizeMatches(
					A4($dillonkearns$elm_markdown$Markdown$InlineParser$tokensToMatches, tokens, _List_Nil, refs, rawText))));
	});
var $dillonkearns$elm_markdown$Markdown$Parser$thisIsDefinitelyNotAnHtmlTag = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			$elm$parser$Parser$Advanced$token(
			A2(
				$elm$parser$Parser$Advanced$Token,
				' ',
				$elm$parser$Parser$Expecting(' '))),
			$elm$parser$Parser$Advanced$token(
			A2(
				$elm$parser$Parser$Advanced$Token,
				'>',
				$elm$parser$Parser$Expecting('>'))),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$chompIf,
					$elm$core$Char$isAlpha,
					$elm$parser$Parser$Expecting('Alpha')),
				$elm$parser$Parser$Advanced$chompWhile(
					function (c) {
						return $elm$core$Char$isAlphaNum(c) || _Utils_eq(
							c,
							_Utils_chr('-'));
					})),
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						$elm$parser$Parser$Advanced$token(
						A2(
							$elm$parser$Parser$Advanced$Token,
							':',
							$elm$parser$Parser$Expecting(':'))),
						$elm$parser$Parser$Advanced$token(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'@',
							$elm$parser$Parser$Expecting('@'))),
						$elm$parser$Parser$Advanced$token(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'\\',
							$elm$parser$Parser$Expecting('\\'))),
						$elm$parser$Parser$Advanced$token(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'+',
							$elm$parser$Parser$Expecting('+'))),
						$elm$parser$Parser$Advanced$token(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'.',
							$elm$parser$Parser$Expecting('.')))
					])))
		]));
var $dillonkearns$elm_markdown$Markdown$Parser$parseAsParagraphInsteadOfHtmlBlock = $elm$parser$Parser$Advanced$backtrackable(
	A2(
		$elm$parser$Parser$Advanced$mapChompedString,
		F2(
			function (rawLine, _v0) {
				return $dillonkearns$elm_markdown$Markdown$RawBlock$OpenBlockOrParagraph(
					$dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(rawLine));
			}),
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$token(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'<',
							$elm$parser$Parser$Expecting('<'))),
					$dillonkearns$elm_markdown$Markdown$Parser$thisIsDefinitelyNotAnHtmlTag),
				$dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd),
			$dillonkearns$elm_markdown$Helpers$lineEndOrEnd)));
var $dillonkearns$elm_markdown$Markdown$Table$TableHeader = function (a) {
	return {$: 'TableHeader', a: a};
};
var $dillonkearns$elm_markdown$Parser$Token$parseString = function (str) {
	return $elm$parser$Parser$Advanced$token(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$Expecting(str)));
};
var $dillonkearns$elm_markdown$Markdown$TableParser$parseCellHelper = function (_v0) {
	var curr = _v0.a;
	var acc = _v0.b;
	var _return = A2(
		$elm$core$Maybe$withDefault,
		$elm$parser$Parser$Advanced$Done(acc),
		A2(
			$elm$core$Maybe$map,
			function (cell) {
				return $elm$parser$Parser$Advanced$Done(
					A2($elm$core$List$cons, cell, acc));
			},
			curr));
	var finishCell = A2(
		$elm$core$Maybe$withDefault,
		$elm$parser$Parser$Advanced$Loop(
			_Utils_Tuple2($elm$core$Maybe$Nothing, acc)),
		A2(
			$elm$core$Maybe$map,
			function (cell) {
				return $elm$parser$Parser$Advanced$Loop(
					_Utils_Tuple2(
						$elm$core$Maybe$Nothing,
						A2($elm$core$List$cons, cell, acc)));
			},
			curr));
	var addToCurrent = function (c) {
		return _Utils_ap(
			A2($elm$core$Maybe$withDefault, '', curr),
			c);
	};
	var continueCell = function (c) {
		return $elm$parser$Parser$Advanced$Loop(
			_Utils_Tuple2(
				$elm$core$Maybe$Just(
					addToCurrent(c)),
				acc));
	};
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v1) {
					return _return;
				},
				$dillonkearns$elm_markdown$Parser$Token$parseString('|\n')),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v2) {
					return _return;
				},
				$dillonkearns$elm_markdown$Parser$Token$parseString('\n')),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v3) {
					return _return;
				},
				$elm$parser$Parser$Advanced$end(
					$elm$parser$Parser$Expecting('end'))),
				A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$backtrackable(
					$elm$parser$Parser$Advanced$succeed(
						continueCell('|'))),
				$dillonkearns$elm_markdown$Parser$Token$parseString('\\\\|')),
				A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$backtrackable(
					$elm$parser$Parser$Advanced$succeed(
						continueCell('\\'))),
				$dillonkearns$elm_markdown$Parser$Token$parseString('\\\\')),
				A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$backtrackable(
					$elm$parser$Parser$Advanced$succeed(
						continueCell('|'))),
				$dillonkearns$elm_markdown$Parser$Token$parseString('\\|')),
				A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$backtrackable(
					$elm$parser$Parser$Advanced$succeed(finishCell)),
				$dillonkearns$elm_markdown$Parser$Token$parseString('|')),
				A2(
				$elm$parser$Parser$Advanced$mapChompedString,
				F2(
					function (_char, _v4) {
						return continueCell(_char);
					}),
				A2(
					$elm$parser$Parser$Advanced$chompIf,
					$elm$core$Basics$always(true),
					$elm$parser$Parser$Problem('No character found')))
			]));
};
var $dillonkearns$elm_markdown$Markdown$TableParser$parseCells = A2(
	$elm$parser$Parser$Advanced$map,
	A2(
		$elm$core$List$foldl,
		F2(
			function (cell, acc) {
				return A2(
					$elm$core$List$cons,
					$elm$core$String$trim(cell),
					acc);
			}),
		_List_Nil),
	A2(
		$elm$parser$Parser$Advanced$loop,
		_Utils_Tuple2($elm$core$Maybe$Nothing, _List_Nil),
		$dillonkearns$elm_markdown$Markdown$TableParser$parseCellHelper));
var $dillonkearns$elm_markdown$Markdown$TableParser$rowParser = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					$dillonkearns$elm_markdown$Parser$Token$parseString('|'),
					$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
				]))),
	$dillonkearns$elm_markdown$Markdown$TableParser$parseCells);
var $dillonkearns$elm_markdown$Markdown$TableParser$parseHeader = F2(
	function (_v0, headersRow) {
		var columnAlignments = _v0.b;
		var headersWithAlignment = function (headers) {
			return A3(
				$elm$core$List$map2,
				F2(
					function (headerCell, alignment) {
						return {alignment: alignment, label: headerCell};
					}),
				headers,
				columnAlignments);
		};
		var combineHeaderAndDelimiter = function (headers) {
			return _Utils_eq(
				$elm$core$List$length(headers),
				$elm$core$List$length(columnAlignments)) ? $elm$core$Result$Ok(
				$dillonkearns$elm_markdown$Markdown$Table$TableHeader(
					headersWithAlignment(headers))) : $elm$core$Result$Err(
				'Tables must have the same number of header columns (' + ($elm$core$String$fromInt(
					$elm$core$List$length(headers)) + (') as delimiter columns (' + ($elm$core$String$fromInt(
					$elm$core$List$length(columnAlignments)) + ')'))));
		};
		var _v1 = A2($elm$parser$Parser$Advanced$run, $dillonkearns$elm_markdown$Markdown$TableParser$rowParser, headersRow);
		if (_v1.$ === 'Ok') {
			var headers = _v1.a;
			return combineHeaderAndDelimiter(headers);
		} else {
			return $elm$core$Result$Err('Unable to parse previous line as a table header');
		}
	});
var $dillonkearns$elm_markdown$Markdown$CodeBlock$CodeBlock = F2(
	function (language, body) {
		return {body: body, language: language};
	});
var $dillonkearns$elm_markdown$Markdown$CodeBlock$infoString = function (fenceCharacter) {
	var toInfoString = F2(
		function (str, _v2) {
			var _v1 = $elm$core$String$trim(str);
			if (_v1 === '') {
				return $elm$core$Maybe$Nothing;
			} else {
				var trimmed = _v1;
				return $elm$core$Maybe$Just(trimmed);
			}
		});
	var _v0 = fenceCharacter.kind;
	if (_v0.$ === 'Backtick') {
		return A2(
			$elm$parser$Parser$Advanced$mapChompedString,
			toInfoString,
			$elm$parser$Parser$Advanced$chompWhile(
				function (c) {
					return (!_Utils_eq(
						c,
						_Utils_chr('`'))) && (!$dillonkearns$elm_markdown$Whitespace$isLineEnd(c));
				}));
	} else {
		return A2(
			$elm$parser$Parser$Advanced$mapChompedString,
			toInfoString,
			$elm$parser$Parser$Advanced$chompWhile(
				A2($elm$core$Basics$composeL, $elm$core$Basics$not, $dillonkearns$elm_markdown$Whitespace$isLineEnd)));
	}
};
var $dillonkearns$elm_markdown$Markdown$CodeBlock$Backtick = {$: 'Backtick'};
var $dillonkearns$elm_markdown$Parser$Token$backtick = A2(
	$elm$parser$Parser$Advanced$Token,
	'`',
	$elm$parser$Parser$Expecting('a \'`\''));
var $dillonkearns$elm_markdown$Markdown$CodeBlock$backtick = {
	_char: _Utils_chr('`'),
	kind: $dillonkearns$elm_markdown$Markdown$CodeBlock$Backtick,
	token: $dillonkearns$elm_markdown$Parser$Token$backtick
};
var $dillonkearns$elm_markdown$Markdown$CodeBlock$colToIndentation = function (_int) {
	switch (_int) {
		case 1:
			return $elm$parser$Parser$Advanced$succeed(0);
		case 2:
			return $elm$parser$Parser$Advanced$succeed(1);
		case 3:
			return $elm$parser$Parser$Advanced$succeed(2);
		case 4:
			return $elm$parser$Parser$Advanced$succeed(3);
		default:
			return $elm$parser$Parser$Advanced$problem(
				$elm$parser$Parser$Expecting('Fenced code blocks should be indented no more than 3 spaces'));
	}
};
var $dillonkearns$elm_markdown$Markdown$CodeBlock$fenceOfAtLeast = F2(
	function (minLength, fenceCharacter) {
		var builtTokens = A3(
			$elm$core$List$foldl,
			F2(
				function (t, p) {
					return A2($elm$parser$Parser$Advanced$ignorer, p, t);
				}),
			$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0),
			A2(
				$elm$core$List$repeat,
				minLength,
				$elm$parser$Parser$Advanced$token(fenceCharacter.token)));
		return A2(
			$elm$parser$Parser$Advanced$mapChompedString,
			F2(
				function (str, _v0) {
					return _Utils_Tuple2(
						fenceCharacter,
						$elm$core$String$length(str));
				}),
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				builtTokens,
				$elm$parser$Parser$Advanced$chompWhile(
					$elm$core$Basics$eq(fenceCharacter._char))));
	});
var $dillonkearns$elm_markdown$Markdown$CodeBlock$Tilde = {$: 'Tilde'};
var $dillonkearns$elm_markdown$Parser$Token$tilde = A2(
	$elm$parser$Parser$Advanced$Token,
	'~',
	$elm$parser$Parser$Expecting('a `~`'));
var $dillonkearns$elm_markdown$Markdown$CodeBlock$tilde = {
	_char: _Utils_chr('~'),
	kind: $dillonkearns$elm_markdown$Markdown$CodeBlock$Tilde,
	token: $dillonkearns$elm_markdown$Parser$Token$tilde
};
var $dillonkearns$elm_markdown$Whitespace$upToThreeSpaces = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$dillonkearns$elm_markdown$Whitespace$space,
				$elm$parser$Parser$Advanced$oneOf(
					_List_fromArray(
						[
							$dillonkearns$elm_markdown$Whitespace$space,
							$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
						]))),
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						$dillonkearns$elm_markdown$Whitespace$space,
						$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
					]))),
			$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
		]));
var $dillonkearns$elm_markdown$Markdown$CodeBlock$openingFence = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(
				F2(
					function (indent, _v0) {
						var character = _v0.a;
						var length = _v0.b;
						return {character: character, indented: indent, length: length};
					})),
			$dillonkearns$elm_markdown$Whitespace$upToThreeSpaces),
		A2($elm$parser$Parser$Advanced$andThen, $dillonkearns$elm_markdown$Markdown$CodeBlock$colToIndentation, $elm$parser$Parser$Advanced$getCol)),
	$elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2($dillonkearns$elm_markdown$Markdown$CodeBlock$fenceOfAtLeast, 3, $dillonkearns$elm_markdown$Markdown$CodeBlock$backtick),
				A2($dillonkearns$elm_markdown$Markdown$CodeBlock$fenceOfAtLeast, 3, $dillonkearns$elm_markdown$Markdown$CodeBlock$tilde)
			])));
var $dillonkearns$elm_markdown$Whitespace$isSpace = $elm$core$Basics$eq(
	_Utils_chr(' '));
var $dillonkearns$elm_markdown$Markdown$CodeBlock$closingFence = F2(
	function (minLength, fenceCharacter) {
		return A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0),
						$dillonkearns$elm_markdown$Whitespace$upToThreeSpaces),
					A2($dillonkearns$elm_markdown$Markdown$CodeBlock$fenceOfAtLeast, minLength, fenceCharacter)),
				$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpace)),
			$dillonkearns$elm_markdown$Helpers$lineEndOrEnd);
	});
var $dillonkearns$elm_markdown$Markdown$CodeBlock$codeBlockLine = function (indented) {
	return A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
			A2($dillonkearns$elm_markdown$Parser$Extra$upTo, indented, $dillonkearns$elm_markdown$Whitespace$space)),
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getOffset, $dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd),
			$dillonkearns$elm_markdown$Helpers$lineEndOrEnd));
};
var $elm$parser$Parser$Advanced$getSource = $elm$parser$Parser$Advanced$Parser(
	function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, s.src, s);
	});
var $dillonkearns$elm_markdown$Markdown$CodeBlock$remainingBlockHelp = function (_v0) {
	var fence = _v0.a;
	var body = _v0.b;
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed(
					$elm$parser$Parser$Advanced$Done(body)),
				$elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd)),
				A2(
				$elm$parser$Parser$Advanced$mapChompedString,
				F2(
					function (lineEnd, _v1) {
						return $elm$parser$Parser$Advanced$Loop(
							_Utils_Tuple2(
								fence,
								_Utils_ap(body, lineEnd)));
					}),
				$dillonkearns$elm_markdown$Whitespace$lineEnd),
				$elm$parser$Parser$Advanced$backtrackable(
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed(
						$elm$parser$Parser$Advanced$Done(body)),
					A2($dillonkearns$elm_markdown$Markdown$CodeBlock$closingFence, fence.length, fence.character))),
				A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$keeper,
					A2(
						$elm$parser$Parser$Advanced$keeper,
						$elm$parser$Parser$Advanced$succeed(
							F3(
								function (start, end, source) {
									return $elm$parser$Parser$Advanced$Loop(
										_Utils_Tuple2(
											fence,
											_Utils_ap(
												body,
												A3($elm$core$String$slice, start, end, source))));
								})),
						$dillonkearns$elm_markdown$Markdown$CodeBlock$codeBlockLine(fence.indented)),
					$elm$parser$Parser$Advanced$getOffset),
				$elm$parser$Parser$Advanced$getSource)
			]));
};
var $dillonkearns$elm_markdown$Markdown$CodeBlock$remainingBlock = function (fence) {
	return A2(
		$elm$parser$Parser$Advanced$loop,
		_Utils_Tuple2(fence, ''),
		$dillonkearns$elm_markdown$Markdown$CodeBlock$remainingBlockHelp);
};
var $dillonkearns$elm_markdown$Markdown$CodeBlock$parser = A2(
	$elm$parser$Parser$Advanced$andThen,
	function (fence) {
		return A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$keeper,
				$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$CodeBlock$CodeBlock),
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$dillonkearns$elm_markdown$Markdown$CodeBlock$infoString(fence.character),
					$dillonkearns$elm_markdown$Helpers$lineEndOrEnd)),
			$dillonkearns$elm_markdown$Markdown$CodeBlock$remainingBlock(fence));
	},
	$dillonkearns$elm_markdown$Markdown$CodeBlock$openingFence);
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$core$String$endsWith = _String_endsWith;
var $dillonkearns$elm_markdown$Markdown$Heading$dropTrailingHashes = function (headingString) {
	return A2($elm$core$String$endsWith, '#', headingString) ? $dillonkearns$elm_markdown$Markdown$Heading$dropTrailingHashes(
		A2($elm$core$String$dropRight, 1, headingString)) : headingString;
};
var $elm$core$String$trimRight = _String_trimRight;
var $dillonkearns$elm_markdown$Markdown$Heading$dropClosingSequence = function (headingString) {
	var droppedTrailingHashesString = $dillonkearns$elm_markdown$Markdown$Heading$dropTrailingHashes(headingString);
	return (A2($elm$core$String$endsWith, ' ', droppedTrailingHashesString) || $elm$core$String$isEmpty(droppedTrailingHashesString)) ? $elm$core$String$trimRight(droppedTrailingHashesString) : headingString;
};
var $dillonkearns$elm_markdown$Parser$Token$hash = A2(
	$elm$parser$Parser$Advanced$Token,
	'#',
	$elm$parser$Parser$Expecting('a `#`'));
var $dillonkearns$elm_markdown$Markdown$Heading$isHash = function (c) {
	if ('#' === c.valueOf()) {
		return true;
	} else {
		return false;
	}
};
var $elm$parser$Parser$Advanced$spaces = $elm$parser$Parser$Advanced$chompWhile(
	function (c) {
		return _Utils_eq(
			c,
			_Utils_chr(' ')) || (_Utils_eq(
			c,
			_Utils_chr('\n')) || _Utils_eq(
			c,
			_Utils_chr('\r')));
	});
var $dillonkearns$elm_markdown$Markdown$Heading$parser = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$RawBlock$Heading),
				A2(
					$elm$parser$Parser$Advanced$andThen,
					function (startingSpaces) {
						var startSpace = $elm$core$String$length(startingSpaces);
						return (startSpace >= 4) ? $elm$parser$Parser$Advanced$problem(
							$elm$parser$Parser$Expecting('heading with < 4 spaces in front')) : $elm$parser$Parser$Advanced$succeed(startSpace);
					},
					$elm$parser$Parser$Advanced$getChompedString($elm$parser$Parser$Advanced$spaces))),
			$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$hash)),
		A2(
			$elm$parser$Parser$Advanced$andThen,
			function (additionalHashes) {
				var level = $elm$core$String$length(additionalHashes) + 1;
				return (level >= 7) ? $elm$parser$Parser$Advanced$problem(
					$elm$parser$Parser$Expecting('heading with < 7 #\'s')) : $elm$parser$Parser$Advanced$succeed(level);
			},
			$elm$parser$Parser$Advanced$getChompedString(
				$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Markdown$Heading$isHash)))),
	$elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed(
					$dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines('')),
				$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$newline)),
				A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
					$elm$parser$Parser$Advanced$oneOf(
						_List_fromArray(
							[
								$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$space),
								$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$tab)
							]))),
				A2(
					$elm$parser$Parser$Advanced$mapChompedString,
					F2(
						function (headingText, _v0) {
							return $dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(
								$dillonkearns$elm_markdown$Markdown$Heading$dropClosingSequence(
									$elm$core$String$trim(headingText)));
						}),
					$dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd))
			])));
var $elm$parser$Parser$Advanced$findSubString = _Parser_findSubString;
var $elm$parser$Parser$Advanced$chompUntil = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v1 = A5($elm$parser$Parser$Advanced$findSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.a;
			var newRow = _v1.b;
			var newCol = _v1.c;
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A4($elm$parser$Parser$Advanced$fromInfo, newRow, newCol, expecting, s.context)) : A3(
				$elm$parser$Parser$Advanced$Good,
				_Utils_cmp(s.offset, newOffset) < 0,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src});
		});
};
var $dillonkearns$elm_markdown$Parser$Token$greaterThan = A2(
	$elm$parser$Parser$Advanced$Token,
	'>',
	$elm$parser$Parser$Expecting('a `>`'));
var $elm$parser$Parser$Advanced$Located = F3(
	function (row, col, context) {
		return {col: col, context: context, row: row};
	});
var $elm$parser$Parser$Advanced$changeContext = F2(
	function (newContext, s) {
		return {col: s.col, context: newContext, indent: s.indent, offset: s.offset, row: s.row, src: s.src};
	});
var $elm$parser$Parser$Advanced$inContext = F2(
	function (context, _v0) {
		var parse = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parse(
					A2(
						$elm$parser$Parser$Advanced$changeContext,
						A2(
							$elm$core$List$cons,
							A3($elm$parser$Parser$Advanced$Located, s0.row, s0.col, context),
							s0.context),
						s0));
				if (_v1.$ === 'Good') {
					var p = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p,
						a,
						A2($elm$parser$Parser$Advanced$changeContext, s0.context, s1));
				} else {
					var step = _v1;
					return step;
				}
			});
	});
var $dillonkearns$elm_markdown$Whitespace$isWhitespace = function (_char) {
	switch (_char.valueOf()) {
		case ' ':
			return true;
		case '\n':
			return true;
		case '\t':
			return true;
		case '\u000B':
			return true;
		case '\u000C':
			return true;
		case '\r':
			return true;
		default:
			return false;
	}
};
var $dillonkearns$elm_markdown$Parser$Token$lessThan = A2(
	$elm$parser$Parser$Advanced$Token,
	'<',
	$elm$parser$Parser$Expecting('a `<`'));
var $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$destinationParser = A2(
	$elm$parser$Parser$Advanced$inContext,
	'link destination',
	$elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed($elm$url$Url$percentEncode),
					$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$lessThan)),
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$getChompedString(
						$elm$parser$Parser$Advanced$chompUntil($dillonkearns$elm_markdown$Parser$Token$greaterThan)),
					$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$greaterThan))),
				$elm$parser$Parser$Advanced$getChompedString(
				$dillonkearns$elm_markdown$Parser$Extra$chompOneOrMore(
					A2($elm$core$Basics$composeL, $elm$core$Basics$not, $dillonkearns$elm_markdown$Whitespace$isWhitespace)))
			])));
var $dillonkearns$elm_markdown$Parser$Token$closingSquareBracket = A2(
	$elm$parser$Parser$Advanced$Token,
	']',
	$elm$parser$Parser$Expecting('a `]`'));
var $dillonkearns$elm_markdown$Parser$Token$openingSquareBracket = A2(
	$elm$parser$Parser$Advanced$Token,
	'[',
	$elm$parser$Parser$Expecting('a `[`'));
var $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$labelParser = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$Helpers$prepareRefLabel),
		$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$openingSquareBracket)),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString(
			$elm$parser$Parser$Advanced$chompUntil($dillonkearns$elm_markdown$Parser$Token$closingSquareBracket)),
		$elm$parser$Parser$Advanced$symbol(
			A2(
				$elm$parser$Parser$Advanced$Token,
				']:',
				$elm$parser$Parser$Expecting(']:')))));
var $dillonkearns$elm_markdown$Parser$Token$doubleQuote = A2(
	$elm$parser$Parser$Advanced$Token,
	'\"',
	$elm$parser$Parser$Expecting('a double quote'));
var $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$hasNoBlankLine = function (str) {
	return A2($elm$core$String$contains, '\n\n', str) ? $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Expecting('no blank line')) : $elm$parser$Parser$Advanced$succeed(str);
};
var $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$onlyWhitespaceTillNewline = A2(
	$elm$parser$Parser$Advanced$ignorer,
	$elm$parser$Parser$Advanced$chompWhile(
		function (c) {
			return (!$dillonkearns$elm_markdown$Whitespace$isLineEnd(c)) && $dillonkearns$elm_markdown$Whitespace$isWhitespace(c);
		}),
	$dillonkearns$elm_markdown$Helpers$lineEndOrEnd);
var $dillonkearns$elm_markdown$Whitespace$requiredWhitespace = A2(
	$elm$parser$Parser$Advanced$ignorer,
	A2(
		$elm$parser$Parser$Advanced$chompIf,
		$dillonkearns$elm_markdown$Whitespace$isWhitespace,
		$elm$parser$Parser$Expecting('Required whitespace')),
	$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isWhitespace));
var $dillonkearns$elm_markdown$Parser$Token$singleQuote = A2(
	$elm$parser$Parser$Advanced$Token,
	'\'',
	$elm$parser$Parser$Expecting('a single quote'));
var $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$titleParser = function () {
	var inSingleQuotes = A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($elm$core$Maybe$Just),
			$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$singleQuote)),
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$andThen,
					$dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$hasNoBlankLine,
					$elm$parser$Parser$Advanced$getChompedString(
						$elm$parser$Parser$Advanced$chompUntil($dillonkearns$elm_markdown$Parser$Token$singleQuote))),
				$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$singleQuote)),
			$dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$onlyWhitespaceTillNewline));
	var inDoubleQuotes = A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($elm$core$Maybe$Just),
			$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$doubleQuote)),
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$andThen,
					$dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$hasNoBlankLine,
					$elm$parser$Parser$Advanced$getChompedString(
						$elm$parser$Parser$Advanced$chompUntil($dillonkearns$elm_markdown$Parser$Token$doubleQuote))),
				$elm$parser$Parser$Advanced$symbol($dillonkearns$elm_markdown$Parser$Token$doubleQuote)),
			$dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$onlyWhitespaceTillNewline));
	return A2(
		$elm$parser$Parser$Advanced$inContext,
		'title',
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$Advanced$backtrackable(
					A2(
						$elm$parser$Parser$Advanced$keeper,
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
							$dillonkearns$elm_markdown$Whitespace$requiredWhitespace),
						$elm$parser$Parser$Advanced$oneOf(
							_List_fromArray(
								[
									inDoubleQuotes,
									inSingleQuotes,
									$elm$parser$Parser$Advanced$succeed($elm$core$Maybe$Nothing)
								])))),
					A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed($elm$core$Maybe$Nothing),
					$dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$onlyWhitespaceTillNewline)
				])));
}();
var $dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$parser = A2(
	$elm$parser$Parser$Advanced$inContext,
	'link reference definition',
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed(
						F3(
							function (label, destination, title) {
								return _Utils_Tuple2(
									label,
									{destination: destination, title: title});
							})),
					$dillonkearns$elm_markdown$Whitespace$upToThreeSpaces),
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							$dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$labelParser,
							$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab)),
						$elm$parser$Parser$Advanced$oneOf(
							_List_fromArray(
								[
									$dillonkearns$elm_markdown$Whitespace$lineEnd,
									$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
								]))),
					$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab))),
			$dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$destinationParser),
		$dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$titleParser));
var $dillonkearns$elm_markdown$ThematicBreak$ThematicBreak = {$: 'ThematicBreak'};
var $dillonkearns$elm_markdown$ThematicBreak$whitespace = $elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab);
var $dillonkearns$elm_markdown$ThematicBreak$withChar = function (tchar) {
	var token = $dillonkearns$elm_markdown$Parser$Token$parseString(
		$elm$core$String$fromChar(tchar));
	return A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							A2(
								$elm$parser$Parser$Advanced$ignorer,
								$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$ThematicBreak$ThematicBreak),
								token),
							$dillonkearns$elm_markdown$ThematicBreak$whitespace),
						token),
					$dillonkearns$elm_markdown$ThematicBreak$whitespace),
				token),
			$elm$parser$Parser$Advanced$chompWhile(
				function (c) {
					return _Utils_eq(c, tchar) || $dillonkearns$elm_markdown$Whitespace$isSpaceOrTab(c);
				})),
		$dillonkearns$elm_markdown$Helpers$lineEndOrEnd);
};
var $dillonkearns$elm_markdown$ThematicBreak$parseThematicBreak = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			$dillonkearns$elm_markdown$ThematicBreak$withChar(
			_Utils_chr('-')),
			$dillonkearns$elm_markdown$ThematicBreak$withChar(
			_Utils_chr('*')),
			$dillonkearns$elm_markdown$ThematicBreak$withChar(
			_Utils_chr('_'))
		]));
var $dillonkearns$elm_markdown$ThematicBreak$parser = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
						$dillonkearns$elm_markdown$Whitespace$space),
					$elm$parser$Parser$Advanced$oneOf(
						_List_fromArray(
							[
								$dillonkearns$elm_markdown$Whitespace$space,
								$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
							]))),
				$elm$parser$Parser$Advanced$oneOf(
					_List_fromArray(
						[
							$dillonkearns$elm_markdown$Whitespace$space,
							$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
						]))),
			$dillonkearns$elm_markdown$ThematicBreak$parseThematicBreak),
			$dillonkearns$elm_markdown$ThematicBreak$parseThematicBreak
		]));
var $dillonkearns$elm_markdown$Markdown$RawBlock$LevelOne = {$: 'LevelOne'};
var $dillonkearns$elm_markdown$Markdown$RawBlock$LevelTwo = {$: 'LevelTwo'};
var $dillonkearns$elm_markdown$Markdown$RawBlock$SetextLine = F2(
	function (a, b) {
		return {$: 'SetextLine', a: a, b: b};
	});
var $dillonkearns$elm_markdown$Parser$Token$equals = A2(
	$elm$parser$Parser$Advanced$Token,
	'=',
	$elm$parser$Parser$Expecting('a `=`'));
var $dillonkearns$elm_markdown$Parser$Token$minus = A2(
	$elm$parser$Parser$Advanced$Token,
	'-',
	$elm$parser$Parser$Expecting('a `-`'));
var $dillonkearns$elm_markdown$Markdown$Parser$setextLineParser = function () {
	var setextLevel = F3(
		function (level, levelToken, levelChar) {
			return A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed(level),
					$elm$parser$Parser$Advanced$token(levelToken)),
				$elm$parser$Parser$Advanced$chompWhile(
					$elm$core$Basics$eq(levelChar)));
		});
	return A2(
		$elm$parser$Parser$Advanced$mapChompedString,
		F2(
			function (raw, level) {
				return A2($dillonkearns$elm_markdown$Markdown$RawBlock$SetextLine, level, raw);
			}),
		A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
				$dillonkearns$elm_markdown$Whitespace$upToThreeSpaces),
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$oneOf(
						_List_fromArray(
							[
								A3(
								setextLevel,
								$dillonkearns$elm_markdown$Markdown$RawBlock$LevelOne,
								$dillonkearns$elm_markdown$Parser$Token$equals,
								_Utils_chr('=')),
								A3(
								setextLevel,
								$dillonkearns$elm_markdown$Markdown$RawBlock$LevelTwo,
								$dillonkearns$elm_markdown$Parser$Token$minus,
								_Utils_chr('-'))
							])),
					$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab)),
				$dillonkearns$elm_markdown$Helpers$lineEndOrEnd)));
}();
var $dillonkearns$elm_markdown$Markdown$RawBlock$TableDelimiter = function (a) {
	return {$: 'TableDelimiter', a: a};
};
var $dillonkearns$elm_markdown$Markdown$TableParser$chompSinglelineWhitespace = $elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab);
var $dillonkearns$elm_markdown$Parser$Extra$maybeChomp = function (condition) {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$chompIf,
				condition,
				$elm$parser$Parser$Problem('Character not found')),
				$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
			]));
};
var $dillonkearns$elm_markdown$Markdown$TableParser$requirePipeIfNotFirst = function (columns) {
	return $elm$core$List$isEmpty(columns) ? $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				$dillonkearns$elm_markdown$Parser$Token$parseString('|'),
				$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0)
			])) : $dillonkearns$elm_markdown$Parser$Token$parseString('|');
};
var $dillonkearns$elm_markdown$Markdown$TableParser$delimiterRowHelp = function (revDelimiterColumns) {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				$elm$parser$Parser$Advanced$backtrackable(
				A2(
					$elm$parser$Parser$Advanced$map,
					function (_v0) {
						return $elm$parser$Parser$Advanced$Done(revDelimiterColumns);
					},
					$dillonkearns$elm_markdown$Parser$Token$parseString('|\n'))),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v1) {
					return $elm$parser$Parser$Advanced$Done(revDelimiterColumns);
				},
				$dillonkearns$elm_markdown$Parser$Token$parseString('\n')),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v2) {
					return $elm$parser$Parser$Advanced$Done(revDelimiterColumns);
				},
				$elm$parser$Parser$Advanced$end(
					$elm$parser$Parser$Expecting('end'))),
				$elm$parser$Parser$Advanced$backtrackable(
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$succeed(
							$elm$parser$Parser$Advanced$Done(revDelimiterColumns)),
						$dillonkearns$elm_markdown$Parser$Token$parseString('|')),
					$elm$parser$Parser$Advanced$end(
						$elm$parser$Parser$Expecting('end')))),
				A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$succeed(
							function (column) {
								return $elm$parser$Parser$Advanced$Loop(
									A2($elm$core$List$cons, column, revDelimiterColumns));
							}),
						$dillonkearns$elm_markdown$Markdown$TableParser$requirePipeIfNotFirst(revDelimiterColumns)),
					$dillonkearns$elm_markdown$Markdown$TableParser$chompSinglelineWhitespace),
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$getChompedString(
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							A2(
								$elm$parser$Parser$Advanced$ignorer,
								A2(
									$elm$parser$Parser$Advanced$ignorer,
									$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0),
									$dillonkearns$elm_markdown$Parser$Extra$maybeChomp(
										function (c) {
											return _Utils_eq(
												c,
												_Utils_chr(':'));
										})),
								$dillonkearns$elm_markdown$Parser$Extra$chompOneOrMore(
									function (c) {
										return _Utils_eq(
											c,
											_Utils_chr('-'));
									})),
							$dillonkearns$elm_markdown$Parser$Extra$maybeChomp(
								function (c) {
									return _Utils_eq(
										c,
										_Utils_chr(':'));
								}))),
					$dillonkearns$elm_markdown$Markdown$TableParser$chompSinglelineWhitespace))
			]));
};
var $dillonkearns$elm_markdown$Markdown$Block$AlignCenter = {$: 'AlignCenter'};
var $dillonkearns$elm_markdown$Markdown$Block$AlignLeft = {$: 'AlignLeft'};
var $dillonkearns$elm_markdown$Markdown$Block$AlignRight = {$: 'AlignRight'};
var $dillonkearns$elm_markdown$Markdown$TableParser$delimiterToAlignment = function (cell) {
	var _v0 = _Utils_Tuple2(
		A2($elm$core$String$startsWith, ':', cell),
		A2($elm$core$String$endsWith, ':', cell));
	if (_v0.a) {
		if (_v0.b) {
			return $elm$core$Maybe$Just($dillonkearns$elm_markdown$Markdown$Block$AlignCenter);
		} else {
			return $elm$core$Maybe$Just($dillonkearns$elm_markdown$Markdown$Block$AlignLeft);
		}
	} else {
		if (_v0.b) {
			return $elm$core$Maybe$Just($dillonkearns$elm_markdown$Markdown$Block$AlignRight);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	}
};
var $dillonkearns$elm_markdown$Markdown$TableParser$delimiterRowParser = A2(
	$elm$parser$Parser$Advanced$andThen,
	function (delimiterRow) {
		var trimmed = delimiterRow.a.trimmed;
		var headers = delimiterRow.b;
		return $elm$core$List$isEmpty(headers) ? $elm$parser$Parser$Advanced$problem(
			$elm$parser$Parser$Expecting('Must have at least one column in delimiter row.')) : ((($elm$core$List$length(headers) === 1) && (!(A2($elm$core$String$startsWith, '|', trimmed) && A2($elm$core$String$endsWith, '|', trimmed)))) ? $elm$parser$Parser$Advanced$problem(
			$elm$parser$Parser$Problem('Tables with a single column must have pipes at the start and end of the delimiter row to avoid ambiguity.')) : $elm$parser$Parser$Advanced$succeed(delimiterRow));
	},
	A2(
		$elm$parser$Parser$Advanced$mapChompedString,
		F2(
			function (delimiterText, revDelimiterColumns) {
				return A2(
					$dillonkearns$elm_markdown$Markdown$Table$TableDelimiterRow,
					{
						raw: delimiterText,
						trimmed: $elm$core$String$trim(delimiterText)
					},
					A2(
						$elm$core$List$map,
						$dillonkearns$elm_markdown$Markdown$TableParser$delimiterToAlignment,
						$elm$core$List$reverse(revDelimiterColumns)));
			}),
		A2($elm$parser$Parser$Advanced$loop, _List_Nil, $dillonkearns$elm_markdown$Markdown$TableParser$delimiterRowHelp)));
var $dillonkearns$elm_markdown$Markdown$Parser$tableDelimiterInOpenParagraph = A2($elm$parser$Parser$Advanced$map, $dillonkearns$elm_markdown$Markdown$RawBlock$TableDelimiter, $dillonkearns$elm_markdown$Markdown$TableParser$delimiterRowParser);
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $dillonkearns$elm_markdown$Markdown$TableParser$standardizeRowLength = F2(
	function (expectedLength, row) {
		var rowLength = $elm$core$List$length(row);
		var _v0 = A2($elm$core$Basics$compare, expectedLength, rowLength);
		switch (_v0.$) {
			case 'LT':
				return A2($elm$core$List$take, expectedLength, row);
			case 'EQ':
				return row;
			default:
				return _Utils_ap(
					row,
					A2($elm$core$List$repeat, expectedLength - rowLength, ''));
		}
	});
var $dillonkearns$elm_markdown$Markdown$TableParser$bodyRowParser = function (expectedRowLength) {
	return A2(
		$elm$parser$Parser$Advanced$andThen,
		function (row) {
			return ($elm$core$List$isEmpty(row) || A2($elm$core$List$all, $elm$core$String$isEmpty, row)) ? $elm$parser$Parser$Advanced$problem(
				$elm$parser$Parser$Problem('A line must have at least one column')) : $elm$parser$Parser$Advanced$succeed(
				A2($dillonkearns$elm_markdown$Markdown$TableParser$standardizeRowLength, expectedRowLength, row));
		},
		$dillonkearns$elm_markdown$Markdown$TableParser$rowParser);
};
var $dillonkearns$elm_markdown$Markdown$Parser$tableRowIfTableStarted = function (_v0) {
	var headers = _v0.a;
	var body = _v0.b;
	return A2(
		$elm$parser$Parser$Advanced$map,
		function (row) {
			return $dillonkearns$elm_markdown$Markdown$RawBlock$Table(
				A2(
					$dillonkearns$elm_markdown$Markdown$Table$Table,
					headers,
					_Utils_ap(
						body,
						_List_fromArray(
							[row]))));
		},
		$dillonkearns$elm_markdown$Markdown$TableParser$bodyRowParser(
			$elm$core$List$length(headers)));
};
var $dillonkearns$elm_markdown$Markdown$Block$H1 = {$: 'H1'};
var $dillonkearns$elm_markdown$Markdown$Block$H2 = {$: 'H2'};
var $dillonkearns$elm_markdown$Markdown$Block$H3 = {$: 'H3'};
var $dillonkearns$elm_markdown$Markdown$Block$H4 = {$: 'H4'};
var $dillonkearns$elm_markdown$Markdown$Block$H5 = {$: 'H5'};
var $dillonkearns$elm_markdown$Markdown$Block$H6 = {$: 'H6'};
var $dillonkearns$elm_markdown$Markdown$Parser$toHeading = function (level) {
	switch (level) {
		case 1:
			return $elm$core$Result$Ok($dillonkearns$elm_markdown$Markdown$Block$H1);
		case 2:
			return $elm$core$Result$Ok($dillonkearns$elm_markdown$Markdown$Block$H2);
		case 3:
			return $elm$core$Result$Ok($dillonkearns$elm_markdown$Markdown$Block$H3);
		case 4:
			return $elm$core$Result$Ok($dillonkearns$elm_markdown$Markdown$Block$H4);
		case 5:
			return $elm$core$Result$Ok($dillonkearns$elm_markdown$Markdown$Block$H5);
		case 6:
			return $elm$core$Result$Ok($dillonkearns$elm_markdown$Markdown$Block$H6);
		default:
			return $elm$core$Result$Err(
				$elm$parser$Parser$Expecting(
					'A heading with 1 to 6 #\'s, but found ' + $elm$core$String$fromInt(level)));
	}
};
var $dillonkearns$elm_markdown$Markdown$ListItem$EmptyItem = {$: 'EmptyItem'};
var $dillonkearns$elm_markdown$Markdown$ListItem$PlainItem = function (a) {
	return {$: 'PlainItem', a: a};
};
var $dillonkearns$elm_markdown$Markdown$ListItem$TaskItem = F2(
	function (a, b) {
		return {$: 'TaskItem', a: a, b: b};
	});
var $dillonkearns$elm_markdown$Markdown$UnorderedList$getIntendedCodeItem = F4(
	function (markerStartPos, listMarker, markerEndPos, _v0) {
		var bodyStartPos = _v0.a;
		var item = _v0.b;
		var spaceNum = bodyStartPos - markerEndPos;
		if (spaceNum <= 4) {
			return _Utils_Tuple3(listMarker, bodyStartPos - markerStartPos, item);
		} else {
			var intendedCodeItem = function () {
				switch (item.$) {
					case 'TaskItem':
						var completion = item.a;
						var string = item.b;
						return A2(
							$dillonkearns$elm_markdown$Markdown$ListItem$TaskItem,
							completion,
							_Utils_ap(
								A2($elm$core$String$repeat, spaceNum - 1, ' '),
								string));
					case 'PlainItem':
						var string = item.a;
						return $dillonkearns$elm_markdown$Markdown$ListItem$PlainItem(
							_Utils_ap(
								A2($elm$core$String$repeat, spaceNum - 1, ' '),
								string));
					default:
						return $dillonkearns$elm_markdown$Markdown$ListItem$EmptyItem;
				}
			}();
			return _Utils_Tuple3(listMarker, (markerEndPos - markerStartPos) + 1, intendedCodeItem);
		}
	});
var $dillonkearns$elm_markdown$Markdown$UnorderedList$unorderedListEmptyItemParser = A2(
	$elm$parser$Parser$Advanced$keeper,
	$elm$parser$Parser$Advanced$succeed(
		function (bodyStartPos) {
			return _Utils_Tuple2(bodyStartPos, $dillonkearns$elm_markdown$Markdown$ListItem$EmptyItem);
		}),
	A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getCol, $dillonkearns$elm_markdown$Helpers$lineEndOrEnd));
var $dillonkearns$elm_markdown$Markdown$ListItem$Complete = {$: 'Complete'};
var $dillonkearns$elm_markdown$Markdown$ListItem$Incomplete = {$: 'Incomplete'};
var $dillonkearns$elm_markdown$Markdown$ListItem$taskItemParser = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$ListItem$Complete),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'[x] ',
					$elm$parser$Parser$ExpectingSymbol('[x] ')))),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$ListItem$Complete),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'[X] ',
					$elm$parser$Parser$ExpectingSymbol('[X] ')))),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$ListItem$Incomplete),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'[ ] ',
					$elm$parser$Parser$ExpectingSymbol('[ ] '))))
		]));
var $dillonkearns$elm_markdown$Markdown$ListItem$parser = A2(
	$elm$parser$Parser$Advanced$keeper,
	$elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$keeper,
				$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$ListItem$TaskItem),
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$dillonkearns$elm_markdown$Markdown$ListItem$taskItemParser,
					$elm$parser$Parser$Advanced$chompWhile($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab))),
				$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$ListItem$PlainItem)
			])),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd),
		$dillonkearns$elm_markdown$Helpers$lineEndOrEnd));
var $dillonkearns$elm_markdown$Markdown$UnorderedList$unorderedListItemBodyParser = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(
				F2(
					function (bodyStartPos, item) {
						return _Utils_Tuple2(bodyStartPos, item);
					})),
			$dillonkearns$elm_markdown$Parser$Extra$chompOneOrMore($dillonkearns$elm_markdown$Whitespace$isSpaceOrTab)),
		$elm$parser$Parser$Advanced$getCol),
	$dillonkearns$elm_markdown$Markdown$ListItem$parser);
var $dillonkearns$elm_markdown$Markdown$UnorderedList$Asterisk = {$: 'Asterisk'};
var $dillonkearns$elm_markdown$Markdown$UnorderedList$Minus = {$: 'Minus'};
var $dillonkearns$elm_markdown$Markdown$UnorderedList$Plus = {$: 'Plus'};
var $dillonkearns$elm_markdown$Markdown$UnorderedList$unorderedListMarkerParser = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$UnorderedList$Minus),
				A2($dillonkearns$elm_markdown$Parser$Extra$upTo, 3, $dillonkearns$elm_markdown$Whitespace$space)),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'-',
					$elm$parser$Parser$ExpectingSymbol('-')))),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$UnorderedList$Plus),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'+',
					$elm$parser$Parser$ExpectingSymbol('+')))),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$UnorderedList$Asterisk),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'*',
					$elm$parser$Parser$ExpectingSymbol('*'))))
		]));
var $dillonkearns$elm_markdown$Markdown$UnorderedList$parser = function (previousWasBody) {
	return A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$keeper,
					$elm$parser$Parser$Advanced$succeed($dillonkearns$elm_markdown$Markdown$UnorderedList$getIntendedCodeItem),
					$elm$parser$Parser$Advanced$getCol),
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$UnorderedList$unorderedListMarkerParser)),
			$elm$parser$Parser$Advanced$getCol),
		previousWasBody ? $dillonkearns$elm_markdown$Markdown$UnorderedList$unorderedListItemBodyParser : $elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[$dillonkearns$elm_markdown$Markdown$UnorderedList$unorderedListEmptyItemParser, $dillonkearns$elm_markdown$Markdown$UnorderedList$unorderedListItemBodyParser])));
};
var $dillonkearns$elm_markdown$Markdown$Parser$unorderedListBlock = function (previousWasBody) {
	var parseListItem = F3(
		function (listmarker, intended, unparsedListItem) {
			switch (unparsedListItem.$) {
				case 'TaskItem':
					var completion = unparsedListItem.a;
					var body = unparsedListItem.b;
					return {
						body: body,
						marker: listmarker,
						task: $elm$core$Maybe$Just(
							function () {
								if (completion.$ === 'Complete') {
									return true;
								} else {
									return false;
								}
							}())
					};
				case 'PlainItem':
					var body = unparsedListItem.a;
					return {body: body, marker: listmarker, task: $elm$core$Maybe$Nothing};
				default:
					return {body: '', marker: listmarker, task: $elm$core$Maybe$Nothing};
			}
		});
	return A2(
		$elm$parser$Parser$Advanced$map,
		function (_v0) {
			var listmarker = _v0.a;
			var intended = _v0.b;
			var unparsedListItem = _v0.c;
			return A4(
				$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
				true,
				intended,
				_List_Nil,
				A3(parseListItem, listmarker, intended, unparsedListItem));
		},
		$dillonkearns$elm_markdown$Markdown$UnorderedList$parser(previousWasBody));
};
var $dillonkearns$elm_markdown$Markdown$Parser$childToBlocks = F2(
	function (node, blocks) {
		switch (node.$) {
			case 'Element':
				var tag = node.a;
				var attributes = node.b;
				var children = node.c;
				var _v99 = $dillonkearns$elm_markdown$Markdown$Parser$nodesToBlocks(children);
				if (_v99.$ === 'Ok') {
					var childrenAsBlocks = _v99.a;
					var block = $dillonkearns$elm_markdown$Markdown$Block$HtmlBlock(
						A3($dillonkearns$elm_markdown$Markdown$Block$HtmlElement, tag, attributes, childrenAsBlocks));
					return $elm$core$Result$Ok(
						A2($elm$core$List$cons, block, blocks));
				} else {
					var err = _v99.a;
					return $elm$core$Result$Err(err);
				}
			case 'Text':
				var innerText = node.a;
				var _v100 = $dillonkearns$elm_markdown$Markdown$Parser$parse(innerText);
				if (_v100.$ === 'Ok') {
					var value = _v100.a;
					return $elm$core$Result$Ok(
						_Utils_ap(
							$elm$core$List$reverse(value),
							blocks));
				} else {
					var error = _v100.a;
					return $elm$core$Result$Err(
						$elm$parser$Parser$Expecting(
							A2(
								$elm$core$String$join,
								'\n',
								A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$deadEndToString, error))));
				}
			case 'Comment':
				var string = node.a;
				return $elm$core$Result$Ok(
					A2(
						$elm$core$List$cons,
						$dillonkearns$elm_markdown$Markdown$Block$HtmlBlock(
							$dillonkearns$elm_markdown$Markdown$Block$HtmlComment(string)),
						blocks));
			case 'Cdata':
				var string = node.a;
				return $elm$core$Result$Ok(
					A2(
						$elm$core$List$cons,
						$dillonkearns$elm_markdown$Markdown$Block$HtmlBlock(
							$dillonkearns$elm_markdown$Markdown$Block$Cdata(string)),
						blocks));
			case 'ProcessingInstruction':
				var string = node.a;
				return $elm$core$Result$Ok(
					A2(
						$elm$core$List$cons,
						$dillonkearns$elm_markdown$Markdown$Block$HtmlBlock(
							$dillonkearns$elm_markdown$Markdown$Block$ProcessingInstruction(string)),
						blocks));
			default:
				var declarationType = node.a;
				var content = node.b;
				return $elm$core$Result$Ok(
					A2(
						$elm$core$List$cons,
						$dillonkearns$elm_markdown$Markdown$Block$HtmlBlock(
							A2($dillonkearns$elm_markdown$Markdown$Block$HtmlDeclaration, declarationType, content)),
						blocks));
		}
	});
var $dillonkearns$elm_markdown$Markdown$Parser$completeBlocks = function (state) {
	var _v84 = state.rawBlocks;
	_v84$5:
	while (true) {
		if (_v84.b) {
			switch (_v84.a.$) {
				case 'BlockQuote':
					var body2 = _v84.a.a;
					var rest = _v84.b;
					var _v85 = A2(
						$elm$parser$Parser$Advanced$run,
						$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
						body2);
					if (_v85.$ === 'Ok') {
						var value = _v85.a;
						return $elm$parser$Parser$Advanced$succeed(
							{
								linkReferenceDefinitions: _Utils_ap(state.linkReferenceDefinitions, value.linkReferenceDefinitions),
								rawBlocks: A2(
									$elm$core$List$cons,
									$dillonkearns$elm_markdown$Markdown$RawBlock$ParsedBlockQuote(value.rawBlocks),
									rest)
							});
					} else {
						var error = _v85.a;
						return $elm$parser$Parser$Advanced$problem(
							$elm$parser$Parser$Problem(
								$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(error)));
					}
				case 'UnorderedListBlock':
					var _v86 = _v84.a;
					var tight = _v86.a;
					var intended = _v86.b;
					var closeListItems = _v86.c;
					var openListItem = _v86.d;
					var rest = _v84.b;
					var _v87 = A2(
						$elm$parser$Parser$Advanced$run,
						$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
						openListItem.body);
					if (_v87.$ === 'Ok') {
						var value = _v87.a;
						var tight2 = A2($elm$core$List$member, $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine, value.rawBlocks) ? false : tight;
						return $elm$parser$Parser$Advanced$succeed(
							{
								linkReferenceDefinitions: _Utils_ap(state.linkReferenceDefinitions, value.linkReferenceDefinitions),
								rawBlocks: A2(
									$elm$core$List$cons,
									A4(
										$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
										tight2,
										intended,
										A2(
											$elm$core$List$cons,
											{body: value.rawBlocks, task: openListItem.task},
											closeListItems),
										openListItem),
									rest)
							});
					} else {
						var e = _v87.a;
						return $elm$parser$Parser$Advanced$problem(
							$elm$parser$Parser$Problem(
								$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
					}
				case 'OrderedListBlock':
					var _v92 = _v84.a;
					var tight = _v92.a;
					var intended = _v92.b;
					var marker = _v92.c;
					var order = _v92.d;
					var closeListItems = _v92.e;
					var openListItem = _v92.f;
					var rest = _v84.b;
					var _v93 = A2(
						$elm$parser$Parser$Advanced$run,
						$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
						openListItem);
					if (_v93.$ === 'Ok') {
						var value = _v93.a;
						var tight2 = A2($elm$core$List$member, $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine, value.rawBlocks) ? false : tight;
						return $elm$parser$Parser$Advanced$succeed(
							{
								linkReferenceDefinitions: _Utils_ap(state.linkReferenceDefinitions, value.linkReferenceDefinitions),
								rawBlocks: A2(
									$elm$core$List$cons,
									A6(
										$dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock,
										tight2,
										intended,
										marker,
										order,
										A2($elm$core$List$cons, value.rawBlocks, closeListItems),
										openListItem),
									rest)
							});
					} else {
						var e = _v93.a;
						return $elm$parser$Parser$Advanced$problem(
							$elm$parser$Parser$Problem(
								$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
					}
				case 'BlankLine':
					if (_v84.b.b) {
						switch (_v84.b.a.$) {
							case 'UnorderedListBlock':
								var _v88 = _v84.a;
								var _v89 = _v84.b;
								var _v90 = _v89.a;
								var tight = _v90.a;
								var intended = _v90.b;
								var closeListItems = _v90.c;
								var openListItem = _v90.d;
								var rest = _v89.b;
								var _v91 = A2(
									$elm$parser$Parser$Advanced$run,
									$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
									openListItem.body);
								if (_v91.$ === 'Ok') {
									var value = _v91.a;
									var tight2 = A2($elm$core$List$member, $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine, value.rawBlocks) ? false : tight;
									return $elm$parser$Parser$Advanced$succeed(
										{
											linkReferenceDefinitions: _Utils_ap(state.linkReferenceDefinitions, value.linkReferenceDefinitions),
											rawBlocks: A2(
												$elm$core$List$cons,
												A4(
													$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
													tight2,
													intended,
													A2(
														$elm$core$List$cons,
														{body: value.rawBlocks, task: openListItem.task},
														closeListItems),
													openListItem),
												rest)
										});
								} else {
									var e = _v91.a;
									return $elm$parser$Parser$Advanced$problem(
										$elm$parser$Parser$Problem(
											$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
								}
							case 'OrderedListBlock':
								var _v94 = _v84.a;
								var _v95 = _v84.b;
								var _v96 = _v95.a;
								var tight = _v96.a;
								var intended = _v96.b;
								var marker = _v96.c;
								var order = _v96.d;
								var closeListItems = _v96.e;
								var openListItem = _v96.f;
								var rest = _v95.b;
								var _v97 = A2(
									$elm$parser$Parser$Advanced$run,
									$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
									openListItem);
								if (_v97.$ === 'Ok') {
									var value = _v97.a;
									var tight2 = A2($elm$core$List$member, $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine, value.rawBlocks) ? false : tight;
									return $elm$parser$Parser$Advanced$succeed(
										{
											linkReferenceDefinitions: _Utils_ap(state.linkReferenceDefinitions, value.linkReferenceDefinitions),
											rawBlocks: A2(
												$elm$core$List$cons,
												A6(
													$dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock,
													tight2,
													intended,
													marker,
													order,
													A2($elm$core$List$cons, value.rawBlocks, closeListItems),
													openListItem),
												rest)
										});
								} else {
									var e = _v97.a;
									return $elm$parser$Parser$Advanced$problem(
										$elm$parser$Parser$Problem(
											$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
								}
							default:
								break _v84$5;
						}
					} else {
						break _v84$5;
					}
				default:
					break _v84$5;
			}
		} else {
			break _v84$5;
		}
	}
	return $elm$parser$Parser$Advanced$succeed(state);
};
var $dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks = F2(
	function (state, newRawBlock) {
		var _v41 = _Utils_Tuple2(newRawBlock, state.rawBlocks);
		_v41$13:
		while (true) {
			if (_v41.b.b) {
				switch (_v41.b.a.$) {
					case 'CodeBlock':
						if (_v41.a.$ === 'CodeBlock') {
							var block1 = _v41.a.a;
							var _v42 = _v41.b;
							var block2 = _v42.a.a;
							var rest = _v42.b;
							return $elm$parser$Parser$Advanced$succeed(
								{
									linkReferenceDefinitions: state.linkReferenceDefinitions,
									rawBlocks: A2(
										$elm$core$List$cons,
										$dillonkearns$elm_markdown$Markdown$RawBlock$CodeBlock(
											{
												body: A2($dillonkearns$elm_markdown$Markdown$Parser$joinStringsPreserveAll, block2.body, block1.body),
												language: $elm$core$Maybe$Nothing
											}),
										rest)
								});
						} else {
							break _v41$13;
						}
					case 'IndentedCodeBlock':
						switch (_v41.a.$) {
							case 'IndentedCodeBlock':
								var block1 = _v41.a.a;
								var _v43 = _v41.b;
								var block2 = _v43.a.a;
								var rest = _v43.b;
								return $elm$parser$Parser$Advanced$succeed(
									{
										linkReferenceDefinitions: state.linkReferenceDefinitions,
										rawBlocks: A2(
											$elm$core$List$cons,
											$dillonkearns$elm_markdown$Markdown$RawBlock$IndentedCodeBlock(
												A2($dillonkearns$elm_markdown$Markdown$Parser$joinStringsPreserveAll, block2, block1)),
											rest)
									});
							case 'BlankLine':
								var _v44 = _v41.a;
								var _v45 = _v41.b;
								var block = _v45.a.a;
								var rest = _v45.b;
								return $elm$parser$Parser$Advanced$succeed(
									{
										linkReferenceDefinitions: state.linkReferenceDefinitions,
										rawBlocks: A2(
											$elm$core$List$cons,
											$dillonkearns$elm_markdown$Markdown$RawBlock$IndentedCodeBlock(
												A2($dillonkearns$elm_markdown$Markdown$Parser$joinStringsPreserveAll, block, '\n')),
											rest)
									});
							default:
								break _v41$13;
						}
					case 'BlockQuote':
						var _v46 = _v41.b;
						var body2 = _v46.a.a;
						var rest = _v46.b;
						switch (newRawBlock.$) {
							case 'BlockQuote':
								var body1 = newRawBlock.a;
								return $elm$parser$Parser$Advanced$succeed(
									{
										linkReferenceDefinitions: state.linkReferenceDefinitions,
										rawBlocks: A2(
											$elm$core$List$cons,
											$dillonkearns$elm_markdown$Markdown$RawBlock$BlockQuote(
												A2($dillonkearns$elm_markdown$Markdown$Parser$joinStringsPreserveAll, body2, body1)),
											rest)
									});
							case 'OpenBlockOrParagraph':
								var body1 = newRawBlock.a.a;
								return $elm$parser$Parser$Advanced$succeed(
									{
										linkReferenceDefinitions: state.linkReferenceDefinitions,
										rawBlocks: A2(
											$elm$core$List$cons,
											$dillonkearns$elm_markdown$Markdown$RawBlock$BlockQuote(
												A3($dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith, '\n', body2, body1)),
											rest)
									});
							default:
								var _v48 = A2(
									$elm$parser$Parser$Advanced$run,
									$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
									body2);
								if (_v48.$ === 'Ok') {
									var value = _v48.a;
									return $elm$parser$Parser$Advanced$succeed(
										{
											linkReferenceDefinitions: _Utils_ap(state.linkReferenceDefinitions, value.linkReferenceDefinitions),
											rawBlocks: A2(
												$elm$core$List$cons,
												newRawBlock,
												A2(
													$elm$core$List$cons,
													$dillonkearns$elm_markdown$Markdown$RawBlock$ParsedBlockQuote(value.rawBlocks),
													rest))
										});
								} else {
									var e = _v48.a;
									return $elm$parser$Parser$Advanced$problem(
										$elm$parser$Parser$Problem(
											$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
								}
						}
					case 'UnorderedListBlock':
						var _v49 = _v41.b;
						var _v50 = _v49.a;
						var tight = _v50.a;
						var intended1 = _v50.b;
						var closeListItems2 = _v50.c;
						var openListItem2 = _v50.d;
						var rest = _v49.b;
						switch (newRawBlock.$) {
							case 'UnorderedListBlock':
								var intended2 = newRawBlock.b;
								var closeListItems1 = newRawBlock.c;
								var openListItem1 = newRawBlock.d;
								if (_Utils_eq(openListItem2.marker, openListItem1.marker)) {
									var _v52 = A2(
										$elm$parser$Parser$Advanced$run,
										$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
										openListItem2.body);
									if (_v52.$ === 'Ok') {
										var value = _v52.a;
										return A2($elm$core$List$member, $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine, value.rawBlocks) ? $elm$parser$Parser$Advanced$succeed(
											{
												linkReferenceDefinitions: _Utils_ap(state.linkReferenceDefinitions, value.linkReferenceDefinitions),
												rawBlocks: A2(
													$elm$core$List$cons,
													A4(
														$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
														false,
														intended2,
														A2(
															$elm$core$List$cons,
															{body: value.rawBlocks, task: openListItem2.task},
															closeListItems2),
														openListItem1),
													rest)
											}) : $elm$parser$Parser$Advanced$succeed(
											{
												linkReferenceDefinitions: _Utils_ap(state.linkReferenceDefinitions, value.linkReferenceDefinitions),
												rawBlocks: A2(
													$elm$core$List$cons,
													A4(
														$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
														tight,
														intended2,
														A2(
															$elm$core$List$cons,
															{body: value.rawBlocks, task: openListItem2.task},
															closeListItems2),
														openListItem1),
													rest)
											});
									} else {
										var e = _v52.a;
										return $elm$parser$Parser$Advanced$problem(
											$elm$parser$Parser$Problem(
												$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
									}
								} else {
									var _v53 = A2(
										$elm$parser$Parser$Advanced$run,
										$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
										openListItem2.body);
									if (_v53.$ === 'Ok') {
										var value = _v53.a;
										var tight2 = A2($elm$core$List$member, $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine, value.rawBlocks) ? false : tight;
										return $elm$parser$Parser$Advanced$succeed(
											{
												linkReferenceDefinitions: _Utils_ap(state.linkReferenceDefinitions, value.linkReferenceDefinitions),
												rawBlocks: A2(
													$elm$core$List$cons,
													newRawBlock,
													A2(
														$elm$core$List$cons,
														A4(
															$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
															tight2,
															intended1,
															A2(
																$elm$core$List$cons,
																{body: value.rawBlocks, task: openListItem2.task},
																closeListItems2),
															openListItem1),
														rest))
											});
									} else {
										var e = _v53.a;
										return $elm$parser$Parser$Advanced$problem(
											$elm$parser$Parser$Problem(
												$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
									}
								}
							case 'OpenBlockOrParagraph':
								var body1 = newRawBlock.a.a;
								return $elm$parser$Parser$Advanced$succeed(
									{
										linkReferenceDefinitions: state.linkReferenceDefinitions,
										rawBlocks: A2(
											$elm$core$List$cons,
											A4(
												$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
												tight,
												intended1,
												closeListItems2,
												_Utils_update(
													openListItem2,
													{
														body: A3($dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith, '\n', openListItem2.body, body1)
													})),
											rest)
									});
							default:
								var _v54 = A2(
									$elm$parser$Parser$Advanced$run,
									$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
									openListItem2.body);
								if (_v54.$ === 'Ok') {
									var value = _v54.a;
									var tight2 = A2($elm$core$List$member, $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine, value.rawBlocks) ? false : tight;
									return $elm$parser$Parser$Advanced$succeed(
										{
											linkReferenceDefinitions: _Utils_ap(state.linkReferenceDefinitions, value.linkReferenceDefinitions),
											rawBlocks: A2(
												$elm$core$List$cons,
												newRawBlock,
												A2(
													$elm$core$List$cons,
													A4(
														$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
														tight2,
														intended1,
														A2(
															$elm$core$List$cons,
															{body: value.rawBlocks, task: openListItem2.task},
															closeListItems2),
														openListItem2),
													rest))
										});
								} else {
									var e = _v54.a;
									return $elm$parser$Parser$Advanced$problem(
										$elm$parser$Parser$Problem(
											$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
								}
						}
					case 'OrderedListBlock':
						var _v55 = _v41.b;
						var _v56 = _v55.a;
						var tight = _v56.a;
						var intended1 = _v56.b;
						var marker = _v56.c;
						var order = _v56.d;
						var closeListItems2 = _v56.e;
						var openListItem2 = _v56.f;
						var rest = _v55.b;
						switch (newRawBlock.$) {
							case 'OrderedListBlock':
								var intended2 = newRawBlock.b;
								var marker2 = newRawBlock.c;
								var closeListItems1 = newRawBlock.e;
								var openListItem1 = newRawBlock.f;
								if (_Utils_eq(marker, marker2)) {
									var _v58 = A2(
										$elm$parser$Parser$Advanced$run,
										$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
										openListItem2);
									if (_v58.$ === 'Ok') {
										var value = _v58.a;
										var tight2 = A2($elm$core$List$member, $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine, value.rawBlocks) ? false : tight;
										return $elm$parser$Parser$Advanced$succeed(
											{
												linkReferenceDefinitions: _Utils_ap(state.linkReferenceDefinitions, value.linkReferenceDefinitions),
												rawBlocks: A2(
													$elm$core$List$cons,
													A6(
														$dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock,
														tight2,
														intended2,
														marker,
														order,
														A2($elm$core$List$cons, value.rawBlocks, closeListItems2),
														openListItem1),
													rest)
											});
									} else {
										var e = _v58.a;
										return $elm$parser$Parser$Advanced$problem(
											$elm$parser$Parser$Problem(
												$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
									}
								} else {
									var _v59 = A2(
										$elm$parser$Parser$Advanced$run,
										$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
										openListItem2);
									if (_v59.$ === 'Ok') {
										var value = _v59.a;
										var tight2 = A2($elm$core$List$member, $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine, value.rawBlocks) ? false : tight;
										return $elm$parser$Parser$Advanced$succeed(
											{
												linkReferenceDefinitions: _Utils_ap(state.linkReferenceDefinitions, value.linkReferenceDefinitions),
												rawBlocks: A2(
													$elm$core$List$cons,
													newRawBlock,
													A2(
														$elm$core$List$cons,
														A6(
															$dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock,
															tight2,
															intended1,
															marker,
															order,
															A2($elm$core$List$cons, value.rawBlocks, closeListItems2),
															openListItem2),
														rest))
											});
									} else {
										var e = _v59.a;
										return $elm$parser$Parser$Advanced$problem(
											$elm$parser$Parser$Problem(
												$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
									}
								}
							case 'OpenBlockOrParagraph':
								var body1 = newRawBlock.a.a;
								return $elm$parser$Parser$Advanced$succeed(
									{
										linkReferenceDefinitions: state.linkReferenceDefinitions,
										rawBlocks: A2(
											$elm$core$List$cons,
											A6($dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock, tight, intended1, marker, order, closeListItems2, openListItem2 + ('\n' + body1)),
											rest)
									});
							default:
								var _v60 = A2(
									$elm$parser$Parser$Advanced$run,
									$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
									openListItem2);
								if (_v60.$ === 'Ok') {
									var value = _v60.a;
									var tight2 = A2($elm$core$List$member, $dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine, value.rawBlocks) ? false : tight;
									return $elm$parser$Parser$Advanced$succeed(
										{
											linkReferenceDefinitions: _Utils_ap(state.linkReferenceDefinitions, value.linkReferenceDefinitions),
											rawBlocks: A2(
												$elm$core$List$cons,
												newRawBlock,
												A2(
													$elm$core$List$cons,
													A6(
														$dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock,
														tight2,
														intended1,
														marker,
														order,
														A2($elm$core$List$cons, value.rawBlocks, closeListItems2),
														openListItem2),
													rest))
										});
								} else {
									var e = _v60.a;
									return $elm$parser$Parser$Advanced$problem(
										$elm$parser$Parser$Problem(
											$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
								}
						}
					case 'OpenBlockOrParagraph':
						switch (_v41.a.$) {
							case 'OpenBlockOrParagraph':
								var body1 = _v41.a.a.a;
								var _v61 = _v41.b;
								var body2 = _v61.a.a.a;
								var rest = _v61.b;
								return $elm$parser$Parser$Advanced$succeed(
									{
										linkReferenceDefinitions: state.linkReferenceDefinitions,
										rawBlocks: A2(
											$elm$core$List$cons,
											$dillonkearns$elm_markdown$Markdown$RawBlock$OpenBlockOrParagraph(
												$dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(
													A3($dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith, '\n', body2, body1))),
											rest)
									});
							case 'SetextLine':
								if (_v41.a.a.$ === 'LevelOne') {
									var _v62 = _v41.a;
									var _v63 = _v62.a;
									var _v64 = _v41.b;
									var unparsedInlines = _v64.a.a;
									var rest = _v64.b;
									return $elm$parser$Parser$Advanced$succeed(
										{
											linkReferenceDefinitions: state.linkReferenceDefinitions,
											rawBlocks: A2(
												$elm$core$List$cons,
												A2($dillonkearns$elm_markdown$Markdown$RawBlock$Heading, 1, unparsedInlines),
												rest)
										});
								} else {
									var _v65 = _v41.a;
									var _v66 = _v65.a;
									var _v67 = _v41.b;
									var unparsedInlines = _v67.a.a;
									var rest = _v67.b;
									return $elm$parser$Parser$Advanced$succeed(
										{
											linkReferenceDefinitions: state.linkReferenceDefinitions,
											rawBlocks: A2(
												$elm$core$List$cons,
												A2($dillonkearns$elm_markdown$Markdown$RawBlock$Heading, 2, unparsedInlines),
												rest)
										});
								}
							case 'TableDelimiter':
								var _v68 = _v41.a.a;
								var text = _v68.a;
								var alignments = _v68.b;
								var _v69 = _v41.b;
								var rawHeaders = _v69.a.a.a;
								var rest = _v69.b;
								var _v70 = A2(
									$dillonkearns$elm_markdown$Markdown$TableParser$parseHeader,
									A2($dillonkearns$elm_markdown$Markdown$Table$TableDelimiterRow, text, alignments),
									rawHeaders);
								if (_v70.$ === 'Ok') {
									var headers = _v70.a.a;
									return $elm$parser$Parser$Advanced$succeed(
										{
											linkReferenceDefinitions: state.linkReferenceDefinitions,
											rawBlocks: A2(
												$elm$core$List$cons,
												$dillonkearns$elm_markdown$Markdown$RawBlock$Table(
													A2($dillonkearns$elm_markdown$Markdown$Table$Table, headers, _List_Nil)),
												rest)
										});
								} else {
									return $elm$parser$Parser$Advanced$succeed(
										{
											linkReferenceDefinitions: state.linkReferenceDefinitions,
											rawBlocks: A2(
												$elm$core$List$cons,
												$dillonkearns$elm_markdown$Markdown$RawBlock$OpenBlockOrParagraph(
													$dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(
														A3($dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith, '\n', rawHeaders, text.raw))),
												rest)
										});
								}
							default:
								break _v41$13;
						}
					case 'Table':
						if (_v41.a.$ === 'Table') {
							var updatedTable = _v41.a.a;
							var _v71 = _v41.b;
							var rest = _v71.b;
							return $elm$parser$Parser$Advanced$succeed(
								{
									linkReferenceDefinitions: state.linkReferenceDefinitions,
									rawBlocks: A2(
										$elm$core$List$cons,
										$dillonkearns$elm_markdown$Markdown$RawBlock$Table(updatedTable),
										rest)
								});
						} else {
							break _v41$13;
						}
					case 'BlankLine':
						if (_v41.b.b.b) {
							switch (_v41.b.b.a.$) {
								case 'OrderedListBlock':
									var _v72 = _v41.b;
									var _v73 = _v72.a;
									var _v74 = _v72.b;
									var _v75 = _v74.a;
									var tight = _v75.a;
									var intended1 = _v75.b;
									var marker = _v75.c;
									var order = _v75.d;
									var closeListItems2 = _v75.e;
									var openListItem2 = _v75.f;
									var rest = _v74.b;
									var _v76 = A2(
										$elm$parser$Parser$Advanced$run,
										$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
										openListItem2);
									if (_v76.$ === 'Ok') {
										var value = _v76.a;
										if (newRawBlock.$ === 'OrderedListBlock') {
											var intended2 = newRawBlock.b;
											var openListItem = newRawBlock.f;
											return $elm$parser$Parser$Advanced$succeed(
												{
													linkReferenceDefinitions: _Utils_ap(state.linkReferenceDefinitions, value.linkReferenceDefinitions),
													rawBlocks: A2(
														$elm$core$List$cons,
														A6(
															$dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock,
															false,
															intended2,
															marker,
															order,
															A2($elm$core$List$cons, value.rawBlocks, closeListItems2),
															openListItem),
														rest)
												});
										} else {
											return $elm$parser$Parser$Advanced$succeed(
												{
													linkReferenceDefinitions: _Utils_ap(state.linkReferenceDefinitions, value.linkReferenceDefinitions),
													rawBlocks: A2(
														$elm$core$List$cons,
														newRawBlock,
														A2(
															$elm$core$List$cons,
															$dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine,
															A2(
																$elm$core$List$cons,
																A6(
																	$dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock,
																	tight,
																	intended1,
																	marker,
																	order,
																	A2($elm$core$List$cons, value.rawBlocks, closeListItems2),
																	openListItem2),
																rest)))
												});
										}
									} else {
										var e = _v76.a;
										return $elm$parser$Parser$Advanced$problem(
											$elm$parser$Parser$Problem(
												$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
									}
								case 'UnorderedListBlock':
									var _v78 = _v41.b;
									var _v79 = _v78.a;
									var _v80 = _v78.b;
									var _v81 = _v80.a;
									var tight = _v81.a;
									var intended1 = _v81.b;
									var closeListItems2 = _v81.c;
									var openListItem2 = _v81.d;
									var rest = _v80.b;
									var _v82 = A2(
										$elm$parser$Parser$Advanced$run,
										$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
										openListItem2.body);
									if (_v82.$ === 'Ok') {
										var value = _v82.a;
										if (newRawBlock.$ === 'UnorderedListBlock') {
											var openListItem = newRawBlock.d;
											return $elm$parser$Parser$Advanced$succeed(
												{
													linkReferenceDefinitions: _Utils_ap(state.linkReferenceDefinitions, value.linkReferenceDefinitions),
													rawBlocks: A2(
														$elm$core$List$cons,
														A4(
															$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
															false,
															intended1,
															A2(
																$elm$core$List$cons,
																{body: value.rawBlocks, task: openListItem2.task},
																closeListItems2),
															openListItem),
														rest)
												});
										} else {
											return $elm$parser$Parser$Advanced$succeed(
												{
													linkReferenceDefinitions: _Utils_ap(state.linkReferenceDefinitions, value.linkReferenceDefinitions),
													rawBlocks: A2(
														$elm$core$List$cons,
														newRawBlock,
														A2(
															$elm$core$List$cons,
															$dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine,
															A2(
																$elm$core$List$cons,
																A4(
																	$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
																	tight,
																	intended1,
																	A2(
																		$elm$core$List$cons,
																		{body: value.rawBlocks, task: openListItem2.task},
																		closeListItems2),
																	openListItem2),
																rest)))
												});
										}
									} else {
										var e = _v82.a;
										return $elm$parser$Parser$Advanced$problem(
											$elm$parser$Parser$Problem(
												$dillonkearns$elm_markdown$Markdown$Parser$deadEndsToString(e)));
									}
								default:
									break _v41$13;
							}
						} else {
							break _v41$13;
						}
					default:
						break _v41$13;
				}
			} else {
				break _v41$13;
			}
		}
		return $elm$parser$Parser$Advanced$succeed(
			{
				linkReferenceDefinitions: state.linkReferenceDefinitions,
				rawBlocks: A2($elm$core$List$cons, newRawBlock, state.rawBlocks)
			});
	});
var $dillonkearns$elm_markdown$Markdown$Parser$inlineParseHelper = F2(
	function (referencesDict, _v36) {
		var unparsedInlines = _v36.a;
		var mappedReferencesDict = $elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$mapSecond(
					function (_v37) {
						var destination = _v37.destination;
						var title = _v37.title;
						return _Utils_Tuple2(destination, title);
					}),
				referencesDict));
		return A2(
			$elm$core$List$map,
			$dillonkearns$elm_markdown$Markdown$Parser$mapInline,
			A2($dillonkearns$elm_markdown$Markdown$InlineParser$parse, mappedReferencesDict, unparsedInlines));
	});
var $dillonkearns$elm_markdown$Markdown$Parser$mapInline = function (inline) {
	switch (inline.$) {
		case 'Text':
			var string = inline.a;
			return $dillonkearns$elm_markdown$Markdown$Block$Text(string);
		case 'HardLineBreak':
			return $dillonkearns$elm_markdown$Markdown$Block$HardLineBreak;
		case 'CodeInline':
			var string = inline.a;
			return $dillonkearns$elm_markdown$Markdown$Block$CodeSpan(string);
		case 'Link':
			var string = inline.a;
			var maybeString = inline.b;
			var inlines = inline.c;
			return A3(
				$dillonkearns$elm_markdown$Markdown$Block$Link,
				string,
				maybeString,
				A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$mapInline, inlines));
		case 'Image':
			var string = inline.a;
			var maybeString = inline.b;
			var inlines = inline.c;
			return A3(
				$dillonkearns$elm_markdown$Markdown$Block$Image,
				string,
				maybeString,
				A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$mapInline, inlines));
		case 'HtmlInline':
			var node = inline.a;
			return $dillonkearns$elm_markdown$Markdown$Block$HtmlInline(
				$dillonkearns$elm_markdown$Markdown$Parser$nodeToRawBlock(node));
		case 'Emphasis':
			var level = inline.a;
			var inlines = inline.b;
			switch (level) {
				case 1:
					return $dillonkearns$elm_markdown$Markdown$Block$Emphasis(
						A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$mapInline, inlines));
				case 2:
					return $dillonkearns$elm_markdown$Markdown$Block$Strong(
						A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$mapInline, inlines));
				default:
					return $dillonkearns$elm_markdown$Markdown$Helpers$isEven(level) ? $dillonkearns$elm_markdown$Markdown$Block$Strong(
						_List_fromArray(
							[
								$dillonkearns$elm_markdown$Markdown$Parser$mapInline(
								A2($dillonkearns$elm_markdown$Markdown$Inline$Emphasis, level - 2, inlines))
							])) : $dillonkearns$elm_markdown$Markdown$Block$Emphasis(
						_List_fromArray(
							[
								$dillonkearns$elm_markdown$Markdown$Parser$mapInline(
								A2($dillonkearns$elm_markdown$Markdown$Inline$Emphasis, level - 1, inlines))
							]));
			}
		default:
			var inlines = inline.a;
			return $dillonkearns$elm_markdown$Markdown$Block$Strikethrough(
				A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Parser$mapInline, inlines));
	}
};
var $dillonkearns$elm_markdown$Markdown$Parser$nodeToRawBlock = function (node) {
	switch (node.$) {
		case 'Text':
			var innerText = node.a;
			return $dillonkearns$elm_markdown$Markdown$Block$HtmlComment('TODO this never happens, but use types to drop this case.');
		case 'Element':
			var tag = node.a;
			var attributes = node.b;
			var children = node.c;
			var parseChild = function (child) {
				if (child.$ === 'Text') {
					var text = child.a;
					return $dillonkearns$elm_markdown$Markdown$Parser$textNodeToBlocks(text);
				} else {
					return _List_fromArray(
						[
							$dillonkearns$elm_markdown$Markdown$Block$HtmlBlock(
							$dillonkearns$elm_markdown$Markdown$Parser$nodeToRawBlock(child))
						]);
				}
			};
			return A3(
				$dillonkearns$elm_markdown$Markdown$Block$HtmlElement,
				tag,
				attributes,
				A2($elm$core$List$concatMap, parseChild, children));
		case 'Comment':
			var string = node.a;
			return $dillonkearns$elm_markdown$Markdown$Block$HtmlComment(string);
		case 'Cdata':
			var string = node.a;
			return $dillonkearns$elm_markdown$Markdown$Block$Cdata(string);
		case 'ProcessingInstruction':
			var string = node.a;
			return $dillonkearns$elm_markdown$Markdown$Block$ProcessingInstruction(string);
		default:
			var declarationType = node.a;
			var content = node.b;
			return A2($dillonkearns$elm_markdown$Markdown$Block$HtmlDeclaration, declarationType, content);
	}
};
var $dillonkearns$elm_markdown$Markdown$Parser$nodesToBlocks = function (children) {
	return A2($dillonkearns$elm_markdown$Markdown$Parser$nodesToBlocksHelp, children, _List_Nil);
};
var $dillonkearns$elm_markdown$Markdown$Parser$nodesToBlocksHelp = F2(
	function (remaining, soFar) {
		nodesToBlocksHelp:
		while (true) {
			if (remaining.b) {
				var node = remaining.a;
				var rest = remaining.b;
				var _v31 = A2($dillonkearns$elm_markdown$Markdown$Parser$childToBlocks, node, soFar);
				if (_v31.$ === 'Ok') {
					var newSoFar = _v31.a;
					var $temp$remaining = rest,
						$temp$soFar = newSoFar;
					remaining = $temp$remaining;
					soFar = $temp$soFar;
					continue nodesToBlocksHelp;
				} else {
					var e = _v31.a;
					return $elm$core$Result$Err(e);
				}
			} else {
				return $elm$core$Result$Ok(
					$elm$core$List$reverse(soFar));
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$Parser$parse = function (input) {
	var _v27 = A2(
		$elm$parser$Parser$Advanced$run,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser(),
			$dillonkearns$elm_markdown$Helpers$endOfFile),
		input);
	if (_v27.$ === 'Err') {
		var e = _v27.a;
		return $elm$core$Result$Err(e);
	} else {
		var v = _v27.a;
		var _v28 = $dillonkearns$elm_markdown$Markdown$Parser$parseAllInlines(v);
		if (_v28.$ === 'Err') {
			var e = _v28.a;
			return A2(
				$elm$parser$Parser$Advanced$run,
				$elm$parser$Parser$Advanced$problem(e),
				'');
		} else {
			var blocks = _v28.a;
			var isNotEmptyParagraph = function (block) {
				if ((block.$ === 'Paragraph') && (!block.a.b)) {
					return false;
				} else {
					return true;
				}
			};
			return $elm$core$Result$Ok(
				A2($elm$core$List$filter, isNotEmptyParagraph, blocks));
		}
	}
};
var $dillonkearns$elm_markdown$Markdown$Parser$parseAllInlines = function (state) {
	return A3($dillonkearns$elm_markdown$Markdown$Parser$parseAllInlinesHelp, state, state.rawBlocks, _List_Nil);
};
var $dillonkearns$elm_markdown$Markdown$Parser$parseAllInlinesHelp = F3(
	function (state, rawBlocks, parsedBlocks) {
		parseAllInlinesHelp:
		while (true) {
			if (rawBlocks.b) {
				var rawBlock = rawBlocks.a;
				var rest = rawBlocks.b;
				var _v26 = A2($dillonkearns$elm_markdown$Markdown$Parser$parseInlines, state.linkReferenceDefinitions, rawBlock);
				switch (_v26.$) {
					case 'ParsedBlock':
						var newParsedBlock = _v26.a;
						var $temp$state = state,
							$temp$rawBlocks = rest,
							$temp$parsedBlocks = A2($elm$core$List$cons, newParsedBlock, parsedBlocks);
						state = $temp$state;
						rawBlocks = $temp$rawBlocks;
						parsedBlocks = $temp$parsedBlocks;
						continue parseAllInlinesHelp;
					case 'EmptyBlock':
						var $temp$state = state,
							$temp$rawBlocks = rest,
							$temp$parsedBlocks = parsedBlocks;
						state = $temp$state;
						rawBlocks = $temp$rawBlocks;
						parsedBlocks = $temp$parsedBlocks;
						continue parseAllInlinesHelp;
					default:
						var e = _v26.a;
						return $elm$core$Result$Err(e);
				}
			} else {
				return $elm$core$Result$Ok(parsedBlocks);
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$Parser$parseHeaderInlines = F2(
	function (linkReferences, header) {
		return A2(
			$elm$core$List$map,
			function (_v24) {
				var label = _v24.label;
				var alignment = _v24.alignment;
				return A3(
					$dillonkearns$elm_markdown$Markdown$Parser$parseRawInline,
					linkReferences,
					function (parsedHeaderLabel) {
						return {alignment: alignment, label: parsedHeaderLabel};
					},
					$dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(label));
			},
			header);
	});
var $dillonkearns$elm_markdown$Markdown$Parser$parseInlines = F2(
	function (linkReferences, rawBlock) {
		switch (rawBlock.$) {
			case 'Heading':
				var level = rawBlock.a;
				var unparsedInlines = rawBlock.b;
				var _v17 = $dillonkearns$elm_markdown$Markdown$Parser$toHeading(level);
				if (_v17.$ === 'Ok') {
					var parsedLevel = _v17.a;
					return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
						A2(
							$dillonkearns$elm_markdown$Markdown$Block$Heading,
							parsedLevel,
							A2($dillonkearns$elm_markdown$Markdown$Parser$inlineParseHelper, linkReferences, unparsedInlines)));
				} else {
					var e = _v17.a;
					return $dillonkearns$elm_markdown$Markdown$Parser$InlineProblem(e);
				}
			case 'OpenBlockOrParagraph':
				var unparsedInlines = rawBlock.a;
				return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
					$dillonkearns$elm_markdown$Markdown$Block$Paragraph(
						A2($dillonkearns$elm_markdown$Markdown$Parser$inlineParseHelper, linkReferences, unparsedInlines)));
			case 'Html':
				var html = rawBlock.a;
				return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
					$dillonkearns$elm_markdown$Markdown$Block$HtmlBlock(html));
			case 'UnorderedListBlock':
				var tight = rawBlock.a;
				var intended = rawBlock.b;
				var unparsedItems = rawBlock.c;
				var parseItem = F2(
					function (rawBlockTask, rawBlocks) {
						var blocksTask = function () {
							if (rawBlockTask.$ === 'Just') {
								if (!rawBlockTask.a) {
									return $dillonkearns$elm_markdown$Markdown$Block$IncompleteTask;
								} else {
									return $dillonkearns$elm_markdown$Markdown$Block$CompletedTask;
								}
							} else {
								return $dillonkearns$elm_markdown$Markdown$Block$NoTask;
							}
						}();
						var blocks = function () {
							var _v18 = $dillonkearns$elm_markdown$Markdown$Parser$parseAllInlines(
								{linkReferenceDefinitions: linkReferences, rawBlocks: rawBlocks});
							if (_v18.$ === 'Ok') {
								var parsedBlocks = _v18.a;
								return parsedBlocks;
							} else {
								var e = _v18.a;
								return _List_Nil;
							}
						}();
						return A2($dillonkearns$elm_markdown$Markdown$Block$ListItem, blocksTask, blocks);
					});
				return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
					A2(
						$dillonkearns$elm_markdown$Markdown$Block$UnorderedList,
						$dillonkearns$elm_markdown$Markdown$Parser$isTightBoolToListDisplay(tight),
						$elm$core$List$reverse(
							A2(
								$elm$core$List$map,
								function (item) {
									return A2(parseItem, item.task, item.body);
								},
								unparsedItems))));
			case 'OrderedListBlock':
				var tight = rawBlock.a;
				var startingIndex = rawBlock.d;
				var unparsedItems = rawBlock.e;
				var parseItem = function (rawBlocks) {
					var _v20 = $dillonkearns$elm_markdown$Markdown$Parser$parseAllInlines(
						{linkReferenceDefinitions: linkReferences, rawBlocks: rawBlocks});
					if (_v20.$ === 'Ok') {
						var parsedBlocks = _v20.a;
						return parsedBlocks;
					} else {
						var e = _v20.a;
						return _List_Nil;
					}
				};
				return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
					A3(
						$dillonkearns$elm_markdown$Markdown$Block$OrderedList,
						$dillonkearns$elm_markdown$Markdown$Parser$isTightBoolToListDisplay(tight),
						startingIndex,
						$elm$core$List$reverse(
							A2($elm$core$List$map, parseItem, unparsedItems))));
			case 'CodeBlock':
				var codeBlock = rawBlock.a;
				return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
					$dillonkearns$elm_markdown$Markdown$Block$CodeBlock(codeBlock));
			case 'ThematicBreak':
				return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock($dillonkearns$elm_markdown$Markdown$Block$ThematicBreak);
			case 'BlankLine':
				return $dillonkearns$elm_markdown$Markdown$Parser$EmptyBlock;
			case 'BlockQuote':
				var rawBlocks = rawBlock.a;
				return $dillonkearns$elm_markdown$Markdown$Parser$EmptyBlock;
			case 'ParsedBlockQuote':
				var rawBlocks = rawBlock.a;
				var _v21 = $dillonkearns$elm_markdown$Markdown$Parser$parseAllInlines(
					{linkReferenceDefinitions: linkReferences, rawBlocks: rawBlocks});
				if (_v21.$ === 'Ok') {
					var parsedBlocks = _v21.a;
					return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
						$dillonkearns$elm_markdown$Markdown$Block$BlockQuote(parsedBlocks));
				} else {
					var e = _v21.a;
					return $dillonkearns$elm_markdown$Markdown$Parser$InlineProblem(e);
				}
			case 'IndentedCodeBlock':
				var codeBlockBody = rawBlock.a;
				return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
					$dillonkearns$elm_markdown$Markdown$Block$CodeBlock(
						{body: codeBlockBody, language: $elm$core$Maybe$Nothing}));
			case 'Table':
				var _v22 = rawBlock.a;
				var header = _v22.a;
				var rows = _v22.b;
				return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
					A2(
						$dillonkearns$elm_markdown$Markdown$Block$Table,
						A2($dillonkearns$elm_markdown$Markdown$Parser$parseHeaderInlines, linkReferences, header),
						A2($dillonkearns$elm_markdown$Markdown$Parser$parseRowInlines, linkReferences, rows)));
			case 'TableDelimiter':
				var _v23 = rawBlock.a;
				var text = _v23.a;
				return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
					$dillonkearns$elm_markdown$Markdown$Block$Paragraph(
						A2(
							$dillonkearns$elm_markdown$Markdown$Parser$inlineParseHelper,
							linkReferences,
							$dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(text.raw))));
			default:
				var raw = rawBlock.b;
				return $dillonkearns$elm_markdown$Markdown$Parser$ParsedBlock(
					$dillonkearns$elm_markdown$Markdown$Block$Paragraph(
						A2(
							$dillonkearns$elm_markdown$Markdown$Parser$inlineParseHelper,
							linkReferences,
							$dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(raw))));
		}
	});
var $dillonkearns$elm_markdown$Markdown$Parser$parseRawInline = F3(
	function (linkReferences, wrap, unparsedInlines) {
		return wrap(
			A2($dillonkearns$elm_markdown$Markdown$Parser$inlineParseHelper, linkReferences, unparsedInlines));
	});
var $dillonkearns$elm_markdown$Markdown$Parser$parseRowInlines = F2(
	function (linkReferences, rows) {
		return A2(
			$elm$core$List$map,
			function (row) {
				return A2(
					$elm$core$List$map,
					function (column) {
						return A3(
							$dillonkearns$elm_markdown$Markdown$Parser$parseRawInline,
							linkReferences,
							$elm$core$Basics$identity,
							$dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(column));
					},
					row);
			},
			rows);
	});
var $dillonkearns$elm_markdown$Markdown$Parser$stepRawBlock = function (revStmts) {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v2) {
					return $elm$parser$Parser$Advanced$Done(revStmts);
				},
				$dillonkearns$elm_markdown$Helpers$endOfFile),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (reference) {
					return $elm$parser$Parser$Advanced$Loop(
						A2($dillonkearns$elm_markdown$Markdown$Parser$addReference, revStmts, reference));
				},
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$LinkReferenceDefinition$parser)),
				function () {
				var _v3 = revStmts.rawBlocks;
				_v3$6:
				while (true) {
					if (_v3.b) {
						switch (_v3.a.$) {
							case 'OpenBlockOrParagraph':
								return A2(
									$elm$parser$Parser$Advanced$map,
									function (block) {
										return $elm$parser$Parser$Advanced$Loop(block);
									},
									A2(
										$elm$parser$Parser$Advanced$andThen,
										$dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks(revStmts),
										$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterOpenBlockOrParagraphParser()));
							case 'Table':
								var table = _v3.a.a;
								return A2(
									$elm$parser$Parser$Advanced$map,
									function (block) {
										return $elm$parser$Parser$Advanced$Loop(block);
									},
									A2(
										$elm$parser$Parser$Advanced$andThen,
										$dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks(revStmts),
										$elm$parser$Parser$Advanced$oneOf(
											_List_fromArray(
												[
													$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser(),
													$dillonkearns$elm_markdown$Markdown$Parser$tableRowIfTableStarted(table)
												]))));
							case 'UnorderedListBlock':
								var _v4 = _v3.a;
								var tight = _v4.a;
								var intended = _v4.b;
								var closeListItems = _v4.c;
								var openListItem = _v4.d;
								var rest = _v3.b;
								var completeOrMergeUnorderedListBlockBlankLine = F2(
									function (state, newString) {
										return _Utils_update(
											state,
											{
												rawBlocks: A2(
													$elm$core$List$cons,
													$dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine,
													A2(
														$elm$core$List$cons,
														A4(
															$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
															tight,
															intended,
															closeListItems,
															_Utils_update(
																openListItem,
																{
																	body: A3($dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith, '', openListItem.body, newString)
																})),
														rest))
											});
									});
								var completeOrMergeUnorderedListBlock = F2(
									function (state, newString) {
										return _Utils_update(
											state,
											{
												rawBlocks: A2(
													$elm$core$List$cons,
													A4(
														$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
														tight,
														intended,
														closeListItems,
														_Utils_update(
															openListItem,
															{
																body: A3($dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith, '\n', openListItem.body, newString)
															})),
													rest)
											});
									});
								return $elm$parser$Parser$Advanced$oneOf(
									_List_fromArray(
										[
											A2(
											$elm$parser$Parser$Advanced$map,
											function (block) {
												return $elm$parser$Parser$Advanced$Loop(block);
											},
											A2(
												$elm$parser$Parser$Advanced$map,
												function (_v5) {
													return A2(completeOrMergeUnorderedListBlockBlankLine, revStmts, '\n');
												},
												$dillonkearns$elm_markdown$Markdown$Parser$blankLine)),
											A2(
											$elm$parser$Parser$Advanced$map,
											function (block) {
												return $elm$parser$Parser$Advanced$Loop(block);
											},
											A2(
												$elm$parser$Parser$Advanced$map,
												completeOrMergeUnorderedListBlock(revStmts),
												A2(
													$elm$parser$Parser$Advanced$keeper,
													A2(
														$elm$parser$Parser$Advanced$ignorer,
														$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
														$elm$parser$Parser$Advanced$symbol(
															A2(
																$elm$parser$Parser$Advanced$Token,
																A2($elm$core$String$repeat, intended, ' '),
																$elm$parser$Parser$ExpectingSymbol('Indentation')))),
													A2(
														$elm$parser$Parser$Advanced$ignorer,
														$elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd),
														$dillonkearns$elm_markdown$Helpers$lineEndOrEnd)))),
											A2(
											$elm$parser$Parser$Advanced$map,
											function (block) {
												return $elm$parser$Parser$Advanced$Loop(block);
											},
											A2(
												$elm$parser$Parser$Advanced$andThen,
												$dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks(revStmts),
												$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterList()))
										]));
							case 'OrderedListBlock':
								var _v10 = _v3.a;
								var tight = _v10.a;
								var intended = _v10.b;
								var marker = _v10.c;
								var order = _v10.d;
								var closeListItems = _v10.e;
								var openListItem = _v10.f;
								var rest = _v3.b;
								var completeOrMergeUnorderedListBlockBlankLine = F2(
									function (state, newString) {
										return _Utils_update(
											state,
											{
												rawBlocks: A2(
													$elm$core$List$cons,
													$dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine,
													A2(
														$elm$core$List$cons,
														A6($dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock, tight, intended, marker, order, closeListItems, openListItem + ('\n' + newString)),
														rest))
											});
									});
								var completeOrMergeUnorderedListBlock = F2(
									function (state, newString) {
										return _Utils_update(
											state,
											{
												rawBlocks: A2(
													$elm$core$List$cons,
													A6($dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock, tight, intended, marker, order, closeListItems, openListItem + ('\n' + newString)),
													rest)
											});
									});
								return $elm$parser$Parser$Advanced$oneOf(
									_List_fromArray(
										[
											A2(
											$elm$parser$Parser$Advanced$map,
											function (block) {
												return $elm$parser$Parser$Advanced$Loop(block);
											},
											A2(
												$elm$parser$Parser$Advanced$map,
												function (_v11) {
													return A2(completeOrMergeUnorderedListBlockBlankLine, revStmts, '\n');
												},
												$dillonkearns$elm_markdown$Markdown$Parser$blankLine)),
											A2(
											$elm$parser$Parser$Advanced$map,
											function (block) {
												return $elm$parser$Parser$Advanced$Loop(block);
											},
											A2(
												$elm$parser$Parser$Advanced$map,
												completeOrMergeUnorderedListBlock(revStmts),
												A2(
													$elm$parser$Parser$Advanced$keeper,
													A2(
														$elm$parser$Parser$Advanced$ignorer,
														$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
														$elm$parser$Parser$Advanced$symbol(
															A2(
																$elm$parser$Parser$Advanced$Token,
																A2($elm$core$String$repeat, intended, ' '),
																$elm$parser$Parser$ExpectingSymbol('Indentation')))),
													A2(
														$elm$parser$Parser$Advanced$ignorer,
														$elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd),
														$dillonkearns$elm_markdown$Helpers$lineEndOrEnd)))),
											A2(
											$elm$parser$Parser$Advanced$map,
											function (block) {
												return $elm$parser$Parser$Advanced$Loop(block);
											},
											A2(
												$elm$parser$Parser$Advanced$andThen,
												$dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks(revStmts),
												$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterList()))
										]));
							case 'BlankLine':
								if (_v3.b.b) {
									switch (_v3.b.a.$) {
										case 'UnorderedListBlock':
											var _v6 = _v3.a;
											var _v7 = _v3.b;
											var _v8 = _v7.a;
											var tight = _v8.a;
											var intended = _v8.b;
											var closeListItems = _v8.c;
											var openListItem = _v8.d;
											var rest = _v7.b;
											var completeOrMergeUnorderedListBlockBlankLine = F2(
												function (state, newString) {
													return _Utils_update(
														state,
														{
															rawBlocks: A2(
																$elm$core$List$cons,
																$dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine,
																A2(
																	$elm$core$List$cons,
																	A4(
																		$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
																		tight,
																		intended,
																		closeListItems,
																		_Utils_update(
																			openListItem,
																			{
																				body: A3($dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith, '', openListItem.body, newString)
																			})),
																	rest))
														});
												});
											var completeOrMergeUnorderedListBlock = F2(
												function (state, newString) {
													return _Utils_update(
														state,
														{
															rawBlocks: A2(
																$elm$core$List$cons,
																A4(
																	$dillonkearns$elm_markdown$Markdown$RawBlock$UnorderedListBlock,
																	tight,
																	intended,
																	closeListItems,
																	_Utils_update(
																		openListItem,
																		{
																			body: A3($dillonkearns$elm_markdown$Markdown$Parser$joinRawStringsWith, '\n', openListItem.body, newString)
																		})),
																rest)
														});
												});
											return ($elm$core$String$trim(openListItem.body) === '') ? A2(
												$elm$parser$Parser$Advanced$map,
												function (block) {
													return $elm$parser$Parser$Advanced$Loop(block);
												},
												A2(
													$elm$parser$Parser$Advanced$andThen,
													$dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks(revStmts),
													$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser())) : $elm$parser$Parser$Advanced$oneOf(
												_List_fromArray(
													[
														A2(
														$elm$parser$Parser$Advanced$map,
														function (block) {
															return $elm$parser$Parser$Advanced$Loop(block);
														},
														A2(
															$elm$parser$Parser$Advanced$map,
															function (_v9) {
																return A2(completeOrMergeUnorderedListBlockBlankLine, revStmts, '\n');
															},
															$dillonkearns$elm_markdown$Markdown$Parser$blankLine)),
														A2(
														$elm$parser$Parser$Advanced$map,
														function (block) {
															return $elm$parser$Parser$Advanced$Loop(block);
														},
														A2(
															$elm$parser$Parser$Advanced$map,
															completeOrMergeUnorderedListBlock(revStmts),
															A2(
																$elm$parser$Parser$Advanced$keeper,
																A2(
																	$elm$parser$Parser$Advanced$ignorer,
																	$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
																	$elm$parser$Parser$Advanced$symbol(
																		A2(
																			$elm$parser$Parser$Advanced$Token,
																			A2($elm$core$String$repeat, intended, ' '),
																			$elm$parser$Parser$ExpectingSymbol('Indentation')))),
																A2(
																	$elm$parser$Parser$Advanced$ignorer,
																	$elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd),
																	$dillonkearns$elm_markdown$Helpers$lineEndOrEnd)))),
														A2(
														$elm$parser$Parser$Advanced$map,
														function (block) {
															return $elm$parser$Parser$Advanced$Loop(block);
														},
														A2(
															$elm$parser$Parser$Advanced$andThen,
															$dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks(revStmts),
															$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser()))
													]));
										case 'OrderedListBlock':
											var _v12 = _v3.a;
											var _v13 = _v3.b;
											var _v14 = _v13.a;
											var tight = _v14.a;
											var intended = _v14.b;
											var marker = _v14.c;
											var order = _v14.d;
											var closeListItems = _v14.e;
											var openListItem = _v14.f;
											var rest = _v13.b;
											var completeOrMergeUnorderedListBlockBlankLine = F2(
												function (state, newString) {
													return _Utils_update(
														state,
														{
															rawBlocks: A2(
																$elm$core$List$cons,
																$dillonkearns$elm_markdown$Markdown$RawBlock$BlankLine,
																A2(
																	$elm$core$List$cons,
																	A6($dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock, tight, intended, marker, order, closeListItems, openListItem + ('\n' + newString)),
																	rest))
														});
												});
											var completeOrMergeUnorderedListBlock = F2(
												function (state, newString) {
													return _Utils_update(
														state,
														{
															rawBlocks: A2(
																$elm$core$List$cons,
																A6($dillonkearns$elm_markdown$Markdown$RawBlock$OrderedListBlock, tight, intended, marker, order, closeListItems, openListItem + ('\n' + newString)),
																rest)
														});
												});
											return ($elm$core$String$trim(openListItem) === '') ? A2(
												$elm$parser$Parser$Advanced$map,
												function (block) {
													return $elm$parser$Parser$Advanced$Loop(block);
												},
												A2(
													$elm$parser$Parser$Advanced$andThen,
													$dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks(revStmts),
													$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser())) : $elm$parser$Parser$Advanced$oneOf(
												_List_fromArray(
													[
														A2(
														$elm$parser$Parser$Advanced$map,
														function (block) {
															return $elm$parser$Parser$Advanced$Loop(block);
														},
														A2(
															$elm$parser$Parser$Advanced$map,
															function (_v15) {
																return A2(completeOrMergeUnorderedListBlockBlankLine, revStmts, '\n');
															},
															$dillonkearns$elm_markdown$Markdown$Parser$blankLine)),
														A2(
														$elm$parser$Parser$Advanced$map,
														function (block) {
															return $elm$parser$Parser$Advanced$Loop(block);
														},
														A2(
															$elm$parser$Parser$Advanced$map,
															completeOrMergeUnorderedListBlock(revStmts),
															A2(
																$elm$parser$Parser$Advanced$keeper,
																A2(
																	$elm$parser$Parser$Advanced$ignorer,
																	$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
																	$elm$parser$Parser$Advanced$symbol(
																		A2(
																			$elm$parser$Parser$Advanced$Token,
																			A2($elm$core$String$repeat, intended, ' '),
																			$elm$parser$Parser$ExpectingSymbol('Indentation')))),
																A2(
																	$elm$parser$Parser$Advanced$ignorer,
																	$elm$parser$Parser$Advanced$getChompedString($dillonkearns$elm_markdown$Helpers$chompUntilLineEndOrEnd),
																	$dillonkearns$elm_markdown$Helpers$lineEndOrEnd)))),
														A2(
														$elm$parser$Parser$Advanced$map,
														function (block) {
															return $elm$parser$Parser$Advanced$Loop(block);
														},
														A2(
															$elm$parser$Parser$Advanced$andThen,
															$dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks(revStmts),
															$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser()))
													]));
										default:
											break _v3$6;
									}
								} else {
									break _v3$6;
								}
							default:
								break _v3$6;
						}
					} else {
						break _v3$6;
					}
				}
				return A2(
					$elm$parser$Parser$Advanced$map,
					function (block) {
						return $elm$parser$Parser$Advanced$Loop(block);
					},
					A2(
						$elm$parser$Parser$Advanced$andThen,
						$dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks(revStmts),
						$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser()));
			}(),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (block) {
					return $elm$parser$Parser$Advanced$Loop(block);
				},
				A2(
					$elm$parser$Parser$Advanced$andThen,
					$dillonkearns$elm_markdown$Markdown$Parser$completeOrMergeBlocks(revStmts),
					$dillonkearns$elm_markdown$Markdown$Parser$openBlockOrParagraphParser))
			]));
};
var $dillonkearns$elm_markdown$Markdown$Parser$textNodeToBlocks = function (textNodeValue) {
	return A2(
		$elm$core$Result$withDefault,
		_List_Nil,
		$dillonkearns$elm_markdown$Markdown$Parser$parse(textNodeValue));
};
var $dillonkearns$elm_markdown$Markdown$Parser$xmlNodeToHtmlNode = function (xmlNode) {
	switch (xmlNode.$) {
		case 'Text':
			var innerText = xmlNode.a;
			return $elm$parser$Parser$Advanced$succeed(
				$dillonkearns$elm_markdown$Markdown$RawBlock$OpenBlockOrParagraph(
					$dillonkearns$elm_markdown$Markdown$RawBlock$UnparsedInlines(innerText)));
		case 'Element':
			var tag = xmlNode.a;
			var attributes = xmlNode.b;
			var children = xmlNode.c;
			var _v1 = $dillonkearns$elm_markdown$Markdown$Parser$nodesToBlocks(children);
			if (_v1.$ === 'Ok') {
				var parsedChildren = _v1.a;
				return $elm$parser$Parser$Advanced$succeed(
					$dillonkearns$elm_markdown$Markdown$RawBlock$Html(
						A3($dillonkearns$elm_markdown$Markdown$Block$HtmlElement, tag, attributes, parsedChildren)));
			} else {
				var err = _v1.a;
				return $elm$parser$Parser$Advanced$problem(err);
			}
		case 'Comment':
			var string = xmlNode.a;
			return $elm$parser$Parser$Advanced$succeed(
				$dillonkearns$elm_markdown$Markdown$RawBlock$Html(
					$dillonkearns$elm_markdown$Markdown$Block$HtmlComment(string)));
		case 'Cdata':
			var string = xmlNode.a;
			return $elm$parser$Parser$Advanced$succeed(
				$dillonkearns$elm_markdown$Markdown$RawBlock$Html(
					$dillonkearns$elm_markdown$Markdown$Block$Cdata(string)));
		case 'ProcessingInstruction':
			var string = xmlNode.a;
			return $elm$parser$Parser$Advanced$succeed(
				$dillonkearns$elm_markdown$Markdown$RawBlock$Html(
					$dillonkearns$elm_markdown$Markdown$Block$ProcessingInstruction(string)));
		default:
			var declarationType = xmlNode.a;
			var content = xmlNode.b;
			return $elm$parser$Parser$Advanced$succeed(
				$dillonkearns$elm_markdown$Markdown$RawBlock$Html(
					A2($dillonkearns$elm_markdown$Markdown$Block$HtmlDeclaration, declarationType, content)));
	}
};
function $dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser() {
	return A2(
		$elm$parser$Parser$Advanced$andThen,
		$dillonkearns$elm_markdown$Markdown$Parser$completeBlocks,
		A2(
			$elm$parser$Parser$Advanced$loop,
			{linkReferenceDefinitions: _List_Nil, rawBlocks: _List_Nil},
			$dillonkearns$elm_markdown$Markdown$Parser$stepRawBlock));
}
function $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser() {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				$dillonkearns$elm_markdown$Markdown$Parser$parseAsParagraphInsteadOfHtmlBlock,
				$dillonkearns$elm_markdown$Markdown$Parser$blankLine,
				$dillonkearns$elm_markdown$Markdown$Parser$blockQuote,
				A2(
				$elm$parser$Parser$Advanced$map,
				$dillonkearns$elm_markdown$Markdown$RawBlock$CodeBlock,
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$CodeBlock$parser)),
				$dillonkearns$elm_markdown$Markdown$Parser$indentedCodeBlock,
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v40) {
					return $dillonkearns$elm_markdown$Markdown$RawBlock$ThematicBreak;
				},
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$ThematicBreak$parser)),
				$dillonkearns$elm_markdown$Markdown$Parser$unorderedListBlock(false),
				$dillonkearns$elm_markdown$Markdown$Parser$orderedListBlock(false),
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$Heading$parser),
				$dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser()
			]));
}
function $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterOpenBlockOrParagraphParser() {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				$dillonkearns$elm_markdown$Markdown$Parser$parseAsParagraphInsteadOfHtmlBlock,
				$dillonkearns$elm_markdown$Markdown$Parser$blankLine,
				$dillonkearns$elm_markdown$Markdown$Parser$blockQuote,
				A2(
				$elm$parser$Parser$Advanced$map,
				$dillonkearns$elm_markdown$Markdown$RawBlock$CodeBlock,
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$CodeBlock$parser)),
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$Parser$setextLineParser),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v39) {
					return $dillonkearns$elm_markdown$Markdown$RawBlock$ThematicBreak;
				},
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$ThematicBreak$parser)),
				$dillonkearns$elm_markdown$Markdown$Parser$unorderedListBlock(true),
				$dillonkearns$elm_markdown$Markdown$Parser$orderedListBlock(true),
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$Heading$parser),
				$dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser(),
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$Parser$tableDelimiterInOpenParagraph)
			]));
}
function $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterList() {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				$dillonkearns$elm_markdown$Markdown$Parser$parseAsParagraphInsteadOfHtmlBlock,
				$dillonkearns$elm_markdown$Markdown$Parser$blankLine,
				$dillonkearns$elm_markdown$Markdown$Parser$blockQuote,
				A2(
				$elm$parser$Parser$Advanced$map,
				$dillonkearns$elm_markdown$Markdown$RawBlock$CodeBlock,
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$CodeBlock$parser)),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v38) {
					return $dillonkearns$elm_markdown$Markdown$RawBlock$ThematicBreak;
				},
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$ThematicBreak$parser)),
				$dillonkearns$elm_markdown$Markdown$Parser$unorderedListBlock(false),
				$dillonkearns$elm_markdown$Markdown$Parser$orderedListBlock(false),
				$elm$parser$Parser$Advanced$backtrackable($dillonkearns$elm_markdown$Markdown$Heading$parser),
				$dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser()
			]));
}
function $dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser() {
	return A2($elm$parser$Parser$Advanced$andThen, $dillonkearns$elm_markdown$Markdown$Parser$xmlNodeToHtmlNode, $dillonkearns$elm_markdown$HtmlParser$html);
}
try {
	var $dillonkearns$elm_markdown$Markdown$Parser$rawBlockParser = $dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser();
	$dillonkearns$elm_markdown$Markdown$Parser$cyclic$rawBlockParser = function () {
		return $dillonkearns$elm_markdown$Markdown$Parser$rawBlockParser;
	};
	var $dillonkearns$elm_markdown$Markdown$Parser$mergeableBlockNotAfterOpenBlockOrParagraphParser = $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser();
	$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser = function () {
		return $dillonkearns$elm_markdown$Markdown$Parser$mergeableBlockNotAfterOpenBlockOrParagraphParser;
	};
	var $dillonkearns$elm_markdown$Markdown$Parser$mergeableBlockAfterOpenBlockOrParagraphParser = $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterOpenBlockOrParagraphParser();
	$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterOpenBlockOrParagraphParser = function () {
		return $dillonkearns$elm_markdown$Markdown$Parser$mergeableBlockAfterOpenBlockOrParagraphParser;
	};
	var $dillonkearns$elm_markdown$Markdown$Parser$mergeableBlockAfterList = $dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterList();
	$dillonkearns$elm_markdown$Markdown$Parser$cyclic$mergeableBlockAfterList = function () {
		return $dillonkearns$elm_markdown$Markdown$Parser$mergeableBlockAfterList;
	};
	var $dillonkearns$elm_markdown$Markdown$Parser$htmlParser = $dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser();
	$dillonkearns$elm_markdown$Markdown$Parser$cyclic$htmlParser = function () {
		return $dillonkearns$elm_markdown$Markdown$Parser$htmlParser;
	};
} catch ($) {
	throw 'Some top-level definitions from `Markdown.Parser` are causing infinite recursion:\n\n  ┌─────┐\n  │    childToBlocks\n  │     ↓\n  │    rawBlockParser\n  │     ↓\n  │    completeBlocks\n  │     ↓\n  │    completeOrMergeBlocks\n  │     ↓\n  │    mergeableBlockNotAfterOpenBlockOrParagraphParser\n  │     ↓\n  │    mergeableBlockAfterOpenBlockOrParagraphParser\n  │     ↓\n  │    mergeableBlockAfterList\n  │     ↓\n  │    htmlParser\n  │     ↓\n  │    inlineParseHelper\n  │     ↓\n  │    mapInline\n  │     ↓\n  │    nodeToRawBlock\n  │     ↓\n  │    nodesToBlocks\n  │     ↓\n  │    nodesToBlocksHelp\n  │     ↓\n  │    parse\n  │     ↓\n  │    parseAllInlines\n  │     ↓\n  │    parseAllInlinesHelp\n  │     ↓\n  │    parseHeaderInlines\n  │     ↓\n  │    parseInlines\n  │     ↓\n  │    parseRawInline\n  │     ↓\n  │    parseRowInlines\n  │     ↓\n  │    stepRawBlock\n  │     ↓\n  │    textNodeToBlocks\n  │     ↓\n  │    xmlNodeToHtmlNode\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $elm$core$Result$map2 = F3(
	function (func, ra, rb) {
		if (ra.$ === 'Err') {
			var x = ra.a;
			return $elm$core$Result$Err(x);
		} else {
			var a = ra.a;
			if (rb.$ === 'Err') {
				var x = rb.a;
				return $elm$core$Result$Err(x);
			} else {
				var b = rb.a;
				return $elm$core$Result$Ok(
					A2(func, a, b));
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$Renderer$combineResults = A2(
	$elm$core$List$foldr,
	$elm$core$Result$map2($elm$core$List$cons),
	$elm$core$Result$Ok(_List_Nil));
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (result.$ === 'Ok') {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$Block$foldl = F3(
	function (_function, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var block = list.a;
				var remainingBlocks = list.b;
				switch (block.$) {
					case 'HtmlBlock':
						var html = block.a;
						if (html.$ === 'HtmlElement') {
							var children = html.c;
							var $temp$function = _function,
								$temp$acc = A2(_function, block, acc),
								$temp$list = _Utils_ap(children, remainingBlocks);
							_function = $temp$function;
							acc = $temp$acc;
							list = $temp$list;
							continue foldl;
						} else {
							var $temp$function = _function,
								$temp$acc = A2(_function, block, acc),
								$temp$list = remainingBlocks;
							_function = $temp$function;
							acc = $temp$acc;
							list = $temp$list;
							continue foldl;
						}
					case 'UnorderedList':
						var tight = block.a;
						var blocks = block.b;
						var childBlocks = A2(
							$elm$core$List$concatMap,
							function (_v3) {
								var children = _v3.b;
								return children;
							},
							blocks);
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = _Utils_ap(childBlocks, remainingBlocks);
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					case 'OrderedList':
						var _int = block.b;
						var blocks = block.c;
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = _Utils_ap(
							$elm$core$List$concat(blocks),
							remainingBlocks);
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					case 'BlockQuote':
						var blocks = block.a;
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = _Utils_ap(blocks, remainingBlocks);
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					case 'Heading':
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = remainingBlocks;
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					case 'Paragraph':
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = remainingBlocks;
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					case 'Table':
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = remainingBlocks;
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					case 'CodeBlock':
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = remainingBlocks;
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					default:
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = remainingBlocks;
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
				}
			}
		}
	});
var $dillonkearns$elm_markdown$Markdown$Block$extractInlineBlockText = function (block) {
	switch (block.$) {
		case 'Paragraph':
			var inlines = block.a;
			return $dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines);
		case 'HtmlBlock':
			var html = block.a;
			if (html.$ === 'HtmlElement') {
				var blocks = html.c;
				return A3(
					$dillonkearns$elm_markdown$Markdown$Block$foldl,
					F2(
						function (nestedBlock, soFar) {
							return _Utils_ap(
								soFar,
								$dillonkearns$elm_markdown$Markdown$Block$extractInlineBlockText(nestedBlock));
						}),
					'',
					blocks);
			} else {
				return '';
			}
		case 'UnorderedList':
			var tight = block.a;
			var items = block.b;
			return A2(
				$elm$core$String$join,
				'\n',
				A2(
					$elm$core$List$map,
					function (_v4) {
						var task = _v4.a;
						var blocks = _v4.b;
						return A2(
							$elm$core$String$join,
							'\n',
							A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Block$extractInlineBlockText, blocks));
					},
					items));
		case 'OrderedList':
			var tight = block.a;
			var _int = block.b;
			var items = block.c;
			return A2(
				$elm$core$String$join,
				'\n',
				A2(
					$elm$core$List$map,
					function (blocks) {
						return A2(
							$elm$core$String$join,
							'\n',
							A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Block$extractInlineBlockText, blocks));
					},
					items));
		case 'BlockQuote':
			var blocks = block.a;
			return A2(
				$elm$core$String$join,
				'\n',
				A2($elm$core$List$map, $dillonkearns$elm_markdown$Markdown$Block$extractInlineBlockText, blocks));
		case 'Heading':
			var headingLevel = block.a;
			var inlines = block.b;
			return $dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines);
		case 'Table':
			var header = block.a;
			var rows = block.b;
			return A2(
				$elm$core$String$join,
				'\n',
				$elm$core$List$concat(
					_List_fromArray(
						[
							A2(
							$elm$core$List$map,
							$dillonkearns$elm_markdown$Markdown$Block$extractInlineText,
							A2(
								$elm$core$List$map,
								function ($) {
									return $.label;
								},
								header)),
							$elm$core$List$concat(
							A2(
								$elm$core$List$map,
								$elm$core$List$map($dillonkearns$elm_markdown$Markdown$Block$extractInlineText),
								rows))
						])));
		case 'CodeBlock':
			var body = block.a.body;
			return body;
		default:
			return '';
	}
};
var $dillonkearns$elm_markdown$Markdown$Block$extractInlineText = function (inlines) {
	return A3($elm$core$List$foldl, $dillonkearns$elm_markdown$Markdown$Block$extractTextHelp, '', inlines);
};
var $dillonkearns$elm_markdown$Markdown$Block$extractTextHelp = F2(
	function (inline, text) {
		switch (inline.$) {
			case 'Text':
				var str = inline.a;
				return _Utils_ap(text, str);
			case 'HardLineBreak':
				return text + ' ';
			case 'CodeSpan':
				var str = inline.a;
				return _Utils_ap(text, str);
			case 'Link':
				var inlines = inline.c;
				return _Utils_ap(
					text,
					$dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines));
			case 'Image':
				var inlines = inline.c;
				return _Utils_ap(
					text,
					$dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines));
			case 'HtmlInline':
				var html = inline.a;
				if (html.$ === 'HtmlElement') {
					var blocks = html.c;
					return A3(
						$dillonkearns$elm_markdown$Markdown$Block$foldl,
						F2(
							function (block, soFar) {
								return _Utils_ap(
									soFar,
									$dillonkearns$elm_markdown$Markdown$Block$extractInlineBlockText(block));
							}),
						text,
						blocks);
				} else {
					return text;
				}
			case 'Strong':
				var inlines = inline.a;
				return _Utils_ap(
					text,
					$dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines));
			case 'Emphasis':
				var inlines = inline.a;
				return _Utils_ap(
					text,
					$dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines));
			default:
				var inlines = inline.a;
				return _Utils_ap(
					text,
					$dillonkearns$elm_markdown$Markdown$Block$extractInlineText(inlines));
		}
	});
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $dillonkearns$elm_markdown$Markdown$Renderer$renderHtml = F5(
	function (tagName, attributes, children, _v0, renderedChildren) {
		var htmlRenderer = _v0.a;
		return A2(
			$elm$core$Result$andThen,
			function (okChildren) {
				return A2(
					$elm$core$Result$map,
					function (myRenderer) {
						return myRenderer(okChildren);
					},
					A3(htmlRenderer, tagName, attributes, children));
			},
			$dillonkearns$elm_markdown$Markdown$Renderer$combineResults(renderedChildren));
	});
var $dillonkearns$elm_markdown$Markdown$Renderer$foldThing = F3(
	function (renderer, topLevelInline, soFar) {
		var _v12 = A2($dillonkearns$elm_markdown$Markdown$Renderer$renderSingleInline, renderer, topLevelInline);
		if (_v12.$ === 'Just') {
			var inline = _v12.a;
			return A2($elm$core$List$cons, inline, soFar);
		} else {
			return soFar;
		}
	});
var $dillonkearns$elm_markdown$Markdown$Renderer$renderHelper = F2(
	function (renderer, blocks) {
		return A2(
			$elm$core$List$filterMap,
			$dillonkearns$elm_markdown$Markdown$Renderer$renderHelperSingle(renderer),
			blocks);
	});
var $dillonkearns$elm_markdown$Markdown$Renderer$renderHelperSingle = function (renderer) {
	return function (block) {
		switch (block.$) {
			case 'Heading':
				var level = block.a;
				var content = block.b;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						function (children) {
							return renderer.heading(
								{
									children: children,
									level: level,
									rawText: $dillonkearns$elm_markdown$Markdown$Block$extractInlineText(content)
								});
						},
						A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, content)));
			case 'Paragraph':
				var content = block.a;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						renderer.paragraph,
						A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, content)));
			case 'HtmlBlock':
				var html = block.a;
				if (html.$ === 'HtmlElement') {
					var tag = html.a;
					var attributes = html.b;
					var children = html.c;
					return $elm$core$Maybe$Just(
						A4($dillonkearns$elm_markdown$Markdown$Renderer$renderHtmlNode, renderer, tag, attributes, children));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			case 'UnorderedList':
				var tight = block.a;
				var items = block.b;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						function (listItems) {
							return renderer.unorderedList(
								A2(
									$elm$core$List$map,
									function (_v7) {
										var task = _v7.a;
										var children = _v7.b;
										return A2(
											$dillonkearns$elm_markdown$Markdown$Block$ListItem,
											task,
											$elm$core$List$concat(children));
									},
									listItems));
						},
						$dillonkearns$elm_markdown$Markdown$Renderer$combineResults(
							A2(
								$elm$core$List$map,
								function (_v4) {
									var task = _v4.a;
									var children = _v4.b;
									return A2(
										$elm$core$Result$map,
										$dillonkearns$elm_markdown$Markdown$Block$ListItem(task),
										$dillonkearns$elm_markdown$Markdown$Renderer$combineResults(
											function (blocks) {
												return A2(
													$elm$core$List$filterMap,
													function (listItemBlock) {
														var _v5 = _Utils_Tuple2(tight, listItemBlock);
														if ((_v5.a.$ === 'Tight') && (_v5.b.$ === 'Paragraph')) {
															var _v6 = _v5.a;
															var content = _v5.b.a;
															return $elm$core$Maybe$Just(
																A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, content));
														} else {
															return A2(
																$elm$core$Maybe$map,
																$elm$core$Result$map($elm$core$List$singleton),
																A2($dillonkearns$elm_markdown$Markdown$Renderer$renderHelperSingle, renderer, listItemBlock));
														}
													},
													blocks);
											}(children)));
								},
								items))));
			case 'OrderedList':
				var tight = block.a;
				var startingIndex = block.b;
				var items = block.c;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						function (listItems) {
							return A2(
								renderer.orderedList,
								startingIndex,
								A2(
									$elm$core$List$map,
									function (children) {
										return $elm$core$List$concat(children);
									},
									listItems));
						},
						$dillonkearns$elm_markdown$Markdown$Renderer$combineResults(
							A2(
								$elm$core$List$map,
								function (itemsblocks) {
									return $dillonkearns$elm_markdown$Markdown$Renderer$combineResults(
										function (blocks) {
											return A2(
												$elm$core$List$filterMap,
												function (listItemBlock) {
													var _v8 = _Utils_Tuple2(tight, listItemBlock);
													if ((_v8.a.$ === 'Tight') && (_v8.b.$ === 'Paragraph')) {
														var _v9 = _v8.a;
														var content = _v8.b.a;
														return $elm$core$Maybe$Just(
															A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, content));
													} else {
														return A2(
															$elm$core$Maybe$map,
															$elm$core$Result$map($elm$core$List$singleton),
															A2($dillonkearns$elm_markdown$Markdown$Renderer$renderHelperSingle, renderer, listItemBlock));
													}
												},
												blocks);
										}(itemsblocks));
								},
								items))));
			case 'CodeBlock':
				var codeBlock = block.a;
				return $elm$core$Maybe$Just(
					$elm$core$Result$Ok(
						renderer.codeBlock(codeBlock)));
			case 'ThematicBreak':
				return $elm$core$Maybe$Just(
					$elm$core$Result$Ok(renderer.thematicBreak));
			case 'BlockQuote':
				var nestedBlocks = block.a;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						renderer.blockQuote,
						$dillonkearns$elm_markdown$Markdown$Renderer$combineResults(
							A2($dillonkearns$elm_markdown$Markdown$Renderer$renderHelper, renderer, nestedBlocks))));
			default:
				var header = block.a;
				var rows = block.b;
				var renderedHeaderCells = $dillonkearns$elm_markdown$Markdown$Renderer$combineResults(
					A2(
						$elm$core$List$map,
						function (_v11) {
							var label = _v11.label;
							var alignment = _v11.alignment;
							return A2(
								$elm$core$Result$map,
								$elm$core$Tuple$pair(alignment),
								A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, label));
						},
						header));
				var renderedHeader = A2(
					$elm$core$Result$map,
					function (listListView) {
						return renderer.tableHeader(
							$elm$core$List$singleton(
								renderer.tableRow(
									A2(
										$elm$core$List$map,
										function (_v10) {
											var maybeAlignment = _v10.a;
											var item = _v10.b;
											return A2(renderer.tableHeaderCell, maybeAlignment, item);
										},
										listListView))));
					},
					renderedHeaderCells);
				var renderedBody = function (r) {
					return $elm$core$List$isEmpty(r) ? _List_Nil : _List_fromArray(
						[
							renderer.tableBody(r)
						]);
				};
				var alignmentForColumn = function (columnIndex) {
					return A2(
						$elm$core$Maybe$andThen,
						function ($) {
							return $.alignment;
						},
						$elm$core$List$head(
							A2($elm$core$List$drop, columnIndex, header)));
				};
				var renderRow = function (cells) {
					return A2(
						$elm$core$Result$map,
						renderer.tableRow,
						A2(
							$elm$core$Result$map,
							$elm$core$List$indexedMap(
								F2(
									function (index, cell) {
										return A2(
											renderer.tableCell,
											alignmentForColumn(index),
											cell);
									})),
							$dillonkearns$elm_markdown$Markdown$Renderer$combineResults(
								A2(
									$elm$core$List$map,
									$dillonkearns$elm_markdown$Markdown$Renderer$renderStyled(renderer),
									cells))));
				};
				var renderedRows = $dillonkearns$elm_markdown$Markdown$Renderer$combineResults(
					A2($elm$core$List$map, renderRow, rows));
				return $elm$core$Maybe$Just(
					A3(
						$elm$core$Result$map2,
						F2(
							function (h, r) {
								return renderer.table(
									A2(
										$elm$core$List$cons,
										h,
										renderedBody(r)));
							}),
						renderedHeader,
						renderedRows));
		}
	};
};
var $dillonkearns$elm_markdown$Markdown$Renderer$renderHtmlNode = F4(
	function (renderer, tag, attributes, children) {
		return A5(
			$dillonkearns$elm_markdown$Markdown$Renderer$renderHtml,
			tag,
			attributes,
			children,
			renderer.html,
			A2($dillonkearns$elm_markdown$Markdown$Renderer$renderHelper, renderer, children));
	});
var $dillonkearns$elm_markdown$Markdown$Renderer$renderSingleInline = F2(
	function (renderer, inline) {
		switch (inline.$) {
			case 'Strong':
				var innerInlines = inline.a;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						renderer.strong,
						A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, innerInlines)));
			case 'Emphasis':
				var innerInlines = inline.a;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						renderer.emphasis,
						A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, innerInlines)));
			case 'Strikethrough':
				var innerInlines = inline.a;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						renderer.strikethrough,
						A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, innerInlines)));
			case 'Image':
				var src = inline.a;
				var title = inline.b;
				var children = inline.c;
				return $elm$core$Maybe$Just(
					$elm$core$Result$Ok(
						renderer.image(
							{
								alt: $dillonkearns$elm_markdown$Markdown$Block$extractInlineText(children),
								src: src,
								title: title
							})));
			case 'Text':
				var string = inline.a;
				return $elm$core$Maybe$Just(
					$elm$core$Result$Ok(
						renderer.text(string)));
			case 'CodeSpan':
				var string = inline.a;
				return $elm$core$Maybe$Just(
					$elm$core$Result$Ok(
						renderer.codeSpan(string)));
			case 'Link':
				var destination = inline.a;
				var title = inline.b;
				var inlines = inline.c;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$andThen,
						function (children) {
							return $elm$core$Result$Ok(
								A2(
									renderer.link,
									{destination: destination, title: title},
									children));
						},
						A2($dillonkearns$elm_markdown$Markdown$Renderer$renderStyled, renderer, inlines)));
			case 'HardLineBreak':
				return $elm$core$Maybe$Just(
					$elm$core$Result$Ok(renderer.hardLineBreak));
			default:
				var html = inline.a;
				if (html.$ === 'HtmlElement') {
					var tag = html.a;
					var attributes = html.b;
					var children = html.c;
					return $elm$core$Maybe$Just(
						A4($dillonkearns$elm_markdown$Markdown$Renderer$renderHtmlNode, renderer, tag, attributes, children));
				} else {
					return $elm$core$Maybe$Nothing;
				}
		}
	});
var $dillonkearns$elm_markdown$Markdown$Renderer$renderStyled = F2(
	function (renderer, styledStrings) {
		return $dillonkearns$elm_markdown$Markdown$Renderer$combineResults(
			A3(
				$elm$core$List$foldr,
				$dillonkearns$elm_markdown$Markdown$Renderer$foldThing(renderer),
				_List_Nil,
				styledStrings));
	});
var $dillonkearns$elm_markdown$Markdown$Renderer$render = F2(
	function (renderer, ast) {
		return $dillonkearns$elm_markdown$Markdown$Renderer$combineResults(
			A2($dillonkearns$elm_markdown$Markdown$Renderer$renderHelper, renderer, ast));
	});
var $dtwrks$elm_book$ElmBook$UI$Markdown$view = F3(
	function (chapterTitle, chapterComponents, componentOptions) {
		return A2(
			$elm$core$Basics$composeR,
			$dillonkearns$elm_markdown$Markdown$Parser$parse,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Result$withDefault(_List_Nil),
				A2(
					$elm$core$Basics$composeR,
					$dillonkearns$elm_markdown$Markdown$Renderer$render(
						A3($dtwrks$elm_book$ElmBook$UI$Markdown$componentRenderer, chapterTitle, chapterComponents, componentOptions)),
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Result$withDefault(_List_Nil),
						function (children) {
							return A2(
								$elm$html$Html$article,
								_List_Nil,
								_List_fromArray(
									[
										A2($elm$html$Html$div, _List_Nil, children)
									]));
						}))));
	});
var $dtwrks$elm_book$ElmBook$UI$Chapter$view = function (props) {
	var body = props.chapterOptions.hiddenTitle ? props.body : ('# ' + (props.title + ('\n' + props.body)));
	return A2(
		$elm$html$Html$article,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('elm-book elm-book-chapter')
			]),
		_List_fromArray(
			[
				A4($dtwrks$elm_book$ElmBook$UI$Markdown$view, props.title, props.components, props.componentOptions, body)
			]));
};
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeLinecap = _VirtualDom_attribute('stroke-linecap');
var $elm$svg$Svg$Attributes$strokeLinejoin = _VirtualDom_attribute('stroke-linejoin');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $dtwrks$elm_book$ElmBook$UI$Icons$iconDarkMode = function (props) {
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$width(
				$elm$core$String$fromInt(props.size)),
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromInt(props.size)),
				$elm$svg$Svg$Attributes$viewBox('0 0 24 24'),
				$elm$svg$Svg$Attributes$fill('none'),
				$elm$svg$Svg$Attributes$stroke(props.color),
				$elm$svg$Svg$Attributes$strokeWidth('2'),
				$elm$svg$Svg$Attributes$strokeLinecap('round'),
				$elm$svg$Svg$Attributes$strokeLinejoin('round')
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d('M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z')
					]),
				_List_Nil)
			]));
};
var $dtwrks$elm_book$ElmBook$UI$ChapterHeader$view = function (props) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('elm-book elm-book-chapter-header')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elm-book-chapter-header__title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(props.title)
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elm-book-chapter-header__btn'),
						$elm$html$Html$Events$onClick(props.onToggleDarkMode)
					]),
				_List_fromArray(
					[
						$dtwrks$elm_book$ElmBook$UI$Icons$iconDarkMode(
						{color: 'currentColor', size: 16})
					]))
			]));
};
var $dtwrks$elm_book$ElmBook$UI$Icons$iconElm = function (props) {
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$width(
				$elm$core$String$fromInt(props.size)),
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromInt(props.size)),
				$elm$svg$Svg$Attributes$viewBox('0 0 256 256')
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill(props.color),
						$elm$svg$Svg$Attributes$d('M128 135.022L7.023 256h241.955z')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill(props.color),
						$elm$svg$Svg$Attributes$d('M202.332 195.311L256 248.98V141.643z')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill(props.color),
						$elm$svg$Svg$Attributes$d('M120.978 128L0 7.022V248.98z')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill(props.color),
						$elm$svg$Svg$Attributes$d('M256 113.806V0H142.193z')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill(props.color),
						$elm$svg$Svg$Attributes$d('M195.584 67.434l60.288 60.289l-60.563 60.564l-60.29-60.29z')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill(props.color),
						$elm$svg$Svg$Attributes$d('M7.021 0l55.725 55.726h121.13L128.15 0z')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill(props.color),
						$elm$svg$Svg$Attributes$d('M128 120.979l55.322-55.323H72.677z')
					]),
				_List_Nil)
			]));
};
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $dtwrks$elm_book$ElmBook$UI$Helpers$themeAccentVar = '--elm-book-accent';
var $dtwrks$elm_book$ElmBook$UI$Helpers$themeAccent = $dtwrks$elm_book$ElmBook$UI$Helpers$var_($dtwrks$elm_book$ElmBook$UI$Helpers$themeAccentVar);
var $dtwrks$elm_book$ElmBook$UI$Footer$view = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('elm-book elm-book-sans')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$href('https://package.elm-lang.org/packages/dtwrks/elm-book/latest/'),
					$elm$html$Html$Attributes$target('_blank'),
					$elm$html$Html$Attributes$class('elm-book-footer'),
					A2($elm$html$Html$Attributes$style, 'color', $dtwrks$elm_book$ElmBook$UI$Helpers$themeAccent)
				]),
			_List_fromArray(
				[
					$dtwrks$elm_book$ElmBook$UI$Icons$iconElm(
					{color: 'currentColor', size: 16}),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('elm-book-footer--text')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('dtwrks/elm-book')
						]))
				]))
		]));
var $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$header = function (theme) {
	return theme.header;
};
var $elm$html$Html$header = _VirtualDom_node('header');
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$svg$Svg$Attributes$rx = _VirtualDom_attribute('rx');
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $dtwrks$elm_book$ElmBook$UI$Icons$iconClose = function (props) {
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$width(
				$elm$core$String$fromInt(props.size)),
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromInt(props.size)),
				$elm$svg$Svg$Attributes$viewBox('0 0 512 512')
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill(props.color),
						$elm$svg$Svg$Attributes$d('M451.792 0H59.208C26.561 0 0 26.561 0 59.208v393.084C0 484.939 26.561 511.5 59.208 511.5h392.584c32.647 0 59.208-26.561 59.208-59.208V59.208C511 26.561 484.439 0 451.792 0zM471 452.292c0 10.591-8.617 19.208-19.208 19.208H59.208C48.617 471.5 40 462.883 40 452.292V59.208C40 48.617 48.617 40 59.208 40h392.584C462.383 40 471 48.617 471 59.208v393.084z')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill(props.color),
						$elm$svg$Svg$Attributes$x('105'),
						$elm$svg$Svg$Attributes$y('377.943'),
						$elm$svg$Svg$Attributes$width('386'),
						$elm$svg$Svg$Attributes$height('40'),
						$elm$svg$Svg$Attributes$rx('20'),
						$elm$svg$Svg$Attributes$transform('rotate(-45 105 377.943)')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill(props.color),
						$elm$svg$Svg$Attributes$x('133.284'),
						$elm$svg$Svg$Attributes$y('105'),
						$elm$svg$Svg$Attributes$width('386'),
						$elm$svg$Svg$Attributes$height('40'),
						$elm$svg$Svg$Attributes$rx('20'),
						$elm$svg$Svg$Attributes$transform('rotate(45 133.284 105)')
					]),
				_List_Nil)
			]));
};
var $dtwrks$elm_book$ElmBook$UI$Icons$iconMenu = function (props) {
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$width(
				$elm$core$String$fromInt(props.size)),
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromInt(props.size)),
				$elm$svg$Svg$Attributes$viewBox('0 0 512 512')
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill(props.color),
						$elm$svg$Svg$Attributes$d('M176.792 0H59.208C26.561 0 0 26.561 0 59.208v117.584C0 209.439 26.561 236 59.208 236h117.584C209.439 236 236 209.439 236 176.792V59.208C236 26.561 209.439 0 176.792 0zM196 176.792c0 10.591-8.617 19.208-19.208 19.208H59.208C48.617 196 40 187.383 40 176.792V59.208C40 48.617 48.617 40 59.208 40h117.584C187.383 40 196 48.617 196 59.208v117.584zM452 0H336c-33.084 0-60 26.916-60 60v116c0 33.084 26.916 60 60 60h116c33.084 0 60-26.916 60-60V60c0-33.084-26.916-60-60-60zm20 176c0 11.028-8.972 20-20 20H336c-11.028 0-20-8.972-20-20V60c0-11.028 8.972-20 20-20h116c11.028 0 20 8.972 20 20v116zM176.792 276H59.208C26.561 276 0 302.561 0 335.208v117.584C0 485.439 26.561 512 59.208 512h117.584C209.439 512 236 485.439 236 452.792V335.208C236 302.561 209.439 276 176.792 276zM196 452.792c0 10.591-8.617 19.208-19.208 19.208H59.208C48.617 472 40 463.383 40 452.792V335.208C40 324.617 48.617 316 59.208 316h117.584c10.591 0 19.208 8.617 19.208 19.208v117.584zM452 276H336c-33.084 0-60 26.916-60 60v116c0 33.084 26.916 60 60 60h116c33.084 0 60-26.916 60-60V336c0-33.084-26.916-60-60-60zm20 176c0 11.028-8.972 20-20 20H336c-11.028 0-20-8.972-20-20V336c0-11.028 8.972-20 20-20h116c11.028 0 20 8.972 20 20v116z')
					]),
				_List_Nil)
			]));
};
var $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$logo = function (theme) {
	return theme.logo;
};
var $dtwrks$elm_book$ElmBook$UI$Header$viewDefault = function (props) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('elm-book-sans elm-book-header-default')
			]),
		_List_fromArray(
			[
				A2(
				$elm$core$Maybe$withDefault,
				$dtwrks$elm_book$ElmBook$UI$Icons$iconElm(
					{color: $dtwrks$elm_book$ElmBook$UI$Helpers$themeAccent, size: 24}),
				A2(
					$elm$core$Maybe$map,
					props.toHtml,
					$dtwrks$elm_book$ElmBook$Internal$ThemeOptions$logo(props.theme))),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elm-book-header-default--wrapper')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('elm-book-header-default--title')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(props.title)
							])),
						A2(
						$elm$core$Maybe$withDefault,
						$elm$html$Html$text(''),
						A2(
							$elm$core$Maybe$map,
							function (subtitle) {
								return A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('elm-book-header-default--subtitle')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(subtitle)
										]));
							},
							$dtwrks$elm_book$ElmBook$Internal$ThemeOptions$subtitle(props.theme)))
					]))
			]));
};
var $dtwrks$elm_book$ElmBook$UI$Header$view = function (props) {
	return A2(
		$elm$html$Html$header,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('elm-book-header')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href(props.href),
						$elm$html$Html$Attributes$class('elm-book-header--link'),
						A2($elm$html$Html$Attributes$style, 'color', $dtwrks$elm_book$ElmBook$UI$Helpers$themeAccent)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('elm-book')
							]),
						_List_fromArray(
							[
								A2(
								$elm$core$Maybe$withDefault,
								$dtwrks$elm_book$ElmBook$UI$Header$viewDefault(
									{href: props.href, theme: props.theme, title: props.title, toHtml: props.toHtml}),
								A2(
									$elm$core$Maybe$map,
									props.toHtml,
									$dtwrks$elm_book$ElmBook$Internal$ThemeOptions$header(props.theme)))
							]))
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elm-book elm-book-header--button'),
						$elm$html$Html$Events$onClick(props.onClickMenuButton)
					]),
				_List_fromArray(
					[
						props.isMenuOpen ? $dtwrks$elm_book$ElmBook$UI$Icons$iconClose(
						{color: $dtwrks$elm_book$ElmBook$UI$Helpers$themeAccent, size: 20}) : $dtwrks$elm_book$ElmBook$UI$Icons$iconMenu(
						{color: $dtwrks$elm_book$ElmBook$UI$Helpers$themeAccent, size: 20})
					]))
			]));
};
var $elm$html$Html$nav = _VirtualDom_node('nav');
var $dtwrks$elm_book$ElmBook$UI$Nav$target_ = function (internal) {
	return internal ? $elm$html$Html$Attributes$class('') : $elm$html$Html$Attributes$target('_blank');
};
var $dtwrks$elm_book$ElmBook$UI$Helpers$themeNavAccentVar = '--elm-book-nav-accent';
var $dtwrks$elm_book$ElmBook$UI$Helpers$themeNavAccent = $dtwrks$elm_book$ElmBook$UI$Helpers$var_($dtwrks$elm_book$ElmBook$UI$Helpers$themeNavAccentVar);
var $dtwrks$elm_book$ElmBook$UI$Helpers$themeNavAccentHighlightVar = '--elm-book-nav-accent-highlight';
var $dtwrks$elm_book$ElmBook$UI$Helpers$themeNavAccentHighlight = $dtwrks$elm_book$ElmBook$UI$Helpers$var_($dtwrks$elm_book$ElmBook$UI$Helpers$themeNavAccentHighlightVar);
var $dtwrks$elm_book$ElmBook$UI$Helpers$themeNavBackgroundVar = '--elm-book-nav-background';
var $dtwrks$elm_book$ElmBook$UI$Helpers$themeNavBackground = $dtwrks$elm_book$ElmBook$UI$Helpers$var_($dtwrks$elm_book$ElmBook$UI$Helpers$themeNavBackgroundVar);
var $dtwrks$elm_book$ElmBook$UI$Nav$view = function (props) {
	var item = function (_v2) {
		var url = _v2.a;
		var label = _v2.b;
		var internal = _v2.c;
		return A2(
			$elm$html$Html$li,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href(url),
							$dtwrks$elm_book$ElmBook$UI$Nav$target_(internal),
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('elm-book-nav-item', true),
									_Utils_Tuple2(
									'active',
									_Utils_eq(
										props.active,
										$elm$core$Maybe$Just(url))),
									_Utils_Tuple2(
									'pre-selected',
									_Utils_eq(
										props.preSelected,
										$elm$core$Maybe$Just(url)))
								])),
							_Utils_eq(
							props.active,
							$elm$core$Maybe$Just(url)) ? A2($elm$html$Html$Attributes$style, 'color', $dtwrks$elm_book$ElmBook$UI$Helpers$themeNavAccentHighlight) : A2($elm$html$Html$Attributes$style, 'color', $dtwrks$elm_book$ElmBook$UI$Helpers$themeNavAccent)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('elm-book-inset elm-book-nav-item-bg'),
									A2($elm$html$Html$Attributes$style, 'background-color', $dtwrks$elm_book$ElmBook$UI$Helpers$themeNavBackground)
								]),
							_List_Nil),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('elm-book-nav-item-content')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(label)
								]))
						]))
				]));
	};
	var list = function (_v1) {
		var title = _v1.a;
		var items = _v1.b;
		return $elm$core$List$isEmpty(items) ? $elm$html$Html$text('') : A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('elm-book-nav-list-wrapper')
				]),
			_List_fromArray(
				[
					(title === '') ? $elm$html$Html$text('') : A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('elm-book-nav-list-title'),
							A2($elm$html$Html$Attributes$style, 'color', $dtwrks$elm_book$ElmBook$UI$Helpers$themeAccent)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(title)
						])),
					A2(
					$elm$html$Html$ul,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('elm-book-nav-list')
						]),
					A2($elm$core$List$map, item, items))
				]));
	};
	var isEmpty = !A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, acc) {
				var xs = _v0.b;
				return acc + $elm$core$List$length(xs);
			}),
		0,
		props.itemGroups);
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('elm-book-wrapper elm-book-sans')
			]),
		_List_fromArray(
			[
				isEmpty ? A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elm-book-nav-empty'),
						A2($elm$html$Html$Attributes$style, 'color', $dtwrks$elm_book$ElmBook$UI$Helpers$themeNavAccent)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('No results')
					])) : A2(
				$elm$html$Html$nav,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elm-book-nav')
					]),
				A2($elm$core$List$map, list, props.itemGroups))
			]));
};
var $dtwrks$elm_book$ElmBook$UI$Search$view = function (props) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('elm-book-wrapper elm-book-search-wrapper elm-book-sans')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elm-book-search-bg elm-book-inset')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elm-book-search-border elm-book-inset')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('elm-book-search'),
						$elm$html$Html$Attributes$value(props.value),
						$elm$html$Html$Events$onInput(props.onInput),
						$elm$html$Html$Events$onFocus(props.onFocus),
						$elm$html$Html$Events$onBlur(props.onBlur),
						$elm$html$Html$Attributes$placeholder('Type \"⌘K\" to search…')
					]),
				_List_Nil)
			]));
};
var $dtwrks$elm_book$ElmBook$UI$Helpers$css_ = function (x) {
	return A3(
		$elm$html$Html$node,
		'style',
		_List_Nil,
		_List_fromArray(
			[
				$elm$html$Html$text(x)
			]));
};
var $dtwrks$elm_book$ElmBook$UI$Helpers$baseStyles = $dtwrks$elm_book$ElmBook$UI$Helpers$css_('\n@import url(\'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=IBM+Plex+Sans:wght@300;400;600&family=IBM+Plex+Serif:ital,wght@0,400;0,600;1,400;1,600&display=swap\');\n\n@keyframes fade-in {\n  from { opacity: 0; }\n  to   { opacity: 1; }\n}\n\n.elm-book-fade-in {\n    animation: 0.3s linear fade-in;\n}\n\n.elm-book-wrapper * {\n    box-sizing: border-box;\n    margin: 0;\n    padding: 0;\n}\n\n.elm-book-wrapper,\n.elm-book {\n    box-sizing: border-box;\n    margin: 0;\n    padding: 0;\n}\n\n.elm-book-sans {\n    font-family: "IBM Plex Sans", "sans-serif";\n}\n\n.elm-book-serif {\n    font-family: "IBM Plex Serif", "serif";\n}\n\n.elm-book-monospace {\n    font-family: "Fira Code", "monospace";\n}\n\n.elm-book-inset {\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n}\n\n.elm-book-shadows {\n    box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);\n}\n\n.elm-book-shadows-light {\n    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);\n}\n');
var $dtwrks$elm_book$ElmBook$UI$ActionLog$styles = $dtwrks$elm_book$ElmBook$UI$Helpers$css_('\n.elm-book-action-log-preview-wrapper {\n    padding: 8px;\n}\n.elm-book-action-log-preview {\n    display: block;\n    width: 100%;\n    padding: 0;\n    margin: 0;\n    border: none;\n    border-radius: 4px;\n    background-color: transparent;\n    text-align: left;\n    font-size: 14px;\n    cursor: pointer;\n}\n.elm-book-action-log-preview:hover {\n    opacity: 0.9;\n}\n.elm-book-action-log-preview:hover {\n    opacity: 0.8;\n}\n\n.elm-book-action-log-preview-empty-wrapper {\n    padding: 8px;\n    font-size: 14px;\n    color: #aaa;\n}\n.elm-book-action-log-preview-empty {\n    padding: 12px 20px;\n    background-color: #f3f3f3;\n    border-radius: 4px;\n}\n\n.elm-book-dark-mode .elm-book-action-log-preview-empty {\n    background-color: #2f3238;\n}\n\n.elm-book-action-log-list-wrapper {\n    position: relative;\n    padding-top: 34px;\n}\n.elm-book-action-log-list-header {\n    display: flex;\n    align-items: center;\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    height: 34px;\n    padding: 0 20px;\n    font-weight: bold;\n    font-size: 14px;\n    letter-spacing: 0.5px;\n    color: #fff;\n}\n.elm-book-action-log-list {\n    list-style-type: none;\n    max-height: 70vh;\n    overflow-y: auto;\n}\n.elm-book-action-log-list-item {\n    border-top: 1px solid #e0e0e0;\n}\n.elm-book-dark-mode .elm-book-action-log-list-item {\n    border-top-color: #3b3f47;\n}\n\n.elm-book-action-log-item-wrapper {\n    display: flex;\n    align-items: center;\n    padding: 8px 20px 8px 0;\n    font-size: 14px;\n    background-color: #f5f5f5;\n}\n.elm-book-dark-mode .elm-book-action-log-item-wrapper {\n    background-color: #2f3238;\n}\n\n.elm-book-action-log-item-index {\n    width: 60px;\n    text-align: center;\n    display: inline-block;\n    color: #a0a0a0;\n}\n.elm-book-action-log__main {\n    flex-grow: 1;\n}\n.elm-book-action-log-item-preffix {\n    padding-right: 16px;\n    color: #a0a0a0;\n    letter-spacing: 0.5px;\n    font-size: 12px;\n}\n.elm-book-action-log-item-label {\n    color: #404040;\n    font-size: 13px;\n    font-weight: bold;\n}\n.elm-book-dark-mode .elm-book-action-log-item-label {\n    color: #f5f5f5;\n}\n');
var $dtwrks$elm_book$ElmBook$UI$Helpers$mediaMobile = '@media screen and (max-width: 768px)';
var $dtwrks$elm_book$ElmBook$UI$Chapter$styles = $dtwrks$elm_book$ElmBook$UI$Helpers$css_('\n.elm-book-chapter {\n    padding: 40px;\n    width: 100%;\n}\n' + ($dtwrks$elm_book$ElmBook$UI$Helpers$mediaMobile + ' {\n    .elm-book-chapter {\n        padding: 24px;\n    }\n}\n'));
var $dtwrks$elm_book$ElmBook$UI$ChapterComponent$styles = $dtwrks$elm_book$ElmBook$UI$Helpers$css_('\n.elm-book__chapter-component__title {\n    padding-bottom: 12px;\n    font-size: 14px;\n    letter-spacing: 0.5px;\n    color: #999;\n}\n\n.elm-book__chapter-component__background {\n    padding: 12px;\n    border-radius: 4px;\n    background-color: #fff;\n}\n.elm-book-dark-mode .elm-book__chapter-component__background {\n    background-color: #3b3f47;\n}\n\n.elm-book__chapter-component__content {\n    border: 1px dashed transparent;\n    position: relative;\n}\n.elm-book__chapter-component__content:hover {\n    border-color: #eaeaea;\n}\n');
var $dtwrks$elm_book$ElmBook$UI$ChapterHeader$styles = $dtwrks$elm_book$ElmBook$UI$Helpers$css_('\n.elm-book-chapter-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    margin: 0;\n    padding: 8px 12px 8px 16px;\n\n}\n.elm-book-dark-mode .elm-book-chapter-header {\n    color: #dadada;\n}\n\n.elm-book-chapter-header__title {\n    margin: 0;\n    padding: 0;\n    font-size: 12px;\n    font-weight: bold;\n    text-transform: uppercase;\n    letter-spacing: 0.5px;\n    color: #b0b4ba;\n}\n.elm-book-dark-mode .elm-book-chapter-header__title {\n    color: #dadada;\n}\n\n.elm-book-chapter-header__btn {\n    border: none;\n    background: none;\n    color: #b0b4ba;\n}\n.elm-book-chapter-header__btn:hover {\n    cursor: pointer;\n    opacity: 0.8;\n}\n.elm-book-chapter-header__btn:active {\n    opacity: 0.6;\n}\n.elm-book-dark-mode .elm-book-chapter-header__btn {\n    color: #dadada;\n}\n');
var $dtwrks$elm_book$ElmBook$UI$Footer$styles = $dtwrks$elm_book$ElmBook$UI$Helpers$css_('\n.elm-book-footer {\n    display: flex;\n    align-items: center;\n    width: 100%;\n    margin: 0;\n    padding: 13px 12px 13px;\n    opacity: 0.8;\n    transition: opacity 200ms;\n    text-decoration: none;\n}\n.elm-book-footer:hover {\n    opacity: 1;\n}\n\n.elm-book-footer--text {\n    padding-left: 12px;\n    font-size: 10px;\n    text-transform: uppercase;\n    letter-spacing: 0.5px;\n    color: currentColor;\n}\n');
var $dtwrks$elm_book$ElmBook$UI$Header$styles = $dtwrks$elm_book$ElmBook$UI$Helpers$css_('\n.elm-book-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n}\n\n.elm-book-header--link {\n    display: block;\n    padding: 8px 12px;\n    text-decoration: none;\n}\n.elm-book-header--link:hover {\n    opacity: 0.9;\n}\n.elm-book-header--link:active {\n    opacity: 0.8;\n}\n\n.elm-book-header--button {\n    display: none;\n    padding: 12px;\n    border: none;\n    border-radius: 4px;\n    box-shadow: none;\n    background-color: transparent;\n    cursor: pointer;\n}\n.elm-book-header--button:hover {\n    opacity: 0.9;\n    background-color: rgba(255, 255, 255, 0.1);\n}\n.elm-book-header--button:active {\n    opacity: 0.4;\n}\n@media screen and (max-width: 768px) {\n    .elm-book-header--button {\n        display: flex;\n        align-items: center;\n    }\n}\n\n.elm-book-header-default {\n    display: flex;\n    align-items: center;\n}\n\n.elm-book-header-default--wrapper {\n    display: block;\n    padding-left: 16px;\n    font-weight: 600;\n    font-size: 16px;\n}\n\n.elm-book-header-default--title {\n    display: block;\n    padding-right: 4px;\n}\n\n.elm-book-header-default--subtitle {\n    display: block;\n    font-weight: 400;\n}\n');
var $dtwrks$elm_book$ElmBook$UI$Helpers$mediaLargeScreen = '@media screen and (min-width: 1720px)';
var $dtwrks$elm_book$ElmBook$UI$Markdown$styles = $dtwrks$elm_book$ElmBook$UI$Helpers$css_('\n.elm-book__component-wrapper {\n    max-width: 720px;\n    margin: 0 auto;\n    padding-bottom: 36px;\n}\n.elm-book__component-wrapper.full {\n    max-width: 100%;\n}\n.elm-book__component-empty {\n    padding: 20px;\n    background-color: #f9e4b5;\n    border-radius: 4px;\n    border: 2px solid #eac97d;\n    color: #ab7700;\n}\n\n.elm-book-md__component-list {\n    list-style-type: none;\n    margin: 0;\n    padding: 0;\n}\n.elm-book-md__component-list__item + .elm-book-md__component-list__item {\n    padding-top: 36px;\n}\n\n.elm-book-md {\n    max-width: 720px;\n    margin: 0 auto;\n    padding-bottom: 36px;\n    color: rgb(41,41,41);\n}\n\n.elm-book-dark-mode .elm-book-md {\n    color: rgb(180, 180, 180);    \n}\n\n.elm-book-md * {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\n' + ($dtwrks$elm_book$ElmBook$UI$Helpers$mediaLargeScreen + (' {\n    .elm-book__component-wrapper {\n        max-width: 960px;\n    }\n    .elm-book__component-wrapper.full {\n        max-width: 100%;\n    }\n    .elm-book-md {\n        max-width: 960px;\n    }\n}\n\n.elm-book-md h1 {\n    font-size: 46px;\n}\n.elm-book-md h2 {\n    font-size: 32px;\n}\n.elm-book-md h3 {\n    font-size: 24px;\n}\n.elm-book-md h4 {\n    font-size: 20px;\n    font-weight: normal;\n    text-transform: uppercase;\n}\n.elm-book-md h5 {\n    font-size: 18px;\n    font-weight: normal;\n    text-transform: uppercase;\n}\n.elm-book-md h6 {\n    font-size: 16px;\n    font-weight: normal;\n    text-transform: uppercase;\n    letter-spacing: 0.5px;\n}\n\n.elm-book-md h1,\n.elm-book-md h2,\n.elm-book-md h3 {\n    font-weight: bold;\n}\n\n.elm-book-md h1,\n.elm-book-md h2,\n.elm-book-md h3,\n.elm-book-md h4,\n.elm-book-md h5,\n.elm-book-md h6 {\n    padding-top: 24px;\n}\n\n.elm-book-dark-mode .elm-book-md h1,\n.elm-book-dark-mode .elm-book-md h2,\n.elm-book-dark-mode .elm-book-md h3,\n.elm-book-dark-mode .elm-book-md h4,\n.elm-book-dark-mode .elm-book-md h5,\n.elm-book-dark-mode .elm-book-md h6 {\n    color: #dadada;\n}\n\n' + ($dtwrks$elm_book$ElmBook$UI$Helpers$mediaMobile + (' {\n    .elm-book-md h1 {\n        font-size: 40px;\n        padding-top: 12px;\n    }\n}\n\n.elm-book-md__default {\n    line-height: 1.8em;\n    color: rgb(80, 80, 90);\n    font-size: 20px;\n}\n' + ($dtwrks$elm_book$ElmBook$UI$Helpers$mediaMobile + (' {\n    .elm-book-md__default {\n        font-size: 18px;\n    }\n}\n\n.elm-book-md a {\n    color: #000;\n    text-decoration: underline;\n}\n.elm-book-md a:hover {\n    opacity: 0.8;   \n}\n.elm-book-dark-mode .elm-book-md a {\n    color: #f0f0f0;\n}\n\n.elm-book-md blockquote {\n    font-size: 18px;\n    margin-left: 0;\n    padding: 8px 0 8px 24px;\n    border-left: 4px solid #f0f0f0;\n}\n.elm-book-md code {\n    display: inline-block;\n    border-radius: 4px;\n    padding: 0 8px;\n    background-color: #f0f0f0;\n    border: 1px solid #eaeaea;\n    color: #4a4a4a;\n    font-size: 0.8em;\n    line-height: 1.8em;\n}\n.elm-book-dark-mode .elm-book-md code {\n    background-color: #333;\n    border: 1px solid #444;\n    color: #bababa;\n}\n\n\n.elm-book-md img {\n    max-width: 100%;\n}\n.elm-book-md ul {\n    padding-left: 32px;\n    list-style: disc;\n}\n.elm-book-md ol {\n    padding-left: 32px;\n}\n\n.elm-book-md hr {\n    border: none;\n    height: 2px;\n    background-color: #f0f0f0;\n}\n.elm-book-dark-mode .elm-book-md hr {\n    background-color: #3b3f47;\n}\n\n.elm-book-md table {\n    border-collapse: collapse;\n    overflow-x: auto;\n    border: 2px solid #f0f0f0;\n}\n.elm-book-md thead {\n    border: none;\n}\n.elm-book-md tbody {\n    border: none;\n}\n.elm-book-md tr {\n    border: none;\n    border-top: 2px solid #f0f0f0;\n}\n.elm-book-md th,\n.elm-book-md td {\n    border: none;\n    border-right: 2px solid #f0f0f0;\n    padding: 12px;\n}\n.elm-book-md th:last-child,\n.elm-book-md td:last-child {\n    border-right: none;\n}\n\n.elm-book-dark-mode .elm-book-md table,\n.elm-book-dark-mode .elm-book-md tr,\n.elm-book-dark-mode .elm-book-md th,\n.elm-book-dark-mode .elm-book-md td {\n    border-color: #3b3f47;\n}\n\n.elm-book-md__code,\n.elm-book-md__code code,\n.elm-book-dark-mode .elm-book-md__code,\n.elm-book-dark-mode .elm-book-md__code code {\n    font-size: 18px;\n    line-height: 22px;\n    padding: 20px 24px;\n    background-color: #2a354d;\n    border-radius: 6px;\n    border: none;\n    overflow: auto;\n}\n.elm-book-md__code-default {}\n\n' + ($dtwrks$elm_book$ElmBook$UI$Helpers$mediaMobile + ' {\n    .elm-book-md__code,\n    .elm-book-md__code code,\n    .elm-book-dark-mode .elm-book-md__code,\n    .elm-book-dark-mode .elm-book-md__code code {\n        font-size: 16px;\n    }\n}\n\n.elm-book-md pre.elmsh {\n    padding: 0;\n    margin: 0;\n}\n\n.elm-book-md code.elmsh {\n    padding: 0;\n}\n\n.elm-book-md .elmsh {\n    color: #f8f8f2;\n}\n.elm-book-md .elmsh-hl {\n    background: #343434;\n}\n.elm-book-md .elmsh-add {\n    background: #003800;\n}\n.elm-book-md .elmsh-del {\n    background: #380000;\n}\n.elm-book-md .elmsh-comm {\n    color: #a4a39c;\n}\n.elm-book-md .elmsh1 {\n    color: #46f0ff;\n}\n.elm-book-md .elmsh2 {\n    color: #a5fb98;\n}\n.elm-book-md .elmsh3 {\n    color: #ff8f00;\n}\n.elm-book-md .elmsh4 {\n    color: #46f0ff;\n}\n.elm-book-md .elmsh5 {\n    color: #46f0ff;\n}\n.elm-book-md .elmsh6 {\n    color: #46f0ff;\n}\n.elm-book-md .elmsh7 {\n    color: #46f0ff;\n}\n.elm-book-md .elmsh-elm-ts, .elm-book-md .elmsh-js-dk, .elm-book-md .elmsh-css-p {\n    font-style: italic;\n    color: #46f0ff;\n}\n.elm-book-md .elmsh-js-ce {\n    font-style: italic;\n    color: #46f0ff;\n}\n.elm-book-md .elmsh-css-ar-i {\n    font-weight: bold;\n    color: #46f0ff;\n}\n'))))))));
var $dtwrks$elm_book$ElmBook$UI$Nav$styles = $dtwrks$elm_book$ElmBook$UI$Helpers$css_('\n.elm-book-nav-empty {\n    padding: 12px 20px;\n    font-size: 14px;\n}\n\n.elm-book-nav-list-wrapper {\n    padding-bottom: 16px;\n}\n\n.elm-book-nav-list-title {\n    padding: 12px 20px 8px;\n    font-weight: bold;\n    font-size: 12px;\n    text-transform: uppercase;\n    letter-spacing: 0.5px;\n}\n\n.elm-book-nav-list {\n    list-style-type: none;\n}\n\n.elm-book-nav-item {\n    position: relative;\n    display: flex;\n    font-size: 14px;\n    letter-spacing: 1px;\n    text-decoration: none;\n}\n.elm-book-nav-item:focus {\n    outline: none;\n}\n\n.elm-book-nav-item-content {\n    position: relative;\n    z-index: 1;\n    padding: 8px 20px;\n}\n\n.elm-book-nav-item-bg {\n    opacity: 0;\n}\n.elm-book-nav-item.pre-selected .elm-book-nav-item-bg {\n    opacity: 0.1;\n}\n.elm-book-nav-item.active .elm-book-nav-item-bg {\n    opacity: 0.2;\n}\n.elm-book-nav-item.active.pre-selected .elm-book-nav-item-bg {\n    opacity: 0.25;\n}\n.elm-book-nav-item:hover .elm-book-nav-item-bg {\n    opacity: 0.15;\n}\n.elm-book-nav-item:active .elm-book-nav-item-bg {\n    opacity: 0.1;\n}\n.elm-book-nav-item.active:hover .elm-book-nav-item-bg {\n    opacity: 0.25;\n}\n.elm-book-nav-item.active:active .elm-book-nav-item-bg {\n    opacity: 0.2;\n}\n');
var $dtwrks$elm_book$ElmBook$UI$Search$styles = $dtwrks$elm_book$ElmBook$UI$Helpers$css_('\n.elm-book-search-wrapper {\n    position: relative;\n    width: 100%;\n}\n\n#elm-book-search {\n    position: relative;\n    z-index: 1;\n    width: 100%;\n    padding: 10px 12px;\n    border: 0;\n    border-radius: 4px;\n    background: none;\n    font-size: 14px;\n    color: ' + ($dtwrks$elm_book$ElmBook$UI$Helpers$themeAccent + (';\n    transition: 0.2s;\n}\n#elm-book-search:focus {\n    outline: none;\n}\n#elm-book-search::placeholder {\n    border-radius: 4px;\n    color: ' + ($dtwrks$elm_book$ElmBook$UI$Helpers$themeNavAccent + (';\n    opacity: 0.7;\n}\n\n.elm-book-search-bg {\n    opacity: 0.2;\n    border-radius: 4px;\n    background-color: ' + ($dtwrks$elm_book$ElmBook$UI$Helpers$themeNavBackground + (';\n}\n.elm-book-search-border {\n    opacity: 0.5;\n    border-radius: 4px;\n    border: 0px solid ' + ($dtwrks$elm_book$ElmBook$UI$Helpers$themeAccent + ';\n    transition: 0.2s;\n}\n\n.elm-book-search-wrapper:hover .elm-book-search-bg {\n    opacity: 0.25;\n}\n.elm-book-search-wrapper:hover .elm-book-search-border {\n    border-width: 3px;\n}\n.elm-book-search-wrapper:focus-within .elm-book-search-border {\n    opacity: 1;\n    border-width: 3px;\n}\n'))))))));
var $dtwrks$elm_book$ElmBook$UI$Wrapper$modalZ = '99999';
var $dtwrks$elm_book$ElmBook$UI$Wrapper$sidebarSize = '300px';
var $dtwrks$elm_book$ElmBook$UI$Wrapper$styles = $dtwrks$elm_book$ElmBook$UI$Helpers$css_('\n.elm-book--wrapper--globals {\n    display: none;\n}\n\n.elm-book--wrapper {\n    display: flex;\n    align-items: stretch;\n    background: ' + ($dtwrks$elm_book$ElmBook$UI$Helpers$themeBackground + (';\n}\n' + ($dtwrks$elm_book$ElmBook$UI$Helpers$mediaMobile + (' {\n    .elm-book--wrapper {\n        flex-direction: column;\n    }\n}\n\n.elm-book--wrapper--sidebar {\n    display: flex;\n    flex-direction: column;\n    width: ' + ($dtwrks$elm_book$ElmBook$UI$Wrapper$sidebarSize + (';\n}\n' + ($dtwrks$elm_book$ElmBook$UI$Helpers$mediaMobile + (' {\n    .elm-book--wrapper--sidebar {\n        width: 100%;\n    }\n    .elm-book--wrapper.is-open .elm-book--wrapper--sidebar {\n        flex-grow: 1;\n    }\n}\n\n.elm-book--wrapper--header {\n    padding: 8px 8px 4px;\n}\n\n.elm-book--wrapper--menu {\n    display: flex;\n    flex-direction: column;\n    flex-grow: 1;\n}\n' + ($dtwrks$elm_book$ElmBook$UI$Helpers$mediaMobile + (' {\n    .elm-book--wrapper--menu {\n        display: none;\n    }\n    .elm-book--wrapper.is-open .elm-book--wrapper--menu {\n        display: flex;\n    }\n}\n\n.elm-book--wrapper--menu--header {\n    padding: 8px;\n}\n\n.elm-book--wrapper--menu--separator {\n    display: block;\n    margin: 0;\n    padding: 0;\n    opacity: 0.2;\n    border-top: none;\n    border-bottom: 1px solid ' + ($dtwrks$elm_book$ElmBook$UI$Helpers$themeNavBackground + (';\n}\n\n.elm-book--wrapper--menu--main-wrapper {\n    position: relative;\n    flex-grow: 1;\n}\n\n.elm-book--wrapper--menu--main {\n    overflow: auto;\n    padding: 8px 0;\n}\n\n.elm-book--wrapper--menu--footer {\n    padding: 8px;\n}\n\n.elm-book--wrapper--main {\n    flex-grow: 1;\n    display: flex;\n    flex-direction: column;\n    padding: 8px 8px 0 0;\n}\n' + ($dtwrks$elm_book$ElmBook$UI$Helpers$mediaMobile + (' {\n    .elm-book--wrapper--main {\n        display: flex;\n        padding-left: 8px;\n    }\n    .elm-book--wrapper.is-open .elm-book--wrapper--main {\n        display: none;\n    }\n}\n\n.elm-book--wrapper--main--wrapper {\n    flex-grow: 1;\n    display: flex;\n    flex-direction: column;\n    background-color: #fbfbfd;\n    border-radius: 4px 4px 0 0;\n    overflow: hidden;\n}\n.elm-book-dark-mode .elm-book--wrapper--main--wrapper {\n    background-color: #20232a;\n}\n\n.elm-book--wrapper--main--header {\n    border-bottom: 1px solid rgba(0, 0, 0, 0.1);\n}\n.elm-book-dark-mode .elm-book--wrapper--main--header {\n    border-bottom-color: rgba(255, 255, 255, 0.15);\n}\n\n.elm-book--wrapper--main--content {\n    position: relative;\n    flex-grow: 1;\n}\n\n.elm-book--wrapper--main--inner {\n    overflow: auto;\n}\n\n.elm-book--wrapper--main--footer {\n    border-top: 1px solid rgba(0, 0, 0, 0.1);\n}\n.elm-book-dark-mode .elm-book--wrapper--main--footer {\n    border-top-color: rgba(255, 255, 255, 0.15);\n}\n\n.elm-book--wrapper--modal {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    z-index: ' + ($dtwrks$elm_book$ElmBook$UI$Wrapper$modalZ + ';\n}\n\n.elm-book--wrapper--modal--bg {\n    z-index: 0;\n    cursor: pointer;\n    background-color: rgba(0, 0, 0, 0.3);\n    transition: background-color 300ms;\n}\n.elm-book--wrapper--modal--bg:hover {\n    background-color: rgba(0, 0, 0, 0.2);\n}\n\n.elm-book--wrapper--modal--content {\n    position: relative;\n    z-index: 1;\n    margin: 40px;\n    width: 640px;\n    max-width: 100%;\n    max-height: calc 100% - 120px;\n    overflow-y: auto;\n    background-color: #fff;\n    border-radius: 8px;\n}\n.elm-book-dark-mode .elm-book--wrapper--modal--content {\n    background-color: #20232a;\n}\n'))))))))))))))));
var $dtwrks$elm_book$ElmBook$UI$Styles$view = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[$dtwrks$elm_book$ElmBook$UI$Helpers$baseStyles, $dtwrks$elm_book$ElmBook$UI$ActionLog$styles, $dtwrks$elm_book$ElmBook$UI$Chapter$styles, $dtwrks$elm_book$ElmBook$UI$ChapterComponent$styles, $dtwrks$elm_book$ElmBook$UI$ChapterHeader$styles, $dtwrks$elm_book$ElmBook$UI$Footer$styles, $dtwrks$elm_book$ElmBook$UI$Header$styles, $dtwrks$elm_book$ElmBook$UI$Markdown$styles, $dtwrks$elm_book$ElmBook$UI$Nav$styles, $dtwrks$elm_book$ElmBook$UI$Search$styles, $dtwrks$elm_book$ElmBook$UI$Wrapper$styles]));
var $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$accent = function (theme) {
	return theme.accent;
};
var $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$background = function (theme) {
	return theme.background;
};
var $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$navAccent = function (theme) {
	return theme.navAccent;
};
var $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$navAccentHighlight = function (theme) {
	return theme.navAccentHighlight;
};
var $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$navBackground = function (theme) {
	return theme.navBackground;
};
var $dtwrks$elm_book$ElmBook$UI$Helpers$setTheme = function (theme) {
	return A2(
		$elm$html$Html$Attributes$attribute,
		'style',
		$elm$core$String$concat(
			A2(
				$elm$core$List$map,
				function (_v0) {
					var k = _v0.a;
					var v = _v0.b;
					return k + (':' + (v + ';'));
				},
				_List_fromArray(
					[
						_Utils_Tuple2(
						$dtwrks$elm_book$ElmBook$UI$Helpers$themeBackgroundVar,
						$dtwrks$elm_book$ElmBook$Internal$ThemeOptions$background(theme)),
						_Utils_Tuple2(
						$dtwrks$elm_book$ElmBook$UI$Helpers$themeAccentVar,
						$dtwrks$elm_book$ElmBook$Internal$ThemeOptions$accent(theme)),
						_Utils_Tuple2(
						$dtwrks$elm_book$ElmBook$UI$Helpers$themeNavBackgroundVar,
						$dtwrks$elm_book$ElmBook$Internal$ThemeOptions$navBackground(theme)),
						_Utils_Tuple2(
						$dtwrks$elm_book$ElmBook$UI$Helpers$themeNavAccentVar,
						$dtwrks$elm_book$ElmBook$Internal$ThemeOptions$navAccent(theme)),
						_Utils_Tuple2(
						$dtwrks$elm_book$ElmBook$UI$Helpers$themeNavAccentHighlightVar,
						$dtwrks$elm_book$ElmBook$Internal$ThemeOptions$navAccentHighlight(theme))
					]))));
};
var $dtwrks$elm_book$ElmBook$UI$Wrapper$view = function (props) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$dtwrks$elm_book$ElmBook$UI$Helpers$setTheme(props.theme),
				props.darkMode ? $elm$html$Html$Attributes$class('elm-book-dark-mode') : $elm$html$Html$Attributes$class('')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elm-book--wrapper--globals')
					]),
				props.globals),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('elm-book--wrapper elm-book-inset', true),
								_Utils_Tuple2('is-open', props.isMenuOpen)
							]))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('elm-book--wrapper--sidebar')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('elm-book--wrapper--header')
									]),
								_List_fromArray(
									[props.header])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('elm-book--wrapper--menu')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('elm-book--wrapper--menu--header')
											]),
										_List_fromArray(
											[props.menuHeader])),
										A2(
										$elm$html$Html$hr,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('elm-book--wrapper--menu--separator')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('elm-book--wrapper--menu--main-wrapper')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('elm-book--wrapper--menu--main elm-book-inset')
													]),
												_List_fromArray(
													[props.menu]))
											])),
										A2(
										$elm$html$Html$hr,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('elm-book--wrapper--menu--separator')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('elm-book--wrapper--menu--footer')
											]),
										_List_fromArray(
											[props.menuFooter]))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('elm-book--wrapper--main')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('elm-book--wrapper--main--wrapper')
									]),
								_List_fromArray(
									[
										function () {
										var _v0 = props.mainHeader;
										if (_v0.$ === 'Just') {
											var mainHeader = _v0.a;
											return A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('elm-book--wrapper--main--header elm-book-sans')
													]),
												_List_fromArray(
													[mainHeader]));
										} else {
											return $elm$html$Html$text('');
										}
									}(),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('elm-book--wrapper--main--content')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$id('elm-book-main'),
														$elm$html$Html$Attributes$class('elm-book--wrapper--main--inner elm-book-inset')
													]),
												_List_fromArray(
													[props.main]))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('elm-book--wrapper--main--footer')
											]),
										_List_fromArray(
											[props.mainFooter]))
									]))
							]))
					])),
				function () {
				var _v1 = props.modal;
				if (_v1.$ === 'Just') {
					var html = _v1.a;
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('elm-book-inset elm-book-fade-in elm-book--wrapper--modal')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick(props.onCloseModal),
										$elm$html$Html$Attributes$class('elm-book-inset elm-book--wrapper--modal--bg')
									]),
								_List_Nil),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('elm-book--wrapper--modal--content elm-book-shadows')
									]),
								_List_fromArray(
									[html]))
							]));
				} else {
					return $elm$html$Html$text('');
				}
			}()
			]));
};
var $dtwrks$elm_book$ElmBook$Internal$Application$view = F2(
	function (config, model) {
		var theme = A2($dtwrks$elm_book$ElmBook$Internal$ThemeOptions$applyOverrides, config.themeOptions, model.themeOverrides);
		var hashBasedNavigation = $dtwrks$elm_book$ElmBook$Internal$ThemeOptions$hashBasedNavigation(config.themeOptions);
		var activeChapter = A2($dtwrks$elm_book$ElmBook$Internal$Book$chapterFromUrl, config, model.url);
		return {
			body: _List_fromArray(
				[
					$dtwrks$elm_book$ElmBook$UI$Styles$view,
					$dtwrks$elm_book$ElmBook$UI$Wrapper$view(
					{
						darkMode: model.darkMode,
						globals: A2(
							$elm$core$List$map,
							config.toHtml,
							A2($elm$core$Maybe$withDefault, _List_Nil, config.themeOptions.globals)),
						header: $dtwrks$elm_book$ElmBook$UI$Header$view(
							{href: '/', isMenuOpen: model.isMenuOpen, onClickHeader: $dtwrks$elm_book$ElmBook$Internal$Msg$DoNothing, onClickMenuButton: $dtwrks$elm_book$ElmBook$Internal$Msg$ToggleMenu, theme: config.themeOptions, title: config.title, toHtml: config.toHtml}),
						isMenuOpen: model.isMenuOpen,
						main: A2(
							$elm$core$Maybe$withDefault,
							$elm$html$Html$text(''),
							A2(
								$elm$core$Maybe$map,
								function (_v0) {
									var activeChapter_ = _v0.a;
									return $dtwrks$elm_book$ElmBook$UI$Chapter$view(
										{
											body: activeChapter_.body,
											chapterOptions: A2($dtwrks$elm_book$ElmBook$Internal$Chapter$toValidOptions, config.chapterOptions, activeChapter_.chapterOptions),
											componentOptions: A2($dtwrks$elm_book$ElmBook$Internal$ComponentOptions$toValidOptions, config.componentOptions, activeChapter_.componentOptions),
											components: A2(
												$elm$core$List$map,
												function (component) {
													return _Utils_Tuple2(
														component.label,
														A3($dtwrks$elm_book$ElmBook$Internal$Application$componentView, config.toHtml, model.state, component.view));
												},
												activeChapter_.componentList),
											title: activeChapter_.title
										});
								},
								activeChapter)),
						mainFooter: A2(
							$elm$core$Maybe$withDefault,
							$dtwrks$elm_book$ElmBook$UI$ActionLog$previewEmpty,
							A2(
								$elm$core$Maybe$map,
								function (lastAction) {
									return $dtwrks$elm_book$ElmBook$UI$ActionLog$preview(
										{
											lastAction: lastAction,
											lastActionIndex: $elm$core$List$length(model.actionLog),
											onClick: $dtwrks$elm_book$ElmBook$Internal$Msg$ActionLogShow
										});
								},
								$elm$core$List$head(model.actionLog))),
						mainHeader: A2(
							$elm$core$Maybe$map,
							function (chapter) {
								return $dtwrks$elm_book$ElmBook$UI$ChapterHeader$view(
									{
										onToggleDarkMode: $dtwrks$elm_book$ElmBook$Internal$Msg$ToggleDarkMode,
										title: $dtwrks$elm_book$ElmBook$Internal$Chapter$chapterBreadcrumb(chapter)
									});
							},
							activeChapter),
						menu: function () {
							var chaptersList = A2($dtwrks$elm_book$ElmBook$Internal$Application$searchChapters, model.search, config.chapters);
							var chaptersListSlugs = A2(
								$elm$core$List$map,
								$dtwrks$elm_book$ElmBook$Internal$Chapter$chapterNavUrl(hashBasedNavigation),
								$elm$core$Array$toList(chaptersList));
							return $dtwrks$elm_book$ElmBook$UI$Nav$view(
								{
									active: A2(
										$elm$core$Maybe$map,
										$dtwrks$elm_book$ElmBook$Internal$Chapter$chapterNavUrl(hashBasedNavigation),
										activeChapter),
									itemGroups: A2(
										$elm$core$List$map,
										$elm$core$Tuple$mapSecond(
											A2(
												$elm$core$Basics$composeR,
												$elm$core$List$map(
													function (index) {
														return A2($elm$core$Array$get, index, config.chapters);
													}),
												A2(
													$elm$core$Basics$composeR,
													$elm$core$List$filterMap($elm$core$Basics$identity),
													A2(
														$elm$core$Basics$composeR,
														$elm$core$List$map(
															function (chapter) {
																var title = chapter.a.title;
																var internal = chapter.a.internal;
																return _Utils_Tuple3(
																	A2($dtwrks$elm_book$ElmBook$Internal$Chapter$chapterNavUrl, hashBasedNavigation, chapter),
																	title,
																	internal);
															}),
														$elm$core$List$filter(
															function (_v1) {
																var slug = _v1.a;
																return A2($elm$core$List$member, slug, chaptersListSlugs);
															}))))),
										config.chapterGroups),
									preSelected: model.isSearching ? A2(
										$elm$core$Maybe$map,
										$dtwrks$elm_book$ElmBook$Internal$Chapter$chapterNavUrl(hashBasedNavigation),
										A2(
											$elm$core$Array$get,
											A2(
												$elm$core$Basics$modBy,
												$elm$core$Array$length(chaptersList),
												model.chapterPreSelected),
											chaptersList)) : $elm$core$Maybe$Nothing
								});
						}(),
						menuFooter: $dtwrks$elm_book$ElmBook$UI$Footer$view,
						menuHeader: $dtwrks$elm_book$ElmBook$UI$Search$view(
							{onBlur: $dtwrks$elm_book$ElmBook$Internal$Msg$SearchBlur, onFocus: $dtwrks$elm_book$ElmBook$Internal$Msg$SearchFocus, onInput: $dtwrks$elm_book$ElmBook$Internal$Msg$Search, value: model.search}),
						modal: model.actionLogModal ? $elm$core$Maybe$Just(
							$dtwrks$elm_book$ElmBook$UI$ActionLog$list(model.actionLog)) : $elm$core$Maybe$Nothing,
						onCloseModal: $dtwrks$elm_book$ElmBook$Internal$Msg$ActionLogHide,
						theme: theme
					})
				]),
			title: function () {
				var mainTitle = A2(
					$elm$core$Maybe$withDefault,
					config.title,
					A2(
						$elm$core$Maybe$map,
						function (s) {
							return config.title + (' | ' + s);
						},
						$dtwrks$elm_book$ElmBook$Internal$ThemeOptions$subtitle(config.themeOptions)));
				if (activeChapter.$ === 'Just') {
					var title = activeChapter.a.a.title;
					return title + (' - ' + mainTitle);
				} else {
					return mainTitle;
				}
			}()
		};
	});
var $dtwrks$elm_book$ElmBook$Internal$Application$withActionLogReset = function (previousModel) {
	return $elm$core$Tuple$mapFirst(
		function (model) {
			return (!_Utils_eq(model.url, previousModel.url)) ? _Utils_update(
				model,
				{actionLog: _List_Nil}) : model;
		});
};
var $dtwrks$elm_book$ElmBook$Internal$Application$application = F2(
	function (chapterGroups, bookBuilder) {
		var config = A2($dtwrks$elm_book$ElmBook$Internal$Book$configFromBuilder, chapterGroups, bookBuilder);
		return $elm$browser$Browser$application(
			{
				init: $dtwrks$elm_book$ElmBook$Internal$Application$init(config),
				onUrlChange: $dtwrks$elm_book$ElmBook$Internal$Msg$OnUrlChange,
				onUrlRequest: $dtwrks$elm_book$ElmBook$Internal$Msg$OnUrlRequest,
				subscriptions: function (_v0) {
					return $elm$core$Platform$Sub$batch(
						_List_fromArray(
							[
								$elm$browser$Browser$Events$onKeyDown($dtwrks$elm_book$ElmBook$Internal$Application$keyDownDecoder),
								$elm$browser$Browser$Events$onKeyUp($dtwrks$elm_book$ElmBook$Internal$Application$keyUpDecoder),
								$elm$core$Platform$Sub$batch(config.statefulOptions.subscriptions)
							]));
				},
				update: F2(
					function (msg, model) {
						return A2(
							$dtwrks$elm_book$ElmBook$Internal$Application$withActionLogReset,
							model,
							A3($dtwrks$elm_book$ElmBook$Internal$Application$update, config, msg, model));
					}),
				view: $dtwrks$elm_book$ElmBook$Internal$Application$view(config)
			});
	});
var $dtwrks$elm_book$ElmBook$Internal$Chapter$chapterWithGroup = F3(
	function (routePrefix, group, _v0) {
		var chapter = _v0.a;
		var groupPrefix = (group === '') ? '' : ('/' + $dtwrks$elm_book$ElmBook$Internal$Helpers$toSlug(group));
		return (!chapter.internal) ? $dtwrks$elm_book$ElmBook$Internal$Chapter$Chapter(chapter) : $dtwrks$elm_book$ElmBook$Internal$Chapter$Chapter(
			_Utils_update(
				chapter,
				{
					groupTitle: $elm$core$Maybe$Just(group),
					url: _Utils_ap(
						routePrefix,
						_Utils_ap(groupPrefix, chapter.url))
				}));
	});
var $dtwrks$elm_book$ElmBook$withChapterGroups = F2(
	function (chapterGroups_, _v0) {
		var config = _v0.a;
		return A2(
			$dtwrks$elm_book$ElmBook$Internal$Application$application,
			A2(
				$elm$core$List$map,
				function (_v1) {
					var group = _v1.a;
					var chapters = _v1.b;
					return _Utils_Tuple2(
						group,
						A2(
							$elm$core$List$map,
							A2($dtwrks$elm_book$ElmBook$Internal$Chapter$chapterWithGroup, config.themeOptions.routePrefix, group),
							chapters));
				},
				chapterGroups_),
			$dtwrks$elm_book$ElmBook$Internal$Book$BookBuilder(config));
	});
var $dtwrks$elm_book$ElmBook$Internal$Helpers$applyAttributes = F2(
	function (fns, a) {
		return A3($elm$core$List$foldl, $elm$core$Basics$apL, a, fns);
	});
var $dtwrks$elm_book$ElmBook$withStatefulOptions = F2(
	function (attributes, _v0) {
		var config = _v0.a;
		return $dtwrks$elm_book$ElmBook$Internal$Book$BookBuilder(
			_Utils_update(
				config,
				{
					statefulOptions: A2($dtwrks$elm_book$ElmBook$Internal$Helpers$applyAttributes, attributes, config.statefulOptions)
				}));
	});
var $dtwrks$elm_book$ElmBook$withThemeOptions = F2(
	function (themeAttributes, _v0) {
		var config = _v0.a;
		return $dtwrks$elm_book$ElmBook$Internal$Book$BookBuilder(
			_Utils_update(
				config,
				{
					themeOptions: A2($dtwrks$elm_book$ElmBook$Internal$Helpers$applyAttributes, themeAttributes, config.themeOptions)
				}));
	});
var $author$project$Main$main = A2(
	$dtwrks$elm_book$ElmBook$withChapterGroups,
	_List_fromArray(
		[
			_Utils_Tuple2(
			'Core',
			_List_fromArray(
				[
					$author$project$Chapters$Core$Buttons$chapter_,
					$author$project$Chapters$Core$ButtonGroup$chapter_,
					$author$project$Main$wip('CallToAction'),
					$author$project$Chapters$Core$Divider$chapter_,
					$author$project$Chapters$Core$Loading$chapter_
				])),
			_Utils_Tuple2(
			'Layout',
			_List_fromArray(
				[
					$author$project$Chapters$Layout$Modal$chapter_,
					$author$project$Main$wip('Drawer')
				])),
			_Utils_Tuple2(
			'Information',
			_List_fromArray(
				[
					$author$project$Chapters$Information$DataRow$chapter_,
					$author$project$Chapters$Information$Popover$chapter_,
					$author$project$Main$wip('Tooltip'),
					$author$project$Chapters$Information$Menu$chapter_,
					$author$project$Main$wip('Tag'),
					$author$project$Main$wip('Badge'),
					$author$project$Main$wip('Table'),
					$author$project$Main$wip('Toast'),
					$author$project$Main$wip('Message'),
					$author$project$Chapters$Information$Pagination$chapter_
				])),
			_Utils_Tuple2(
			'Form',
			_List_fromArray(
				[$author$project$Chapters$Form$Field$chapter_, $author$project$Chapters$Form$InputText$chapter_, $author$project$Chapters$Form$InputTextArea$chapter_, $author$project$Chapters$Form$InputNumber$chapter_, $author$project$Chapters$Form$InputTime$chapter_, $author$project$Chapters$Form$InputDate$chapter_, $author$project$Chapters$Form$InputAutocomplete$chapter_, $author$project$Chapters$Form$InputCheckbox$chapter_, $author$project$Chapters$Form$InputRadio$chapter_, $author$project$Chapters$Form$InputSelect$chapter_, $author$project$Chapters$Form$InputSlider$chapter_]))
		]),
	A2(
		$dtwrks$elm_book$ElmBook$withThemeOptions,
		_List_fromArray(
			[
				$dtwrks$elm_book$ElmBook$ThemeOptions$globals(
				_List_fromArray(
					[
						$author$project$Theme$globalProviderWithDarkMode(
						{
							dark: $author$project$Theme$darkTheme,
							light: $author$project$Theme$lightTheme,
							strategy: $author$project$Theme$classStrategy('elm-book-dark-mode')
						}),
						$author$project$W$Styles$globalStyles
					]))
			]),
		A2(
			$dtwrks$elm_book$ElmBook$withStatefulOptions,
			_List_fromArray(
				[
					$dtwrks$elm_book$ElmBook$StatefulOptions$initialState(
					{inputNumber: $author$project$Chapters$Form$InputNumber$init, inputTextArea: $author$project$Chapters$Form$InputTextArea$init, range: $author$project$Chapters$Form$InputSlider$init})
				]),
			$dtwrks$elm_book$ElmBook$book('elm-widgets'))));
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));