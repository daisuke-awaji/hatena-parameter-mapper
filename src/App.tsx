import React, { useEffect, useState } from "react";
import { Box, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Tooltip from "@material-ui/core/Tooltip";

import { format } from "sql-formatter";
import { mapByParameters, csvDelimitedStringToArray } from "./mapByParameters";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import CopyToClipBoard from "react-copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism.css";

const PLACE_HOLDER_INPUT = `Input your sql.

e.g.

SELECT
  user_id,
  user_name
FROM
  user
WHERE
  user_id = ?
  AND user_name = ?
`;

const PLACE_HOLDER_OUTPUT = `Output your sql.

e.g.

SELECT
  user_id,
  user_name
FROM
  user
WHERE
  user_id = '0001'
  AND user_name = 'John'
`;

const PLACE_HOLDER_PARAMETERS = `Parameters (delimited by comma).

e.g.

0001,
John
`;

const SQL_FORMAT_LANGUAGES = [
  "none",
  "mysql",
  "db2",
  "mariadb",
  "n1ql",
  "plsql",
  "postgresql",
  "redshift",
  "spark",
  "sql",
  "tsql",
];

const CopyIcon: React.FC<{ input: string }> = ({ input }) => {
  const [openTip, setOpenTip] = useState<boolean>(false);
  const handleCloseTip = (): void => {
    setOpenTip(false);
  };

  const handleClickButton = (): void => {
    setOpenTip(true);
  };

  return (
    <div style={{ textAlign: "right" }}>
      <Tooltip arrow open={openTip} onClose={handleCloseTip} disableHoverListener placement="top" title="Copied!">
        <CopyToClipBoard text={input}>
          <IconButton disabled={input === ""} onClick={handleClickButton}>
            <ContentCopyIcon />
          </IconButton>
        </CopyToClipBoard>
      </Tooltip>
    </div>
  );
};

function App() {
  const [sqlInput, setSqlInput] = useState("");
  const [parameters, setParameters] = useState("");
  const [sqlOutput, setSqlOutput] = useState("");

  const [formatter, setFormatter] = useState("mysql");

  const handleChange = (event: SelectChangeEvent) => {
    setFormatter(event.target.value as any);
  };

  useEffect(() => {
    try {
      // 改行とクォートを取り除く
      const replaced = csvDelimitedStringToArray(parameters);
      const mapped = mapByParameters(sqlInput, replaced);
      setSqlOutput(mapped);
    } catch (e) {
      console.error(e);
    }
  }, [sqlInput, parameters]);

  return (
    <>
      <Box sx={{ flexGrow: 1, padding: "1rem" }}>
        <Grid container spacing={2} direction="row" justifyContent="center" alignItems="flex-end">
          <Grid item xs={12} md={6}>
            <h1>? Parameter Mapper</h1>
            <div>Embeds the inputted parameters into the ?. Currently support only sql format.</div>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="formatter-select-label">Formatter</InputLabel>
              <Select
                labelId="formatter-select-label"
                id="formatter-select"
                value={formatter}
                label="Formatter"
                onChange={handleChange}
              >
                {SQL_FORMAT_LANGUAGES.map((lg) => {
                  return (
                    <MenuItem key={lg} value={lg}>
                      {lg}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1, paddingLeft: "1rem", paddingRight: "1rem", minHeight: "85vh" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <CopyIcon input={sqlInput} />

            <Editor
              value={sqlInput}
              onValueChange={(code) => setSqlInput(code)}
              highlight={(code) => highlight(code, languages.sql, "sql")}
              placeholder={PLACE_HOLDER_INPUT}
              padding={10}
              onBlur={() => {
                setSqlInput(formatter === "none" ? sqlInput : format(sqlInput, { language: formatter as any }));
              }}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
                outline: "solid 1px",
                outlineColor: "rgb(64, 44, 27, .6)",
                width: "100%",
                minHeight: "70vh",
                backgroundColor: "rgba(250, 247, 237, 0.7)",
                borderRadius: "0.25rem",
              }}
            />
            <div style={{ paddingBottom: "1vh" }}></div>
            <Editor
              value={parameters}
              onValueChange={(code) => setParameters(code)}
              highlight={(code) => highlight(code, languages.sql, "sql")}
              placeholder={PLACE_HOLDER_PARAMETERS}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
                outline: "solid 1px",
                outlineColor: "rgb(64, 44, 27, .6)",
                width: "100%",
                minHeight: "10vh",
                backgroundColor: "rgba(250, 247, 237, 0.7)",
                borderRadius: "0.25rem",
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CopyIcon input={sqlOutput} />

            <Editor
              value={sqlOutput}
              onValueChange={(code) => code}
              highlight={(code) => highlight(code, languages.sql, "sql")}
              placeholder={PLACE_HOLDER_OUTPUT}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
                outline: "1px solid rgba(24, 51, 71, .6)",
                width: "100%",
                minHeight: "70vh",
                backgroundColor: "rgba(244, 248, 243, 0.7)",
                borderRadius: "0.25rem",
              }}
              disabled
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1, padding: "1rem" }}>
        <a href="https://github.com/daisuke-awaji/typeorm-query-param-mapper">
          <img
            src="https://github.githubassets.com/images/modules/site/icons/footer/github-mark.svg"
            alt="github-logo"
          />
        </a>
      </Box>
    </>
  );
}

export default App;
