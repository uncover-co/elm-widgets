const fs = require("fs");

const styles =
    fs
        .readFileSync("./styles/output/index.css", "utf-8")
        .replace(/\\(?!\\)/g, "\\\\")

const template =
    fs
        .readFileSync("./src/Template/W/Styles.elm", "utf-8")
        .replace("module Template.", "module ")
        .replace("<| Debug.todo \"STYLES\"", `"""${styles}"""`)


fs.writeFileSync("./src/W/Styles.elm", template);
