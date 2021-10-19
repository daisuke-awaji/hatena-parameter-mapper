import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextareaAutosize,
} from "@mui/material";
import { format } from "sql-formatter";
import { mapByParameters, csvDelimitedStringToArray } from "./mapByParameters";

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

function App() {
  const [sqlInput, setSqlInput] = useState("");
  const [parameters, setParameters] = useState("");
  const [sqlOutput, setSqlOutput] = useState("");

  const [formatter, setFormatter] = useState("mysql");

  const handleChange = (event: SelectChangeEvent) => {
    setFormatter(event.target.value as any);
  };

  useEffect(() => {
    // 改行とクォートを取り除く
    const replaced = csvDelimitedStringToArray(parameters);
    console.log(replaced);
    const mapped = mapByParameters(sqlInput, replaced);
    setSqlOutput(mapped);
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
                  return <MenuItem value={lg}>{lg}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1, padding: "1rem", minHeight: "85vh" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextareaAutosize
              placeholder={PLACE_HOLDER_INPUT}
              style={{ width: "100%", minHeight: "70vh" }}
              value={sqlInput}
              onChange={(e) => setSqlInput(e.target.value)}
              onBlur={() => {
                setSqlInput(formatter === "none" ? sqlInput : format(sqlInput, { language: formatter as any }));
              }}
            />
            <TextareaAutosize
              placeholder={PLACE_HOLDER_PARAMETERS}
              style={{ width: "100%", minHeight: "8vh" }}
              value={parameters}
              onChange={(e) => setParameters(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextareaAutosize
              placeholder={PLACE_HOLDER_OUTPUT}
              style={{ width: "100%", minHeight: "70vh", color: "black" }}
              value={sqlOutput}
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
