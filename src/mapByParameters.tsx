export const mapByParameters = (sql: string, parameters: any[]) => {
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

export const csvDelimitedStringToArray = (input: string): any[] => {
  const replaced = input.replace(/\r?\n/g, "");

  const arrParsed = replaced.split(",").reduce<string[]>((prev, cur) => {
    if (prev[prev.length - 1]?.startsWith("[")) {
      if (!prev[prev.length - 1]?.endsWith("]")) {
        prev[prev.length - 1] = prev[prev.length - 1] + "," + cur;
        return prev;
      }
    }
    prev.push(cur);
    return prev;
  }, []);

  const result = arrParsed
    .filter((i) => i !== ",")
    .filter((i) => i !== "'")
    .filter((i) => i !== `"`)
    .filter((i) => i !== "")
    .map((i) => (i.startsWith("[") ? JSON.parse(i.replace(/'/g, '"')) : i))
    .map((i) => (typeof i === "string" ? i.replace(/'/g, "") : i));

  return result;
};
