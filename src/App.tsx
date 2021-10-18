import React, { useEffect, useState } from "react";
import { Box, Grid, TextareaAutosize } from "@mui/material";
import { format } from "sql-formatter";

const mapByParameters = (sql: string, parameters: any[]) => {
  const converted = parameters.reduce((sqlReplace, param) => {
    if (typeof param === "string") {
      param = "'" + param + "'";
    }
    if (typeof param === "object") {
      param = param.map((p: any) => {
        return typeof p === "string" ? "'" + p + "'" : p;
      });
    }
    return sqlReplace.replace("?", param);
  }, sql);

  return converted;
};

function App() {
  const [sqlInput, setSqlInput] = useState("");
  const [parameters, setParameters] = useState("");
  const [sqlOutput, setSqlOutput] = useState("");

  useEffect(() => {
    const mapped = mapByParameters(sqlInput, parameters.replace(/\r?\n/g, "").split(","));
    setSqlOutput(mapped);
  }, [sqlInput, parameters]);

  return (
    <>
      <Box sx={{ flexGrow: 1, padding: "1rem" }}>
        <h1>? Parameter Mapper</h1>
        <div>Embeds the inputted parameters into the ?. Currently support only sql format.</div>
      </Box>
      <Box sx={{ flexGrow: 1, padding: "1rem", minHeight: "85vh" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextareaAutosize
              placeholder="Input"
              style={{ width: "100%", minHeight: "70vh" }}
              value={sqlInput}
              onChange={(e) => setSqlInput(format(e.target.value))}
            />
            <TextareaAutosize
              placeholder="Parameters (delimited by comma)"
              style={{ width: "100%", minHeight: "8vh" }}
              value={parameters}
              onChange={(e) => setParameters(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextareaAutosize
              placeholder="Output"
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
