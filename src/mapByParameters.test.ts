import { csvDelimitedStringToArray, mapByParameters } from "./mapByParameters";

describe("map parameters into sql", () => {
  test("normal usage", () => {
    const sql = `
            select * from user
            where user_id = ?`;
    const parameters = [`0001`];
    const result = mapByParameters(sql, parameters);

    expect(result).toBe(`
            select * from user
            where user_id = '0001'`);
  });

  test("multiple parameters", () => {
    const sql = `
            select * from user
            where user_id = ?
            and user_name = ?`;
    const parameters = [`0001`, "john"];
    const result = mapByParameters(sql, parameters);

    expect(result).toBe(`
            select * from user
            where user_id = '0001'
            and user_name = 'john'`);
  });

  test("array", () => {
    const sql = `
            select * from user
            where user_id in (?)`;
    const parameters = [["0001", "0002"]];
    const result = mapByParameters(sql, parameters);
    console.log(result);

    expect(result).toBe(`
            select * from user
            where user_id in ('0001','0002')`);
  });
});

describe("convert csv delimited string to array", () => {
  test("normal usage", () => {
    const input = "a,b,c";
    const result = csvDelimitedStringToArray(input);
    expect(result).toMatchObject(["a", "b", "c"]);
  });
  test("array contained", () => {
    const input = "aaa,['xxx','yyy'],ccc";
    const result = csvDelimitedStringToArray(input);
    expect(result).toMatchObject(["aaa", ["xxx", "yyy"], "ccc"]);
  });
  test.only("array contained with quote", () => {
    const input = "'aaa',['xxx','yyy'],'ccc'";
    const result = csvDelimitedStringToArray(input);
    expect(result).toMatchObject(["aaa", ["xxx", "yyy"], "ccc"]);
  });
});
